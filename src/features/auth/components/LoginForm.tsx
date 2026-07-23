import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchemaType } from '../validation/login.schema';
import { useLogin } from '../hooks/use-login';
import { PasswordField } from './PasswordField';
import { LoadingButton } from './LoadingButton';

export interface LoginFormProps {
  onSuccess?: (userData: any) => void;
  onForgotPasswordClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPasswordClick,
}) => {
  const { isLoading, error, fieldErrors, login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      stayLoggedIn: true,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const result = await login({
      email: data.email,
      password: data.password,
      stayLoggedIn: data.stayLoggedIn,
    });

    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* API Level Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-sans-body flex items-start gap-3">
          <span className="material-symbols-outlined text-[18px] shrink-0 text-[#ffb4ab]">
            warning
          </span>
          <div className="flex-1">
            <p className="font-semibold text-sm mb-0.5">Authentication Failure</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Identity (Email) */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="font-mono-label text-[11px] uppercase tracking-wider text-[#99907c] flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">fingerprint</span>
          IDENTITY (EMAIL)
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="archivist@sacredstories.museum"
          autoComplete="username"
          className={`input-glass w-full rounded-lg px-4 py-3.5 text-[#e2e2e2] font-sans-body placeholder:text-[#d0c5af]/30 text-sm ${
            errors.email || fieldErrors?.email ? 'border-[#ffb4ab]' : ''
          }`}
          {...register('email')}
        />
        {errors.email && (
          <p className="font-sans-body text-xs text-[#ffb4ab] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {errors.email.message}
          </p>
        )}
        {fieldErrors?.email?.map((msg, i) => (
          <p key={i} className="font-sans-body text-xs text-[#ffb4ab] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {msg}
          </p>
        ))}
      </div>

      {/* Secret Key (Password) */}
      <PasswordField
        id="login-password"
        label="SECRET KEY"
        autoComplete="current-password"
        placeholder="••••••••••••••••"
        error={
          errors.password?.message ||
          (fieldErrors?.password ? fieldErrors.password[0] : undefined)
        }
        forgotPasswordLink={
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="font-mono-label text-[11px] text-[#f2ca50] hover:underline hover:text-[#ffe088] transition-colors focus:outline-none"
          >
            Forgot Password?
          </button>
        }
        {...register('password')}
      />

      {/* Stay logged in checkbox */}
      <div className="flex items-center gap-3 pt-1">
        <input
          type="checkbox"
          id="stayLoggedIn"
          className="w-4 h-4 rounded border-[#99907c]/40 bg-white/5 text-[#f2ca50] focus:ring-[#f2ca50] focus:ring-offset-[#121414] cursor-pointer"
          {...register('stayLoggedIn')}
        />
        <label
          htmlFor="stayLoggedIn"
          className="font-sans-body text-xs text-[#d0c5af] cursor-pointer select-none"
        >
          Stay logged in for this session
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          icon="arrow_forward"
          iconPosition="right"
        >
          INITIATE ACCESS
        </LoadingButton>
      </div>
    </form>
  );
};
