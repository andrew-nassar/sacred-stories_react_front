/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { authHttpClient, AuthApi } from '../../auth/api/auth.api';

export const api = authHttpClient;

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const AuthService = {
  login: async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string; user?: any }> => {
    const response = await AuthApi.login({ email, password, stayLoggedIn: true });
    const user = AuthApi.getStoredUser();
    const accessToken = AuthApi.getStoredToken() || '';
    const refreshToken = localStorage.getItem('sacred_stories_refresh_token') || '';
    return { accessToken, refreshToken, user };
  },

  logout: () => {
    AuthApi.clearSession();
    window.dispatchEvent(new Event('admin-logout'));
  },

  getCurrentUser: () => {
    return AuthApi.getStoredUser();
  },

  getAccessToken: () => {
    return AuthApi.getStoredToken();
  },

  getRefreshToken: () => {
    return localStorage.getItem('sacred_stories_refresh_token');
  },

  isAuthenticated: (): boolean => {
    return !!AuthApi.getStoredToken();
  },

  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    if (!user) return false;
    // Handle either nested or direct properties
    const role = user.role || user.roleName || '';
    return role === 'Admin' || role === 'Archivist' || role === 'Chief Editor';
  },
};
