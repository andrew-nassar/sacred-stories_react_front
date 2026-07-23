import { User, AuthTokens } from './auth.types';

export interface LoginRequest {
  email: string;
  password: string;
  stayLoggedIn?: boolean;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  requiresEmailConfirmation?: boolean;
}
