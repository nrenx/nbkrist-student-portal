-- Create visitor_sessions table
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on last_seen for efficient queries
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen ON visitor_sessions(last_seen);

-- Enable Row Level Security
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert their own sessions
CREATE POLICY "Allow anonymous users to insert their own sessions"
  ON visitor_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow anonymous users to update their own sessions
CREATE POLICY "Allow anonymous users to update their own sessions"
  ON visitor_sessions
  FOR UPDATE
  TO anon
  USING (id::text = auth.uid()::text)
  WITH CHECK (id::text = auth.uid()::text);

-- Create policy to allow anonymous users to delete their own sessions
CREATE POLICY "Allow anonymous users to delete their own sessions"
  ON visitor_sessions
  FOR DELETE
  TO anon
  USING (id::text = auth.uid()::text);

-- Create policy to allow anonymous users to select all sessions (for counting)
CREATE POLICY "Allow anonymous users to select all sessions"
  ON visitor_sessions
  FOR SELECT
  TO anon
  USING (true);
