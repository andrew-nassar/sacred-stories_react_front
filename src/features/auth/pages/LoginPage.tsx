import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // استيراد أيقونة السهم
import { AuthHeader } from '../components/AuthHeader';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';

export interface LoginPageProps {
  onLoginSuccess?: (userData: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const handleSuccess = (userData: any) => {
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    } else {
      navigate('/'); // العودة للصفحة الرئيسية بعد تسجيل الدخول بنجاح
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121414] text-[#e2e2e2] flex flex-col justify-between items-center py-10 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 ethereal-gradient pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#f2ca50]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* زر العودة للصفحة الرئيسية في الأعلى */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 font-mono text-xs text-[#99907c] hover:text-[#f2ca50] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Sanctuary</span>
      </Link>

      {/* Header */}
      <div className="relative z-10 w-full max-w-md pt-4">
        <AuthHeader />
      </div>

      {/* Main Card */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <AuthCard>
          <div className="mb-6">
            <h2 className="font-serif-display text-2xl font-medium text-[#e2e2e2] tracking-tight">
              Archivist Login
            </h2>
          </div>

          <LoginForm
            onSuccess={handleSuccess}
            onForgotPasswordClick={() => navigate('/resend-verification')}
          />

          <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-3">
            <p className="font-sans-body text-xs text-[#d0c5af]">
              First time here?{' '}
              <Link
                to="/register"
                className="font-medium text-[#f2ca50] hover:underline hover:text-[#ffe088] transition-colors"
              >
                Create Account
              </Link>
            </p>
            <div>
              <Link
                to="/resend-verification"
                className="font-mono-label text-[11px] text-[#99907c] hover:text-[#e2e2e2] transition-colors"
              >
                Resend Verification Email
              </Link>
            </div>
          </div>
        </AuthCard>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="font-mono-label text-[10px] text-[#99907c]/60 uppercase tracking-[0.2em]">
          © 2024 SACRED STORIES DIGITAL MUSEUM • END-TO-END ENCRYPTED
        </p>
      </footer>
    </div>
  );
};