import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchemaType } from '../validation/register.schema';
import { useRegister } from '../hooks/use-register';
import { PasswordField } from './PasswordField';
import { LoadingButton } from './LoadingButton';

export interface RegisterFormProps {
  onSuccess?: (registeredEmail: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { isLoading, error, fieldErrors, register: submitRegister } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    const result = await submitRegister({
      email: data.email,
      password: data.password,
    });

    if (result && onSuccess) {
      onSuccess(data.email);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* API Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-sans-body flex items-start gap-3">
          <span className="material-symbols-outlined text-[18px] shrink-0">warning</span>
          <div>
            <p className="font-semibold mb-0.5">Registration Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      {/* Email */}
      <div className="space-y-1">
        <label
          htmlFor="register-email"
          className="font-mono-label text-[11px] uppercase tracking-wider text-[#99907c] flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          EMAIL ADDRESS
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="user@sacredstories.museum"
          className={`input-glass w-full rounded-lg px-4 py-3 text-[#e2e2e2] font-sans-body placeholder:text-[#d0c5af]/30 text-sm ${
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
        {fieldErrors?.email?.map((msg, idx) => (
          <p key={idx} className="font-sans-body text-xs text-[#ffb4ab] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {msg}
          </p>
        ))}
      </div>

      {/* Secret Key / Password */}
      <PasswordField
        id="register-password"
        label="SECRET KEY"
        placeholder="At least 8 characters..."
        error={
          errors.password?.message ||
          (fieldErrors?.password ? fieldErrors.password[0] : undefined)
        }
        {...register('password')}
      />

      {/* Confirm Password */}
      <PasswordField
        id="register-confirm-password"
        label="CONFIRM SECRET KEY"
        icon="check_circle"
        placeholder="Re-enter secret key..."
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Accept terms */}
      <div className="pt-1 space-y-1">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptTerms"
            className="w-4 h-4 mt-0.5 rounded border-[#99907c]/40 bg-white/5 text-[#f2ca50] focus:ring-[#f2ca50] cursor-pointer"
            {...register('acceptTerms')}
          />
          <label
            htmlFor="acceptTerms"
            className="font-sans-body text-xs text-[#d0c5af] leading-relaxed cursor-pointer select-none"
          >
            I agree to honor the <span className="text-[#f2ca50]">Sacred Archive Protocols</span> and privacy guidelines.
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="font-sans-body text-xs text-[#ffb4ab] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          icon="how_to_reg"
          iconPosition="right"
        >
          CREATE ARCHIVIST ACCOUNT
        </LoadingButton>
      </div>
    </form>
  );
};
