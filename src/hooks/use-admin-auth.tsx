import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { isAdmin, signIn, signOut } from '@/services/adminService';
import { AdminUser } from '@/types/blog';

interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setAdminUser(null);
          return;
        }

        // Check if the user is an admin
        const adminStatus = await isAdmin();
        setIsAuthenticated(adminStatus);

        if (adminStatus) {
          // Get admin user details
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (error || !data) {
            setAdminUser(null);
          } else {
            setAdminUser(data as AdminUser);
          }
        } else {
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setError('Failed to check authentication status');
        setIsAuthenticated(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if the user is an admin
        const adminStatus = await isAdmin();
        setIsAuthenticated(adminStatus);

        if (adminStatus && session?.user) {
          // Get admin user details
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (error || !data) {
            setAdminUser(null);
          } else {
            setAdminUser(data as AdminUser);
          }
        } else {
          setAdminUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
    });

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { success, error } = await signIn(email, password);

      if (!success) {
        setError(error || 'Failed to sign in');
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error('Error signing in:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await signOut();

      if (!success) {
        setError('Failed to sign out');
        return false;
      }

      setIsAuthenticated(false);
      setAdminUser(null);
      return true;
    } catch (err) {
      console.error('Error signing out:', err);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    adminUser,
    error,
    login,
    logout
  };
}
