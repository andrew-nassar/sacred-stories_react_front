import React from 'react';

export interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title = 'Sacred Stories',
  subtitle = 'DIGITAL MUSEUM ARCHIVE',
  showLogo = true,
}) => {
  return (
    <div className="text-center mb-8">
      {showLogo && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#1e2020] border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] shadow-[0_0_20px_rgba(242,202,80,0.15)] group hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-2xl">castle</span>
          </div>
        </div>
      )}
      <h1 className="font-serif-display text-3xl md:text-4xl font-semibold tracking-tight text-[#e2e2e2]">
        {title}
      </h1>
      {subtitle && (
        <p className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-[#99907c] mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
