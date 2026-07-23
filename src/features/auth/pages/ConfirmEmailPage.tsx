import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useConfirmEmail } from '../hooks/use-confirm-email';

export const ConfirmEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId') || '';
  const token = searchParams.get('token') || '';

  const { isLoading, isConfirmed, isExpired, error, confirmEmail } = useConfirmEmail();

  useEffect(() => {
    if (userId && token) {
      confirmEmail(userId, token);
    }
  }, [userId, token, confirmEmail]);

  return (
    <div className="min-h-screen w-full bg-[#121414] text-[#e2e2e2] font-sans-body flex flex-col justify-between items-center px-4 py-10 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 ethereal-gradient pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#f2ca50]/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Header Brand */}
      <header className="relative z-10 pt-4 text-center">
        <span className="font-serif-display text-2xl font-semibold tracking-tight text-[#f2ca50] block">
          Sacred Stories
        </span>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-lg my-auto flex flex-col items-center text-center">
        {/* State 1: Loading */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="w-20 h-20 mx-auto rounded-full border border-[#f2ca50]/30 flex items-center justify-center bg-[#1e2020]">
              <span className="material-symbols-outlined text-4xl text-[#f2ca50] animate-spin">
                progress_activity
              </span>
            </div>
            <h2 className="font-serif-display text-3xl font-semibold text-[#e2e2e2]">
              Verifying Gateway Token...
            </h2>
            <p className="font-sans-body text-sm text-[#d0c5af]">
              Please hold while we validate your archivist credentials.
            </p>
          </div>
        )}

        {/* State 2: Verification Complete (Success) */}
        {!isLoading && isConfirmed && (
          <div className="space-y-8 w-full">
            {/* Top Badge */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div
                className="absolute inset-0 border border-[#f2ca50]/30 rounded-full orbit-animation"
                style={{ animationDuration: '6s' }}
              />
              <div className="w-16 h-16 rounded-full bg-[#f2ca50]/10 border border-[#f2ca50]/40 flex items-center justify-center shadow-[0_0_25px_rgba(242,202,80,0.3)]">
                <span className="material-symbols-outlined text-3xl text-[#f2ca50]">
                  check_circle
                </span>
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-3">
              <h1 className="font-serif-display text-4xl md:text-5xl font-semibold tracking-tight text-[#e2e2e2]">
                Verification Complete
              </h1>
              <p className="font-sans-body text-base text-[#d0c5af] max-w-md mx-auto leading-relaxed">
                Your sanctuary account is now active. The archives and sacred chronicles are open to you.
              </p>
            </div>

            {/* Glass Container Action */}
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto space-y-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-serif-display text-lg font-medium py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(242,202,80,0.25)] hover:shadow-[0_0_30px_rgba(242,202,80,0.4)]"
              >
                Back to login
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 font-mono-label text-[11px] text-[#f2ca50] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-ping" />
                <span>• ENTERING SANCTUARY...</span>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Link Expired or Error */}
        {!isLoading && (!isConfirmed || isExpired) && (
          <div className="space-y-8 w-full">
            {/* Expired Link Icon */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffb4ab]/20 to-[#f2ca50]/10 border border-[#ffb4ab]/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,180,171,0.2)]">
                <span className="material-symbols-outlined text-4xl text-[#ffb4ab]">
                  history_toggle_off
                </span>
              </div>
            </div>

            {/* Titles */}
            <div className="space-y-3">
              <h1 className="font-serif-display text-4xl md:text-5xl font-semibold tracking-tight text-[#e2e2e2]">
                Link Expired
              </h1>
              <p className="font-sans-body text-base text-[#d0c5af] max-w-md mx-auto leading-relaxed">
                The confirmation link is no longer valid. For security, these links expire after 24 hours.
              </p>
              {error && (
                <p className="font-mono-label text-xs text-[#ffb4ab]/90 pt-1">
                  [{error}]
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto w-full pt-4">
              <button
                type="button"
                onClick={() => navigate('/resend-verification')}
                className="w-full sm:w-1/2 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-mono-label text-xs tracking-wider py-3.5 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(242,202,80,0.2)]"
              >
                Resend Email
              </button>
              <Link
                to="/login"
                className="w-full sm:w-1/2 bg-[#333535]/40 hover:bg-[#333535]/80 border border-[#99907c]/30 text-[#e2e2e2] font-mono-label text-xs tracking-wider py-3.5 px-6 rounded-lg transition-all text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center w-full max-w-4xl flex items-center justify-between font-mono-label text-[11px] text-[#99907c]/60">
        <span>© 2024 Sacred Stories Digital Museum. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#e2e2e2] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#e2e2e2] transition-colors">Archive</a>
        </div>
      </footer>
    </div>
  );
};
