# Admin Setup Guide

This guide explains how to set up the admin functionality for the blog system.

## Database Setup

1. First, run the SQL migration script to create the necessary tables:

```sql
-- Run this in your Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  author_name TEXT,
  author_email TEXT
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create security policies
-- Public can read approved blog posts
CREATE POLICY "Public can read approved blog posts" ON blog_posts
  FOR SELECT USING (status = 'approved');

-- Public can submit new blog posts (with pending status)
CREATE POLICY "Public can submit new blog posts" ON blog_posts
  FOR INSERT WITH CHECK (status = 'pending');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## Creating an Admin User

### Option 1: Using the Create Admin Script

1. Install the required dependency:
```bash
npm install @supabase/supabase-js
```

2. Run the create-admin script:
```bash
node scripts/create-admin.js
```

3. Follow the prompts to enter your Supabase URL, API key, admin email, and password.

### Option 2: Manually Creating an Admin User

You can directly insert an admin user into the admin_users table:

```sql
INSERT INTO admin_users (email, password)
VALUES ('admin@example.com', 'your-password');
```

## Testing Admin Login

1. After setting up the admin user, navigate to the Admin Dashboard page.
2. You should be redirected to the login page.
3. Enter the email and password you created.
4. After successful login, you'll be redirected to the Admin Dashboard.

## Security Considerations

- The admin password is stored as plain text in the database for simplicity.
- Make sure your Supabase database has proper security settings.
- The admin login is protected by the AdminAuthGuard component, which prevents unauthorized access.
- Session information is stored in memory and will be cleared when the page is refreshed or closed.

## Troubleshooting

If you encounter issues with admin login:

1. Check that the admin_users table was created correctly with the password field.
2. Verify that the admin user was inserted correctly with the correct password.
3. Check the browser console for any error messages.
4. Try clearing your browser cache and cookies.
