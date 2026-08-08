import axios, { AxiosError } from 'axios';
import { apiClient } from '../../../shared/api/apiClient';
import { API_ENDPOINTS } from '../../../shared/api/endpoints';
import { authStorage, StoredUser } from '../../../shared/auth/authStorage';
import { ApiResponse, ApiErrorResponse } from '../types/api.types';
import {
  ConfirmEmailResponse,
  ResendVerificationRequest,
  RefreshTokenRequest,
  AuthTokens,
} from '../types/auth.types';
import { LoginRequest, LoginResponse } from '../types/login.types';
import { RegisterRequest, RegisterResponse } from '../types/register.types';

export const authHttpClient = apiClient;

export class AuthApi {
  public static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );

      const loginData = response.data?.data;

      if (loginData?.accessToken) {
        // Automatically calculate expiresIn (in seconds) from ISO expiration date
        const expirationMs = loginData.refreshTokenExpiration
          ? new Date(loginData.refreshTokenExpiration).getTime()
          : 0;
        
        const expiresIn = expirationMs > 0
          ? Math.max(0, Math.floor((expirationMs - Date.now()) / 1000))
          : 0;

        // Save session
        this.saveSession(
          {
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
            expiresIn,
            tokenType: 'Bearer',
          },
          {
            userName: loginData.userName,
            email: loginData.email,
            role: loginData.role,
          }
        );
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
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public static async confirmEmail(
    email: string,
    token: string
  ): Promise<ApiResponse<ConfirmEmailResponse>> {
    try {
      const response = await apiClient.get<ApiResponse<ConfirmEmailResponse>>(
        API_ENDPOINTS.AUTH.CONFIRM_EMAIL,
        {
          params: { email, token },
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
      const response = await apiClient.post<ApiResponse<{ sent: boolean }>>(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL,
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
      const response = await apiClient.post<ApiResponse<AuthTokens>>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        data
      );
      if (response.data?.data) {
        const tokens = response.data.data;
        const currentUser = this.getStoredUser();
        if (currentUser) {
          this.saveSession(tokens, currentUser);
        } else {
          localStorage.setItem('sacred_stories_access_token', tokens.accessToken);
          localStorage.setItem('sacred_stories_refresh_token', tokens.refreshToken);
        }
      }
      return response.data;
    } catch (error) {
      this.clearSession();
      throw this.handleError(error);
    }
  }

  public static async logout(): Promise<void> {
    try {
      const accessToken = authStorage.getAccessToken() || '';
      const refreshToken = authStorage.getRefreshToken() || '';

      if (accessToken || refreshToken) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout request failed on server:', error);
    } finally {
      this.clearSession();
      window.dispatchEvent(new Event('sacred-stories-logout'));
    }
  }

  public static getStoredToken(): string | null {
    return authStorage.getAccessToken();
  }

  public static getStoredUser(): StoredUser | null {
    return authStorage.getCurrentUser();
  }

  public static saveSession(tokens: AuthTokens, user: StoredUser): void {
    authStorage.saveSession(tokens.accessToken, tokens.refreshToken, user);
  }

  public static clearSession(): void {
    authStorage.clearSession();
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
