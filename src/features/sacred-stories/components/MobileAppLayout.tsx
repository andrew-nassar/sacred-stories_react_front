import React, { useState, useEffect } from "react";
import { 
  Compass, Search, User, Sparkles, MapPin, Calendar, Info, Sun, Moon, 
  BookOpen, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Quote, Heart, 
  RefreshCw, Award, Send, SlidersHorizontal, Eye, MessageSquareCode, Library, Check,
  Volume2, VolumeX
} from "lucide-react";
import { useSacredStore, TabId } from "../store/sacredStore";
import { useAuthStore } from "../../auth/store/authStore";
import { translations, translatedSaints } from "../store/translations";
import { SAINTS_DATA, Saint } from "../../../data";
import { motion, AnimatePresence } from "motion/react";
import Footer from "./Footer";
import SaintDetailsPage from "./SaintDetailsPage";
import { archivesAdapter, mapApiStoryToSaint } from "../adapters/archivesAdapter";

interface MobileAppLayoutProps {
  onOpenAuthModal: () => void;
}

export default function MobileAppLayout({ onOpenAuthModal }: MobileAppLayoutProps) {
  const {
    currentTab,
    setCurrentTab,
    selectedSaint,
    setSelectedSaint,
    setIsPrayerModalOpen,
    setDefaultSaintForPrayer,
    language,
    setLanguage,
    theme,
    setTheme,
    isAmbientPlaying,
    setIsAmbientPlaying
  } = useSacredStore();

  const { user } = useAuthStore();
  const t = translations[language];

  // API + Fallback state for saints
  const [saintsList, setSaintsList] = useState<Saint[]>(SAINTS_DATA);
  const [isLoadingSaints, setIsLoadingSaints] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("all");

  // Load Saints from API or fall back
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
            setSaintsList(mapped);
          } else {
            setSaintsList(SAINTS_DATA);
          }
        }
      } catch (err) {
        if (active) {
          setSaintsList(SAINTS_DATA);
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

  // Handle selecting a saint with API detail hydration
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
      setSelectedSaint(saint);
      setCurrentTab("saint-details");
    } finally {
      setIsLoadingSaints(false);
    }
  };

  // Filter local/API list based on custom location chips
  const filteredSaintsList = saintsList.filter((saint) => {
    const matchesSearch = 
      saint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saint.patronage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      saint.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedLocationFilter === "all") return matchesSearch;
    return matchesSearch && saint.location.toLowerCase().includes(selectedLocationFilter.toLowerCase());
  });

  // Selected Lives Carousel/Slider list
  const featuredLivesList = [
    {
      id: "maria-shadows",
      name: language === "ar" ? "القديسة ماريا الظلال" : "St. Maria of the Shadows",
      era: "1920 – 1944",
      title: language === "ar" ? "أرشيف الشهادة والقداسة" : "The Silent Witness of the Northern Plains",
      subtitle: language === "ar" ? "نور يسطع في أحلك ليالي الحرب، كرسَت حياتها للنازحين في صمت الصلاة." : "A silent light enduring through the deepest darkness of the mid-century conflict, preserving faith in hidden sanctuaries.",
      image: "/src/assets/images/maria_shadows_portrait_1784383647571.jpg"
    },
    {
      id: "oscar-salvador",
      name: language === "ar" ? "أوسكار سان سلفادور" : "Oscar of San Salvador",
      era: "1952 – 1980",
      title: language === "ar" ? "صوت من لا صوت لهم" : "Voice for the Voiceless",
      subtitle: language === "ar" ? "صوت من لا صوت لهم، قُتل وهو يرفع الكأس المقدسة دفاعاً عن الحق." : "A modern prophet of peace who stood with the oppressed, speaking truth to power until his final breath at the altar.",
      image: "/src/assets/images/oscar_salvador_portrait_1784383657074.jpg"
    },
    {
      id: "maximilian-kolbe",
      name: language === "ar" ? "ماكسيميليان الشجاع" : "St. Maximilian Kolbe",
      era: "1894 – 1941",
      title: language === "ar" ? "شهادة الشجاعة العظمى" : "The Apostle of Auschwitz",
      subtitle: language === "ar" ? "قصة التضحية العظمى في معسكرات الاعتقال، حيث وهب حياته فداءً لآخر." : "A Polish friar who offered his life to spare a stranger in the hunger bunker of Auschwitz, turning a cell of death into a temple of praise.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800"
    }
  ];

  const [activeSaintIndex, setActiveSaintIndex] = useState(0);

  const handleNextSaint = () => {
    setActiveSaintIndex((prev) => (prev + 1) % featuredLivesList.length);
  };

  const handlePrevSaint = () => {
    setActiveSaintIndex((prev) => (prev - 1 + featuredLivesList.length) % featuredLivesList.length);
  };

  const menuItems: { id: TabId; label: string; icon: any }[] = [
    { id: "home", label: language === "ar" ? "الرئيسية" : "Home", icon: Compass },
    { id: "saints", label: language === "ar" ? "الأرشيف" : "Archive", icon: Search },
    { id: "churches", label: language === "ar" ? "الكنائس" : "Churches", icon: MapPin },
    { id: "timeline", label: language === "ar" ? "الزمن" : "Timeline", icon: Calendar },
    { id: "about", label: language === "ar" ? "المشروع" : "About", icon: Info },
  ];

  const handleOpenPrayerForSelected = () => {
    if (selectedSaint) {
      setDefaultSaintForPrayer(selectedSaint.name);
      setIsPrayerModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-white/90 pb-28 selection:bg-gold-accent/30 selection:text-white">
      {/* Top Mobile AppBar */}
      <header className="sticky top-0 z-40 w-full glass-panel bg-surface-dim/80 backdrop-blur-xl border-b border-white/10 px-4 py-3.5 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button className="text-primary active:scale-95 transition-transform">
            <Compass className="w-5 h-5 text-gold-accent" />
          </button>
          <h1 className="font-serif text-xl font-bold tracking-tight text-gold-accent select-none">
            {language === "ar" ? "قصص مقدسة" : t.appName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Liturgy Toggle */}
          <button
            onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
            className={`p-1.5 rounded-full transition-all active:scale-95 relative ${
              isAmbientPlaying 
                ? "text-gold-accent bg-gold-accent/10 shadow-[0_0_10px_rgba(242,202,80,0.2)]" 
                : "text-white/60 hover:text-white"
            }`}
            title={language === "ar" ? "الموسيقى الليتورجية" : "Liturgy Ambient Sound"}
          >
            {isAmbientPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-gold-accent animate-pulse" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-gold-accent rounded-full animate-ping" />
              </>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-2 py-1 rounded text-[10px] font-mono font-bold border border-white/10 text-white/80 active:scale-95 transition-all"
          >
            {language === "en" ? "العربية" : "EN"}
          </button>

          {/* Theme Toggler */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-full text-white/70 hover:text-white active:scale-95"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-gold-accent" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Profile registry */}
          <button
            onClick={onOpenAuthModal}
            className={`p-1.5 rounded-full text-white/75 active:scale-95 ${
              user.isRegistered ? "text-gold-accent bg-gold-accent/5" : ""
            }`}
          >
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {/* SAINT DETAILS SHEET (FULL SCREEN ON MOBILE) */}
          {currentTab === "saint-details" ? (
            <motion.div
              key="saint-details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="px-0 py-0"
            >
              <SaintDetailsPage />
            </motion.div>
          ) : (
            <div>
              {/* TAB VIEWS */}

              {/* 1. HOME TAB */}
              {currentTab === "home" && (
                <motion.div
                  key="home-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="px-4 py-6 space-y-8"
                >
                  {/* Tagline Badge */}
                  <div className="text-center">
                    <span className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-mono tracking-widest uppercase mb-4">
                      {language === "ar" ? "أرشيف الشهادة والقداسة" : "Archive of Witness & Holiness"}
                    </span>
                    <h2 className="font-serif text-3xl font-bold leading-tight text-white mb-3">
                      {language === "ar" ? (
                        <>شهداء وقديسون <br/><span className="text-primary italic">مسيحيون معاصرون</span></>
                      ) : (
                        <>Modern <span className="text-primary italic">Christian Martyrs</span> & Saints</>
                      )}
                    </h2>
                    <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto">
                      {language === "ar" 
                        ? "استكشف حيوات من ضحوا بكل شيء من أجل إيمانهم في العصر الحديث. رحلة بصرية وروحية عبر قصص الصمود والمحبة." 
                        : "Explore the lives of those who sacrificed everything for their faith in the modern era. A visual and spiritual journey through resilience and love."}
                    </p>
                  </div>

                  {/* Search bar */}
                  <div className="glass-panel flex items-center p-1 rounded-xl w-full border border-white/10 shadow-lg bg-white/[0.02]">
                    <Search className="w-4 h-4 text-white/40 mx-3" />
                    <input 
                      type="text" 
                      placeholder={language === "ar" ? "ابحث عن قديس أو شهيد..." : "Search for a saint or martyr..."}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentTab("saints"); // immediately jump to archive search
                      }}
                      className="bg-transparent border-none text-white focus:outline-none w-full py-2.5 text-xs placeholder:text-white/30"
                    />
                  </div>

                  {/* Navigation CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCurrentTab("saints")}
                      className="bg-primary text-on-primary py-3 rounded-lg font-bold text-xs hover:shadow-[0_0_15px_rgba(242,202,80,0.3)] transition-all active:scale-95"
                    >
                      {language === "ar" ? "استكشف القديسين" : "Explore Saints"}
                    </button>
                    <button
                      onClick={() => setIsPrayerModalOpen(true)}
                      className="border border-white/10 text-white/90 bg-white/5 py-3 rounded-lg font-bold text-xs hover:bg-white/10 transition-all active:scale-95"
                    >
                      {language === "ar" ? "صلاة اليوم" : "Today's Prayer"}
                    </button>
                  </div>

                  {/* Horizontal Scroll / Carousel of Selected Lives */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white">
                          {language === "ar" ? "حيوات مختارة" : "Selected Lives"}
                        </h3>
                        <div className="h-1 w-12 bg-primary rounded-full mt-1"></div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handlePrevSaint}
                          className="p-1 rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextSaint}
                          className="p-1 rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Selected Active card */}
                    <div 
                      onClick={() => {
                        const match = SAINTS_DATA.find(s => s.id === featuredLivesList[activeSaintIndex].id);
                        if (match) {
                          handleSelectSaint(match);
                        }
                      }}
                      className="glass-panel rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-surface-dim/80 cursor-pointer group hover:border-gold-accent/30 shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all duration-300"
                    >
                      {/* Image container */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <img 
                          src={featuredLivesList[activeSaintIndex].image} 
                          alt={featuredLivesList[activeSaintIndex].name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-gold-accent animate-pulse" />
                          <span className="text-[8px] font-mono uppercase text-gold-accent tracking-wider">
                            {language === "ar" ? "مميز" : "Featured"}
                          </span>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase bg-gold-accent/10 border border-gold-accent/30 text-gold-accent px-2 py-0.5 rounded-md">
                            {featuredLivesList[activeSaintIndex].era}
                          </span>
                          <span className="text-[10px] text-white/30 font-mono">
                            {language === "ar" ? "تاريخ معاصر" : "Modern Era"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-serif text-lg font-bold text-white group-hover:text-gold-accent transition-colors duration-300">
                            {featuredLivesList[activeSaintIndex].name}
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                            {featuredLivesList[activeSaintIndex].subtitle}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gold-accent/80 font-medium group-hover:text-gold-accent transition-colors">
                          <span>
                            {language === "ar" ? "قراءة السيرة الكاملة" : "Read Full Biography"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ethereal Spacer Quote */}
                  <div className="py-8 text-center space-y-4 border-y border-white/5">
                    <Quote className="w-8 h-8 text-gold-accent/20 mx-auto" />
                    <p className="font-serif italic text-sm text-white/80 leading-relaxed max-w-sm mx-auto">
                      {language === "ar" 
                        ? "\"الشهادة ليست نهاية القصة، بل هي البداية الحقيقية للحياة الأبدية التي تضيء دروبنا في هذا العالم المظلم.\""
                        : "\"Martyrdom is not the end of the story, but the true beginning of eternal life that lights our paths in this dark world.\""}
                    </p>
                    <span className="block font-mono text-[9px] text-gold-accent uppercase tracking-widest">
                      {language === "ar" ? "مخطوطات من القرن العشرين" : "20th Century Chronicles"}
                    </span>
                  </div>

                  {/* Bento Categories */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-serif text-lg font-bold text-white">
                        {language === "ar" ? "فئات القداسة" : "Categories of Sacrifice"}
                      </h3>
                      <p className="text-[10px] text-white/40 mt-1">
                        {language === "ar" ? "تصفح الأرشيف حسب نوع التضحية أو العصر التاريخي" : "Explore the records by category or historical era"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div 
                        onClick={() => {
                          setSelectedLocationFilter("all");
                          setCurrentTab("saints");
                        }}
                        className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px] border border-white/5 bg-gradient-to-br from-white/[0.01] to-black/30 hover:border-gold-accent/25 transition-all"
                      >
                        <SlidersHorizontal className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="text-sm font-serif font-bold text-white mt-3">
                            {language === "ar" ? "شهداء العدالة الاجتماعية" : "Martyrs of Social Justice"}
                          </h4>
                          <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                            {language === "ar" ? "الذين ناضلوا ضد الظلم والقهر باسم المحبة المسيحية." : "Those who stood against oppression and tyranny in the name of Christian love."}
                          </p>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          setSelectedLocationFilter("all");
                          setCurrentTab("saints");
                        }}
                        className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px] border border-white/5 bg-gradient-to-br from-white/[0.01] to-black/30 hover:border-gold-accent/25 transition-all"
                      >
                        <Compass className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="text-sm font-serif font-bold text-white mt-3">
                            {language === "ar" ? "رسل المحبة في الأراضي البعيدة" : "Apostles of Love in Faraway Lands"}
                          </h4>
                          <p className="text-[10px] text-white/50 mt-1 leading-relaxed">
                            {language === "ar" ? "رحالة الإيمان الذين حملوا النور إلى زوايا العالم المهجورة." : "Faith travelers who brought celestial hope to the forgotten spaces of the earth."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Centered Monastic Footer */}
                  <Footer />
                </motion.div>
              )}

              {/* 2. ARCHIVE SEARCH TAB */}
              {currentTab === "saints" && (
                <motion.div
                  key="saints-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="px-4 py-6 space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold text-gold-accent">
                      {language === "ar" ? "أرشيف القداسة" : "Sacred Archives"}
                    </h2>
                    <p className="text-[10px] text-white/40 tracking-wider font-mono">
                      {language === "ar" ? "مستكشف القديسين والشهداء المعاصرين" : "Hagiographical Explorer of Modern Witnesses"}
                    </p>
                  </div>

                  {/* Search + Filter */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={language === "ar" ? "ابحث عن قديس أو شهيد..." : "Search for a saint or martyr..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 bg-surface-container-low border border-white/10 rounded-xl px-11 text-xs text-white focus:outline-none focus:border-gold-accent/40 focus:ring-1 focus:ring-gold-accent/40"
                    />
                    <Search className="w-4 h-4 text-white/40 absolute left-4 top-4" />
                  </div>

                  {/* Location Filter Chips */}
                  <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                    {[
                      { id: "all", label: language === "ar" ? "الكل" : "All" },
                      { id: "poland", label: language === "ar" ? "بولندا" : "Poland" },
                      { id: "greece", label: language === "ar" ? "اليونان" : "Greece" },
                      { id: "egypt", label: language === "ar" ? "مصر" : "Egypt" },
                      { id: "germany", label: language === "ar" ? "ألمانيا" : "Germany" }
                    ].map((chip) => {
                      const isActive = selectedLocationFilter === chip.id;
                      return (
                        <button
                          key={chip.id}
                          onClick={() => setSelectedLocationFilter(chip.id)}
                          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase border transition-all ${
                            isActive
                              ? "bg-gold-accent/10 border-gold-accent/40 text-gold-accent font-semibold"
                              : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Archive List Grid */}
                  <div className="space-y-4">
                    {isLoadingSaints ? (
                      <div className="flex justify-center py-12">
                        <div className="flex items-center gap-2 font-mono text-xs text-gold-accent bg-gold-accent/5 px-4 py-2 rounded-full border border-gold-accent/10">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{language === "ar" ? "جاري جلب السجلات الرهبانية..." : "Loading monastic registers..."}</span>
                        </div>
                      </div>
                    ) : filteredSaintsList.length > 0 ? (
                      filteredSaintsList.map((saint) => (
                        <div
                          key={saint.id}
                          onClick={() => handleSelectSaint(saint)}
                          className="glass-panel rounded-xl p-3.5 flex gap-4 items-center border border-white/5 bg-gradient-to-r from-white/[0.01] to-black/40 hover:border-gold-accent/25 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          {/* Profile thumbnail with grayscale */}
                          <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 relative">
                            <img
                              src={saint.image}
                              alt={saint.name}
                              className="w-full h-full object-cover grayscale brightness-90"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-serif text-sm font-bold text-white group-hover:text-gold-accent truncate">
                                {saint.name}
                              </h3>
                              <span className="text-[9px] text-white/40 font-mono flex-shrink-0">
                                {saint.era}
                              </span>
                            </div>
                            <p className="text-[10px] text-gold-accent font-serif italic mt-0.5 truncate">
                              {saint.title}
                            </p>
                            <p className="text-[11px] text-white/50 line-clamp-2 mt-1 leading-relaxed">
                              {saint.subtitle}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono mt-2 pt-2 border-t border-white/5">
                              <MapPin className="w-3 h-3 text-gold-accent" />
                              <span className="truncate">{saint.location}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-white/40 text-xs">
                        {language === "ar" ? "لم نجد سجلات تطابق بحثك." : "No records matching your search."}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <Footer />
                </motion.div>
              )}

              {/* 3. CHURCHES TAB */}
              {currentTab === "churches" && (
                <motion.div
                  key="churches-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="px-4 py-6 space-y-6"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-primary block">
                      {language === "ar" ? "حج تفاعلي" : "Interactive Pilgrimage"}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      {language === "ar" ? "المساحات المقدسة | الكنائس" : "Sacred Spaces | Churches"}
                    </h2>
                    <p className="text-[10px] text-white/40 font-mono">
                      {language === "ar" ? "استكشف العمارة الروحية عبر الزمان" : "Explore spiritual architecture through history"}
                    </p>
                  </div>

                  {/* Map / Cathedral Placeholder Hero */}
                  <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10 group">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTCvTo0MKuZYY9GrdxNsGOve6pshDw59pi6xc0J3EfqEEhUWdZLTKeg2OAUM-_M0cOSWH3917auBQeTUVPkYsvztPrc_BcT_gsaDFPECYrm3Ymald-fpM00Tj_rxPwFLK6vQh38TjF7RD2PyQu2HnHCHrg42lzaPHwr2gChUssmRLRNL8V6W__kQ3lC6lAodXUx98z6aAsgOm2RoBKoHI_10pzkV2KNAEbx8ZgPkthO5LiQPYDBYLRUA" 
                      alt="Cathedral Interior" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
                    
                    {/* Interactive Marker Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 animate-pulse pointer-events-none">
                      <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 backdrop-blur-sm shadow-2xl">
                        <Compass className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/70">
                        {language === "ar" ? "انقر لبدء الرحلة" : "Click to Start"}
                      </span>
                    </div>
                  </div>

                  {/* Shrines list */}
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg font-bold text-gold-accent border-b border-white/5 pb-2">
                      {language === "ar" ? "مزارات مختارة" : "Selected Shrines"}
                    </h3>

                    <div className="space-y-4">
                      {/* Sanctuary Card 1 */}
                      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 bg-white/[0.01]">
                        <div className="h-44 relative">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuChyo78W3hb6ElmcUoNGBvAxkSBJJsfYwm4J043jvMXV86932DfNdiSD7ZG8F655jNRCTxEYN8aI7yunjtajKD3tm3qwEx2kwXNQIL3ExWbYtfMlpCYWAdvknX2T8RFa53LmZydJGGH7DMZCiW5bdffgYnpwKkJPgJSrwPQuyQfwQrZiFQ5kVRLaECCqy0Yu5Bcp8M_la_31jirQuXMwJoorEVXX0qqP_ZVpCsZKKxt_h6s-eo2s1bWLQ" 
                            alt="chapel" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif text-base font-bold text-white">
                            {language === "ar" ? "ملاذ الضوء الأبدي" : "Sanctuary of Eternal Light"}
                          </h4>
                          <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
                            {language === "ar" 
                              ? "هندسة معمارية تدمج بين الضوء السماوي والمواد الأرضية لتخلق فضاءً للصمت المطلق."
                              : "Architecture blending celestial light with earthly matter to create a space of absolute silence."}
                          </p>
                        </div>
                      </div>

                      {/* Sanctuary Card 2 */}
                      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 bg-white/[0.01]">
                        <div className="h-44 relative">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoFHbt31UHeDu6hDtpYFHuYWUAGock57LQ_XEdcHJcXCsdk2l15GVDaodyg5G7eum-OpUX84QokY4Exl0YNNtBgzJqzN-UgnSVc5KcuN6sMMk17fk4vGl_KTlb65fCic6UJBpHB71-DhJeLy2pbh_1uDXEbnHSEYvcS2V45tK3KvMrmLnr50BwOFySqdV1ZYWzlgTyUgKqc9vI9-sAy7VXZ_jW61Zt4Tvuz64bWvD7iPYJ4_dmWkN3Ag" 
                            alt="cliff church" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-serif text-base font-bold text-white">
                            {language === "ar" ? "كنيسة المجهول" : "Church of the Unknown"}
                          </h4>
                          <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
                            {language === "ar" 
                              ? "مكياج معبأ بالصخور والشموع يروي قصص الإيمان العميقة في أوقات الشدة والاضطهاد التاريخي."
                              : "A majestic stone altar carved into high cliffside caverns, preserving testimonies of faith in times of tribulations."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-5 text-center">
                    <div>
                      <span className="text-2xl font-serif font-bold text-primary block leading-none">20</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-mono block">
                        {language === "ar" ? "موقع مقدّس" : "Sacred Sites"}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-primary block leading-none">4</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-mono block">
                        {language === "ar" ? "دولة" : "Countries"}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <span className="text-2xl font-serif font-bold text-primary block leading-none">2M</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-mono block">
                        {language === "ar" ? "زائر سنوي" : "Annual Visitors"}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <span className="text-2xl font-serif font-bold text-primary block leading-none">35</span>
                      <span className="text-[9px] uppercase tracking-wider text-white/40 mt-1 font-mono block">
                        {language === "ar" ? "إرشاد روحي" : "Spiritual Guides"}
                      </span>
                    </div>
                  </div>

                  {/* Suggest a site box */}
                  <div className="glass-panel p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
                    <MapPin className="w-12 h-12 text-primary/10 absolute top-2 right-2" />
                    <h3 className="font-serif text-base font-bold text-white mb-2 relative z-10">
                      {language === "ar" ? "هل تعرف مساحة مقدسة تستحق التوثيق؟" : "Know a Sacred Space Worth Documenting?"}
                    </h3>
                    <p className="text-[11px] text-white/60 leading-relaxed mb-4 relative z-10">
                      {language === "ar" 
                        ? "ساهم في إثراء متحفنا الرقمي عبر اقتراح كنائس أو مواقع لها تاريخ روحي فريد."
                        : "Contribute to our digital museum registers by proposing churches or historic shrines with unique spiritual legacies."}
                    </p>
                    <button 
                      onClick={() => alert(language === "ar" ? "شكراً لمساهمتكم. تم تسجيل الاقتراح." : "Thank you. Your proposal has been recorded.")}
                      className="w-full bg-primary text-on-primary py-2.5 rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(242,202,80,0.3)] active:scale-95 transition-all"
                    >
                      {language === "ar" ? "اقترح موقعاً جديداً" : "Propose a New Site"}
                    </button>
                  </div>

                  {/* Footer */}
                  <Footer />
                </motion.div>
              )}

              {/* 4. TIMELINE TAB */}
              {currentTab === "timeline" && (
                <motion.div
                  key="timeline-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="px-4 py-6 space-y-8"
                >
                  <div className="text-center">
                    <span className="inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-widest uppercase mb-3">
                      {language === "ar" ? "رحلة عبر الزمن" : "Journey Through Time"}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      {language === "ar" ? "تسلسل الإيمان الزمني" : "Eternal Timeline of Faith"}
                    </h2>
                    <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed mt-1">
                      {language === "ar" 
                        ? "استكشف اللحظات المقدسة والتحولات الروحية التي شكلت مسيرتنا عبر العقود."
                        : "Explore holy moments and sacred transformations that shaped our faith journey through history."}
                    </p>
                  </div>

                  {/* Vertical Timeline Structure */}
                  <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute right-[19px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-transparent via-gold-accent to-transparent" />

                    {/* Timeline Era 1 */}
                    <div className="relative pl-12 mb-12">
                      {/* Active Circle Dot */}
                      <div className="absolute left-[3px] top-1.5 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 glow-pulse" />
                      
                      <div className="space-y-3">
                        <span className="text-[10px] text-primary font-mono font-bold tracking-widest uppercase block">
                          {language === "ar" ? "١٩١٠ - ١٩٢٥" : "1910 - 1925"}
                        </span>
                        
                        <div className="glass-panel p-4 rounded-xl border border-white/10 bg-white/[0.01]">
                          <h4 className="font-serif text-base font-bold text-primary mb-2">
                            {language === "ar" ? "البوتقة الأولى" : "The First Crucible"}
                          </h4>
                          <p className="text-[11px] text-white/60 leading-relaxed mb-4">
                            {language === "ar" 
                              ? "بداية عهد الصمود، حيث تجلى الإيمان في أبهى صوره وسط التحديات العظيمة. كانت هذه الحقبة بمثابة الاختبار الأول لجوهر الروح."
                              : "The early dawn of modern steadfastness under historical trials, testing the pure spiritual essence of the faithful."}
                          </p>
                          <div className="h-32 rounded-lg overflow-hidden border border-white/5">
                            <img 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbVbAbzdENkjcgu-w6RNsgkPOlhDR7z--V-7zilH1YsBpOdXowBqrlI8uGfq8uWT1hg3L3xHWS6XZCGgrv6D_tMaqn_gliA-48V6JsL_V-3piKD29jtVhXqEt6MvnF1e3CXkl63SNzSM7mI6YTTwpQvuKzp5513G7YMO9nDfgNaDe0gpCVsjaUrKye5QBk50r_hZLS2tGavXPH2RZNJ2OuAtCuSf7P_3AvI-TVg8iHSqQm8rE5W1Qp3w" 
                              alt="crucible" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Era 2 */}
                    <div className="relative pl-12 mb-12">
                      <div className="absolute left-[5px] top-1.5 w-3 h-3 bg-white/40 rounded-full" />
                      
                      <div className="space-y-3">
                        <span className="text-[10px] text-white/50 font-mono font-bold tracking-widest uppercase block">
                          {language === "ar" ? "١٩٤٠ - ١٩٦٠" : "1940 - 1960"}
                        </span>
                        
                        <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                          <h4 className="font-serif text-base font-bold text-secondary mb-2">
                            {language === "ar" ? "ظلال منتصف القرن" : "Mid-Century Shadows"}
                          </h4>
                          <p className="text-[11px] text-white/60 leading-relaxed mb-4">
                            {language === "ar" 
                              ? "فترة من التأمل العميق والبحث عن السكينة في عالم مضطرب. تميزت هذه المرحلة بالتحول نحو الجوهر الداخلي والعبادة الصامتة."
                              : "A time of deep contemplation, retreat, and seeking divine light through absolute silence in a troubled global setting."}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="h-24 rounded-lg overflow-hidden">
                              <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLlNTtPY-yQVTqEd2q_vOnwgfrC6h2xPeJFa9Me5nEjJSGiZLDOJf2ZKJfLunKaXXTLbVxeXxN8IuNk2J_0Dp31kYBnBcImoUFBfq8hsQ-awx_JFmNDorjmnpXKkzvwuWND0r_DD4xsR_gNy4BRepyvKn7nOW7Q8xYHhVqwX3Sb7WS2YsvzC-CVD065QnnNQvWD_HfUvrq1eYdkLtUuLsN2g9grNDZpGQ5uj19KAvjB0b1hLaB30aYvw" 
                                alt="shadows" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="h-24 rounded-lg overflow-hidden">
                              <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBAQ-uB6tRK3CMjRPlpyjBIt7y9oDkSjVlBBgBtZHG9smEx3JyAzWdRSVGeLn_zKgSNdHkMo0AYpYwffjNX6vsydOywAOyND3n43X3ccXVazetxNornB1C9YjJwYcJRgC3an4aliEJ1n5yaRTuIVtHlqnmmSfW3kRTIbJpZCPENFPAycir9k3vUBWze-dsf5VI9LVTnLty8-NSwnhFVOmT0qwBDGwjiAyRgNYwQpayLlycMSZIG8aj1Q" 
                                alt="beads" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Era 3 */}
                    <div className="relative pl-12">
                      <div className="absolute left-[3px] top-1.5 w-4 h-4 bg-sky-400 rounded-full ring-4 ring-sky-400/20 glow-pulse" />
                      
                      <div className="space-y-3">
                        <span className="text-[10px] text-sky-400 font-mono font-bold tracking-widest uppercase block">
                          {language === "ar" ? "١٩٨٠ - الآن" : "1980 - Present"}
                        </span>
                        
                        <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                          <h4 className="font-serif text-base font-bold text-sky-300 mb-2">
                            {language === "ar" ? "الآفاق الجديدة" : "New Horizons"}
                          </h4>
                          <p className="text-[11px] text-white/60 leading-relaxed mb-4">
                            {language === "ar" 
                              ? "عصر الانتشار والنهضة الرقمية، حيث تلتقي التقاليد القديمة مع رؤى المستقبل المشرقة. آفاق لا حدود لها من الإبداع الروحي."
                              : "The digital renaissance and expansion era, connecting ancestral devotion with celestial visual technologies."}
                          </p>
                          <div className="h-32 rounded-lg overflow-hidden">
                            <img 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8XG0xBf9DvGysqxiNktKnewKY25XM1pNiTAFL_InjrsKOGqoo0IPw9ujWj-Z4OWRbL6nsf7vQZ4nLiIJs86CIBDE4W3yN0Y3OGlh8at2n768Dl11JTPPD90Wl-H1EIBRc4uMuq3MlsFtWAQJ896g7z2Zi-jC-aMRwnKGbgAGHSmesGwKr0-KCARt_oKkwydmPiCH_7wzxsLb-n08jtsycoX2HcTa8EyiJrpGg3kMRwR16uLITSMPyUg" 
                              alt="future" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <Footer />
                </motion.div>
              )}

              {/* 5. ABOUT TAB */}
              {currentTab === "about" && (
                <motion.div
                  key="about-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="px-4 py-6 space-y-8"
                >
                  <div className="text-center">
                    <span className="inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-mono tracking-widest uppercase mb-3">
                      {language === "ar" ? "عن المشروع" : "About the Scriptorium"}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-white">
                      {language === "ar" ? "حفظ أصداء التضحية الأبدية" : "Preserving Echoes of Eternal Devotion"}
                    </h2>
                    <div className="w-8 h-[1px] bg-primary mx-auto mt-4" />
                  </div>

                  {/* Mission / رسالتنا */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-gold-accent" />
                      <h3 className="font-serif text-base font-bold text-gold-accent">
                        {language === "ar" ? "رسالتنا" : "Our Mission"}
                      </h3>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed text-justify">
                      {language === "ar" 
                        ? "نحن نسعى في مشروع \"قصص مقدسة\" إلى تكريم ذكرى الشهداء والقديسين الذين بذلوا أنفسهم في سبيل الحقيقة والعدالة. من خلال التوثيق الدقيق والبحث التاريخي، نعمل على إنشاء أرشيف رقمي يجسد روح الصمود والتضحية، ليكون منارة للأجيال القادمة."
                        : "In 'Sacred Stories', we seek to honor the memory of martyrs and saints who surrendered their earthly lives for justice, compassion, and the Gospel. Through academic and monastic hagiography, we curate an eternal sanctuary ledger."}
                    </p>
                  </div>

                  {/* Core Archives Category lists */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-2">
                      {language === "ar" ? "الأرشيف والأقسام" : "Core Archives"}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 bg-white/[0.01] p-2 flex flex-col gap-2">
                        <div className="h-24 rounded-lg overflow-hidden">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFQT-vJBOLcNcu0ozE_yINSp6yJQMXm0S8pWIt7I4mpCe2laiFjMKs5SbHhK7dVB9QK1dQiMG8G49GCKYXA5643iuOVeXWuan5Y4xl3z1wN826nuKmB1h3rfnL92VHKvYqGJ9N8HGqTrpEJOoLwf7ucej0mFEowLfmpHg2Sgm2P0eV6V54_VyhTMY30ZYxO3jtWeUarGXsxtDK6HsnAtrhkjWzRQhw287RjLLyKwnXBncy5rl4jNO9Rg" 
                            alt="oral" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-[11px] font-bold text-white text-center">
                          {language === "ar" ? "التقاليد الشفهية" : "Oral Traditions"}
                        </h4>
                      </div>

                      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 bg-white/[0.01] p-2 flex flex-col gap-2">
                        <div className="h-24 rounded-lg overflow-hidden">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLkgxB_0Ubjjhffv5gfcbT7rFyQRVriOLpwIIwYVjJYX-BucfeVKO6bmlgCojJ0Vcuqq82Ujs9cL2nzSHA3j-c_0ZOpYNio1N36ryjzZDYdrtsqYm_-YbroztC4d8k34V7qjBM2SOTmAa0Y7nvICROVHhdwzsFzIOKX-gusjrCyzBcCpypxTRk0gWpABmj9NxrSwme72I0uQvG8q5UR3RijVgo4v6gALjl0u6mDQozgQxSId8yZP0lbg" 
                            alt="document" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-[11px] font-bold text-white text-center">
                          {language === "ar" ? "الوثائق الأولية" : "Primary Documents"}
                        </h4>
                      </div>

                      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 bg-white/[0.01] p-2 flex flex-col gap-2">
                        <div className="h-24 rounded-lg overflow-hidden">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfJ4v8N4rmvfq4FIUZPdcOC3voTg5oDulg0NFPTE3zst_4H6EoTbgue4RF4KxgGsBO05rwsLZt8ijJVQe5Jwhqb4epkofqOgbkE9XI0Rtt6ffltnzMs5_VkjyyphOsNkyg9XrLV3SVVqeFhwva_H4km0KbEgmSn4ex4s_nYAP4gVXTRMzQWo-SuOUVouMKdMcfKji_kXN41z0JEHZFsZL501ghgsqYikSqpHie3Fw2ZkmLN1hE69dVVQ" 
                            alt="biographies" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-[11px] font-bold text-white text-center">
                          {language === "ar" ? "السير الذاتية" : "Biographies"}
                        </h4>
                      </div>

                      <div className="glass-panel rounded-xl overflow-hidden border border-white/5 bg-white/[0.01] p-2 flex flex-col gap-2">
                        <div className="h-24 rounded-lg overflow-hidden">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxkSbd8WzdPn3P_aAjZGBpigJ5LVPH1L56fw9lt4WDC3UrvbSfxw5_Ats7kYcvJTnQAuh_TVQDvSp2dpdXXSqcNRbTRqLvIYik9-pIKuSae3mCYdS5QO6fXM0THr_bhMfqy7ND9gCYUrlT4eHZQl7pV06WFWThl8W0pFx7SRYId0MhDYDN12O-spRDPgWEoRMqZ4rVFOwGVZiibSo7ioyUTAWPXVnyA9UcTuf-0P-zGJ910Ta1i-bVzw" 
                            alt="shrines" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-[11px] font-bold text-white text-center">
                          {language === "ar" ? "المواقع المقدسة" : "Sacred Sites"}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* How to Contribute */}
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg font-bold text-white">
                      {language === "ar" ? "كيفية المساهمة" : "How to Contribute"}
                    </h3>

                    <div className="border-r-2 border-primary/20 pr-6 mr-1.5 space-y-8 relative">
                      {/* Step 1 */}
                      <div className="relative">
                        <div className="absolute -right-[33px] top-1 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/10" />
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Send className="w-3.5 h-3.5 text-primary" />
                          <span>{language === "ar" ? "مشاركة الوثائق" : "Share Documents"}</span>
                        </h4>
                        <p className="text-[11px] text-white/50 mt-1 mb-3">
                          {language === "ar" ? "أرسل إلينا صوراً أو مسوحات ضوئية للوثائق التي تملكها." : "Submit digital manuscripts or testimony scans to the monastery registers."}
                        </p>
                        <button 
                          onClick={() => alert(language === "ar" ? "ميزة الرفع ستتوفر قريباً." : "Upload functionality arriving shortly.")}
                          className="bg-primary text-on-primary font-bold text-[10px] px-3 py-1.5 rounded active:scale-95 transition-all"
                        >
                          {language === "ar" ? "ابدأ التحميل" : "Begin Upload"}
                        </button>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <div className="absolute -right-[33px] top-1 w-3.5 h-3.5 rounded-full bg-primary/40" />
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span>{language === "ar" ? "التطوع في البحث" : "Volunteer in Research"}</span>
                        </h4>
                        <p className="text-[11px] text-white/50 mt-1 mb-3">
                          {language === "ar" ? "انضم إلى فريق المحققين التاريخيين والموثقين لدينا." : "Join our team of theological researchers and historical archivists."}
                        </p>
                        <button 
                          onClick={() => alert(language === "ar" ? "تم تسجيل طلب انضمامك." : "Volunteer application filed.")}
                          className="border border-white/10 text-white/80 font-bold text-[10px] px-3 py-1.5 rounded bg-white/5 active:scale-95 transition-all"
                        >
                          {language === "ar" ? "انضم إلينا" : "Join Scriptorium"}
                        </button>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <div className="absolute -right-[33px] top-1 w-3.5 h-3.5 rounded-full bg-primary/20" />
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Heart className="w-3.5 h-3.5 text-primary" />
                          <span>{language === "ar" ? "الدعم المالي" : "Financial Support"}</span>
                        </h4>
                        <p className="text-[11px] text-white/50 mt-1 mb-3">
                          {language === "ar" ? "ساعدنا في الحفاظ على استمرارية المشروع وتقنياته." : "Sustain the servers and preservation tools of this online monastery."}
                        </p>
                        <button 
                          onClick={() => alert(language === "ar" ? "ستتوفر بوابة التبرعات في البيئة النهائية." : "Donations portal opens in production deployment.")}
                          className="border border-primary/40 text-primary font-bold text-[10px] px-3 py-1.5 rounded bg-primary/5 active:scale-95 transition-all"
                        >
                          {language === "ar" ? "تبرع الآن" : "Sponsor Project"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <Footer />
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dim/95 backdrop-blur-lg border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] h-16 px-2 py-2 flex items-center justify-around pb-safe">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id && !selectedSaint;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSaint(null); // clear detail view to return back to corresponding tab index
                setCurrentTab(item.id);
              }}
              className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-lg transition-all ${
                isActive ? "text-gold-accent scale-105 font-bold" : "text-white/40 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-mono tracking-wider uppercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
