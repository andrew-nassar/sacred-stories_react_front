import React, { useState, useEffect } from "react";
import { Search, Filter, Sparkles, BookOpen, MapPin, Award, BookOpenCheck, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SAINTS_DATA, Saint } from "../../../data";
import { useSacredStore } from "../store/sacredStore";
import { archivesAdapter, mapApiStoryToSaint } from "../adapters/archivesAdapter";

export default function SaintsExplorer() {
  const { setSelectedSaint, setCurrentTab, searchQueryPass, setSearchQueryPass } = useSacredStore();

  const [searchQuery, setSearchQuery] = useState(searchQueryPass);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [saints, setSaints] = useState<Saint[]>(SAINTS_DATA);
  const [isLoadingSaints, setIsLoadingSaints] = useState(false);

  // Gemini State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedSaint, setSynthesizedSaint] = useState<Saint | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // Synchronize initial query
  useEffect(() => {
    if (searchQueryPass) {
      setSearchQuery(searchQueryPass);
    }
  }, [searchQueryPass]);

  // Clean initial search query trigger on mount/dismount
  useEffect(() => {
    return () => {
      setSearchQueryPass("");
    };
  }, []);

  // API Fetch for Sacred Stories
  useEffect(() => {
    let active = true;
    async function fetchSaints() {
      setIsLoadingSaints(true);
      try {
        const response = await archivesAdapter.getSacredStories({
          searchTerm: searchQuery || undefined,
        });
        if (active) {
          if (response && response.succeeded && response.data && response.data.items) {
            const mapped = response.data.items.map(mapApiStoryToSaint);
            setSaints(mapped);
          } else {
            setSaints(SAINTS_DATA);
          }
        }
      } catch (err) {
        if (active) {
          console.log("No deployed custom API detected, or local API is currently offline. Falling back to built-in Martyrology database.");
          setSaints(SAINTS_DATA);
        }
      } finally {
        if (active) {
          setIsLoadingSaints(false);
        }
      }
    }
    fetchSaints();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  // Load detailed saint from API on select
  const handleSelectSaint = async (saint: Saint) => {
    if (saint.biography && saint.reflection) {
      setSelectedSaint(saint);
      setCurrentTab("saint-details");
      return;
    }
    try {
      setIsLoadingSaints(true);
      const detailedSaint = await archivesAdapter.getSacredStoryById(saint.id);
      setSelectedSaint(detailedSaint);
      setCurrentTab("saint-details");
    } catch (err) {
      console.warn("Failed to fetch full details from API, using list summary instead.", err);
      setSelectedSaint(saint);
      setCurrentTab("saint-details");
    } finally {
      setIsLoadingSaints(false);
    }
  };

  // Filter logic
  const filteredSaints = saints.filter((saint) => {
    const matchesSearch = 
      saint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saint.patronage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saint.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTheme = selectedTheme === "all" || saint.colorTheme === selectedTheme;
    
    let matchesEra = true;
    if (selectedEra !== "all") {
      if (selectedEra === "20th") {
        matchesEra = saint.era.includes("19") && !saint.era.startsWith("20");
      } else if (selectedEra === "21st") {
        matchesEra = saint.era.includes("20") || saint.era.startsWith("20");
      } else if (selectedEra === "historic") {
        matchesEra = !saint.era.includes("19") && !saint.era.includes("20");
      }
    }

    return matchesSearch && matchesTheme && matchesEra;
  });

  // Dynamic saint synthesis via server proxy adapter
  const handleSynthesizeSaint = async () => {
    if (!searchQuery.trim()) return;

    setIsSynthesizing(true);
    setSynthesisError(null);
    setSynthesizedSaint(null);

    try {
      const data = await archivesAdapter.searchArchives(searchQuery);

      if (data.saint) {
        setSynthesizedSaint(data.saint);
        // Automatically add to list so user can search it again during this session!
        if (!saints.some(s => s.name.toLowerCase() === data.saint.name.toLowerCase())) {
          setSaints(prev => [data.saint, ...prev]);
        }
      } else {
        throw new Error("No record found for this search.");
      }
    } catch (err: any) {
      console.error(err);
      setSynthesisError(err.message || "An unexpected error occurred during synthesis.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative z-10">
      
      {/* Search Header */}
      <div className="text-center mb-12">
        <span className="font-mono text-xs text-gold-accent tracking-[0.25em] uppercase block mb-3">
          The Scriptorium
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white mb-4">
          Martyrology Search
        </h2>
        <p className="text-white/60 font-sans max-w-xl mx-auto text-sm leading-relaxed">
          Search our curated library of modern heroes, or query the dynamic archives to retrieve comprehensive hagiographies of any saint or martyr.
        </p>
      </div>

      {/* Main Search & Filter Interface */}
      <div className="glass-panel rounded-xl p-6 md:p-8 mb-12 flex flex-col gap-6 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, patronage, location, or try 'St. Joan of Arc'..."
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
              onKeyDown={(e) => e.key === "Enter" && handleSynthesizeSaint()}
            />
          </div>

          {/* Dynamic AI Synthesis Button */}
          <button
            onClick={handleSynthesizeSaint}
            disabled={isSynthesizing || !searchQuery.trim()}
            className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-gold-dark via-gold-accent to-amber-400 hover:from-gold-accent hover:to-amber-300 text-canvas disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 disabled:cursor-not-allowed font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
            title="Ask Gemini to retrieve/synthesize historical record from theological logs"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ARCHIVING...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>DYNAMIC SYNTHESIS</span>
              </>
            )}
          </button>
        </div>

        {/* Quick filters row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
          {/* Theme Filters */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-gold-accent/70" /> THEME:
            </span>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All" },
                { id: "gold", label: "Humility/Gold" },
                { id: "burgundy", label: "Martyrdom/Red" },
                { id: "navy", label: "Contemplation/Blue" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 ${
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
                { id: "all", label: "All" },
                { id: "historic", label: "Pre-20th C" },
                { id: "20th", label: "20th Century" },
                { id: "21st", label: "21st Century" },
              ].map((era) => (
                <button
                  key={era.id}
                  onClick={() => setSelectedEra(era.id)}
                  className={`px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 ${
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

      {/* Synthesis Loader / Results Panel */}
      <AnimatePresence>
        {isSynthesizing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel rounded-xl p-8 text-center border border-gold-accent/20 bg-gold-accent/5 max-w-2xl mx-auto mb-12 relative overflow-hidden"
          >
            {/* Spinning halos in the background */}
            <div className="absolute -inset-10 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-56 h-56 rounded-full border-2 border-gold-accent animate-spin-slow" />
              <div className="w-44 h-44 rounded-full border border-gold-accent border-dashed animate-spin-reverse absolute" />
            </div>
            
            <Sparkles className="w-10 h-10 text-gold-accent animate-pulse mx-auto mb-4" />
            <h3 className="font-serif text-xl text-white font-medium mb-2">Unlocking the Heavenly Registers</h3>
            <p className="text-white/60 text-xs font-mono mb-4">Querying theological codices for: &ldquo;{searchQuery}&rdquo;</p>
            <div className="h-1.5 w-48 bg-white/10 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-dark via-gold-accent to-amber-300 w-2/3 rounded-full animate-[shimmer_1.5s_infinite_linear]" />
            </div>
          </motion.div>
        )}

        {synthesisError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-lg bg-burgundy-dark/20 border border-burgundy-accent/30 text-center max-w-md mx-auto mb-12 text-white/80 text-sm"
          >
            <p className="font-mono text-xs text-red-400 font-semibold mb-1">ARCHIVAL LOOKUP DELAYED</p>
            {synthesisError}
            <p className="text-[10px] text-white/40 mt-2">Ensure the GEMINI_API_KEY secret is populated in the Settings tab.</p>
          </motion.div>
        )}

        {synthesizedSaint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel border-2 border-gold-accent/30 rounded-xl p-6 md:p-8 mb-12 max-w-3xl mx-auto relative overflow-hidden"
          >
            {/* Top halo detail */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Photo representation */}
              <div className="w-32 h-44 md:w-40 md:h-52 rounded-lg overflow-hidden border border-gold-accent/20 relative shrink-0">
                <img
                  src={synthesizedSaint.image}
                  alt={synthesizedSaint.name}
                  className="w-full h-full object-cover grayscale brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-gold-accent border border-gold-accent/30 px-1.5 py-0.5 rounded bg-black/60">
                    SYNTHESIZED
                  </span>
                </div>
              </div>

              {/* Text metadata */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="font-mono text-[10px] text-gold-accent px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-widest">
                    {synthesizedSaint.era}
                  </span>
                  <span className="font-mono text-[10px] text-white/50 px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-accent/70" /> {synthesizedSaint.location}
                  </span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-1">
                  {synthesizedSaint.name}
                </h3>
                <p className="font-serif italic text-gold-accent/80 text-sm mb-4">
                  {synthesizedSaint.title}
                </p>
                <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-4">
                  {synthesizedSaint.subtitle}
                </p>

                <div className="flex gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => handleSelectSaint(synthesizedSaint)}
                    className="px-4 py-2 rounded bg-white/5 border border-white/10 hover:bg-gold-accent/10 hover:border-gold-accent/30 text-white hover:text-gold-accent text-xs font-mono tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Read Scroll
                  </button>
                  <button
                    onClick={() => {
                      setSynthesizedSaint(null);
                    }}
                    className="px-4 py-2 rounded text-white/40 hover:text-white text-xs font-mono tracking-widest uppercase transition-all"
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
      {isLoadingSaints && (
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-gold-accent bg-gold-accent/5 px-4 py-2 rounded-full border border-gold-accent/10">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting modern hagiography registries...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredSaints.length > 0 ? (
            filteredSaints.map((saint) => {
              const borderTheme = 
                saint.colorTheme === "burgundy" ? "hover:border-burgundy-accent/40" :
                saint.colorTheme === "gold" ? "hover:border-gold-accent/40" : "hover:border-blue-500/35";

              return (
                <motion.div
                  key={saint.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => handleSelectSaint(saint)}
                  className={`glass-panel rounded-xl overflow-hidden cursor-pointer flex flex-col h-full group border border-white/5 shadow-md ${borderTheme} transition-all duration-300`}
                >
                  {/* Portrait headshot */}
                  <div className="relative h-48 overflow-hidden bg-black">
                    <img
                      src={saint.image}
                      alt={saint.name}
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-canvas to-transparent opacity-90" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="font-mono text-[9px] text-gold-accent bg-black/60 border border-gold-accent/30 px-2 py-0.5 rounded tracking-widest uppercase">
                        {saint.era}
                      </span>
                    </div>
                  </div>

                  {/* Body textuals */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-semibold text-white group-hover:text-gold-accent transition-colors duration-300 mb-1">
                        {saint.name}
                      </h4>
                      <p className="font-serif italic text-gold-accent/70 text-xs mb-3">
                        {saint.title}
                      </p>
                      <p className="text-white/60 text-xs leading-relaxed font-sans line-clamp-3">
                        {saint.subtitle}
                      </p>
                    </div>

                    {/* Metadata tags */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gold-accent/70" />
                        <span className="truncate max-w-[100px]">{saint.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-gold-accent/70" />
                        <span className="truncate max-w-[100px]">{saint.feastDay}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center">
              <BookOpenCheck className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="font-serif text-white/70 text-lg mb-2">No local records match your search criteria</p>
              <p className="text-white/40 text-xs font-sans max-w-md mx-auto">
                Use the <span className="text-gold-accent font-semibold font-mono">DYNAMIC SYNTHESIS</span> button above to query the deep archives and compile a biography for &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
