/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthApi } from '@/src/features/auth/api/auth.api';

export function useAuthGuard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token =
      AuthApi.getStoredToken() ||
      localStorage.getItem('admin_access_token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('sacred_access_token') ||
      localStorage.getItem('token');
    return Boolean(token);
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    return AuthApi.getStoredUser() || JSON.parse(localStorage.getItem('admin_user') || 'null');
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkAuth = useCallback(() => {
    const token =
      AuthApi.getStoredToken() ||
      localStorage.getItem('admin_access_token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('sacred_access_token') ||
      localStorage.getItem('token');

    const user = AuthApi.getStoredUser() || JSON.parse(localStorage.getItem('admin_user') || 'null');

    const authed = Boolean(token);
    setIsAuthenticated(authed);
    setCurrentUser(user);

    return authed;
  }, []);

  useEffect(() => {
    checkAuth();

    const handleStorage = () => checkAuth();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('admin-login', handleStorage);
    window.addEventListener('admin-logout', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('admin-login', handleStorage);
      window.removeEventListener('admin-logout', handleStorage);
    };
  }, [checkAuth]);

  const redirectToLogin = useCallback(() => {
    navigate('/login', { state: { from: '/create-story' } });
  }, [navigate]);

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    checkAuth,
    redirectToLogin,
  };
}
