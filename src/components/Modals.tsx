import React, { useState } from "react";
import { X, MapPin, Award, Calendar, Quote, Sparkles, RefreshCw, Compass, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Saint } from "../data";

interface SaintDetailModalProps {
  saint: Saint | null;
  onClose: () => void;
  onOpenPrayerWithSaint: (saintName: string) => void;
}

export function SaintDetailModal({ saint, onClose, onOpenPrayerWithSaint }: SaintDetailModalProps) {
  if (!saint) return null;

  const accentColor = 
    saint.colorTheme === "burgundy" ? "text-burgundy-accent border-burgundy-accent/20 bg-burgundy-accent/5" :
    saint.colorTheme === "gold" ? "text-gold-accent border-gold-accent/20 bg-gold-accent/5" : "text-sky-400 border-sky-400/20 bg-sky-400/5";

  const glowTheme = 
    saint.colorTheme === "burgundy" ? "glow-burgundy border-burgundy-accent/20" :
    saint.colorTheme === "gold" ? "glow-gold border-gold-accent/20" : "glow-navy border-sky-500/10";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0c0f0f]/90 backdrop-blur-md"
        />

        {/* Modal content panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-xl border border-white/10 ${glowTheme} shadow-2xl flex flex-col md:flex-row`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Beautiful portrait banner */}
          <div className="w-full md:w-2/5 relative min-h-[300px] md:min-h-full bg-black">
            <img
              src={saint.image}
              alt={saint.name}
              className="w-full h-full object-cover grayscale brightness-90 md:absolute md:inset-0"
              referrerPolicy="no-referrer"
            />
            {/* Dark vignette blending into typography card */}
            <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-transparent md:bg-gradient-to-r md:from-transparent md:via-canvas/40 md:to-canvas" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col gap-2 md:hidden">
              <span className="font-mono text-[10px] tracking-widest text-gold-accent uppercase bg-black/60 px-2 py-1 rounded border border-gold-accent/20 self-start">
                {saint.era}
              </span>
              <h2 className="font-serif text-3xl font-semibold text-white">{saint.name}</h2>
              <p className="font-serif italic text-gold-accent/80 text-xs">{saint.title}</p>
            </div>
          </div>

          {/* Right: Detailed hagiographical contents */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-between bg-gradient-to-b from-canvas to-black/35">
            <div>
              {/* Desktop Header */}
              <div className="hidden md:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs tracking-widest text-gold-accent uppercase bg-white/5 px-2.5 py-1 rounded border border-white/10">
                    {saint.era}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-gold-accent animate-pulse" />
                  <span className="font-mono text-[11px] text-white/50 tracking-wider">
                    {saint.location}
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-1">
                  {saint.name}
                </h2>
                <p className="font-serif italic text-gold-accent text-sm">
                  {saint.title}
                </p>
              </div>

              {/* Decorative line */}
              <div className="w-16 h-[1px] bg-gold-accent/40 mb-6 hidden md:block" />

              {/* Subtitle statement */}
              <p className="text-white font-serif italic text-sm md:text-base leading-relaxed mb-6 border-l-2 border-gold-accent/30 pl-4 py-1 bg-white/5 rounded-r">
                &ldquo;{saint.subtitle}&rdquo;
              </p>

              {/* Biography Section */}
              <div className="space-y-4 mb-6">
                <h4 className="font-mono text-[10px] text-white/40 tracking-widest uppercase">The Biography</h4>
                <p className="text-white/70 font-sans text-sm leading-relaxed text-justify">
                  {saint.biography}
                </p>
              </div>

              {/* Quote Block */}
              {saint.quote && (
                <div className="mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-lg relative overflow-hidden">
                  <Quote className="w-10 h-10 text-gold-accent/10 absolute -left-2 -top-2" />
                  <p className="font-serif text-white/90 italic text-sm relative z-10 leading-relaxed pl-4">
                    &ldquo;{saint.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Reflection Lesson */}
              <div className="mb-8 p-4 rounded-lg border border-gold-accent/10 bg-gold-accent/[0.02]">
                <h4 className="font-mono text-[10px] text-gold-accent tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Contemplative Lesson
                </h4>
                <p className="text-white/80 font-sans text-xs md:text-sm leading-relaxed">
                  {saint.reflection}
                </p>
              </div>

              {/* Metadatas grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 pt-6 border-t border-white/5 text-[11px] font-mono">
                <div>
                  <span className="text-white/30 block mb-1 uppercase tracking-wider">Feast Day</span>
                  <span className="text-white/80 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-accent/70" /> {saint.feastDay}
                  </span>
                </div>
                <div>
                  <span className="text-white/30 block mb-1 uppercase tracking-wider">Canonized</span>
                  <span className="text-white/80 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-gold-accent/70" /> {saint.canonized}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="text-white/30 block mb-1 uppercase tracking-wider">Patronage</span>
                  <span className="text-white/80 truncate block text-xs" title={saint.patronage}>
                    {saint.patronage}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA action trigger */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                onClick={() => onOpenPrayerWithSaint(saint.name)}
                className="px-6 py-2.5 rounded bg-gold-accent text-canvas font-mono text-xs tracking-widest uppercase font-semibold flex items-center gap-2 hover:bg-white hover:text-canvas transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                Seek Bespoke Litany
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface BespokePrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSaintName?: string;
}

export function BespokePrayerModal({ isOpen, onClose, defaultSaintName = "" }: BespokePrayerModalProps) {
  const [situation, setSituation] = useState("");
  const [saintSelection, setSaintSelection] = useState(defaultSaintName);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReflection, setGeneratedReflection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync default saint when modal shifts
  React.useEffect(() => {
    if (defaultSaintName) {
      setSaintSelection(defaultSaintName);
    }
  }, [defaultSaintName]);

  const handleGenerateReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedReflection(null);

    try {
      const response = await fetch("/api/generate-reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          saintName: saintSelection
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to trigger spiritual oracle.");
      }

      setGeneratedReflection(data.reflection);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      setIsGenerating(false);
    }
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

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl glass-panel rounded-xl border border-white/10 glow-gold p-6 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-canvas to-black/45"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-full border border-gold-accent/20 flex items-center justify-center mx-auto mb-3 bg-gold-accent/5">
              <Sparkles className="w-5 h-5 text-gold-accent" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">Bespoke Liturgical Reflection</h3>
            <p className="text-white/50 text-xs font-sans max-w-md mx-auto leading-relaxed">
              Whisper your current anxieties, daily burdens, or seeking intentions. Gemini will synthesize a customized theological prayer paired with a historical witness of faith.
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-4 rounded-lg bg-burgundy-dark/10 border border-burgundy-accent/30 text-center mb-6 text-white/80 text-xs font-sans">
              <span className="font-semibold block text-red-400 font-mono mb-1">SYNTHESIS HALTED</span>
              {error}
              <p className="text-[9px] text-white/30 mt-2">Verify that GEMINI_API_KEY is properly configured in the secrets menu.</p>
            </div>
          )}

          {/* Result view */}
          {generatedReflection ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-white/[0.01] border border-white/5 p-6 rounded-lg mb-8 relative overflow-hidden"
            >
              {/* Celestial visual effects */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="prose prose-invert max-w-none text-white/85 text-sm leading-relaxed font-sans whitespace-pre-line text-justify border-l border-gold-accent/20 pl-4 py-1">
                {generatedReflection}
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setSituation("");
                    setGeneratedReflection(null);
                  }}
                  className="px-5 py-2.5 rounded bg-gold-accent text-canvas font-mono text-xs tracking-widest uppercase font-semibold hover:bg-white transition-all cursor-pointer"
                >
                  Seek Another Litany
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-mono text-xs tracking-widest uppercase transition-all cursor-pointer"
                >
                  Return to Sanctuary
                </button>
              </div>
            </motion.div>
          ) : (
            /* Input Form */
            <form onSubmit={handleGenerateReflection} className="space-y-6">
              {/* Intention Input */}
              <div>
                <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2">
                  What intentions or situations weigh on your heart today?
                </label>
                <textarea
                  required
                  rows={3}
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder="e.g., Seeking courage to speak truth at my workplace, finding patience while nursing a family member, or looking for silence in high stress..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white placeholder-white/30 font-sans text-sm focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                />
              </div>

              {/* Saint Alignment (Optional dropdown) */}
              <div>
                <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2">
                  Align prayer with a specific saintly witness (Optional)
                </label>
                <input
                  type="text"
                  value={saintSelection}
                  onChange={(e) => setSaintSelection(e.target.value)}
                  placeholder="e.g. St. Oscar Romero, St. Maria of the Shadows, St. Francis..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 font-sans text-sm focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                />
                <span className="text-[10px] text-white/30 font-mono mt-1.5 block">
                  Leave empty for a general modern witness alignment.
                </span>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating || !situation.trim()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-gold-accent disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed text-canvas font-mono text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-canvas transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Litany...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>Engrave Prayer Scroll</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
