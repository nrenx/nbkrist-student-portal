/**
 * Supabase configuration settings
 */

// Read environment variables with fallbacks
const getEnvVar = (key: string, defaultValue: string): string => {
  return import.meta.env[key] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const supabaseConfig = {
  // Supabase project URL and API key
  url: getEnvVar('VITE_SUPABASE_URL', 'https://ndeagjkuhzyozgimudow.supabase.co'),
  key: getEnvVar('VITE_SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZWFnamt1aHp5b3pnaW11ZG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDg5OTY4NiwiZXhwIjoyMDYwNDc1Njg2fQ.qyjFWHusv_o03P_eS_j_kCemXLD45wvioD3lxIqYlbM'),

  // Storage bucket name for student data
  storageBucket: getEnvVar('VITE_SUPABASE_STORAGE_BUCKET', 'student_data'),

  // Path structure for student data files
  pathTemplate: '{academicYear}/{yearOfStudy}/{branch}/{section}/{rollNumber}',

  // File names for different types of student data
  fileNames: {
    personalDetails: 'personal_details.json',
    attendance: 'attendance.json',
    midMarks: 'mid_marks.json',
    rollIndex: 'rollIndex.json'
  },

  // Base paths for student data
  basePaths: [
    'student_details/{academicYear}/{yearOfStudy}/{branch}/{section}/{rollNumber}',
    'student_data/student_details/{academicYear}/{yearOfStudy}/{branch}/{section}/{rollNumber}',
    '{academicYear}/{yearOfStudy}/{branch}/{section}/{rollNumber}'
  ],

  // Retry configuration
  maxRetries: getNumberEnvVar('VITE_MAX_RETRIES', 2),
  retryDelay: getNumberEnvVar('VITE_RETRY_DELAY', 1000), // ms

  // Cache configuration
  cacheEnabled: getBooleanEnvVar('VITE_ENABLE_CACHE', true),
  cacheDuration: getNumberEnvVar('VITE_CACHE_DURATION', 5 * 60 * 1000), // 5 minutes in ms
};
