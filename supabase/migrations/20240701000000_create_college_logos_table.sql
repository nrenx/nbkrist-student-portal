-- Create college_logos table
CREATE TABLE IF NOT EXISTS college_logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  uploader_name TEXT,
  uploader_email TEXT,
  download_count INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_college_logos_status ON college_logos(status);
CREATE INDEX IF NOT EXISTS idx_college_logos_created_at ON college_logos(created_at);

-- Enable Row Level Security
ALTER TABLE college_logos ENABLE ROW LEVEL SECURITY;

-- Create policies for college_logos
-- Allow anyone to read approved logos
CREATE POLICY "Allow public read access to approved logos"
  ON college_logos
  FOR SELECT
  USING (status = 'approved');

-- Allow anyone to insert new logos (with pending status)
CREATE POLICY "Allow public to submit logos"
  ON college_logos
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_logo_downloads(logo_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE college_logos
  SET download_count = download_count + 1
  WHERE id = logo_id;
END;
$$ LANGUAGE plpgsql;


-- Create the college_logo storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('college_logo', 'college_logo', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the college_logo bucket
-- Allow public read access to all files
CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'college_logo');

-- Allow authenticated users to insert files
CREATE POLICY "Authenticated Users Can Upload"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'college_logo');

-- Allow file owners to update their files
CREATE POLICY "File Owners Can Update"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'college_logo' AND auth.uid() = owner);

-- Allow file owners to delete their files
CREATE POLICY "File Owners Can Delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'college_logo' AND auth.uid() = owner);