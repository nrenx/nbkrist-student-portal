import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Log environment variables for debugging (remove in production)
console.log('Supabase URL:', supabaseUrl ? 'Defined' : 'Undefined');
console.log('Supabase Key:', supabaseKey ? `Defined (starts with ${supabaseKey.substring(0, 10)}...)` : 'Undefined');

// Check if environment variables are defined
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing. Make sure you have set up your .env file correctly.');
}

// Hardcoded values as fallback for development (REMOVE IN PRODUCTION)
const url = supabaseUrl || 'https://oucqfglqvvlduhqabztv.supabase.co';
const key = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Y3FmZ2xxdnZsZHVocWFienR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgxMzgzNSwiZXhwIjoyMDYwMzg5ODM1fQ.mNqyDTylA0ApXp4RA8APJbr-EjEDe8iIgnTguP486ZA';

export const supabase = createClient(url, key);
