import { useState, useCallback } from 'react';
import { AuthApi } from '../api/auth.api';
import { ConfirmEmailResponse } from '../types/auth.types';
import { ApiErrorResponse } from '../types/api.types';

export interface UseConfirmEmailResult {
  isLoading: boolean;
  isConfirmed: boolean;
  isExpired: boolean;
  error: string | null;
  confirmData: ConfirmEmailResponse | null;
  confirmEmail: (email: string, token: string) => Promise<ConfirmEmailResponse | null>;
}

export function useConfirmEmail(): UseConfirmEmailResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<ConfirmEmailResponse | null>(null);

  const confirmEmail = useCallback(
    async (email: string, token: string): Promise<ConfirmEmailResponse | null> => {
      if (!email || !token) {
        setError('Invalid or missing confirmation parameters.');
        setIsExpired(true);
        return null;
      }

      setIsLoading(true);
      setError(null);
      setIsConfirmed(false);
      setIsExpired(false);

      try {
        const response = await AuthApi.confirmEmail(email, token);
        
        // Since the API request was successful (2xx), any valid response that doesn't explicitly state failure is a success.
        const isSuccess = !!response && (
          response.succeeded === true ||
          (response as any).isConfirmed === true ||
          response.data?.isConfirmed === true ||
          (response.succeeded !== false && !response.errors)
        );

        if (isSuccess) {
          setIsConfirmed(true);
          const resolvedData = response.data || {
            isConfirmed: true,
            message: response.message || 'Email confirmed successfully.'
          };
          setConfirmData(resolvedData);
          setIsLoading(false);
          return resolvedData;
        } else {
          setIsExpired(true);
          setError(response.message || 'Confirmation link has expired or is invalid.');
          setIsLoading(false);
          return null;
        }
      } catch (err) {
        const apiErr = err as ApiErrorResponse;
        setIsExpired(true);
        setError(apiErr.message || 'Email verification failed. The link may have expired.');
        setIsLoading(false);
        return null;
      }
    },
    []
  );

  return {
    isLoading,
    isConfirmed,
    isExpired,
    error,
    confirmData,
    confirmEmail,
  };
}
