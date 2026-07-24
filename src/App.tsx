import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./shared/components/Navbar";
import LiturgyPlayer from "./shared/components/LiturgyPlayer";
import MobileAppLayout from "./shared/components/MobileAppLayout";
import { BespokePrayerModal } from "./shared/components/Modals";
import { AppProviders } from "./app/providers/AppProviders";
import { useIsMobile } from "./shared/services/useIsMobile";
import ArchivistChat from "./features/chat/ArchivistChat";
import MainContent from "./features/navigation/MainContent";
import { LoginPage, RegisterPage , ResendVerificationPage } from "./features/auth"; // استيراد صفحات الدخول والتسجيل المستقلة

function SanctuaryApp() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // دالة تحويل المستخدم إلى صفحة تسجيل الدخول المستقلة
  const handleOpenAuth = () => {
    navigate("/login");
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-canvas text-white/90 font-sans relative selection:bg-gold-accent/30 selection:text-white">
        <MobileAppLayout onOpenAuthModal={handleOpenAuth} />
        <LiturgyPlayer />
        <BespokePrayerModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-white/90 font-sans relative selection:bg-gold-accent/30 selection:text-white pb-24">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <Navbar onOpenAuthModal={handleOpenAuth} />
      
      {/* Dynamic Views */}
      <MainContent />

      {/* Floating Chat Drawer */}
      <ArchivistChat />

      {/* Persistent Audio Player & Modals */}
      <LiturgyPlayer />
      <BespokePrayerModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          {/* الصفحة الرئيسية للترقية والتصفح */}
          <Route path="/*" element={<SanctuaryApp />} />

          {/* صفحة تسجيل الدخول كمكون/صفحة مستقلة بالكامل */}
          <Route path="/login" element={<LoginPage />} />

          {/* صفحة إنشاء حساب مستقلة بالكامل */}
          <Route path="/register" element={<RegisterPage />} />
          {/* صفحة إعادة إرسال البريد الإلكتروني للتحقق */}
          <Route path="/resend-verification" element={<ResendVerificationPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}