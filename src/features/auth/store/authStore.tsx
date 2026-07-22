import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PilgrimUser {
  name: string;
  baptismalName?: string;
  spiritualFocus?: string;
  isRegistered: boolean;
}

interface AuthState {
  user: PilgrimUser;
  registerPilgrim: (name: string, baptismalName?: string, spiritualFocus?: string) => void;
  clearPilgrim: () => void;
}

const defaultUser: PilgrimUser = {
  name: "Contemplative Pilgrim",
  isRegistered: false,
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PilgrimUser>(defaultUser);

  useEffect(() => {
    const saved = localStorage.getItem("sacred_stories_pilgrim");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse pilgrim session");
      }
    }
  }, []);

  const registerPilgrim = (name: string, baptismalName?: string, spiritualFocus?: string) => {
    const newUser: PilgrimUser = {
      name,
      baptismalName,
      spiritualFocus,
      isRegistered: true,
    };
    setUser(newUser);
    localStorage.setItem("sacred_stories_pilgrim", JSON.stringify(newUser));
  };

  const clearPilgrim = () => {
    setUser(defaultUser);
    localStorage.removeItem("sacred_stories_pilgrim");
  };

  return (
    <AuthContext.Provider value={{ user, registerPilgrim, clearPilgrim }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthStore() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return context;
}
