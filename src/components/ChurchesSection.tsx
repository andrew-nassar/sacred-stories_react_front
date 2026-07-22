import React from "react";
import { CHURCHES_DATA, Church } from "../data";
import { MapPin, Calendar, Compass, Clock } from "lucide-react";
import { motion } from "motion/react";

interface ChurchesSectionProps {
  onSanctuarySelect: (church: Church) => void;
}

export default function ChurchesSection({ onSanctuarySelect }: ChurchesSectionProps) {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase block mb-3">
          Temples of Light
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Digital Sanctuaries
        </h2>
        <p className="text-white/60 font-sans max-w-xl mx-auto text-sm leading-relaxed">
          Sacred geography mapping where these modern witnesses left their earthly testimony or are honored today with perpetual liturgy.
        </p>
      </div>

      {/* Grid of churches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {CHURCHES_DATA.map((church, index) => {
          return (
            <motion.div
              key={church.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-panel rounded-xl overflow-hidden group flex flex-col justify-between border border-white/5 glow-gold"
            >
              <div>
                {/* Church image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={church.image}
                    alt={church.name}
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/45 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono tracking-wider text-gold-accent">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{church.location}</span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-medium text-white mb-2 group-hover:text-gold-accent transition-colors">
                    {church.name}
                  </h3>
                  <p className="text-gold-accent/80 font-serif text-xs italic mb-4">
                    Dedicated to: {church.dedication}
                  </p>
                  <p className="text-white/65 text-xs font-sans leading-relaxed mb-4">
                    {church.description}
                  </p>
                </div>
              </div>

              {/* Footer action */}
              <div className="p-6 pt-0 border-t border-white/5 mt-4">
                <div className="text-[10px] font-mono text-white/40 mb-4 flex items-center gap-1.5 bg-white/5 p-2.5 rounded border border-white/5 leading-relaxed">
                  <Clock className="w-3.5 h-3.5 text-gold-accent/70 shrink-0" />
                  <span>{church.historicalNote}</span>
                </div>
                
                <button
                  onClick={() => onSanctuarySelect(church)}
                  className="w-full px-4 py-2 text-center rounded bg-gold-accent/10 border border-gold-accent/20 hover:bg-gold-accent hover:text-canvas text-gold-accent text-xs font-mono tracking-widest uppercase transition-all duration-300"
                >
                  Enter Sanctuary Chamber
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Contemplative full-screen sanctuary card */}
      <div className="glass-panel rounded-xl p-8 md:p-12 border border-white/5 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-surface-container to-canvas relative overflow-hidden">
        {/* Decorative thin gold lines */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold-accent/20 to-transparent" />

        <div className="w-16 h-16 rounded-full border border-gold-accent/30 flex items-center justify-center p-4 shrink-0 bg-gold-accent/5">
          <Compass className="w-8 h-8 text-gold-accent animate-spin-slow" />
        </div>

        <div>
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-2">Sacred Pilgrimage</h3>
          <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
            In our physical churches, pilgrims find solace by lighting candles of prayer. We invite you to visit the <strong className="text-gold-accent">Liturgy Room</strong> in our bottom bar to play Gregorian or meditative chants while you explore these saints&rsquo; registers.
          </p>
        </div>
      </div>
    </div>
  );
}
