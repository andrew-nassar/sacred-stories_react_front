import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';
import { LoginRequest, LoginResponse } from '../types/login.types';
import { ApiErrorResponse } from '../types/api.types';

export interface UseLoginResult {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  login: (data: LoginRequest) => Promise<LoginResponse | null>;
  resetError: () => void;
}

export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

  const resetError = useCallback(() => {
    setError(null);
    setFieldErrors(null);
  }, []);

  const login = useCallback(
    async (data: LoginRequest): Promise<LoginResponse | null> => {
      setIsLoading(true);
      setError(null);
      setFieldErrors(null);

      try {
        const response = await AuthApi.login(data);
        if (response.success && response.data) {
          setIsLoading(false);
          return response.data;
        } else {
          setError(response.message || 'Login failed. Please check your credentials.');
          setIsLoading(false);
          return null;
        }
      } catch (err) {
        const apiErr = err as ApiErrorResponse;
        setError(apiErr.message || 'Identity verification failed. Please try again.');
        if (apiErr.errors) {
          setFieldErrors(apiErr.errors);
        }
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  return {
    isLoading,
    error,
    fieldErrors,
    login,
    resetError,
  };
}
