import React, { useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, BookOpen, Sparkles, RefreshCw, CheckCircle2, Clock, Archive } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  fetchSacredStories,
  fetchSacredStoryById,
  setPageNumber,
  setSearchTerm,
  setStatusFilter,
  setTypeFilter,
  setSelectedStoryId
} from "../../../store/slices/sacredStoriesSlice";
import { StoryStatus, StoryType } from "../../../domain/entities/sacredStory";
import { useSacredStore } from "../../../shared/store/sacredStore";

export function getStoryTypeLabel(type: StoryType): string {
  switch (type) {
    case StoryType.Saint: return "Saint";
    case StoryType.Pope: return "Pope";
    case StoryType.Apostle: return "Apostle";
    case StoryType.Martyr: return "Martyr";
    case StoryType.Monk: return "Monk";
    case StoryType.BiblicalCharacter: return "Biblical Character";
    default: return "Holy Witness";
  }
}

export function getStoryTypeBadgeColor(type: StoryType): string {
  switch (type) {
    case StoryType.Martyr: return "bg-burgundy-accent/20 border-burgundy-accent/40 text-burgundy-accent";
    case StoryType.Pope: return "bg-blue-500/20 border-blue-500/40 text-blue-400";
    case StoryType.Monk: return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
    case StoryType.Apostle: case StoryType.BiblicalCharacter: return "bg-amber-500/20 border-amber-500/40 text-amber-300";
    default: return "bg-gold-accent/20 border-gold-accent/40 text-gold-accent";
  }
}

export function getStoryStatusBadge(status: StoryStatus) {
  switch (status) {
    case StoryStatus.UnderReview:
      return {
        label: "Under Review",
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      };
    case StoryStatus.Published:
      return {
        label: "Published",
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      };
    case StoryStatus.Archived:
      return {
        label: "Archived",
        icon: Archive,
        className: "bg-gray-500/10 text-gray-400 border-gray-500/30"
      };
    default:
      return {
        label: "Published",
        icon: CheckCircle2,
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      };
  }
}

export default function SacredStoriesList() {
  const dispatch = useAppDispatch();
  const { setCurrentTab } = useSacredStore();

  const {
    items,
    totalCount,
    pageNumber,
    pageSize,
    loadingList,
    errorList,
    searchTerm,
    typeFilter,
    statusFilter,
  } = useAppSelector((state) => state.sacredStories);

  // Trigger API fetch whenever search, filter, or page changes
  useEffect(() => {
    dispatch(fetchSacredStories(undefined));
  }, [dispatch, searchTerm, typeFilter, statusFilter, pageNumber, pageSize]);

  const handleSelectStory = (id: string) => {
    dispatch(setSelectedStoryId(id));
    dispatch(fetchSacredStoryById(id));
    setCurrentTab("saint-details");
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative z-10" id="sacred-stories-list">
      {/* Title Header */}
      <div className="text-center mb-12">
        <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase block mb-3">
          Clean Architecture & Redux Endpoint
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Sacred Stories Register
        </h2>
        <p className="text-white/60 font-sans max-w-xl mx-auto text-sm leading-relaxed">
          Paginated list view connected to local endpoint <code className="text-gold-accent font-mono text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10">GET /api/SacredStories</code>.
        </p>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="glass-panel rounded-xl p-6 md:p-8 mb-10 flex flex-col gap-6 border border-white/10 shadow-2xl bg-black/40">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search stories by name or quote..."
            className="w-full bg-black/60 border border-white/15 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-gold-accent transition-all duration-300 shadow-inner"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-white/10">
          {/* Type Filter Selector (Enum 0-5) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-gold-accent" /> TYPE:
            </span>
            <button
              onClick={() => dispatch(setTypeFilter("ALL"))}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                typeFilter === "ALL"
                  ? "bg-gold-accent text-canvas font-bold border border-gold-accent shadow-md shadow-gold-accent/20"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              All Types
            </button>
            {[
              { type: StoryType.Saint, label: "Saint (0)" },
              { type: StoryType.Pope, label: "Pope (1)" },
              { type: StoryType.Apostle, label: "Apostle (2)" },
              { type: StoryType.Martyr, label: "Martyr (3)" },
              { type: StoryType.Monk, label: "Monk (4)" },
              { type: StoryType.BiblicalCharacter, label: "Biblical (5)" },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => dispatch(setTypeFilter(type))}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  typeFilter === type
                    ? "bg-gold-accent text-canvas font-bold border border-gold-accent shadow-md shadow-gold-accent/20"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Status Filter Selector (Enum 0-2) */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest mr-1">
              STATUS:
            </span>
            <button
              onClick={() => dispatch(setStatusFilter("ALL"))}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                statusFilter === "ALL"
                  ? "bg-white/20 text-white font-bold border border-white/30"
                  : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
              }`}
            >
              All Statuses
            </button>
            {[
              { status: StoryStatus.UnderReview, label: "Review (0)" },
              { status: StoryStatus.Published, label: "Published (1)" },
              { status: StoryStatus.Archived, label: "Archived (2)" },
            ].map(({ status, label }) => (
              <button
                key={status}
                onClick={() => dispatch(setStatusFilter(status))}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                  statusFilter === status
                    ? "bg-white/20 text-white font-bold border border-white/30"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loadingList && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 font-mono text-xs text-gold-accent bg-gold-accent/10 px-5 py-2.5 rounded-full border border-gold-accent/20 shadow-lg animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-accent" />
            <span>Fetching Sacred Stories from local endpoint...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorList && (
        <div className="p-4 rounded-xl bg-burgundy-dark/30 border border-burgundy-accent/40 text-center max-w-lg mx-auto mb-8 text-white/90 text-xs font-mono">
          <p className="font-bold text-red-400 mb-1">API RETRIEVAL ERROR</p>
          {errorList}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            items.map((story) => {
              const typeLabel = getStoryTypeLabel(story.type);
              const typeColor = getStoryTypeBadgeColor(story.type);
              const statusBadge = getStoryStatusBadge(story.status);
              const StatusIcon = statusBadge.icon;

              return (
                <motion.div
                  key={story.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectStory(story.id)}
                  className="glass-panel rounded-xl overflow-hidden cursor-pointer flex flex-col h-full group border border-white/10 hover:border-gold-accent/40 shadow-lg hover:shadow-2xl transition-all duration-300 bg-black/40"
                >
                  {/* Cover Image */}
                  <div className="relative h-52 overflow-hidden bg-black">
                    <img
                      src={story.coverImage}
                      alt={story.name}
                      className="w-full h-full object-cover grayscale brightness-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* Type & Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded border shadow-md font-semibold backdrop-blur-md ${typeColor}`}>
                        {typeLabel}
                      </span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 backdrop-blur-md ${statusBadge.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-accent transition-colors duration-300 mb-2">
                        {story.name}
                      </h3>
                      <p className="font-serif italic text-white/70 text-xs line-clamp-3 leading-relaxed">
                        &ldquo;{story.famousQuote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gold-accent group-hover:text-white transition-colors">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Read Full Story
                      </span>
                      <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            !loadingList && (
              <div className="col-span-full py-16 text-center glass-panel rounded-xl border border-white/10">
                <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="font-serif text-white/80 text-lg mb-1">No Sacred Stories Found</p>
                <p className="text-white/40 text-xs font-mono">
                  Try adjusting your search query or reset filters.
                </p>
              </div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 font-mono text-xs">
          <button
            onClick={() => dispatch(setPageNumber(pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gold-accent/20 hover:border-gold-accent text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-white/60 px-2">
            Page <strong className="text-gold-accent">{pageNumber}</strong> of {totalPages} ({totalCount} total)
          </span>

          <button
            onClick={() => dispatch(setPageNumber(pageNumber + 1))}
            disabled={pageNumber >= totalPages}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-gold-accent/20 hover:border-gold-accent text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
