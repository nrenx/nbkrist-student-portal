import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/supabase';

/**
 * Initialize Supabase client with proper error handling
 * This function attempts to create a Supabase client with the provided configuration
 */
const initializeSupabaseClient = (): SupabaseClient => {
  // Get configuration values
  const url = supabaseConfig.url || import.meta.env.VITE_SUPABASE_URL;
  const key = supabaseConfig.key || import.meta.env.VITE_SUPABASE_KEY;

  // Only log non-sensitive information in development mode
  if (import.meta.env.DEV) {
    console.log('Environment:', import.meta.env.MODE);
    console.log('Base URL:', import.meta.env.BASE_URL);
    console.log('Storage Bucket:', supabaseConfig.storageBucket);
    console.log('Supabase URL defined:', !!url);
    console.log('Supabase Key defined:', !!key);
  }

  // Check if environment variables are defined
  if (!url || !key) {
    console.error('Supabase URL or Key is missing. Make sure you have set up your .env file correctly.');
  }

  try {
    // Create and return the Supabase client
    return createClient(url, key);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw new Error('Failed to initialize Supabase client');
  }
};

// Initialize the Supabase client
export const supabase = initializeSupabaseClient();

/**
 * Check if the storage bucket exists
 * @returns Promise<boolean> - True if the bucket exists, false otherwise
 */
export const checkBucketExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .getBucket(supabaseConfig.storageBucket);

    if (error) {
      console.error('Error checking bucket existence:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check bucket existence:', error);
    return false;
  }
};

// Check bucket existence on startup
checkBucketExists()
  .then(exists => {
    if (exists) {
      console.log(`Storage bucket '${supabaseConfig.storageBucket}' exists and is accessible.`);
    } else {
      console.error(`Storage bucket '${supabaseConfig.storageBucket}' does not exist or is not accessible.`);
    }
  })
  .catch(error => {
    console.error('Error during bucket existence check:', error);
  });
