import { supabase } from '@/lib/supabase';
import { BlogPost, BlogPostSubmission, BlogPostStatus, BlogPostUpdate } from '@/types/blog';

// Storage bucket for blog images
const BLOG_IMAGES_BUCKET = 'blog_images';

/**
 * Fetch all published blog posts
 * @returns Promise with array of blog posts
 */
export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'approved')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching published blog posts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('An unexpected error occurred while fetching published blog posts:', error);
    throw error;
  }
}

/**
 * Fetch a single blog post by ID
 * @param id - Blog post ID
 * @returns Promise with blog post or null if not found
 */
export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) {
      console.error(`Error fetching blog post with ID ${id}:`, error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error(`An unexpected error occurred while fetching blog post with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Submit a new blog post
 * @param post - Blog post submission data
 * @returns Promise with the created blog post ID
 */
export async function submitBlogPost(post: BlogPostSubmission): Promise<string> {
  try {
    let imageUrl = null;

    // Upload image if provided
    if (post.image) {
      imageUrl = await uploadBlogImage(post.image);
    }

    // Insert blog post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        content: post.content,
        image_url: imageUrl,
        status: 'pending',
        author_name: post.author_name,
        author_email: post.author_email
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting blog post:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('An unexpected error occurred while submitting blog post:', error);
    throw error;
  }
}

/**
 * Upload a blog image to Supabase Storage
 * @param image - Image file to upload
 * @returns Promise with the image URL
 */
export async function uploadBlogImage(image: File): Promise<string> {
  try {
    // Create a unique filename
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check if bucket exists, create if not
    const { data: bucketData } = await supabase.storage.listBuckets();
    const bucketExists = bucketData?.some(bucket => bucket.name === BLOG_IMAGES_BUCKET);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BLOG_IMAGES_BUCKET, {
        public: true
      });
    }

    // Upload the file
    const { error } = await supabase.storage
      .from(BLOG_IMAGES_BUCKET)
      .upload(filePath, image);

    if (error) {
      console.error('Error uploading blog image:', error);
      throw error;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from(BLOG_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('An unexpected error occurred while uploading blog image:', error);
    throw error;
  }
}

/**
 * Admin: Fetch all blog posts (for admin dashboard)
 * @param status - Optional status filter
 * @returns Promise with array of blog posts
 */
export async function fetchAllBlogPosts(status?: BlogPostStatus): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching all blog posts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('An unexpected error occurred while fetching all blog posts:', error);
    throw error;
  }
}

/**
 * Admin: Update a blog post
 * @param id - Blog post ID
 * @param updates - Blog post updates
 * @returns Promise with success boolean
 */
export async function updateBlogPost(id: string, updates: BlogPostUpdate): Promise<boolean> {
  try {
    // If status is being updated to 'approved' and no published_at date is provided, set it to now
    if (updates.status === 'approved' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error(`Error updating blog post with ID ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`An unexpected error occurred while updating blog post with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Admin: Delete a blog post
 * @param id - Blog post ID
 * @returns Promise with success boolean
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    // First get the post to check if it has an image
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error(`Error fetching blog post with ID ${id} for deletion:`, fetchError);
      throw fetchError;
    }

    // Delete the image if it exists
    if (post?.image_url) {
      const imagePath = post.image_url.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from(BLOG_IMAGES_BUCKET)
          .remove([imagePath]);
      }
    }

    // Delete the blog post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting blog post with ID ${id}:`, error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error(`An unexpected error occurred while deleting blog post with ID ${id}:`, error);
    throw error;
  }
}
