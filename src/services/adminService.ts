import { supabase } from '@/lib/supabase';
import { AdminUser } from '@/types/blog';

// Store the admin session in memory
let currentAdmin: AdminUser | null = null;

/**
 * Check if a user is an admin
 * @returns Promise with boolean indicating if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return currentAdmin !== null;
}

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise with success boolean and optional error message
 */
export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the admin user from the database
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (!data) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Check if password field exists
    if (!data.password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Compare the password directly (no hashing)
    if (password !== data.password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Store the admin user in memory
    currentAdmin = {
      id: data.id,
      email: data.email,
      created_at: data.created_at
    };

    return { success: true };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/**
 * Sign out the current user
 * @returns Promise with success boolean
 */
export async function signOut(): Promise<boolean> {
  try {
    // Clear the admin session
    currentAdmin = null;
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

/**
 * Get the current admin user
 * @returns Promise with admin user or null if not an admin
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  return currentAdmin;
}

/**
 * Create a new admin user
 * @param email - Admin email
 * @param password - Admin password
 * @returns Promise with success boolean and optional error message
 */
export async function createAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Insert the admin user with plain text password
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        { email: email.toLowerCase(), password: password }
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating admin:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
