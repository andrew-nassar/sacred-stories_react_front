// File: src/features/sacred_stories/widgets/StoryCard.tsx

import React from "react";
import { MapPin, Award } from "lucide-react";
import { motion } from "motion/react";
import { Saint } from "../../../data";
import { getSaintTypeLabel, getSaintTitleByType } from "../../admin/services/archivesService";

interface StoryCardProps {
  saint: Saint;
  status: number;
  type: number;
  onClick: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ saint, status, type, onClick }) => {
  // Highlight border based on color theme
  const borderTheme = 
    saint.colorTheme === "emerald" ? "hover:border-emerald-500/35" :
    saint.colorTheme === "burgundy" ? "hover:border-burgundy-accent/40" :
    saint.colorTheme === "gold" ? "hover:border-gold-accent/40" : "hover:border-blue-500/35";

  // Status and Type indicators
  const getStatusBadge = (s: number) => {
    switch (s) {
      case 0:
        return { text: "Pending", bg: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
      case 1:
        return { text: "Published", bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
      case 2:
        return { text: "Rejected", bg: "bg-rose-500/10 text-rose-500 border-rose-500/20" };
      default:
        return { text: "Unknown", bg: "bg-white/10 text-white/50 border-white/10" };
    }
  };

  const statusBadge = getStatusBadge(status);
  const typeLabel = getSaintTypeLabel(type);
  const typeTitle = getSaintTitleByType(type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`glass-panel rounded-xl overflow-hidden cursor-pointer flex flex-col h-full group border border-white/5 shadow-md ${borderTheme} transition-all duration-300`}
    >
      {/* Portrait headshot */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={saint.image}
          alt={saint.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas to-transparent opacity-90" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {statusBadge && (
            <span className={`font-mono text-[8px] uppercase tracking-wider border px-2 py-0.5 rounded backdrop-blur-sm ${statusBadge.bg}`}>
              {statusBadge.text}
            </span>
          )}
          <span className="font-mono text-[8px] uppercase tracking-wider text-gold-accent border border-gold-accent/30 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
            {typeLabel}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="font-mono text-[9px] text-gold-accent bg-black/60 border border-gold-accent/30 px-2 py-0.5 rounded tracking-widest uppercase">
            {saint.era}
          </span>
        </div>
      </div>

      {/* Narrative details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-lg font-semibold text-white tracking-wide group-hover:text-gold-accent transition-colors duration-300 mb-1">
            {saint.name}
          </h4>
          <p className="font-serif italic text-gold-accent/70 text-xs mb-3">
            {typeTitle || saint.title}
          </p>
          <p className="text-white/60 text-xs leading-relaxed font-sans line-clamp-3">
            {saint.subtitle}
          </p>
        </div>

        {/* Footer indicators */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gold-accent/70" />
            <span className="truncate max-w-[120px]">{saint.location !== "N/A" ? saint.location : "Universal Shrine"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-gold-accent/70" />
            <span className="truncate max-w-[100px]">Feast Day</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
