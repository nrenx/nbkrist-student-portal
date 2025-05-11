-- Drop existing policy if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_users' 
        AND policyname = 'Admin users can manage admin_users'
    ) THEN
        DROP POLICY "Admin users can manage admin_users" ON admin_users;
    END IF;
END $$;

-- Create a better policy for admin_users
CREATE POLICY "Enable all access for admin_users" ON admin_users
    USING (true)
    WITH CHECK (true);

-- Disable RLS for admin_users to simplify access
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
