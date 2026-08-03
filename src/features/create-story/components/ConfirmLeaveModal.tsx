/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmLeaveModalProps {
  isOpen: boolean;
  onConfirmLeave: () => void;
  onCancel: () => void;
}

export const ConfirmLeaveModal: React.FC<ConfirmLeaveModalProps> = ({
  isOpen,
  onConfirmLeave,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#121620] border border-white/20 rounded-2xl p-6 shadow-2xl space-y-6 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Unsaved Changes</h3>
            <p className="text-xs text-white/60 mt-0.5">
              You have unsaved information in your story submission form.
            </p>
          </div>
        </div>

        <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
          Leaving this page now will discard all unsaved biography text, timeline events, and gallery entries.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            Continue Editing
          </button>
          <button
            type="button"
            onClick={onConfirmLeave}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-red-600/20"
          >
            Discard & Leave
          </button>
        </div>
      </div>
    </div>
  );
};
