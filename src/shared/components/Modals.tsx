import React, { useState } from "react";
import { X, Sparkles, RefreshCw, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSacredStore } from "../store/sacredStore";
import { archivesAdapter } from "../../features/admin/services/archivesService";

export function BespokePrayerModal() {
  const { isPrayerModalOpen, setIsPrayerModalOpen, defaultSaintForPrayer } = useSacredStore();

  const [situation, setSituation] = useState("");
  const [saintSelection, setSaintSelection] = useState(defaultSaintForPrayer);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReflection, setGeneratedReflection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sync default saint when modal shifts
  React.useEffect(() => {
    if (defaultSaintForPrayer) {
      setSaintSelection(defaultSaintForPrayer);
    }
  }, [defaultSaintForPrayer]);

  const handleGenerateReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setGeneratedReflection(null);

    try {
      const data = await archivesAdapter.generateReflection(situation, saintSelection);
      setGeneratedReflection(data.reflection);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isPrayerModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsPrayerModalOpen(false)}
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
            onClick={() => setIsPrayerModalOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-full border border-gold-accent/20 flex items-center justify-center mx-auto mb-3 bg-gold-accent/5">
              <Sparkles className="w-5 h-5 text-gold-accent animate-pulse" />
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
                  onClick={() => setIsPrayerModalOpen(false)}
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

              {/* Saint Alignment */}
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