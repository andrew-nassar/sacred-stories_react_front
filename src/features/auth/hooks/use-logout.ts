import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';
import { useSacredStore } from '@/src/app/store/sacredStore';

export interface UseLogoutResult {
  isLoggingOut: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<boolean>;
}

export function useLogout(): UseLogoutResult {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsAuthenticated, setCurrentUser } = useSacredStore();

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoggingOut(true);
    setError(null);

    try {
      await AuthApi.logout();
      return true;
    } catch (err) {
      setError('Logout request failed, session cleared locally.');
      return true;
    } finally {
      // 1. Clear reactive auth state in store
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoggingOut(false);
    }
  }, [setIsAuthenticated, setCurrentUser]);

  return {
    isLoggingOut,
    isLoading: isLoggingOut, // alias for compatibility
    error,
    logout,
  };
}