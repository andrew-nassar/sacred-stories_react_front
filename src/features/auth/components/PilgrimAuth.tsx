import React, { useState } from "react";
import { X, BookOpen, Sparkles, UserCheck, LogOut, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/authStore";

interface PilgrimAuthProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PilgrimAuth({ isOpen, onClose }: PilgrimAuthProps) {
  const { user, registerPilgrim, clearPilgrim } = useAuthStore();
  const [name, setName] = useState(user.isRegistered ? user.name : "");
  const [baptismalName, setBaptismalName] = useState(user.isRegistered ? user.baptismalName || "" : "");
  const [spiritualFocus, setSpiritualFocus] = useState(user.isRegistered ? user.spiritualFocus || "" : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    registerPilgrim(name.trim(), baptismalName.trim() || undefined, spiritualFocus.trim() || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0c0f0f]/95 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md glass-panel rounded-xl border border-white/10 glow-gold p-6 md:p-8 shadow-2xl bg-gradient-to-b from-canvas to-black"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full border border-gold-accent/20 flex items-center justify-center mx-auto mb-3 bg-gold-accent/5">
              <Compass className="w-5 h-5 text-gold-accent animate-spin-slow" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">Pilgrim Guestbook</h3>
            <p className="text-white/50 text-xs font-sans mt-1">
              {user.isRegistered 
                ? "Manage your spiritual pilgrim session" 
                : "Register in the digital scriptorium to guide prayers"}
            </p>
          </div>

          {user.isRegistered ? (
            /* Logged in state view */
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-lg">
                <span className="font-mono text-[9px] uppercase tracking-widest text-gold-accent block mb-2">Registered Scholar</span>
                <p className="font-serif text-lg font-medium text-white">{user.name}</p>
                {user.baptismalName && (
                  <p className="text-white/60 text-xs font-sans mt-0.5">Baptismal Name: {user.baptismalName}</p>
                )}
                {user.spiritualFocus && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <span className="font-mono text-[9px] text-white/30 uppercase block">Daily Contemplative Seek</span>
                    <p className="text-white/70 text-xs italic font-serif mt-1">&ldquo;{user.spiritualFocus}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearPilgrim}
                  className="flex-1 py-2.5 rounded border border-burgundy-accent/30 text-burgundy-accent hover:bg-burgundy-accent/10 font-mono text-[11px] tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Guestbook
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded bg-gold-accent text-[#0c0f0f] font-mono text-[11px] tracking-wider uppercase font-semibold hover:bg-white hover:text-[#0c0f0f] transition-all cursor-pointer"
                >
                  Close Scroll
                </button>
              </div>
            </div>
          ) : (
            /* Register form state */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">Pilgrim Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Brother Thomas"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">Baptismal/Confessional Name (Optional)</label>
                <input
                  type="text"
                  value={baptismalName}
                  onChange={(e) => setBaptismalName(e.target.value)}
                  placeholder="e.g. Augustin"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">Current Spiritual Intent (Optional)</label>
                <textarea
                  rows={2}
                  value={spiritualFocus}
                  onChange={(e) => setSpiritualFocus(e.target.value)}
                  placeholder="e.g., Finding peace in daily labor, seeking silent prayer..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-colors resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gold-accent text-[#0c0f0f] font-mono text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-1.5 hover:bg-white hover:text-[#0c0f0f] transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  Engrave Pilgrim Seal
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
