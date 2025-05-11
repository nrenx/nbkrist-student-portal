import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, getCurrentAdmin, isAdmin } from '@/services/adminService';
import { AdminUser } from '@/types/blog';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<boolean>;
}

export function useAdminAuth(): AdminAuthState {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authenticated = await isAdmin();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const admin = await getCurrentAdmin();
          setAdminUser(admin);
        } else {
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const result = await signIn(email, password);

      if (result.success) {
        setIsAuthenticated(true);
        const admin = await getCurrentAdmin();
        if (admin) {
          setAdminUser(admin);
        }
      }

      return result;
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await signOut();

      if (success) {
        setIsAuthenticated(false);
        setAdminUser(null);
      }

      return success;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    isLoading,
    adminUser,
    login,
    logout
  };
}
