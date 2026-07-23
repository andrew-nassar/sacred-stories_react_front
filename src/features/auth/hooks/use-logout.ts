import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';

export interface UseLogoutResult {
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<boolean>;
}

export function useLogout(): UseLogoutResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthApi.logout();
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Logout request failed, session cleared locally.');
      setIsLoading(false);
      return true;
    }
  }, []);

  return {
    isLoading,
    error,
    logout,
  };
}
