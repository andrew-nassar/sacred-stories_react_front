import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';
import { ApiErrorResponse } from '../types/api.types';

export interface UseResendVerificationResult {
  isLoading: boolean;
  isSent: boolean;
  error: string | null;
  resendVerification: (email: string) => Promise<boolean>;
  resetState: () => void;
}

export function useResendVerification(): UseResendVerificationResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setIsSent(false);
    setError(null);
  }, []);

  const resendVerification = useCallback(
    async (email: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      setIsSent(false);

      try {
        const response = await AuthApi.resendVerificationEmail({ email });
        if (response.succeeded) {
          setIsSent(true);
          setIsLoading(false);
          return true;
        } else {
          setError(response.message || 'Failed to resend verification email.');
          setIsLoading(false);
          return false;
        }
      } catch (err) {
        const apiErr = err as ApiErrorResponse;
        setError(apiErr.message || 'Could not send verification email. Please try again.');
        setIsLoading(false);
        return false;
      }
    },
    []
  );

  return {
    isLoading,
    isSent,
    error,
    resendVerification,
    resetState,
  };
}
