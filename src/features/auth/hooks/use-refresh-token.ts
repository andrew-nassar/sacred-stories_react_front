import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';
import { AuthTokens } from '../types/auth.types';
import { ApiErrorResponse } from '../types/api.types';

export interface UseRefreshTokenResult {
  isLoading: boolean;
  error: string | null;
  refresh: (refreshTokenStr?: string) => Promise<AuthTokens | null>;
}

export function useRefreshToken(): UseRefreshTokenResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (refreshTokenStr?: string): Promise<AuthTokens | null> => {
      const storedRefreshToken =
        refreshTokenStr || localStorage.getItem('sacred_stories_refresh_token');

      if (!storedRefreshToken) {
        setError('No refresh token available.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await AuthApi.refreshToken({
          refreshToken: storedRefreshToken,
        });
        if (response.success && response.data) {
          setIsLoading(false);
          return response.data;
        } else {
          setError(response.message || 'Token refresh failed.');
          setIsLoading(false);
          return null;
        }
      } catch (err) {
        const apiErr = err as ApiErrorResponse;
        setError(apiErr.message || 'Session renewal failed.');
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  return {
    isLoading,
    error,
    refresh,
  };
}
