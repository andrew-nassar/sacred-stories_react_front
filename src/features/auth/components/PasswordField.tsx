import React, { useState, forwardRef } from 'react';

export interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  forgotPasswordLink?: React.ReactNode;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label = 'SECRET KEY',
      error,
      icon = 'key',
      forgotPasswordLink,
      className = '',
      id = 'password-field',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={id}
              className="font-mono-label text-[11px] uppercase tracking-wider text-[#99907c] flex items-center gap-1.5"
            >
              {icon && (
                <span className="material-symbols-outlined text-[16px]">
                  {icon}
                </span>
              )}
              {label}
            </label>
          )}
          {forgotPasswordLink}
        </div>

        <div className="relative flex items-center">
          <input
            ref={ref}
            id={id}
            type={showPassword ? 'text' : 'password'}
            className={`input-glass w-full rounded-lg px-4 py-3.5 pr-12 text-[#e2e2e2] font-sans-body placeholder:text-[#d0c5af]/30 text-sm ${
              error ? 'border-[#ffb4ab]/80 focus:border-[#ffb4ab]' : ''
            } ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="absolute right-3.5 text-[#99907c] hover:text-[#f2ca50] transition-colors p-1 flex items-center justify-center focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        {error && (
          <p className="font-sans-body text-xs text-[#ffb4ab] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
