import React from "react";
import { ArrowRight, Calendar, MapPin, Quote } from "lucide-react";
import { motion } from "motion/react";
import { SAINTS_DATA, Saint } from "../data";

interface FeaturedLivesProps {
  onSaintClick: (saint: Saint) => void;
  onViewAllClick: () => void;
}

export default function FeaturedLives({ onSaintClick, onViewAllClick }: FeaturedLivesProps) {
  // Curate the three specific featured lives as in the user's screenshot
  const featuredIds = ["maria-shadows", "oscar-salvador", "shore-martyrs"];
  const featuredSaints = SAINTS_DATA.filter((s) => featuredIds.includes(s.id));

  return (
    <section className="py-24 px-6 md:px-12 bg-canvas relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-burgundy-accent/5 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-navy/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <span className="font-mono text-xs text-gold-accent tracking-[0.3em] uppercase block mb-3">
          The Hall of Witness
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Featured Lives
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mt-6" />
      </div>

      {/* Three Portrait Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {featuredSaints.map((saint, index) => {
          // Select colors based on theme
          const glowColor = 
            saint.colorTheme === "burgundy" ? "glow-burgundy hover:border-burgundy-accent/40" : 
            saint.colorTheme === "gold" ? "glow-gold hover:border-gold-accent/40" : "glow-navy hover:border-sky-500/30";

          return (
            <motion.div
              key={saint.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onClick={() => onSaintClick(saint)}
              className={`group relative h-[480px] rounded-xl overflow-hidden cursor-pointer glass-panel flex flex-col justify-end p-6 transition-all duration-500 ${glowColor}`}
            >
              {/* Background Portrait Image with Vignette and Hover Zoom */}
              <div className="absolute inset-0 z-0">
                <img
                  src={saint.image}
                  alt={saint.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-90 transition-all duration-700 ease-out"
                />
                {/* Vignette / Dark Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/50 to-transparent opacity-85 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0c0f0f] via-canvas/90 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col gap-3">
                {/* Era / Dates Tag */}
                <div className="flex items-center gap-1.5 self-start px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono tracking-wider text-gold-accent/90">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{saint.era}</span>
                </div>

                {/* Name */}
                <h3 className="font-serif text-2xl md:text-3xl font-medium text-white group-hover:text-gold-accent transition-colors duration-300">
                  {saint.name}
                </h3>

                {/* Subtitle / Poetic Witness */}
                <p className="text-white/60 font-sans text-xs italic leading-relaxed font-light min-h-[36px]">
                  {saint.title}
                </p>

                {/* Location label */}
                <div className="flex items-center gap-1.5 text-white/40 text-[11px] font-mono mt-1">
                  <MapPin className="w-3 h-3 text-gold-accent/70" />
                  <span>{saint.location}</span>
                </div>

                {/* Micro CTA interaction */}
                <div className="flex items-center gap-2 text-xs font-mono text-gold-accent opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 mt-2">
                  <span>ENTER SANCTUARY</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Complete Martyrology Link */}
      <div className="text-center mt-16 relative z-10">
        <button
          onClick={onViewAllClick}
          className="inline-flex items-center gap-2 text-sm md:text-base font-mono tracking-widest uppercase text-gold-accent hover:text-white group transition-colors duration-300 cursor-pointer"
        >
          <span>View Complete Martyrology</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}
