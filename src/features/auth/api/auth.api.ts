import axios, { AxiosInstance, AxiosError } from 'axios';
import { AUTH_ENDPOINTS } from './auth.endpoints';
import { ApiResponse, ApiErrorResponse } from '../types/api.types';
import {
  ConfirmEmailResponse,
  ResendVerificationRequest,
  RefreshTokenRequest,
  AuthTokens,
} from '../types/auth.types';
import { LoginRequest, LoginResponse } from '../types/login.types';
import { RegisterRequest, RegisterResponse } from '../types/register.types';

const TOKEN_KEY = 'sacred_stories_access_token';
const REFRESH_TOKEN_KEY = 'sacred_stories_refresh_token';
const USER_KEY = 'sacred_stories_user';

export const authHttpClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

authHttpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class AuthApi {
  public static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await authHttpClient.post<ApiResponse<LoginResponse>>(
        AUTH_ENDPOINTS.LOGIN,
        data
      );
      if (response.data?.data?.tokens) {
        this.saveSession(response.data.data.tokens, response.data.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public static async register(
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await authHttpClient.post<ApiResponse<RegisterResponse>>(
        AUTH_ENDPOINTS.REGISTER,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public static async confirmEmail(
    userId: string,
    token: string
  ): Promise<ApiResponse<ConfirmEmailResponse>> {
    try {
      const response = await authHttpClient.get<ApiResponse<ConfirmEmailResponse>>(
        AUTH_ENDPOINTS.CONFIRM_EMAIL,
        {
          params: { userId, token },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public static async resendVerificationEmail(
    data: ResendVerificationRequest
  ): Promise<ApiResponse<{ sent: boolean }>> {
    try {
      const response = await authHttpClient.post<ApiResponse<{ sent: boolean }>>(
        AUTH_ENDPOINTS.RESEND_VERIFICATION_EMAIL,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public static async refreshToken(
    data: RefreshTokenRequest
  ): Promise<ApiResponse<AuthTokens>> {
    try {
      const response = await authHttpClient.post<ApiResponse<AuthTokens>>(
        AUTH_ENDPOINTS.REFRESH_TOKEN,
        data
      );
      if (response.data?.data) {
        localStorage.setItem(TOKEN_KEY, response.data.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.data.refreshToken);
      }
      return response.data;
    } catch (error) {
      this.clearSession();
      throw this.handleError(error);
    }
  }

  public static async logout(): Promise<ApiResponse<void>> {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const response = await authHttpClient.post<ApiResponse<void>>(
        AUTH_ENDPOINTS.LOGOUT,
        { refreshToken }
      );
      this.clearSession();
      return response.data;
    } catch (error) {
      this.clearSession();
      throw this.handleError(error);
    }
  }

  public static getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public static getStoredUser(): any | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static saveSession(tokens: AuthTokens, user: any): void {
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public static clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private static handleError(error: unknown): ApiErrorResponse {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<ApiResponse<any> | ApiErrorResponse>;
      if (serverError.response?.data) {
        const data = serverError.response.data as any;
        return {
          statusCode: serverError.response.status,
          message: data.message || 'An authentication error occurred.',
          errors: data.errors,
        };
      }
      return {
        statusCode: serverError.response?.status || 500,
        message: serverError.message || 'Network connection failed.',
      };
    }
    return {
      statusCode: 500,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
