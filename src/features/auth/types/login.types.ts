import { User, AuthTokens } from './auth.types';

export interface LoginRequest {
  email: string;
  password: string;
  stayLoggedIn?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  userName: string;
  email: string;
  role: string;
}
