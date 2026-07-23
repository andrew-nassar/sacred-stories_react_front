import React from "react";
import { Search, User, Sparkles, Compass, Sun, Moon } from "lucide-react";
import { motion } from "motion/react";
import { useSacredStore, TabId } from "../../shared/store/sacredStore";
import { translations } from "../../shared/translations/translations";

interface NavbarProps {
  onOpenAuthModal: () => void;
}

export default function Navbar({ onOpenAuthModal }: NavbarProps) {
  const { currentTab, setCurrentTab, setIsPrayerModalOpen, setSearchQueryPass, language, setLanguage, theme, setTheme } = useSacredStore();
  const t = translations[language];

  const navItems: { id: TabId; label: string }[] = [
    { id: "home", label: t.home },
    { id: "saints", label: t.saints },
    { id: "churches", label: t.churches },
    { id: "timeline", label: t.timeline },
    { id: "about", label: t.about },
  ];

  const handleSearchClick = () => {
    setCurrentTab("saints");
    setSearchQueryPass("");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 sm:px-6 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between">
      {/* Logo */}
      <div 
        onClick={() => setCurrentTab("home")}
        className="flex items-center gap-1.5 md:gap-2 cursor-pointer group shrink-0"
      >
        <Compass className="w-4 h-4 md:w-5 md:h-5 text-gold-accent group-hover:rotate-45 transition-transform duration-500" />
        <span className="font-serif text-lg md:text-xl lg:text-2xl font-bold tracking-wide text-gold-accent select-none">
          {t.appName}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center md:gap-3 lg:gap-6 xl:gap-8 shrink-0">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`relative text-[11px] lg:text-sm tracking-wider lg:tracking-widest uppercase font-mono transition-colors duration-300 py-1 ${
                isActive ? "text-gold-accent font-medium" : "text-white/60 hover:text-white"
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeNavLine"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 shrink-0">
        {/* Language Selector */}
        <button
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          className="px-2 py-1 rounded hover:text-gold-accent hover:bg-white/5 transition-all duration-300 font-mono text-[10px] md:text-xs font-semibold border border-white/10 shrink-0"
          title={language === "en" ? "Switch to Arabic" : "التغيير إلى الإنجليزية"}
        >
          {language === "en" ? "العربية" : "EN"}
        </button>

        {/* Theme Toggler */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-1.5 md:p-2 rounded-full text-white/70 hover:text-gold-accent hover:bg-white/5 transition-all duration-300 shrink-0"
          title={theme === "dark" ? t.lightMode : t.darkMode}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
        </button>

        {/* Search Toggle */}
        <button
          onClick={handleSearchClick}
          className="p-1.5 md:p-2 rounded-full text-white/70 hover:text-gold-accent hover:bg-white/5 transition-all duration-300 shrink-0"
          title={t.searchArchives}
        >
          <Search className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Dynamic Prayer/Reflection Assistant Trigger */}
        <button
          onClick={() => setIsPrayerModalOpen(true)}
          className="flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-1.5 rounded-full border border-gold-accent/20 bg-gold-accent/5 hover:bg-gold-accent/10 hover:border-gold-accent/40 text-gold-accent text-xs font-mono tracking-wider transition-all duration-300 shrink-0"
          title={t.bespokePrayer}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden lg:inline uppercase">{t.bespokePrayer}</span>
        </button>

        {/* Profile / Spiritual Companion */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-1 p-1.5 md:p-2 rounded-full text-white/70 hover:text-gold-accent hover:bg-white/5 transition-all duration-300 shrink-0"
          title="Archival Journal"
        >
          <User className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </header>
  );
}