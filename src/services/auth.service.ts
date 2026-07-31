/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { ADMIN_CONFIG } from '../features/admin/shared/config';

const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || '';

export const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh (401) and forbidden (403)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const expiredAccessToken = localStorage.getItem('admin_access_token') || '';
      const refreshToken = localStorage.getItem('admin_refresh_token') || '';

      try {
        const response = await axios.post(`${backendUrl}/api/Auth/refresh-token`, {
          expiredAccessToken,
          refreshToken,
        });

        const newAccessToken = response.data?.accessToken || response.data?.AccessToken || response.data?.data?.accessToken || response.data?.data?.AccessToken;
        const newRefreshToken = response.data?.refreshToken || response.data?.RefreshToken || response.data?.data?.refreshToken || response.data?.data?.RefreshToken;

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('No tokens returned from refresh endpoint');
        }

        localStorage.setItem('admin_access_token', newAccessToken);
        localStorage.setItem('admin_refresh_token', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear auth and trigger redirect/logout
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');

        window.dispatchEvent(new Event('admin-session-expired'));
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.dispatchEvent(new Event('admin-unauthorized'));
    }

    return Promise.reject(error);
  }
);

// Helper to decode JWT without external dependencies
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
    if (ADMIN_CONFIG.useMockOnly) {
      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockToken = 'mock_jwt_token_for_archivist';
      const mockRefreshToken = 'mock_refresh_token_for_archivist';
      const mockUser = {
        id: 'usr-1',
        name: 'Nikolaos of Myra',
        email: email || 'n.myra@sacredstories.org',
        role: 'Admin',
        status: 'Active',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        verified: true,
      };

      localStorage.setItem('admin_access_token', mockToken);
      localStorage.setItem('admin_refresh_token', mockRefreshToken);
      localStorage.setItem('admin_user', JSON.stringify(mockUser));

      return { accessToken: mockToken, refreshToken: mockRefreshToken, user: mockUser };
    }

    const response = await api.post('/api/Auth/login', { email, password });
    const data = response.data?.data || response.data;
    const accessToken = data.accessToken || data.AccessToken;
    const refreshToken = data.refreshToken || data.RefreshToken;

    if (!accessToken || !refreshToken) {
      throw new Error('Invalid login response schema');
    }

    localStorage.setItem('admin_access_token', accessToken);
    localStorage.setItem('admin_refresh_token', refreshToken);

    // Parse user from JWT or response
    let user = data.user || null;
    if (!user) {
      const decoded = parseJwt(accessToken);
      if (decoded) {
        // Look for common role and name claims
        const role = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User';
        const name = decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.email || email;
        const emailClaim = decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || email;
        user = {
          id: decoded.sub || decoded.nameid || 'usr-jwt',
          name,
          email: emailClaim,
          role: role === 'Admin' || role === 'Archivist' ? 'Admin' : role,
          status: 'Active',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          verified: true,
        };
      }
    }

    if (user) {
      localStorage.setItem('admin_user', JSON.stringify(user));
    }

    return { accessToken, refreshToken, user };
  },

  logout: () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    window.dispatchEvent(new Event('admin-logout'));
  },

  getCurrentUser: () => {
    const stored = localStorage.getItem('admin_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  },

  getAccessToken: () => {
    return localStorage.getItem('admin_access_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('admin_refresh_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('admin_access_token');
  },

  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    if (!user) return false;
    return user.role === 'Admin' || user.role === 'Archivist' || user.role === 'Chief Editor';
  },
};
