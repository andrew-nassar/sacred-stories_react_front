import React from "react";
import { Search, User, Sparkles, Compass } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  onOpenReflectionModal: () => void;
  onSearchIconClick: () => void;
}

export default function Navbar({ currentTab, setTab, onOpenReflectionModal, onSearchIconClick }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "saints", label: "Saints" },
    { id: "churches", label: "Churches" },
    { id: "timeline", label: "Timeline" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-6 py-4 md:px-12 flex items-center justify-between">
      {/* Logo */}
      <div 
        onClick={() => setTab("home")}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <Compass className="w-5 h-5 text-gold-accent group-hover:rotate-45 transition-transform duration-500" />
        <span className="font-serif text-xl md:text-2xl font-bold tracking-wide text-gold-accent select-none">
          Sacred Stories
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`relative text-sm tracking-widest uppercase font-mono transition-colors duration-300 py-1 ${
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
      <div className="flex items-center gap-4">
        {/* Search Toggle */}
        <button
          onClick={onSearchIconClick}
          className="p-2 rounded-full text-white/70 hover:text-gold-accent hover:bg-white/5 transition-all duration-300"
          title="Search archives"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Dynamic Prayer/Reflection Assistant Trigger */}
        <button
          onClick={onOpenReflectionModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-accent/20 bg-gold-accent/5 hover:bg-gold-accent/10 hover:border-gold-accent/40 text-gold-accent text-xs font-mono tracking-wider transition-all duration-300"
          title="Daily reflection & bespoke prayers"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">BESPOKE PRAYER</span>
        </button>

        {/* Profile / Spiritual Companion */}
        <button
          onClick={onOpenReflectionModal}
          className="p-2 rounded-full text-white/70 hover:text-gold-accent hover:bg-white/5 transition-all duration-300"
          title="Archival Journal"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
