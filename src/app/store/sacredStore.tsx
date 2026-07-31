import React, { createContext, useContext, useState, ReactNode } from "react";
import { Saint } from "../../data";

export type TabId = "home" | "saints" | "churches" | "timeline" | "about" | "saint-details";

// User shape based on your Login response
export interface CurrentUser {
  userName: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}

interface SacredState {
  currentTab: TabId;
  setCurrentTab: (tab: TabId) => void;
  selectedSaint: Saint | null;
  setSelectedSaint: (saint: Saint | null) => void;
  selectedSaintId: string | null;
  setSelectedSaintId: (id: string | null) => void;
  previousTab: TabId;
  setPreviousTab: (tab: TabId) => void;
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
  // --- Auth state added ---
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
}

const SacredContext = createContext<SacredState | undefined>(undefined);

export function SacredStoreProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTabState] = useState<TabId>("home");
  const [previousTab, setPreviousTab] = useState<TabId>("home");
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [selectedSaintId, setSelectedSaintId] = useState<string | null>(null);

  // Auth State Management
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("accessToken") || !!localStorage.getItem("token");
  });
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const setCurrentTab = (tab: TabId) => {
    setCurrentTabState((prev) => {
      if (prev !== "saint-details") {
        setPreviousTab(prev);
      }
      return tab;
    });
  };

  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [defaultSaintForPrayer, setDefaultSaintForPrayer] = useState("");
  const [searchQueryPass, setSearchQueryPass] = useState("");
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [language, setLanguageState] = useState<"en" | "ar">(() => {
    const saved = localStorage.getItem("sacred_language");
    return saved === "en" || saved === "ar" ? saved : "en";
  });
  const [theme, setThemeState] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("sacred_theme");
    return saved === "dark" || saved === "light" ? saved : "dark";
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
        selectedSaintId,
        setSelectedSaintId,
        previousTab,
        setPreviousTab,
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
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
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