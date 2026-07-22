import React from "react";
import { ChevronDown, Search, Compass } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onExploreClick: () => void;
  onSearchClick: () => void;
}

export default function HeroSection({ onExploreClick, onSearchClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden bg-gradient-to-b from-canvas via-canvas to-black/40">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold-dark/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] rounded-full bg-burgundy-dark/5 blur-[100px] pointer-events-none" />

      {/* Decorative center icon or cross */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="w-12 h-12 rounded-full border border-gold-accent/30 flex items-center justify-center p-2">
          <Compass className="w-6 h-6 text-gold-accent animate-spin-slow" />
        </div>
      </motion.div>

      {/* Hero Headline */}
      <div className="max-w-4xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-4xl md:text-7xl font-bold tracking-tight text-white mb-2 leading-tight"
        >
          Modern Christian
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="font-serif text-4xl md:text-7xl font-bold tracking-tight text-gold-accent mb-8 leading-tight italic"
        >
          Martyrs & Saints
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-white/75 font-sans text-base md:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
        >
          A digital sanctuary preserving the echoes of sacrifice. In the silence of
          memory, their stories become eternal light, guiding us through the corridors of
          history.
        </motion.p>
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-center z-10 mb-20"
      >
        <button
          onClick={onExploreClick}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gold-accent hover:bg-gold-dark text-canvas font-sans font-medium tracking-wider transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-gold-accent/10 cursor-pointer"
        >
          Explore Saints
        </button>

        <button
          onClick={onSearchClick}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-gold-accent/30 bg-white/5 hover:bg-white/10 text-white hover:text-gold-accent font-sans font-medium tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <Search className="w-4 h-4" />
          Search Archives
        </button>
      </motion.div>

      {/* Scroll to enter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 cursor-pointer select-none"
        onClick={onExploreClick}
      >
        <span className="font-mono text-xs text-white/50 tracking-[0.25em] uppercase">
          Scroll to enter
        </span>
        <div className="flex flex-col items-center">
          <ChevronDown className="w-4 h-4 text-gold-accent animate-bounce" />
          <ChevronDown className="w-4 h-4 text-gold-accent -mt-2.5 animate-bounce delay-150" />
        </div>
      </motion.div>
    </section>
  );
}
