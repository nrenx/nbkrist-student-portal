-- Fix admin login issues

-- 1. Make sure the admin_users table exists
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Disable Row Level Security for admin_users table
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 3. Drop any existing policies that might be causing issues
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_users' 
        AND policyname = 'Admin users can manage admin_users'
    ) THEN
        DROP POLICY "Admin users can manage admin_users" ON admin_users;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_users' 
        AND policyname = 'Enable all access for admin_users'
    ) THEN
        DROP POLICY "Enable all access for admin_users" ON admin_users;
    END IF;
END $$;

-- 4. Check if the admin user exists
DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM admin_users WHERE email = 'bollineninarendra2002@gmail.com';
    
    IF admin_count = 0 THEN
        -- Insert the admin user if it doesn't exist
        INSERT INTO admin_users (email, password)
        VALUES ('bollineninarendra2002@gmail.com', 'Bollineni@2002');
        
        RAISE NOTICE 'Admin user created with email: bollineninarendra2002@gmail.com';
    ELSE
        -- Update the admin user's password if it exists
        UPDATE admin_users
        SET password = 'Bollineni@2002'
        WHERE email = 'bollineninarendra2002@gmail.com';
        
        RAISE NOTICE 'Admin user password updated for email: bollineninarendra2002@gmail.com';
    END IF;
END $$;
