import React, { useEffect } from "react";
import { ArrowLeft, MapPin, ExternalLink, Calendar, BookOpen, Video, Image as ImageIcon, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchSacredStoryById, clearStoryDetail } from "../../store/slices/sacredStoriesSlice";
import { useSacredStore } from "../../shared/store/sacredStore";
import { getStoryTypeBadgeColor, getStoryTypeLabel } from "../sacred-stories/components/SacredStoriesList";

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function SacredStoryDetailView() {
  const dispatch = useAppDispatch();
  const { setCurrentTab, selectedSaintId } = useSacredStore();

  const {
    selectedStoryId: reduxSelectedId,
    storyDetail,
    loadingDetail,
    errorDetail,
  } = useAppSelector((state) => state.sacredStories);

  const activeId = selectedSaintId || reduxSelectedId || "f81d4fae-7dec-11d0-a765-00a0c91e6bf6";

  useEffect(() => {
    if (activeId) {
      dispatch(fetchSacredStoryById(activeId));
    }
  }, [dispatch, activeId]);

  const handleBack = () => {
    dispatch(clearStoryDetail());
    setCurrentTab("saints");
  };

  if (loadingDetail) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white p-6 relative">
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border border-gold-accent/20 flex items-center justify-center bg-gold-accent/5">
            <Loader2 className="w-8 h-8 text-gold-accent animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-serif text-lg tracking-wider text-gold-accent animate-pulse">
              Unlocking Sacred Detail Register...
            </p>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Fetching GET /api/SacredStories/{activeId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (errorDetail || !storyDetail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="glass-panel border border-burgundy-accent/30 bg-burgundy-dark/10 p-8 rounded-2xl max-w-md space-y-6">
          <AlertCircle className="w-12 h-12 text-burgundy-accent mx-auto" />
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-semibold text-white">Story Not Found</h3>
            <p className="text-xs text-white/60 font-mono">
              {errorDetail || `No details returned for story ID: ${activeId}`}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="px-6 py-2.5 rounded-lg bg-gold-accent text-canvas font-mono text-xs uppercase font-bold hover:bg-white transition-all"
          >
            Return to Sacred Register
          </button>
        </div>
      </div>
    );
  }

  const youtubeId = extractYouTubeId(storyDetail.videoUrl);
  const typeLabel = getStoryTypeLabel(storyDetail.type);
  const typeBadgeColor = getStoryTypeBadgeColor(storyDetail.type);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 relative z-10 text-white/90 space-y-16" id="sacred-story-detail-view">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gold-accent font-mono text-xs tracking-wider uppercase bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-gold-accent/20 hover:border-gold-accent hover:text-white transition-all duration-300 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Register</span>
        </button>

        <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] hidden md:inline">
          UUID: {storyDetail.id}
        </span>
      </div>

      {/* HEADER SECTION: Name, Cover Image, Famous Quote, Video link */}
      <section className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row relative bg-black/50 shadow-2xl">
        {/* Cover Image */}
        <div className="w-full md:w-1/2 relative min-h-[340px] md:min-h-[460px] bg-black overflow-hidden group shrink-0">
          <img
            src={storyDetail.coverImage}
            alt={storyDetail.name}
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0c0f0f]" />
        </div>

        {/* Content Metadata */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-[#0c0f0f] relative gap-6">
          <div className="space-y-4">
            {/* Type badge */}
            <div className="flex items-center gap-3">
              <span className={`font-mono text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border ${typeBadgeColor}`}>
                {typeLabel}
              </span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              {storyDetail.name}
            </h1>

            {/* Famous Quote */}
            <blockquote className="text-gold-accent/90 font-serif italic text-base md:text-lg leading-relaxed border-l-2 border-gold-accent/50 pl-4 py-1">
              &ldquo;{storyDetail.famousQuote}&rdquo;
            </blockquote>
          </div>

          {/* Video Player or Watch Link */}
          {storyDetail.videoUrl && (
            <div className="pt-2">
              {youtubeId ? (
                <a
                  href={`#video-player-section`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-accent hover:bg-white text-canvas font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg"
                >
                  <Video className="w-4 h-4" /> Watch Sacred Video Documentary
                </a>
              ) : (
                <a
                  href={storyDetail.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-gold-accent hover:text-canvas text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Watch Sacred Video Link
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* BIOGRAPHY SECTION */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <BookOpen className="w-6 h-6 text-gold-accent" />
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
            Biography & Historical Record
          </h2>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 bg-black/40 text-white/80 font-sans text-base leading-relaxed space-y-4 shadow-xl">
          <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-gold-accent first-letter:font-bold first-letter:mr-2">
            {storyDetail.biography}
          </p>

          {storyDetail.rejectionReason && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs">
              <strong className="block mb-1 font-bold uppercase">Archival Record Note:</strong>
              {storyDetail.rejectionReason}
            </div>
          )}
        </div>
      </section>

      {/* EMBEDDED VIDEO PLAYER SECTION (IF YOUTUBE URL PRESENT) */}
      {youtubeId && (
        <section id="video-player-section" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Video className="w-6 h-6 text-gold-accent" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
              Sacred Video & Documentary Player
            </h2>
          </div>

          <div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={`${storyDetail.name} Documentary`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* DEDICATED BURIAL PLACE SECTION */}
      {storyDetail.burialPlace && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <MapPin className="w-6 h-6 text-gold-accent" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
              Burial Place & Sacred Shrine
            </h2>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 bg-[#0d0f0f] p-6 md:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Text Info */}
              <div className="flex-1 space-y-5">
                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white">
                  {storyDetail.burialPlace.name}
                </h3>
                <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed">
                  {storyDetail.burialPlace.description}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-gold-accent">
                    <MapPin className="w-4 h-4 text-gold-accent" />
                    <span>{storyDetail.burialPlace.address}</span>
                  </div>

                  {storyDetail.burialPlace.googleMapsUrl && (
                    <div>
                      <a
                        href={storyDetail.burialPlace.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-accent text-canvas font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" /> Open in Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              {storyDetail.burialPlace.coverImage && (
                <div className="w-full md:w-5/12 aspect-[16/11] md:h-72 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 relative group shadow-lg">
                  <img
                    src={storyDetail.burialPlace.coverImage}
                    alt={storyDetail.burialPlace.name}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CHRONOLOGICAL TIMELINE EVENTS SECTION */}
      {storyDetail.timeline && storyDetail.timeline.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Calendar className="w-6 h-6 text-gold-accent" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
              Chronological Timeline
            </h2>
          </div>

          <div className="max-w-4xl mx-auto relative pl-6 md:pl-0 py-4">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-gold-accent via-gold-accent/40 to-transparent -translate-x-1/2" />

            <div className="space-y-12 relative z-10">
              {storyDetail.timeline.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={item.id || index}
                    className={`flex flex-col md:flex-row items-stretch ${isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center mt-2">
                      <div className="w-4 h-4 rounded-full bg-black border-2 border-gold-accent shadow-md shadow-gold-accent/50" />
                    </div>
                    <div className="md:w-1/2 pl-8 md:pl-10 md:pr-10">
                      <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40 hover:border-gold-accent/30 transition-all">
                        <span className="font-mono text-sm font-bold text-gold-accent block mb-1">
                          {item.date}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-white/70 text-xs leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SACRED GALLERY SECTION: GRID / CAROUSEL */}
      {storyDetail.sacredGallery && storyDetail.sacredGallery.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <ImageIcon className="w-6 h-6 text-gold-accent" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
              Sacred Gallery Exhibits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storyDetail.sacredGallery.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-xl overflow-hidden border border-white/10 bg-black/50 group shadow-lg hover:border-gold-accent/40 transition-all duration-300"
              >
                <div className="h-56 overflow-hidden bg-black relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale brightness-85 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </div>
                <div className="p-4">
                  <h4 className="font-serif text-base font-bold text-white group-hover:text-gold-accent transition-colors">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
