// API
export { AuthApi, authHttpClient } from './api/auth.api';
export { AUTH_ENDPOINTS } from './api/auth.endpoints';

// Types
export * from './types/api.types';
export * from './types/auth.types';
export * from './types/login.types';
export * from './types/register.types';

// Validation Schemas
export { loginSchema, type LoginSchemaType } from './validation/login.schema';
export { registerSchema, type RegisterSchemaType } from './validation/register.schema';

// Hooks
export { useLogin, type UseLoginResult } from './hooks/use-login';
export { useRegister, type UseRegisterResult } from './hooks/use-register';
export { useConfirmEmail, type UseConfirmEmailResult } from './hooks/use-confirm-email';
export { useResendVerification, type UseResendVerificationResult } from './hooks/use-resend-verification';
export { useRefreshToken, type UseRefreshTokenResult } from './hooks/use-refresh-token';
export { useLogout, type UseLogoutResult } from './hooks/use-logout';

// Components
export { AuthHeader, type AuthHeaderProps } from './components/AuthHeader';
export { AuthCard, type AuthCardProps } from './components/AuthCard';
export { PasswordField, type PasswordFieldProps } from './components/PasswordField';
export { LoadingButton, type LoadingButtonProps } from './components/LoadingButton';
export { LoginForm, type LoginFormProps } from './components/LoginForm';
export { RegisterForm, type RegisterFormProps } from './components/RegisterForm';

// Pages
export { LoginPage, type LoginPageProps } from './pages/LoginPage';
export { RegisterPage, type RegisterPageProps } from './pages/RegisterPage';
export { EmailVerificationPage } from './pages/EmailVerificationPage';
export { ConfirmEmailPage } from './pages/ConfirmEmailPage';
export { ResendVerificationPage } from './pages/ResendVerificationPage';
