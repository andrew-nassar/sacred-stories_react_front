import React from 'react';

export interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`glass-card rounded-2xl p-5 sm:p-7 md:p-10 text-left relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Subtle glass reflection highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
