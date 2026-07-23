export const AUTH_ENDPOINTS = {
  REGISTER: '/api/Auth/register',
  LOGIN: '/api/Auth/login',
  CONFIRM_EMAIL: '/api/Auth/confirm-email',
  RESEND_VERIFICATION_EMAIL: '/api/Auth/resend-verification-email',
  REFRESH_TOKEN: '/api/Auth/refresh-token',
  LOGOUT: '/api/Auth/logout',
} as const;
