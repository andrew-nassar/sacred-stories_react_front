import BASE_URL from './config';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/Auth/login`,
    REGISTER: `${BASE_URL}/api/Auth/register`,
    CONFIRM_EMAIL: `${BASE_URL}/api/Auth/confirm-email`,
    RESEND_VERIFICATION_EMAIL: `${BASE_URL}/api/Auth/resend-verification-email`,
    REFRESH_TOKEN: `${BASE_URL}/api/Auth/refresh-token`,
    LOGOUT: `${BASE_URL}/api/Auth/logout`,
  },
  STORIES: {
    BASE: `${BASE_URL}/api/SacredStories`,
    DETAIL: (id: string | number) => `${BASE_URL}/api/SacredStories/${id}`,
    STATUS: (id: string | number) => `${BASE_URL}/api/SacredStories/${id}/status`,
    TYPES: `${BASE_URL}/api/SacredStories/types`,
  },
  DASHBOARD: {
    DATA: `${BASE_URL}/api/dashboard/data`,
    METRICS: `${BASE_URL}/api/Dashboard/metrics`,
  },
  ARCHIVES: {
    SEARCH: `${BASE_URL}/api/search-archives`,
    CHAT: `${BASE_URL}/api/archivist-chat`,
    REFLECTION: `${BASE_URL}/api/generate-reflection`,
  },
} as const;
