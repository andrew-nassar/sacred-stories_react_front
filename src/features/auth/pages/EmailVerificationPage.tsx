import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useResendVerification } from '../hooks/use-resend-verification';

export const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || 'user@email.com';

  const { isLoading, isSent, error, resendVerification } = useResendVerification();

  const handleOpenEmailApp = () => {
    window.location.href = `mailto:${email}`;
  };

  const handleResend = async () => {
    await resendVerification(email);
  };

  return (
    <div className="min-h-screen w-full bg-[#121414] text-[#e2e2e2] font-sans-body flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
      {/* Background Atmospheric Layer */}
      <div className="fixed inset-0 ethereal-gradient pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8e0f28]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2d4668]/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-[520px] my-auto flex flex-col items-center text-center">
        {/* Central Graphic Area */}
        <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
          {/* Golden Orbit Rings */}
          <div
            className="absolute inset-0 border border-[#f2ca50]/20 rounded-full orbit-animation"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute inset-4 border border-[#f2ca50]/10 rounded-full orbit-animation"
            style={{ animationDirection: 'reverse', animationDuration: '12s' }}
          />

          {/* Glowing Sacred Envelope */}
          <div className="floating z-10">
            <div className="glass-card w-32 h-32 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:border-[#f2ca50]/40 transition-colors duration-500">
              <div className="absolute inset-0 bg-[#f2ca50]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="material-symbols-outlined text-[60px] text-[#f2ca50] glow-pulse">
                mark_as_unread
              </span>
            </div>
          </div>

          {/* Floating Particles/Orbs */}
          <div
            className="absolute top-4 right-4 w-2 h-2 bg-[#f2ca50] rounded-full blur-[2px] opacity-40 floating"
            style={{ animationDelay: '-2s' }}
          />
          <div
            className="absolute bottom-8 left-0 w-3 h-3 bg-[#b6d0f8] rounded-full blur-[2px] opacity-30 floating"
            style={{ animationDelay: '-4s' }}
          />
        </div>

        {/* Content */}
        <div className="space-y-4 max-w-md">
          <h1 className="font-serif-display text-3xl md:text-5xl font-semibold tracking-tight text-[#e2e2e2]">
            Verification Pending
          </h1>
          <p className="font-sans-body text-base md:text-lg text-[#d0c5af] leading-relaxed">
            We have sent a <span className="text-[#f2ca50] font-medium italic">sanctified gateway link</span> to{' '}
            <br className="hidden md:block" />
            <span className="text-[#e2e2e2] font-semibold border-b border-[#4d4635] pb-0.5">
              {email}
            </span>
            . Please follow the link to activate your archivist access.
          </p>

          {isSent && (
            <div className="p-3 rounded-lg bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] text-xs font-mono-label flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              A fresh verification link has been sent to your email!
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-sans-body">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-10 w-full space-y-4">
          {/* Primary Action */}
          <button
            type="button"
            onClick={handleOpenEmailApp}
            className="w-full bg-[#f2ca50] text-[#3c2f00] font-mono-label text-xs tracking-widest uppercase py-4 px-8 rounded-lg flex items-center justify-center gap-3 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(242,202,80,0.2)] hover:shadow-[0_0_30px_rgba(242,202,80,0.4)]"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            OPEN EMAIL APP
          </button>

          {/* Secondary Action */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleResend}
            className="w-full bg-[#333535]/30 hover:bg-[#333535]/50 border border-[#99907c]/20 text-[#e2e2e2] font-mono-label text-xs tracking-widest uppercase py-4 px-8 rounded-lg flex items-center justify-center gap-3 active:scale-95 transition-all duration-300 disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[18px] ${
                isLoading ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            {isLoading ? 'SENDING...' : 'RESEND VERIFICATION'}
          </button>

          {/* Direct Link Simulation for Demo */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/confirm-email?userId=demo-user-123&token=valid-token')}
              className="text-[11px] font-mono-label text-[#f2ca50]/70 hover:text-[#f2ca50] underline"
            >
              [ Demo simulation: Click here to simulate clicking the email link ]
            </button>
          </div>

          {/* Back Link */}
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 font-mono-label text-xs text-[#d0c5af] hover:text-[#f2ca50] transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Back to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="font-mono-label text-[11px] text-[#d0c5af]/40">
          © 2024 Sacred Stories Digital Museum. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
