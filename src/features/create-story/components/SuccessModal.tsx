/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Sparkles, Home, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  isOpen: boolean;
  onReset: () => void;
  storyTitle?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onReset,
  storyTitle,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#121620] border border-gold-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-gold-accent/15 border border-gold-accent/40 flex items-center justify-center text-gold-accent mx-auto animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-accent bg-gold-accent/10 px-3 py-1 rounded-full border border-gold-accent/20 font-bold inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Story Submitted Successfully</span>
          </span>
          <h2 className="font-serif text-2xl font-bold text-white">
            {storyTitle || 'Sacred Story Submitted'}
          </h2>
          <p className="text-xs text-white/70 leading-relaxed max-w-xs mx-auto">
            Your sacred story contribution has been successfully submitted and stored in the archivist records.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10"
          >
            <Plus className="w-4 h-4 text-gold-accent" />
            <span>Submit Another Story</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-lg shadow-gold-accent/20 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
