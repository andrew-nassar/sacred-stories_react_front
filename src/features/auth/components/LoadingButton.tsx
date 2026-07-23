import React from 'react';

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  fullWidth = true,
  disabled,
  className = '',
  type = 'submit',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-[#333535]/40 hover:bg-[#333535]/80 border border-[#99907c]/30 text-[#e2e2e2]';
      case 'ghost':
        return 'bg-transparent hover:bg-white/5 text-[#d0c5af] hover:text-[#f2ca50]';
      case 'primary':
      default:
        return 'bg-[#f2ca50] text-[#3c2f00] font-semibold hover:bg-[#ffe088] shadow-[0_0_20px_rgba(242,202,80,0.2)] hover:shadow-[0_0_30px_rgba(242,202,80,0.4)]';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`sacred-button font-mono-label text-xs uppercase tracking-widest py-4 px-6 rounded-lg flex items-center justify-center gap-2.5 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none ${
        fullWidth ? 'w-full' : ''
      } ${getVariantStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="material-symbols-outlined text-[18px]">
              {icon}
            </span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};
