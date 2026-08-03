export const AUTH_KEYS = {
  ACCESS_TOKEN: 'sacred_stories_access_token',
  REFRESH_TOKEN: 'sacred_stories_refresh_token',
  USER: 'sacred_stories_user',
} as const;

export interface StoredUser {
  userName: string;
  email: string;
  role: string;
  id?: string;
  status?: string;
  avatarUrl?: string;
  verified?: boolean;
  joinDate?: string;
  roleName?: string;
  [key: string]: any;
}

export const authStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
  },

  getCurrentUser: (): StoredUser | null => {
    const raw = localStorage.getItem(AUTH_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveSession: (accessToken: string, refreshToken: string, user: StoredUser): void => {
    localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
  },

  clearSession: (): void => {
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
    
    // Clear legacy/duplicate keys as requested to keep storage pristine
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  },
};
