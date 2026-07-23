import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResendVerification } from '../hooks/use-resend-verification';
import { LoadingButton } from '../components/LoadingButton';

export const ResendVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'ar' | 'en'>('en');
  const [email, setEmail] = useState('');

  const { isLoading, isSent, error, resendVerification } = useResendVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const success = await resendVerification(email);
    if (success) {
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }, 1200);
    }
  };

  const isAr = lang === 'ar';

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen w-full bg-[#121414] text-[#e2e2e2] font-sans-body flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden"
    >
      {/* Background Texture & Glow */}
      <div className="fixed inset-0 ethereal-gradient pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#f2ca50]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Language Toggle Bar */}
      <header className="relative z-10 w-full max-w-md flex justify-between items-center pt-2">
        <div className="text-center mx-auto">
          <span className="font-serif-display text-2xl font-medium tracking-tight text-[#f2ca50] block mb-1">
            Sacred Stories
          </span>
          <div className="h-px w-12 bg-[#f2ca50]/30 mx-auto" />
        </div>
        <button
          type="button"
          onClick={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
          className="absolute right-0 font-mono-label text-[11px] text-[#99907c] hover:text-[#f2ca50] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md transition-colors"
        >
          {isAr ? 'English' : 'عربي'}
        </button>
      </header>

      {/* Main Verification Card */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <section className="glass-card rounded-2xl p-8 md:p-10 text-center">
          {/* Top Mail Icon Badge */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#f2ca50]/10 rounded-full flex items-center justify-center border border-[#f2ca50]/30 shadow-[0_0_30px_rgba(242,202,80,0.1)]">
              <span className="material-symbols-outlined text-3xl text-[#f2ca50]">
                mail
              </span>
            </div>
          </div>

          {/* Titles */}
          <div className="mb-8">
            <h1 className="font-serif-display text-2xl md:text-3xl font-semibold text-[#e2e2e2] mb-3">
              {isAr ? 'إعادة إرسال رابط التفعيل' : 'Resend Verification Link'}
            </h1>
            <p className="font-sans-body text-sm text-[#d0c5af] max-w-[300px] mx-auto opacity-80 leading-relaxed">
              {isAr
                ? 'أدخل بريدك الإلكتروني لتلقي رابط تفعيل جديد للوصول إلى الأرشيف.'
                : 'Enter your email address to receive a new activation link for archive access.'}
            </p>
          </div>

          {/* Alert messages */}
          {isSent && (
            <div className="mb-6 p-3 rounded-lg bg-[#f2ca50]/10 border border-[#f2ca50]/30 text-[#f2ca50] text-xs font-mono-label">
              {isAr
                ? 'تم إرسال رابط التفعيل بنجاح! جاري التوجيه...'
                : 'Verification link sent successfully! Redirecting...'}
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-sans-body">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2 text-start">
              <label
                htmlFor="resend-email"
                className="font-mono-label text-[11px] text-[#99907c] block uppercase tracking-wider"
              >
                {isAr ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}
              </label>
              <input
                id="resend-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                className="input-glass w-full rounded-lg px-4 py-3.5 text-[#e2e2e2] font-sans-body placeholder:text-[#d0c5af]/30 text-sm dir-ltr text-left"
              />
            </div>

            <LoadingButton
              type="submit"
              isLoading={isLoading}
              icon={isAr ? 'arrow_back' : 'arrow_forward'}
              iconPosition="right"
            >
              {isAr ? 'إرسال الرابط' : 'Send Link'}
            </LoadingButton>
          </form>

          {/* Back to login link */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <Link
              to="/login"
              className="font-mono-label text-xs text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAr ? 'arrow_forward' : 'arrow_back'}
              </span>
              {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="font-mono-label text-[10px] text-[#99907c] uppercase tracking-[0.2em] opacity-40">
          LUMINA ARCHIVE SECURITY PROTOCOL 0.4.1
        </p>
      </footer>
    </div>
  );
};
