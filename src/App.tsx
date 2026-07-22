import React, { useState } from "react";
import Navbar from "./shared/components/Navbar";
import LiturgyPlayer from "./shared/components/LiturgyPlayer";
import MobileAppLayout from "./shared/components/MobileAppLayout";
import { SaintDetailModal, BespokePrayerModal } from "./shared/components/Modals";
import PilgrimAuth from "./features/auth/components/PilgrimAuth";
import { AppProviders } from "./app/providers/AppProviders";
import { useIsMobile } from "./shared/services/useIsMobile";
import ArchivistChat from "./features/chat/ArchivistChat";
import MainContent from "./features/navigation/MainContent";

function SanctuaryApp() {
  const isMobile = useIsMobile();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-canvas text-white/90 font-sans relative selection:bg-gold-accent/30 selection:text-white">
        <MobileAppLayout onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        <LiturgyPlayer />
        <SaintDetailModal />
        <BespokePrayerModal />
        <PilgrimAuth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-white/90 font-sans relative selection:bg-gold-accent/30 selection:text-white pb-24">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      
      {/* Dynamic Views */}
      <MainContent />

      {/* Floating Chat Drawer */}
      <ArchivistChat />

      {/* Persistent Audio Player & Modals */}
      <LiturgyPlayer />
      <SaintDetailModal />
      <BespokePrayerModal />
      <PilgrimAuth isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <SanctuaryApp />
    </AppProviders>
  );
}
