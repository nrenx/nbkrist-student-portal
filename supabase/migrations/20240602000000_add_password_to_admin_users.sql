-- Add password column to admin_users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'admin_users'
        AND column_name = 'password'
    ) THEN
        ALTER TABLE admin_users ADD COLUMN password TEXT NOT NULL DEFAULT 'changeme';
    END IF;
END $$;

-- Create security policies for admin_users if they don't exist
DO $$
BEGIN
    -- Check if the policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_users' 
        AND policyname = 'Admin users can manage admin_users'
    ) THEN
        -- Create policy for admin users
        CREATE POLICY "Admin users can manage admin_users" ON admin_users
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;
