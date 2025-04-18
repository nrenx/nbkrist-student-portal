import { supabase } from '@/lib/supabase';
import { supabaseConfig } from '@/config/supabase';

/**
 * Test function to check if we can access the Supabase bucket
 * This function tries to list the contents of the bucket root directory
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Storage bucket:', supabaseConfig.storageBucket);

    // Try to list the contents of the bucket root directory
    const { data, error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .list();

    if (error) {
      console.error('Error accessing Supabase bucket:', error);
      return false;
    }

    console.log('Successfully accessed Supabase bucket');
    console.log('Items in root directory:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('Root directory contents:', data.map(item => item.name));
    }

    return true;
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return false;
  }
}

/**
 * Test function to check if a specific file exists in the bucket
 * @param path - File path to check
 */
export async function testFileExists(path: string): Promise<boolean> {
  try {
    console.log(`Testing if file exists at path: ${path}`);

    // Try to get a signed URL for the file
    const { data, error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .createSignedUrl(path, 60);

    if (error) {
      console.error(`Error checking file at ${path}:`, error);
      return false;
    }

    console.log(`File exists at ${path}`);
    return true;
  } catch (error) {
    console.error(`Error checking file at ${path}:`, error);
    return false;
  }
}

/**
 * Test function to try downloading a file from the bucket
 * @param path - File path to download
 */
export async function testFileDownload(path: string): Promise<boolean> {
  try {
    console.log(`Testing file download from path: ${path}`);

    // Try to download the file
    const { data, error } = await supabase.storage
      .from(supabaseConfig.storageBucket)
      .download(path);

    if (error) {
      console.error(`Error downloading file from ${path}:`, error);
      return false;
    }

    if (!data) {
      console.log(`No data returned from ${path}`);
      return false;
    }

    // Get the file content as text
    const text = await data.text();
    console.log(`Successfully downloaded file from ${path}`);
    console.log(`File content length: ${text.length} characters`);

    // Log a preview of the content
    if (text.length > 0) {
      console.log(`Content preview: ${text.substring(0, Math.min(100, text.length))}...`);
    }

    return true;
  } catch (error) {
    console.error(`Error downloading file from ${path}:`, error);
    return false;
  }
}

/**
 * Explore the Supabase bucket structure by listing all directories and files
 * @returns A list of all paths found in the bucket
 */
export async function exploreSupabaseBucket(): Promise<string[]> {
  const allPaths: string[] = [];
  const exploredPaths: Set<string> = new Set();

  // Function to recursively explore directories
  async function exploreDirectory(path: string): Promise<void> {
    // Skip if we've already explored this path
    if (exploredPaths.has(path)) {
      return;
    }

    exploredPaths.add(path);
    console.log(`Exploring directory: ${path}`);

    try {
      const { data, error } = await supabase.storage
        .from(supabaseConfig.storageBucket)
        .list(path);

      if (error) {
        console.error(`Error listing directory ${path}:`, error);
        return;
      }

      if (!data || data.length === 0) {
        console.log(`No files found in directory ${path}`);
        return;
      }

      // Process each item in the directory
      for (const item of data) {
        const itemPath = path ? `${path}/${item.name}` : item.name;
        allPaths.push(itemPath);

        // If this is a folder, explore it recursively
        if (item.id === null) { // Folders have null id in Supabase
          await exploreDirectory(itemPath);
        }
      }
    } catch (error) {
      console.error(`Error exploring directory ${path}:`, error);
    }
  }

  // Start exploration from the root directory
  await exploreDirectory('');

  return allPaths;
}