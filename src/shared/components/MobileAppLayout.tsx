import React, { useState } from "react";
import { 
  Compass, Search, MapPin, Calendar, Info, Sun, Moon, 
  Volume2, Menu, X, Heart
} from "lucide-react";
import { useSacredStore, TabId } from "../../shared/store/sacredStore";
import { translations } from "../../shared/translations/translations";
import { motion, AnimatePresence } from "motion/react";
import Footer from "./Footer";
import HeroSection from "../../features/home/HeroSection";
import FeaturedLives from "../../features/home/FeaturedLives";
import SaintsExplorer from "../../features/saints/SaintsExplorer";
import ChurchesSection from "../../features/churches/ChurchesSection";
import TimelineSection from "../../features/timeline/TimelineSection";
import AboutSection from "../../features/about/AboutSection";
import SaintDetailsPage from "../../features/saint-details/SaintDetailsPage";

interface MobileAppLayoutProps {
  onOpenAuthModal: () => void;
}

export default function MobileAppLayout({ onOpenAuthModal }: MobileAppLayoutProps) {
  const {
    currentTab,
    setCurrentTab,
    language,
    setLanguage,
    theme,
    setTheme,
    isAmbientPlaying,
    setIsAmbientPlaying
  } = useSacredStore();

  const t = translations[language];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems: { id: TabId; label: string; icon: any }[] = [
    { id: "home", label: language === "ar" ? "الرئيسية" : "Home", icon: Compass },
    { id: "saints", label: language === "ar" ? "الأرشيف" : "Archive", icon: Search },
    { id: "churches", label: language === "ar" ? "الكنائس" : "Churches", icon: MapPin },
    { id: "timeline", label: language === "ar" ? "الزمن" : "Timeline", icon: Calendar },
    { id: "about", label: language === "ar" ? "المشروع" : "About", icon: Info },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-white/90 pb-28 selection:bg-gold-accent/30 selection:text-white">
      {/* Top Mobile AppBar */}
      <header className="sticky top-0 z-40 w-full glass-panel bg-surface-dim/80 backdrop-blur-xl border-b border-white/10 px-4 py-3.5 flex items-center justify-between h-16 [direction:ltr]">
        {/* Left/Right Brand Name dependent on Lang */}
        <div className={`flex items-center gap-2.5 ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}>
          <button onClick={() => setCurrentTab("home")} className="text-primary active:scale-95 transition-transform">
            <Compass className="w-5.5 h-5.5 text-gold-accent" />
          </button>
          <span className="font-serif text-lg font-bold tracking-tight text-gold-accent select-none">
            {language === "ar" ? "قصص مقدسة" : t.appName}
          </span>
        </div>

        {/* Action Controls Toggle Button */}
        <div className={`flex items-center gap-2.5 ${language === "ar" ? "flex-row-reverse" : "flex-row"}`}>
          {isAmbientPlaying && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-accent/10 border border-gold-accent/20 animate-pulse">
              <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-ping" />
              <span className="text-[9px] text-gold-accent font-mono font-medium tracking-wider uppercase">LITURGY</span>
            </div>
          )}

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-gold-accent/40 text-white hover:text-gold-accent active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            title={language === "ar" ? "القائمة والإعدادات" : "Menu & Settings"}
          >
            <Menu className="w-5 h-5 text-gold-accent" />
          </button>
        </div>
      </header>

      {/* Drawer Menu Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Side Drawer Panel sliding from trailing side */}
            <motion.div
              initial={{ x: language === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className={`fixed top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#0c0f0f] border-white/10 flex flex-col shadow-2xl h-full p-6 text-white overflow-y-auto font-sans ${
                language === "ar" 
                  ? "left-0 border-r text-right [direction:rtl]" 
                  : "right-0 border-l text-left [direction:ltr]"
              }`}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-5.5 h-5.5 text-gold-accent" />
                  <span className="font-serif text-lg font-bold text-gold-accent">
                    {language === "ar" ? "قائمة المزار" : "LEX Sanctuary"}
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pilgrim Card */}
              <div className="mb-6">
                <div className="glass-panel border border-white/10 bg-white/[0.01] p-4 rounded-xl">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 block mb-1">
                    {language === "ar" ? "زائر عابر" : "Guest Traveler"}
                  </span>
                  <p className="text-white/60 text-xs mb-3 font-light">
                    {language === "ar" 
                      ? "سجل في الأرشيف المقدس لحفظ نياتك الروحية" 
                      : "Register to coordinate spiritual intentions."}
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full py-2.5 rounded-lg bg-gold-accent text-[#0c0f0f] font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#0c0f0f] transition-all cursor-pointer shadow-md shadow-gold-accent/10"
                  >
                    {language === "ar" ? "سجل كحاج" : "Register Pilgrim"}
                  </button>
                </div>
              </div>

              {/* Navigation Site Map */}
              <div className="space-y-2.5 mb-6">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 block mb-1.5">
                  {language === "ar" ? "أقسام المزار" : "Sanctuary Chambers"}
                </span>
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = currentTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all text-start cursor-pointer ${
                          isActive 
                            ? "bg-gold-accent/10 border-r-2 border-gold-accent text-gold-accent font-medium shadow-inner" 
                            : "hover:bg-white/5 text-white/70 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-sans tracking-wide font-medium uppercase">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Controls and Settings */}
              <div className="space-y-4 mb-6 pt-4 border-t border-white/5">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 block">
                  {language === "ar" ? "تخصيص المظهر والصوت" : "Customization & Atmosphere"}
                </span>

                {/* Liturgical Ambient Music Toggle Card */}
                <div className="p-3.5 rounded-xl border border-white/5 bg-black/30 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-gold-accent" />
                      <div>
                        <span className="text-xs font-serif font-bold text-white block">
                          {language === "ar" ? "موسيقى ليتورجية" : "Liturgy Chants"}
                        </span>
                        <span className="text-[10px] text-white/40 block">
                          {isAmbientPlaying 
                            ? (language === "ar" ? "عزف مستمر" : "Active Ambient") 
                            : (language === "ar" ? "صامت" : "Silent")}
                        </span>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => setIsAmbientPlaying(!isAmbientPlaying)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        isAmbientPlaying ? "bg-gold-accent" : "bg-white/10"
                      }`}
                    >
                      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-canvas transition-transform ${
                        isAmbientPlaying ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Equalizer animation only shown when playing */}
                  {isAmbientPlaying && (
                    <div className="flex items-end justify-center gap-1.5 h-6 bg-black/20 rounded py-1">
                      <span className="w-1 bg-gold-accent/80 rounded-t animate-[equalize_1.2s_ease-in-out_infinite] h-4" />
                      <span className="w-1 bg-gold-accent/80 rounded-t animate-[equalize_0.8s_ease-in-out_infinite_0.2s] h-2" />
                      <span className="w-1 bg-gold-accent/80 rounded-t animate-[equalize_1.5s_ease-in-out_infinite_0.4s] h-5" />
                      <span className="w-1 bg-gold-accent/80 rounded-t animate-[equalize_1s_ease-in-out_infinite_0.1s] h-3" />
                      <span className="w-1 bg-gold-accent/80 rounded-t animate-[equalize_1.3s_ease-in-out_infinite_0.3s] h-4" />
                    </div>
                  )}
                </div>

                {/* Language Select Pill */}
                <div className="flex items-center justify-between p-1 bg-black/30 border border-white/5 rounded-lg">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 py-1.5 rounded text-center text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      language === "en" ? "bg-gold-accent text-canvas" : "text-white/60 hover:text-white"
                    }`}
                  >
                    ENGLISH
                  </button>
                  <button
                    onClick={() => setLanguage("ar")}
                    className={`flex-1 py-1.5 rounded text-center text-xs font-serif font-bold transition-all cursor-pointer ${
                      language === "ar" ? "bg-gold-accent text-canvas" : "text-white/60 hover:text-white"
                    }`}
                  >
                    العربية
                  </button>
                </div>

                {/* Theme Selector Pill */}
                <div className="flex items-center justify-between p-1 bg-black/30 border border-white/5 rounded-lg">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 py-1.5 rounded text-center text-[10px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "dark" ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30" : "text-white/60"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>DARK</span>
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 py-1.5 rounded text-center text-[10px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      theme === "light" ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30" : "text-white/60"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>LIGHT</span>
                  </button>
                </div>
              </div>

              {/* Spiritual Quote Footer */}
              <div className="mt-auto pt-6 border-t border-white/5 text-center">
                <Heart className="w-4 h-4 text-gold-accent/20 mx-auto mb-2" />
                <p className="text-[10px] text-white/40 italic font-serif leading-relaxed max-w-[200px] mx-auto">
                  {language === "ar" 
                    ? "«الحب وحده هو القوة المبدعة، وبذار الإيمان لا تفنى أبداً.»" 
                    : "“Love alone is the creative force, and the seeds of faith never perish.”"}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {/* Tab Views */}
          {currentTab === "saint-details" ? (
            <motion.div
              key="saint-details-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="px-0 py-0"
            >
              <SaintDetailsPage />
            </motion.div>
          ) : (
            <div className="px-4 py-6">
              <AnimatePresence mode="wait">
                {currentTab === "home" && (
                  <motion.div
                    key="home-subview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    <HeroSection />
                    <FeaturedLives />
                    <Footer />
                  </motion.div>
                )}

                {currentTab === "saints" && (
                  <motion.div
                    key="saints-subview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <SaintsExplorer />
                  </motion.div>
                )}

                {currentTab === "churches" && (
                  <motion.div
                    key="churches-subview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <ChurchesSection />
                  </motion.div>
                )}

                {currentTab === "timeline" && (
                  <motion.div
                    key="timeline-subview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <TimelineSection />
                  </motion.div>
                )}

                {currentTab === "about" && (
                  <motion.div
                    key="about-subview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <AboutSection />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav bar for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 glass-panel bg-surface-dim/90 border-t border-white/10 flex items-center justify-around px-2 z-40 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.5)]">
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl transition-all ${
                isActive ? "text-gold-accent font-medium scale-110" : "text-white/40 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] tracking-wide font-sans font-medium uppercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}