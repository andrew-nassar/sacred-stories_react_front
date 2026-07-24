import React, { useState } from "react";
import { TIMELINE_DATA, SAINTS_DATA, TimelineEvent } from "../../data";
import { ChevronRight, Info } from "lucide-react";
import { motion } from "motion/react";
import { useSacredStore } from "../../shared/store/sacredStore";

export default function TimelineSection() {
  const { setSelectedSaintId, setCurrentTab } = useSacredStore();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  const handleTimelineItemClick = (event: TimelineEvent, index: number) => {
    setSelectedEventIndex(selectedEventIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative z-10">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase block mb-3">
          Chronology of Witness
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Historical Timeline
        </h2>
        <p className="text-white/60 font-sans max-w-xl mx-auto text-sm leading-relaxed">
          The linear path of sacrifice through modern times, mapping historical turning points from the early 20th century to contemporary martyrdom.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative pl-6 md:pl-32 pr-2">
        {/* Continuous vertical line (0.5px Gold) */}
        <div className="absolute left-[30px] md:left-[120px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-gold-accent/10 via-gold-accent/40 to-gold-accent/10" />

        <div className="space-y-12">
          {TIMELINE_DATA.map((event, index) => {
            const isSelected = selectedEventIndex === index;
            const associatedSaint = event.saintId 
              ? SAINTS_DATA.find((s) => s.id === event.saintId) 
              : null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => handleTimelineItemClick(event, index)}
              >
                {/* Year Label */}
                <div className="absolute -left-6 md:-left-32 top-0 text-center select-none w-12 md:w-20">
                  <span className="font-mono text-base md:text-lg font-semibold text-gold-accent group-hover:text-white transition-colors duration-300 block">
                    {event.year}
                  </span>
                  <div className="w-8 h-[1px] bg-gold-accent/30 mx-auto mt-1" />
                </div>

                {/* Pulsing Date Circle/Halo */}
                <div className="absolute left-[5px] md:left-[85px] top-1.5 z-10 flex items-center justify-center">
                  {/* Outer glowing ripple */}
                  <div className="absolute w-4 h-4 rounded-full bg-gold-accent/20 animate-ping" />
                  {/* Inner gold point */}
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-accent border border-canvas group-hover:bg-white group-hover:scale-125 transition-all duration-300" />
                </div>

                {/* Event Card Content */}
                <div className="glass-panel rounded-lg p-5 ml-8 md:ml-12 border border-white/5 hover:border-gold-accent/20 transition-all duration-300 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 mb-2">
                    <h3 className="font-serif text-lg md:text-xl font-medium text-white group-hover:text-gold-accent transition-colors duration-300">
                      {event.title}
                    </h3>
                    <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded self-start sm:self-auto shrink-0">
                      {event.subtitle}
                    </span>
                  </div>

                  <p className="text-white/60 text-xs md:text-sm font-sans leading-relaxed mb-3">
                    {event.description}
                  </p>

                  {/* Association link */}
                  {associatedSaint && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-white/40 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-gold-accent/60" /> Related Saint Profile available
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent closing card toggle
                          setSelectedSaintId(associatedSaint.id);
                          setCurrentTab("saint-details");
                        }}
                        className="self-start text-[11px] font-mono text-gold-accent hover:text-white flex items-center gap-1 transition-all animate-pulse"
                      >
                        <span>Open Sacred Scroll</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
