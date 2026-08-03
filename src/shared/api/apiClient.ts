import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import BASE_URL from './config';
import { authStorage } from '../auth/authStorage';
import { API_ENDPOINTS } from './endpoints';

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

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite loops if the refresh-token endpoint itself returns 401
    const isRefreshRequest = originalRequest.url?.includes('/api/Auth/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const expiredAccessToken = authStorage.getAccessToken() || '';
      const refreshToken = authStorage.getRefreshToken() || '';

      if (!refreshToken) {
        isRefreshing = false;
        authStorage.clearSession();
        window.dispatchEvent(new Event('sacred-stories-logout'));
        window.location.replace('/login');
        return Promise.reject(error);
      }

      try {
        // Use a clean axios post call to avoid interceptor recursion
        const response = await axios.post(`${BASE_URL}/api/Auth/refresh-token`, {
          expiredAccessToken,
          refreshToken,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          }
        });

        const resData = response.data?.data || response.data;
        const newAccessToken = resData?.accessToken || resData?.AccessToken;
        const newRefreshToken = resData?.refreshToken || resData?.RefreshToken;

        if (!newAccessToken) {
          throw new Error('Refresh endpoint did not return an access token.');
        }

        // Keep current user info intact, just update tokens
        const currentUser = authStorage.getCurrentUser();
        if (currentUser) {
          authStorage.saveSession(newAccessToken, newRefreshToken || refreshToken, currentUser);
        } else {
          // If user info is not found, at least save tokens
          localStorage.setItem('sacred_stories_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('sacred_stories_refresh_token', newRefreshToken);
          }
        }

        // Sync with common header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Re-dispatch global login/refresh event so UI stores update
        window.dispatchEvent(new Event('admin-login'));

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        authStorage.clearSession();
        window.dispatchEvent(new Event('sacred-stories-logout'));
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.dispatchEvent(new Event('sacred-stories-forbidden'));
    }

    return Promise.reject(error);
  }
);

/**
 * Reusable unified apiFetch helper that routes through apiClient
 * to preserve Bearer token attachment and automatic token refreshing
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Combine base URL if relative path
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const method = (options.method || 'GET').toUpperCase();

  try {
    const response = await apiClient({
      url,
      method,
      headers: options.headers as any,
      data: options.body ? JSON.parse(options.body as string) : undefined,
    });
    return response.data as T;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data as any;
      const errorText = typeof data === 'string' ? data : (data?.message || error.message);
      throw new Error(`API Error ${status}: ${errorText}`);
    }
    throw error;
  }
}
