// File: src/features/sacred_stories/widgets/StoryTimeline.tsx

import React from "react";

export interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

interface StoryTimelineProps {
  title: string;
  subtitle: string;
  timelineItems: TimelineEvent[];
  language?: "ar" | "en";
}

export function StoryTimeline({
  title,
  subtitle,
  timelineItems,
  language = "en",
}: StoryTimelineProps) {
  const isAr = language === "ar";
  
  return (
    <section id="story-timeline-section" className={`space-y-12 ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}>
      {/* Centered Header */}
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-wide">
          {title}
        </h2>
        <p className="text-[#D4AF37] font-sans text-xs md:text-sm tracking-wider">
          {subtitle}
        </p>
        <div className="w-16 h-[1px] bg-[#D4AF37]/50 mx-auto mt-4" />
      </div>

      {/* Timeline Layout */}
      <div className="max-w-4xl mx-auto relative pl-8 pr-4 py-8 md:pl-0 md:pr-0">
        {/* Continuous vertical gold line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/40 to-transparent -translate-x-1/2" />

        <div className="space-y-16 relative z-10">
          {timelineItems.map((event, index) => {
            // Alternate side alignments on desktop
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-stretch ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Spacer block to alternate content sides on desktop */}
                <div className="hidden md:block md:w-1/2" />

                {/* Circular node marker on the vertical line */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center mt-3">
                  <div className="w-5 h-5 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping absolute" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  </div>
                </div>

                {/* Content card */}
                <div className={`md:w-1/2 pl-8 md:pl-12 md:pr-12 text-start ${isAr ? "text-right" : "text-left"}`}>
                  <div className="group transition-all duration-300">
                    <span className="font-mono text-xl font-bold text-[#D4AF37] block mb-2 transition-all duration-300 group-hover:translate-x-1">
                      {event.year}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-md">
                      {event.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
