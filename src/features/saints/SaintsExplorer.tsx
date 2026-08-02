import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Sparkles, BookOpen, MapPin, Award, BookOpenCheck, RefreshCw, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSacredStore } from "../../shared/store/sacredStore";
import { fetchSacredStories } from "../../shared/sacred_stories/services/sacredStoryService";
import { SacredStoryItem } from "../../shared/sacred_stories/models/sacred_Story_model";
import { archivesAdapter } from "../../shared/services/archivesService";
import { Pagination } from "../../shared/components/Pagination";

// Local UI model for rendering cards
export interface Saint {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  era: string;
  location: string;
  feastDay: string;
  patronage: string;
  colorTheme: string;
  type?: number;
}

// Sacred Story Types mapping (0 to 5)
const STORY_TYPES = [
  { id: "all", label: "All Types" },
  { id: 0, label: "Hermit (متوحد)" },
  { id: 1, label: "Saint (قديس)" },
  { id: 2, label: "Martyr (شهيد)" },
  { id: 3, label: "Patriarch (بطريرك)" },
  { id: 4, label: "Archpriest (قمص)" },
  { id: 5, label: "Pope (بابا)" },
];

// Helper to map API items to local UI Saint model
function mapApiStoryToSaint(item: SacredStoryItem): Saint {
  return {
    id: item.id,
    name: item.name,
    title: item.famousQuote || "Venerable Servant of God",
    subtitle: item.famousQuote || "",
    image: item.coverImage || "https://picsum.photos/640/480/?image=233",
    era: "Historic",
    location: "Global Archive",
    feastDay: "Annual",
    patronage: "Faith",
    colorTheme: item.type === 2 ? "burgundy" : item.type === 0 ? "navy" : "gold",
    type: item.type,
  };
}

export default function SaintsExplorer() {
  const { setSelectedSaintId, setCurrentTab, searchQueryPass, setSearchQueryPass } = useSacredStore();

  // Input & Filter state
  const [searchInput, setSearchInput] = useState(searchQueryPass || "");
  const [selectedType, setSelectedType] = useState<number | "all">("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pure API-driven state (no static local data fallback)
  const [saints, setSaints] = useState<Saint[]>([]);
  const [isLoadingSaints, setIsLoadingSaints] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  // Gemini State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedSaint, setSynthesizedSaint] = useState<Saint | null>(null);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  // Synchronize initial query pass
  useEffect(() => {
    if (searchQueryPass) {
      setSearchInput(searchQueryPass);
    }
  }, [searchQueryPass]);

  // Clean initial search query trigger on mount/dismount
  useEffect(() => {
    return () => {
      setSearchQueryPass("");
    };
  }, [setSearchQueryPass]);

  // Fetch API function - Called on explicit user action, page change, or mount
  const executeApiSearch = useCallback(
    async (query: string, typeVal: number | "all", page: number = 1, size: number = 12) => {
      setIsLoadingSaints(true);
      try {
        const response = await fetchSacredStories({
          searchTerm: query.trim() || undefined,
          type: typeVal !== "all" ? typeVal : undefined,
          pageNumber: page,
          pageSize: size,
        });

        if (response && response.succeeded && response.data && response.data.items) {
          const mapped = response.data.items.map(mapApiStoryToSaint);
          setSaints(mapped);
          setTotalCount(response.data.totalCount ?? mapped.length);
          setPageNumber(response.data.pageNumber ?? page);
          setPageSize(response.data.pageSize ?? size);
        } else {
          setSaints([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("API Error fetching stories:", err);
        setSaints([]);
        setTotalCount(0);
      } finally {
        setIsLoadingSaints(false);
      }
    },
    []
  );

  // Initial load on mount
  useEffect(() => {
    executeApiSearch(searchInput, selectedType, 1, pageSize);
  }, []);

  // Trigger search on Click or Enter (resets to page 1)
  const handleExecuteSearch = () => {
    setPageNumber(1);
    executeApiSearch(searchInput, selectedType, 1, pageSize);
  };

  // Type Filter change trigger (resets to page 1)
  const handleTypeChange = (typeId: number | "all") => {
    setSelectedType(typeId);
    setPageNumber(1);
    executeApiSearch(searchInput, typeId, 1, pageSize);
  };

  // Page change trigger
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    executeApiSearch(searchInput, selectedType, newPage, pageSize);
  };

  // Page size change trigger
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1);
    executeApiSearch(searchInput, selectedType, 1, newSize);
  };

  // Select saint for details
  const handleSelectSaint = (saint: Saint) => {
    setSelectedSaintId(saint.id);
    setCurrentTab("saint-details");
  };

  // Local filtering for Era & Theme
  const filteredSaints = saints.filter((saint) => {
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

    return matchesTheme && matchesEra;
  });

  // Dynamic saint synthesis via server proxy adapter
  const handleSynthesizeSaint = async () => {
    if (!searchInput.trim()) return;

    setIsSynthesizing(true);
    setSynthesisError(null);
    setSynthesizedSaint(null);

    try {
      const data = await archivesAdapter.searchArchives(searchInput);

      if (data.saint) {
        setSynthesizedSaint(data.saint);
        if (!saints.some((s) => s.name.toLowerCase() === data.saint.name.toLowerCase())) {
          setSaints((prev) => [data.saint, ...prev]);
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
    <div className="max-w-6xl mx-auto py-6 sm:py-12 px-4 relative z-10">
      {/* Search Header */}
      <div className="text-center mb-6 md:mb-12">
        <span className="font-mono text-[10px] sm:text-xs text-gold-accent tracking-[0.25em] uppercase block mb-1 md:mb-3">
          The Scriptorium
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-semibold text-white mb-2 md:mb-4">
          Martyrology Search
        </h2>
        <p className="text-white/60 font-sans max-w-xl mx-auto text-xs sm:text-sm leading-snug sm:leading-relaxed hidden sm:block">
          Search our curated library of modern heroes, or query the dynamic archives to retrieve comprehensive hagiographies of any saint or martyr.
        </p>
      </div>

      {/* Desktop Search & Filter Interface (Unchanged Desktop Layout) */}
      <div className="hidden md:flex glass-panel rounded-xl p-6 md:p-8 mb-12 flex-col gap-6 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Search bar with explicit Search Trigger button */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, patronage, location, or try 'St. Joan of Arc'..."
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-12 py-3.5 text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleExecuteSearch();
                }
              }}
            />
            <button
              onClick={handleExecuteSearch}
              title="Execute Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-gold-accent hover:bg-white/10 rounded-md transition-all duration-200"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic AI Synthesis Button */}
          <button
            onClick={handleSynthesizeSaint}
            disabled={isSynthesizing || !searchInput.trim()}
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
        <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
          {/* Story Types Filters (0 to 5) */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
              <Filter className="w-3 h-3 text-gold-accent/70" /> TYPE:
            </span>
            <div className="flex flex-wrap gap-2">
              {STORY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id as number | "all")}
                  className={`px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 ${
                    selectedType === type.id
                      ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30"
                      : "bg-white/5 text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Theme Filters */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest shrink-0">
                THEME:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "gold", label: "Humility/Gold" },
                  { id: "burgundy", label: "Martyrdom/Red" },
                  { id: "navy", label: "Contemplation/Blue" },
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 ${
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest shrink-0">
                ERA:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "historic", label: "Pre-20th C" },
                  { id: "20th", label: "20th Century" },
                  { id: "21st", label: "21st Century" },
                ].map((era) => (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEra(era.id)}
                    className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-sans transition-all duration-300 ${
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
      </div>

      {/* Mobile Search & Filter Interface (Photo 1 Design - Compact Mobile) */}
      <div className="block md:hidden mb-6">
        {/* Rounded Pill Input Bar */}
        <div className="relative flex items-center bg-[#121414] border border-white/15 rounded-full px-4 py-2 shadow-xl focus-within:border-gold-accent/50 transition-colors">
          <button onClick={handleExecuteSearch} className="p-1 text-gold-accent hover:text-yellow-400 transition-colors shrink-0">
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search the sanctuary..."
            className="w-full bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder-white/40 font-sans px-2 focus:outline-none focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleExecuteSearch();
              }
            }}
          />
          <button
            onClick={() => setIsFilterOpen(true)}
            title="Filter Sanctuary"
            className="p-1 text-gold-accent/80 hover:text-gold-accent transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Sanctuary Popup Modal (Photo 2 Design) */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-[#121414] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-left overflow-y-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold-accent tracking-tight">
                    Filter Sanctuary
                  </h3>
                  <div className="w-10 h-1 bg-gold-accent/60 rounded-full mt-2" />
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section 1: SEARCH TYPE */}
              <div>
                <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase block mb-3 font-semibold">
                  SEARCH TYPE
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Types" },
                    { id: 1, label: "Saint" },
                    { id: 0, label: "Hermit" },
                    { id: 2, label: "Martyr" },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id as number | "all")}
                      className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${
                        selectedType === type.id
                          ? "bg-[#252216] text-gold-accent border border-gold-accent/70 font-medium shadow-sm"
                          : "bg-[#1f2223] text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: HISTORICAL ERA */}
              <div>
                <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase block mb-3 font-semibold">
                  HISTORICAL ERA
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Eternal" },
                    { id: "historic", label: "Early Church" },
                    { id: "medieval", label: "Medieval" },
                    { id: "20th", label: "Modern" },
                  ].map((era) => (
                    <button
                      key={era.id}
                      onClick={() => setSelectedEra(era.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${
                        selectedEra === era.id
                          ? "bg-[#252216] text-gold-accent border border-gold-accent/70 font-medium shadow-sm"
                          : "bg-[#1f2223] text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 3: WISDOM THEME */}
              <div>
                <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase block mb-3 font-semibold">
                  WISDOM THEME
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Any Theme" },
                    { id: "navy", label: "Silence" },
                    { id: "gold", label: "Humility" },
                    { id: "prayer", label: "Prayer" },
                    { id: "burgundy", label: "Sacrifice" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${
                        selectedTheme === theme.id
                          ? "bg-[#252216] text-gold-accent border border-gold-accent/70 font-medium shadow-sm"
                          : "bg-[#1f2223] text-white/60 border border-transparent hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* APPLY FILTERS Button */}
              <button
                onClick={() => {
                  handleExecuteSearch();
                  setIsFilterOpen(false);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-gold-accent to-yellow-500 hover:from-gold-accent hover:to-amber-400 text-canvas font-mono text-xs font-bold uppercase tracking-wider shadow-lg active:scale-98 transition-all mt-4"
              >
                APPLY FILTERS
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
            <p className="text-white/60 text-xs font-mono mb-4">
              Querying theological codices for: &ldquo;{searchInput}&rdquo;
            </p>
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
                saint.colorTheme === "burgundy"
                  ? "hover:border-burgundy-accent/40"
                  : saint.colorTheme === "gold"
                  ? "hover:border-gold-accent/40"
                  : "hover:border-blue-500/35";

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
              <p className="font-serif text-white/70 text-lg mb-2">
                {isLoadingSaints ? "Loading records..." : "No records match your search criteria"}
              </p>
              <p className="text-white/40 text-xs font-sans max-w-md mx-auto">
                Use the <span className="text-gold-accent font-semibold font-mono">DYNAMIC SYNTHESIS</span> button above to query the deep archives and compile a biography for &ldquo;{searchInput}&rdquo;.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={pageNumber}
        pageSize={pageSize}
        totalItems={totalCount}
        loading={isLoadingSaints}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[6, 12, 24, 48]}
        className="mt-8"
      />
    </div>
  );
}