// College logo data types for Supabase integration

// Logo status options
export type LogoStatus = 'pending' | 'approved' | 'rejected';

// College logo data structure
export interface CollegeLogo {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  status: LogoStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  uploader_name?: string;
  uploader_email?: string;
  download_count: number;
}

// Logo submission form data
export interface LogoSubmission {
  name: string;
  description?: string;
  image: File;
  uploader_name?: string;
  uploader_email?: string;
}

// Logo update data
export interface LogoUpdate {
  name?: string;
  description?: string;
  image_url?: string;
  status?: LogoStatus;
  approved_at?: string | null;
  uploader_name?: string;
  uploader_email?: string;
  download_count?: number;
}
