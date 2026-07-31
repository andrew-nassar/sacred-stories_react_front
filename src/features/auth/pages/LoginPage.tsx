import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AuthHeader } from '../components/AuthHeader';
import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { useSacredStore } from '@/src/app/store/sacredStore';

export interface LoginPageProps {
  onLoginSuccess?: (userData: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setCurrentUser } = useSacredStore();

  const handleSuccess = (userData: any) => {
    // Unpack user object safely if passed inside a nested envelope
    const user = userData?.data || userData;

    // 1. Set global authentication state
    setIsAuthenticated(true);
    setCurrentUser(user);

    // 2. Trigger callback if provided
    if (onLoginSuccess) {
      onLoginSuccess(user);
    } 
    
      // 3. Role-based Navigation
      const userRole = user?.role?.toLowerCase();
      console.log('User role:', userRole);

      if (userRole === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    
  };

  return (
    <div className="min-h-screen w-full bg-[#121414] text-[#e2e2e2] flex flex-col justify-between items-center py-10 px-4 relative overflow-hidden">
      <div className="fixed inset-0 ethereal-gradient pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#f2ca50]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <Link
        to="/"
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex items-center gap-2 font-mono text-xs text-[#99907c] hover:text-[#f2ca50] transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Return to Sanctuary</span>
        <span className="sm:hidden">Sanctuary</span>
      </Link>

      <div className="relative z-10 w-full max-w-md pt-10 sm:pt-4">
        <AuthHeader />
      </div>

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

      <footer className="relative z-10 py-6 text-center">
        <p className="font-mono-label text-[10px] text-[#99907c]/60 uppercase tracking-[0.2em]">
          © 2024 SACRED STORIES DIGITAL MUSEUM • END-TO-END ENCRYPTED
        </p>
      </footer>
    </div>
  );
};