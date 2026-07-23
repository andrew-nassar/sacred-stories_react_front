export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  requiresVerification: boolean;
  message: string;
}
