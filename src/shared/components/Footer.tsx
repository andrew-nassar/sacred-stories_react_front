import React, { useState } from "react";
import { useSacredStore } from "../store/sacredStore";
import { translations } from "../translations/translations";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Mail, X } from "lucide-react";

export default function Footer() {
  const { setCurrentTab, language } = useSacredStore();
  const t = translations[language];

  // Modals inside the footer for unmapped sections to keep UI polished
  const [activeModal, setActiveModal] = useState<"donate" | "contact" | null>(null);

  // Translations for Footer
  const footerText = {
    en: {
      archives: "Archives",
      liturgies: "Liturgies",
      donate: "Donate",
      contact: "Contact",
      motto: "Built in eternal memory.",
      donateTitle: "Sacred Almsgiving",
      donateDesc: "Your support preserves the deep records of martyrs and saints for generations to come. This digital sanctuary is maintained entirely through modest pilgrim contributions.",
      donateMethod: "Support options will be available upon production deployment.",
      contactTitle: "Sacred Contact",
      contactDesc: "Do you have historical logs, martyr testimonies, or theological records you would like to submit to the scriptorium?",
      contactInfo: "Reach out to our monastic archival team at",
      close: "Close"
    },
    ar: {
      archives: "الأرشيف",
      liturgies: "الليتورجيا",
      donate: "تبرع",
      contact: "اتصل بنا",
      motto: "صُنع للذكرى الأبدية.",
      donateTitle: "الصدقة المقدسة",
      donateDesc: "دعمكم يحفظ السجلات العميقة للشهداء والقديسين للأجيال القادمة. يتم الحفاظ على هذا المزار الرقمي بالكامل من خلال مساهمات الحجاج المتواضعة.",
      donateMethod: "ستتوفر خيارات الدعم عند النشر النهائي للإنتاج.",
      contactTitle: "اتصل بنا",
      contactDesc: "هل لديك وثائق تاريخية، أو شهادات شهداء، أو سجلات لاهوتية ترغب في تقديمها إلى المكتبة؟",
      contactInfo: "تواصل مع فريق الأرشفة الرهباني على",
      close: "إغلاق"
    }
  }[language];

  const handleLinkClick = (link: string) => {
    if (link === "archives") {
      setCurrentTab("saints");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link === "liturgies") {
      setCurrentTab("churches");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (link === "donate") {
      setActiveModal("donate");
    } else if (link === "contact") {
      setActiveModal("contact");
    }
  };

  return (
    <footer className="w-full bg-black/60 border-t border-white/5 py-16 px-6 md:px-12 relative z-20 text-center flex flex-col items-center justify-center">
      {/* Dynamic atmospheric ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] rounded-full bg-gold-accent/5 blur-[80px] pointer-events-none" />

      {/* Brand Label */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-gold-accent select-none">
          {t.appName}
        </h3>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent mt-2" />
      </div>

      {/* Navigation Row */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8">
        <button
          onClick={() => handleLinkClick("archives")}
          className="text-white/60 hover:text-gold-accent font-mono text-xs tracking-widest uppercase transition-colors duration-300"
        >
          {footerText.archives}
        </button>
        <button
          onClick={() => handleLinkClick("liturgies")}
          className="text-white/60 hover:text-gold-accent font-mono text-xs tracking-widest uppercase transition-colors duration-300"
        >
          {footerText.liturgies}
        </button>
        <button
          onClick={() => handleLinkClick("donate")}
          className="text-white/60 hover:text-gold-accent font-mono text-xs tracking-widest uppercase transition-colors duration-300"
        >
          {footerText.donate}
        </button>
        <button
          onClick={() => handleLinkClick("contact")}
          className="text-white/60 hover:text-gold-accent font-mono text-xs tracking-widest uppercase transition-colors duration-300"
        >
          {footerText.contact}
        </button>
      </div>

      {/* Copyright Line */}
      <p className="text-white/40 font-mono text-[10px] md:text-xs tracking-wider">
        © 2024 {t.appName}. {footerText.motto}
      </p>

      {/* Modals for Footer actions */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-gradient-to-b from-canvas to-black border border-gold-accent/25 rounded-xl overflow-hidden shadow-2xl p-6 relative"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {activeModal === "donate" ? (
                <div className="text-center pt-4">
                  <div className="w-12 h-12 rounded-full bg-gold-accent/10 border border-gold-accent/30 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-5 h-5 text-gold-accent" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-white mb-2">
                    {footerText.donateTitle}
                  </h4>
                  <p className="text-white/60 text-xs leading-relaxed mb-6">
                    {footerText.donateDesc}
                  </p>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-gold-accent/80 font-mono text-[10px] tracking-wider uppercase">
                    {footerText.donateMethod}
                  </div>
                </div>
              ) : (
                <div className="text-center pt-4">
                  <div className="w-12 h-12 rounded-full bg-gold-accent/10 border border-gold-accent/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-5 h-5 text-gold-accent" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-white mb-2">
                    {footerText.contactTitle}
                  </h4>
                  <p className="text-white/60 text-xs leading-relaxed mb-4">
                    {footerText.contactDesc}
                  </p>
                  <p className="text-white/40 text-[11px] mb-6">
                    {footerText.contactInfo}
                    <span className="block text-gold-accent font-mono text-xs mt-1.5 font-semibold select-all">
                      scribe@sacredstories.org
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded bg-gold-accent text-canvas hover:bg-white text-xs font-mono tracking-widest uppercase transition-all"
                >
                  {footerText.close}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
