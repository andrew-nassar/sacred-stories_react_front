// Safely handle optional trailing slashes in your .env
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const AUTH_ENDPOINTS = {
  REGISTER: `${BASE_URL}/api/Auth/register`,
  LOGIN: `${BASE_URL}/api/Auth/login`,
  CONFIRM_EMAIL: `${BASE_URL}/api/Auth/confirm-email`,
  RESEND_VERIFICATION_EMAIL: `${BASE_URL}/api/Auth/resend-verification-email`,
  REFRESH_TOKEN: `${BASE_URL}/api/Auth/refresh-token`,
  LOGOUT: `${BASE_URL}/api/Auth/logout`,
} as const;