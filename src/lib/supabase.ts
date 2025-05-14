import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/supabase';

// Use the provided Supabase credentials
const supabaseUrl = 'https://ndeagjkuhzyozgimudow.supabase.co';

// Use service_role key for full access to storage
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZWFnamt1aHp5b3pnaW11ZG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDg5OTY4NiwiZXhwIjoyMDYwNDc1Njg2fQ.qyjFWHusv_o03P_eS_j_kCemXLD45wvioD3lxIqYlbM';

// Create a Supabase client with optimized options for storage
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

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
