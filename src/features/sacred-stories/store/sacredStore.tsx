import React, { createContext, useContext, useState, ReactNode } from "react";
import { Saint, Church } from "../../../data";

export type TabId = "home" | "saints" | "churches" | "timeline" | "about" | "saint-details";

interface SacredState {
  currentTab: TabId;
  setCurrentTab: (tab: TabId) => void;
  selectedSaint: Saint | null;
  setSelectedSaint: (saint: Saint | null) => void;
  isPrayerModalOpen: boolean;
  setIsPrayerModalOpen: (open: boolean) => void;
  defaultSaintForPrayer: string;
  setDefaultSaintForPrayer: (name: string) => void;
  searchQueryPass: string;
  setSearchQueryPass: (query: string) => void;
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  isAmbientPlaying: boolean;
  setIsAmbientPlaying: (playing: boolean) => void;
}

const SacredContext = createContext<SacredState | undefined>(undefined);

export function SacredStoreProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<TabId>("home");
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [defaultSaintForPrayer, setDefaultSaintForPrayer] = useState("");
  const [searchQueryPass, setSearchQueryPass] = useState("");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [language, setLanguageState] = useState<"en" | "ar">(() => {
    const saved = localStorage.getItem("sacred_language");
    return (saved === "en" || saved === "ar") ? saved : "en";
  });
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("sacred_theme");
    return (saved === "dark" || saved === "light") ? saved : "dark";
  });

  const setLanguage = (lang: "en" | "ar") => {
    setLanguageState(lang);
    localStorage.setItem("sacred_language", lang);
  };

  const setTheme = (t: "dark" | "light") => {
    setThemeState(t);
    localStorage.setItem("sacred_theme", t);
  };

  // Sync HTML elements for dir and dark/light classes
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Set text direction
    if (language === "ar") {
      root.setAttribute("dir", "rtl");
      root.setAttribute("lang", "ar");
    } else {
      root.setAttribute("dir", "ltr");
      root.setAttribute("lang", "en");
    }
  }, [language]);

  React.useEffect(() => {
    const root = document.documentElement;
    
    // Set theme classes
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [theme]);

  return (
    <SacredContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedSaint,
        setSelectedSaint,
        isPrayerModalOpen,
        setIsPrayerModalOpen,
        defaultSaintForPrayer,
        setDefaultSaintForPrayer,
        searchQueryPass,
        setSearchQueryPass,
        language,
        setLanguage,
        theme,
        setTheme,
        isAmbientPlaying,
        setIsAmbientPlaying,
      }}
    >
      {children}
    </SacredContext.Provider>
  );
}

export function useSacredStore() {
  const context = useContext(SacredContext);
  if (!context) {
    throw new Error("useSacredStore must be used within a SacredStoreProvider");
  }
  return context;
}
