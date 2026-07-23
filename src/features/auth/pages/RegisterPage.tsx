import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/AuthHeader';
import { AuthCard } from '../components/AuthCard';
import { RegisterForm } from '../components/RegisterForm';

export interface RegisterPageProps {
  onRegisterSuccess?: (email: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();

  const handleSuccess = (email: string) => {
    if (onRegisterSuccess) {
      onRegisterSuccess(email);
    } else {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121414] text-[#e2e2e2] flex flex-col justify-between items-center py-10 px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 ethereal-gradient pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#f2ca50]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-md pt-2">
        <AuthHeader />
      </div>

      {/* Main Card */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <AuthCard>
          <div className="mb-6">
            <h2 className="font-serif-display text-2xl font-medium text-[#e2e2e2] tracking-tight">
              Initiate Archivist Profile
            </h2>
            <p className="font-sans-body text-xs text-[#d0c5af]/80 mt-1">
              Join the sanctuary digital archive and preserve sacred records.
            </p>
          </div>

          <RegisterForm onSuccess={handleSuccess} />

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="font-sans-body text-xs text-[#d0c5af]">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-medium text-[#f2ca50] hover:underline hover:text-[#ffe088] transition-colors"
              >
                Access Login Here
              </Link>
            </p>
          </div>
        </AuthCard>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="font-mono-label text-[10px] text-[#99907c]/60 uppercase tracking-[0.2em]">
          © 2024 SACRED STORIES DIGITAL MUSEUM • ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};
