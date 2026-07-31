import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';
import { RegisterRequest, RegisterResponse } from '../types/register.types';
import { ApiErrorResponse } from '../types/api.types';

export interface UseRegisterResult {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]> | null;
  isSuccess: boolean;
  register: (data: RegisterRequest) => Promise<RegisterResponse | null>;
  resetState: () => void;
}

export function useRegister(): UseRegisterResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setFieldErrors(null);
    setIsSuccess(false);
  }, []);

  const register = useCallback(
    async (data: RegisterRequest): Promise<RegisterResponse | null> => {
      setIsLoading(true);
      setError(null);
      setFieldErrors(null);
      setIsSuccess(false);

      try {
        const response = await AuthApi.register(data);
        if (response.succeeded && response.data) {
          setIsSuccess(true);
          setIsLoading(false);
          return response.data;
        } else {
          setError(response.message || 'Registration failed. Please try again.');
          setIsLoading(false);
          return null;
        }
      } catch (err) {
        const apiErr = err as ApiErrorResponse;
        setError(apiErr.message || 'Registration request failed.');
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
    isSuccess,
    register,
    resetState,
  };
}
