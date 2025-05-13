import { supabase } from '@/lib/supabase';
import { CollegeLogo, LogoSubmission, LogoStatus, LogoUpdate } from '@/types/logo';

// Storage bucket for college logos
const LOGO_IMAGES_BUCKET = 'college_logo';

/**
 * Fetch all approved college logos
 * @returns Promise with array of college logos
 */
export async function fetchApprovedLogos(): Promise<CollegeLogo[]> {
  try {
    const { data, error } = await supabase
      .from('college_logos')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching approved logos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('An unexpected error occurred while fetching approved logos:', error);
    throw error;
  }
}

/**
 * Fetch a college logo by ID
 * @param id - Logo ID
 * @returns Promise with the logo or null if not found
 */
export async function fetchLogoById(id: string): Promise<CollegeLogo | null> {
  try {
    const { data, error } = await supabase
      .from('college_logos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching logo by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('An unexpected error occurred while fetching logo by ID:', error);
    throw error;
  }
}

/**
 * Admin: Fetch all college logos (for admin dashboard)
 * @param status - Optional status filter
 * @returns Promise with array of college logos
 */
export async function fetchAllLogos(status?: LogoStatus): Promise<CollegeLogo[]> {
  try {
    let query = supabase
      .from('college_logos')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all logos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('An unexpected error occurred while fetching all logos:', error);
    throw error;
  }
}

/**
 * Submit a new college logo
 * @param logo - Logo submission data
 * @returns Promise with the created logo ID
 */
export async function submitLogo(logo: LogoSubmission): Promise<string> {
  try {
    // Upload image
    const imageUrl = await uploadLogoImage(logo.image);

    // Insert logo
    const { data, error } = await supabase
      .from('college_logos')
      .insert({
        name: logo.name,
        description: logo.description || '',
        image_url: imageUrl,
        status: 'pending',
        uploader_name: logo.uploader_name,
        uploader_email: logo.uploader_email,
        download_count: 0
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting logo:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('An unexpected error occurred while submitting logo:', error);
    throw error;
  }
}

/**
 * Update a college logo
 * @param id - Logo ID
 * @param updates - Logo update data
 * @returns Promise with success boolean
 */
export async function updateLogo(id: string, updates: LogoUpdate): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('college_logos')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating logo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('An unexpected error occurred while updating logo:', error);
    return false;
  }
}

/**
 * Delete a college logo
 * @param id - Logo ID
 * @returns Promise with success boolean
 */
export async function deleteLogo(id: string): Promise<boolean> {
  try {
    // First, get the logo to find the image URL
    const { data: logo, error: fetchError } = await supabase
      .from('college_logos')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching logo for deletion:', fetchError);
      return false;
    }

    // Delete the image from storage if it exists
    if (logo?.image_url) {
      const imagePath = extractPathFromUrl(logo.image_url);
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from(LOGO_IMAGES_BUCKET)
          .remove([imagePath]);

        if (storageError) {
          console.error('Error deleting logo image from storage:', storageError);
          // Continue with deletion even if image removal fails
        }
      }
    }

    // Delete the logo record
    const { error } = await supabase
      .from('college_logos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting logo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('An unexpected error occurred while deleting logo:', error);
    return false;
  }
}

/**
 * Increment the download count for a logo
 * @param id - Logo ID
 * @returns Promise with success boolean
 */
export async function incrementDownloadCount(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_logo_downloads', { logo_id: id });

    if (error) {
      console.error('Error incrementing download count:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('An unexpected error occurred while incrementing download count:', error);
    return false;
  }
}

/**
 * Upload a logo image to Supabase Storage
 * @param image - Image file to upload
 * @returns Promise with the image URL
 */
export async function uploadLogoImage(image: File): Promise<string> {
  try {
    // Create a unique filename
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check if bucket exists, create if not
    const { data: bucketData } = await supabase.storage.listBuckets();
    const bucketExists = bucketData?.some(bucket => bucket.name === LOGO_IMAGES_BUCKET);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(LOGO_IMAGES_BUCKET, {
        public: true
      });
    }

    // Upload the file
    const { error } = await supabase.storage
      .from(LOGO_IMAGES_BUCKET)
      .upload(filePath, image);

    if (error) {
      console.error('Error uploading logo image:', error);
      throw error;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from(LOGO_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('An unexpected error occurred while uploading logo image:', error);
    throw error;
  }
}

/**
 * Extract the path from a Supabase storage URL
 * @param url - Supabase storage URL
 * @returns The path part of the URL or null if not a valid URL
 */
function extractPathFromUrl(url: string): string | null {
  try {
    // Example URL: https://xxxx.supabase.co/storage/v1/object/public/college_logo/filename.png
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === LOGO_IMAGES_BUCKET);
    
    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      return null;
    }
    
    return pathParts[bucketIndex + 1];
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    return null;
  }
}
