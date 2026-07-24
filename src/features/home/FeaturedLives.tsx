import React, { useEffect, useState } from "react";
import { ArrowRight, Quote, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useSacredStore } from "../../shared/store/sacredStore";
import { SacredStoryItem } from "../../shared/sacred_stories/models/sacred_Story_model";
import { fetchFeaturedStories } from "../../shared/sacred_stories/services/sacredStoryService";

export default function FeaturedLives() {
  const { setSelectedSaintId, setCurrentTab } = useSacredStore();
  const [stories, setStories] = useState<SacredStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchFeaturedStories(3)
      .then((data) => {
        if (isMounted) {
          setStories(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to load featured stories.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 bg-canvas relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-burgundy-accent/5 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-navy/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 sm:mb-16 relative z-10">
        <span className="font-mono text-xs text-gold-accent tracking-[0.3em] uppercase block mb-3">
          The Hall of Witness
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Featured Lives
        </h2>
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mt-6" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20 text-gold-accent font-mono text-sm gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Retrieving sacred registers...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-12 text-burgundy-accent font-mono text-sm">
          {error}
        </div>
      )}

      {/* Three Portrait Cards */}
      {!isLoading && !error && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onClick={() => {
                setSelectedSaintId(story.id);
                setCurrentTab("saint-details");
              }}
              className="group relative h-[340px] md:h-[480px] rounded-xl overflow-hidden cursor-pointer glass-panel flex flex-col justify-end p-5 md:p-6 transition-all duration-500 keep-white-text glow-gold md:hover:border-gold-accent/40"
            >
              {/* Background Portrait Image: Grayscale by default on Desktop, colored on Hover */}
              <div className="absolute inset-0 z-0">
                <img
                  src={story.coverImage}
                  alt={story.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover brightness-90 md:brightness-75 md:grayscale md:group-hover:grayscale-0 md:group-hover:brightness-100 md:group-hover:scale-105 transition-all duration-700 ease-out"
                />
                {/* Vignette / Dark Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-[#121414]/50 to-transparent opacity-85 md:group-hover:opacity-75 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0c0f0f] via-[#121414]/80 to-transparent" />
              </div>

              {/* Card Content */}
              <div className="relative z-10 flex flex-col gap-2 md:gap-3">
                {/* Name */}
                <h3 className="font-serif text-xl md:text-3xl font-medium text-white md:group-hover:text-gold-accent transition-colors duration-300">
                  {story.name}
                </h3>

                {/* Famous Quote */}
                {story.famousQuote && (
                  <div className="flex items-start gap-2 text-white/70 font-sans text-xs italic leading-relaxed font-light min-h-[36px]">
                    <Quote className="w-3.5 h-3.5 text-gold-accent/80 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{story.famousQuote}</p>
                  </div>
                )}

                {/* Micro CTA interaction */}
                <div className="flex items-center gap-2 text-xs font-mono text-gold-accent opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 mt-2">
                  <span>ENTER SANCTUARY</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Complete Martyrology Link */}
      <div className="text-center mt-16 relative z-10">
        <button
          onClick={() => setCurrentTab("saints")}
          className="inline-flex items-center gap-2 text-sm md:text-base font-mono tracking-widest uppercase text-white hover:text-gold-accent group transition-colors duration-300 cursor-pointer keep-white-text"
        >
          <span className="text-white">View Complete Martyrology</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}