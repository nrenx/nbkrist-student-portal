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

-- Create policies for blog_posts
-- Allow anyone to read approved posts
CREATE POLICY "Allow public read access to approved blog posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'approved');

-- Allow anyone to insert new posts (with pending status)
CREATE POLICY "Allow public to submit blog posts"
  ON blog_posts
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Allow admin users to read all posts
CREATE POLICY "Allow admin users to read all blog posts"
  ON blog_posts
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Allow admin users to update posts
CREATE POLICY "Allow admin users to update blog posts"
  ON blog_posts
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Allow admin users to delete posts
CREATE POLICY "Allow admin users to delete blog posts"
  ON blog_posts
  FOR DELETE
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Create policies for admin_users
-- Only allow admin users to read the admin_users table
CREATE POLICY "Allow admin users to read admin_users"
  ON admin_users
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
