import React, { ReactNode } from "react";
import { AuthProvider } from "../../features/auth/store/authStore";
import { SacredStoreProvider } from "../store/sacredStore";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SacredStoreProvider>
        {children}
      </SacredStoreProvider>
    </AuthProvider>
  );
}
