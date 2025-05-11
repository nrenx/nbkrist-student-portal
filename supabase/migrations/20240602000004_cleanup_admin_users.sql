-- Cleanup admin users table by removing duplicates and users with typos

-- First, let's identify the admin users
DO $$
BEGIN
    RAISE NOTICE 'Current admin users:';
END $$;

-- Delete the admin user with the typo in the email
DELETE FROM admin_users
WHERE email = 'bollineninarendr2002@gmail.com';

-- Ensure the correct admin user exists
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
