export interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  isEmailConfirmed: boolean;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ConfirmEmailParams {
  userId: string;
  token: string;
}

export interface ConfirmEmailResponse {
  isConfirmed: boolean;
  message: string;
  user?: User;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  accessToken?: string;
}
