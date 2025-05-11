// Blog data types for Supabase integration

// Blog post status options
export type BlogPostStatus = 'pending' | 'approved' | 'rejected';

// Blog post data structure
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  status: BlogPostStatus;
  created_at: string;
  updated_at: string;
  published_at?: string;
  author_name?: string;
  author_email?: string;
}

// Blog post submission form data
export interface BlogPostSubmission {
  title: string;
  content: string;
  image?: File;
  author_name?: string;
  author_email?: string;
}

// Admin user data structure
export interface AdminUser {
  id: string;
  email: string;
  password?: string; // Optional in the interface to avoid exposing it unnecessarily
  created_at: string;
}

// Blog post with optional image file for form handling
export interface BlogPostWithImage extends BlogPost {
  imageFile?: File;
}

// Blog post update data
export interface BlogPostUpdate {
  title?: string;
  content?: string;
  image_url?: string;
  status?: BlogPostStatus;
  published_at?: string | null;
  author_name?: string;
  author_email?: string;
}
