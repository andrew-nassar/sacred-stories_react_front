// File: src/features/sacred_stories/pages/SacredStoriesPage.tsx

import React, { useState, useEffect } from "react";
import { Search, Filter, Sparkles, BookOpen, MapPin, Award, BookOpenCheck, RefreshCw, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SAINTS_DATA, Saint } from "../../../data";
import { useSacredStore } from "../../../shared/store/sacredStore";
import { archivesAdapter, mapApiStoryToSaint } from "../../../shared/services/archivesService";
import { useSacredStoriesList } from "../logic/useSacredStoriesList";
import { StoryCard } from "../widgets/StoryCard";

export default function SacredStoriesPage() {
  const { setSelectedSaintId, setCurrentTab, searchQueryPass, setSearchQueryPass } = useSacredStore();
  
  const {
    stories,
    totalCount,
    pageNumber,
    pageSize,
    loadingStories,
    searchTerm,
    selectedType,
    selectedStatus,
    loadStories,
    changeSearchTerm,
    changeSelectedType,
    changeSelectedStatus,
    changePageNumber,
  } = useSacredStoriesList();

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<string>("all");

  // Gemini State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedSaint, setSynthesizedSaint] = useState<any | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // Synchronize initial query from global store pass
  useEffect(() => {
    if (searchQueryPass) {
      setLocalSearch(searchQueryPass);
      changeSearchTerm(searchQueryPass);
    }
  }, [searchQueryPass, changeSearchTerm]);

  // Clean initial search query trigger on mount/dismount
  useEffect(() => {
    return () => {
      setSearchQueryPass("");
    };
  }, [setSearchQueryPass]);

  // Redux Fetch for Sacred Stories
  useEffect(() => {
    loadStories();
  }, [loadStories, searchTerm, selectedType, selectedStatus, pageNumber, pageSize]);



  // Load detailed saint from API on select
  const handleSelectSaint = (storyId: string) => {
    setSelectedSaintId(storyId);
    setCurrentTab("saint-details");
  };

  // Map our Redux stories to the Saint model for rendering
  const mappedSaints = stories.map(mapApiStoryToSaint);

  // Filter client side as secondary filtering for Theme & Era if chosen
  const filteredSaints = mappedSaints.filter((saint) => {
    const matchesTheme = selectedTheme === "all" || saint.colorTheme === selectedTheme;
    
    let matchesEra = true;
    if (selectedEra !== "all") {
      if (selectedEra === "1st-century") {
        matchesEra = saint.era.toLowerCase().includes("century") && (saint.era.toLowerCase().includes("1st") || saint.era.toLowerCase().includes("first"));
      } else if (selectedEra === "20th-century") {
        matchesEra = saint.era.toLowerCase().includes("20th") || saint.era.toLowerCase().includes("modern") || saint.era.toLowerCase().includes("1980");
      }
    }

    return matchesTheme && matchesEra;
  });

  // Dynamic saint synthesis via server proxy adapter (Gemini)
  const handleSynthesizeSaint = async () => {
    if (!localSearch.trim()) return;

    setIsSynthesizing(true);
    setSynthesisError(null);
    setSynthesizedSaint(null);

    try {
      const data = await archivesAdapter.searchArchives(localSearch);

      if (data.saint) {
        setSynthesizedSaint(data.saint);
        // Force refresh stories list to pick up any new syntheses saved to DB
        loadStories();
      } else {
        throw new Error("No record found for this search.");
      }
    } catch (err: any) {
      console.error(err);
      setSynthesisError("Gemini could not locate or compile theological records. Please refine your query.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Pagination Helper variables
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
      
      {/* Title block */}
      <div className="text-center mb-12">
        <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase block mb-3 animate-[pulse_3s_infinite]">
          The Scriptorium
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Sacred Stories Register
        </h2>
        <p className="text-white/60 font-sans max-w-xl mx-auto text-sm leading-relaxed">
          Search, filter, and paginate our curated library of holy witnesses, or query the dynamic archives using Gemini to retrieve comprehensive historical hagiographies.
        </p>
      </div>

      {/* Main search card */}
      <div className="glass-panel rounded-xl p-6 md:p-8 mb-8 flex flex-col gap-6 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Search bar */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name, quotes, biography, or try 'St. Maximilian'..."
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-12 py-3.5 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  changeSearchTerm(localSearch);
                }
              }}
            />
            <button
              onClick={() => changeSearchTerm(localSearch)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gold-accent/10 hover:bg-gold-accent/25 border border-gold-accent/20 text-gold-accent hover:text-amber-300 transition-all duration-300 cursor-pointer flex items-center justify-center"
              title="Click to search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic AI Synthesis Button */}
          <button
            onClick={handleSynthesizeSaint}
            disabled={isSynthesizing || !localSearch.trim()}
            className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-gold-dark via-gold-accent to-amber-400 hover:from-gold-accent hover:to-amber-300 text-canvas disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 disabled:cursor-not-allowed font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer"
            title="Ask Gemini to retrieve/synthesize historical record from theological logs"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-canvas" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-canvas fill-current" />
                <span>Dynamic Synthesis</span>
              </>
            )}
          </button>
        </div>

        {/* Categories / Type filters row */}
        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
              <Filter className="w-3 h-3 text-gold-accent/70" /> CATEGORY TYPE:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: undefined, label: "All Types" },
                { id: 0, label: "Saints" },
                { id: 1, label: "Popes" },
                { id: 2, label: "Apostles" },
                { id: 3, label: "Martyrs" },
                { id: 4, label: "Monks" },
                { id: 5, label: "Biblical Characters" },
              ].map((typeItem) => (
                <button
                  key={typeItem.label}
                  onClick={() => changeSelectedType(typeItem.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                    selectedType === typeItem.id
                      ? "bg-gold-accent/20 text-gold-accent border border-gold-accent/40"
                      : "bg-white/5 text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  {typeItem.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 pt-2">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
              <Eye className="w-3 h-3 text-gold-accent/70" /> STATUS FILTER:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: undefined, label: "All Statuses" },
                { id: 0, label: "Draft / Pending" },
                { id: 1, label: "Approved / Published" },
                { id: 2, label: "Rejected" },
              ].map((statusItem) => (
                <button
                  key={statusItem.label}
                  onClick={() => changeSelectedStatus(statusItem.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-all duration-300 cursor-pointer ${
                    selectedStatus === statusItem.id
                      ? "bg-gold-accent/20 text-gold-accent border border-gold-accent/40"
                      : "bg-white/5 text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  {statusItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theme and Era client filters row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
          {/* Theme Filters */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              THEME:
            </span>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All Themes" },
                { id: "emerald", label: "Sovereign Green" },
                { id: "burgundy", label: "Sacrificial Red" },
                { id: "gold", label: "Celestial Gold" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 cursor-pointer ${
                    selectedTheme === theme.id
                      ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30"
                      : "bg-white/5 text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Era Filters */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              ERA:
            </span>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All Eras" },
                { id: "1st-century", label: "Early Apostolic" },
                { id: "20th-century", label: "Modern Martyrs" },
              ].map((era) => (
                <button
                  key={era.id}
                  onClick={() => setSelectedEra(era.id)}
                  className={`px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 cursor-pointer ${
                    selectedEra === era.id
                      ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30"
                      : "bg-white/5 text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  {era.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Error Display */}
      {synthesisError && (
        <div className="mb-8 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-sans text-center">
          {synthesisError}
        </div>
      )}

      {/* Synthesis Result Display */}
      <AnimatePresence>
        {synthesizedSaint && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel rounded-xl p-6 mb-8 border border-gold-accent/30 bg-gradient-to-br from-canvas via-gold-accent/5 to-canvas shadow-xl relative overflow-hidden"
          >
            {/* Ambient gold glow decoration */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gold-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gold-accent/50 shrink-0 shadow-lg">
                <img
                  src={synthesizedSaint.coverImage}
                  alt={synthesizedSaint.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="font-mono text-[9px] text-gold-accent bg-gold-accent/10 border border-gold-accent/25 px-2 py-0.5 rounded tracking-widest uppercase">
                    Compiled successfully
                  </span>
                </div>
                <h3 className="font-serif text-xl text-white font-medium">{synthesizedSaint.name}</h3>
                <p className="font-sans text-xs text-white/70 italic max-w-2xl leading-relaxed">
                  &ldquo;{synthesizedSaint.famousQuote}&rdquo;
                </p>

                <div className="flex gap-3 justify-center md:justify-start pt-2">
                  <button
                    onClick={() => handleSelectSaint(synthesizedSaint.id)}
                    className="px-4 py-2 rounded bg-white/5 border border-white/10 hover:bg-gold-accent/10 hover:border-gold-accent/30 text-white hover:text-gold-accent text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Read Scroll
                  </button>
                  <button
                    onClick={() => {
                      setSynthesizedSaint(null);
                    }}
                    className="px-4 py-2 rounded text-white/40 hover:text-white text-xs font-mono tracking-widest uppercase transition-all cursor-pointer"
                  >
                    Clear Result
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of curations */}
      {loadingStories && (
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-gold-accent bg-gold-accent/5 px-4 py-2 rounded-full border border-gold-accent/10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting modern hagiography registers...</span>
          </div>
        </div>
      )}

      {filteredSaints.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSaints.map((saint) => {
            // Find native story object to grab status and type directly
            const originalStory = stories.find(s => s.id === saint.id);
            const statusVal = originalStory ? originalStory.status : 1;
            const typeVal = originalStory ? originalStory.type : 0;

            return (
              <StoryCard
                key={saint.id}
                saint={saint}
                status={statusVal}
                type={typeVal}
                onClick={() => handleSelectSaint(saint.id)}
              />
            );
          })}
        </div>
      ) : (
        !loadingStories && (
          <div className="glass-panel rounded-xl py-16 px-4 border border-white/5 text-center shadow-lg">
            <BookOpenCheck className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="font-serif text-white/70 text-lg mb-2">No local records match your search criteria</p>
            <p className="text-white/40 text-xs font-sans max-w-md mx-auto">
              Try expanding your search query or category filters, or use the <span className="text-gold-accent font-semibold font-mono">DYNAMIC SYNTHESIS</span> button above to compile a biography using Gemini.
            </p>
          </div>
        )
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => changePageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber === 1}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="font-mono text-xs text-white/60">
            Page <span className="text-gold-accent font-semibold">{pageNumber}</span> of {totalPages}
          </span>

          <button
            onClick={() => changePageNumber(Math.min(totalPages, pageNumber + 1))}
            disabled={pageNumber === totalPages}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
