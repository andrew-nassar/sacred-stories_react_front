import React, { ReactNode } from "react";
import { SacredStoreProvider } from "../store/sacredStore";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SacredStoreProvider>
      {children}
    </SacredStoreProvider>
  );
}