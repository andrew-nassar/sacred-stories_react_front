import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SAINTS_DATA } from "../../data";
import { useSacredStore } from "../../shared/store/sacredStore";
import { HeroSection, BiographySection, SacredTimeline, LocationShowcase, SacredGallery } from "./LexComponents";
import { getSacredStoryById } from "./api/saintDetailsApi";

// Enrichment database fallback
const ENRICHED_DB: Record<string, any> = {
  "maximilian-kolbe": {
    quoteText: {
      ar: "«الحب وحده هو القوة المبدعة»",
      en: "“Only love is a creative force. Hatred is not creative.”"
    },
    bioTitle: {
      ar: "ندور الطفولة ورؤية التاجين",
      en: "Childhood Vows and the Two Crowns"
    },
    bioParagraphs: {
      ar: [
        "في سن العاشرة، ظهرت له العذراء مريم حاملة تاجين: الأبيض يرمز للطهارة والأحمر للاستشهاد...",
        "أسس «كتيبة مريم الكلية الطهارة» لنشر التكريس المريمي حول العالم..."
      ],
      en: [
        "At the age of ten, the Virgin Mary appeared to him in a vision...",
        "He founded the 'Militia Immaculatae' to spread devotion..."
      ]
    },
    timeline: [
      {
        year: "١٨٩٤",
        title: { ar: "الميلاد في بولندا", en: "Birth in Poland" },
        desc: { ar: "ولد لعائلة متدينة مكرسة للفضيلة والتقوى والخدمة البسيطة.", en: "Born into a deeply devout family..." }
      }
    ],
    exhibits: [],
    stories: {
      archive: { ar: "", en: "" },
      liturgy: { ar: "", en: "" },
      panel: { ar: "", en: "" },
      chapel: { ar: "", en: "" }
    },
    monastery: {
      name: { ar: "", en: "" },
      desc: { ar: "", en: "" },
      locationText: { ar: "", en: "" },
      image: ""
    }
  }
};

function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function SaintDetailsPage() {
  const {
    selectedSaint,
    setSelectedSaint,
    selectedSaintId,
    setSelectedSaintId,
    setCurrentTab,
    previousTab,
    language,
    setIsPrayerModalOpen,
    setDefaultSaintForPrayer,
    isAmbientPlaying,
    setIsAmbientPlaying
  } = useSacredStore();

  const [activeStoryTab, setActiveStoryTab] = useState<"archive" | "liturgy" | "panel" | "chapel">("archive");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSaint && !selectedSaintId) {
      setSelectedSaintId(selectedSaint.id);
    }
  }, [selectedSaint, selectedSaintId, setSelectedSaintId]);

  useEffect(() => {
    if (!selectedSaintId) return;

    if (selectedSaint && selectedSaint.id === selectedSaintId && selectedSaint.biography && selectedSaint.reflection) {
      return;
    }

    let isMounted = true;
    const loadSaint = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiData = await getSacredStoryById(selectedSaintId);
        if (isMounted) {
          const mappedSaint: any = {
            id: apiData.id,
            name: apiData.name,
            image: apiData.coverImage,
            quote: apiData.famousQuote,
            videoUrl: apiData.videoUrl,
            biography: apiData.biography,
            subtitle: apiData.famousQuote,
            era: "2026",
            location: apiData.burialPlace?.address || "",
            burialPlace: apiData.burialPlace,
            rawTimeline: apiData.timeline,
            sacredGallery: apiData.sacredGallery,
          };
          setSelectedSaint(mappedSaint);
        }
      } catch (err) {
        console.warn("Failed to fetch saint details from API, seeking local database", err);
        const local = SAINTS_DATA.find((s) => s.id === selectedSaintId);
        if (local) {
          if (isMounted) {
            setSelectedSaint(local);
          }
        } else {
          if (isMounted) {
            setError(language === "ar" ? "فشل تحميل تفاصيل القديس. يرجى المحاولة مرة أخرى." : "Failed to load saint details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSaint();

    return () => {
      isMounted = false;
    };
  }, [selectedSaintId, language, setSelectedSaint]);

  const handleBack = () => {
    setSelectedSaint(null);
    setSelectedSaintId(null);
    setCurrentTab(previousTab || "saints");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center text-white relative" id="saint-details-loading">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border border-gold-accent/20 flex items-center justify-center bg-gold-accent/5">
              <Loader2 className="w-8 h-8 text-gold-accent animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-gold-accent border-r-transparent border-b-transparent border-l-transparent animate-spin-slow" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-serif text-lg tracking-wider text-gold-accent animate-pulse">
              {language === "ar" ? "جاري فتح السجلات الروحية..." : "Unlocking Spiritual Registers..."}
            </p>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              {language === "ar" ? "استدعاء تاريخ الشهادة المباركة" : "Retrieving Holy Witness Testimony"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!selectedSaint && !selectedSaintId)) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center text-white/90 relative p-6 text-center" id="saint-details-error">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        <div className="glass-panel border border-burgundy-accent/20 bg-burgundy-dark/5 p-8 rounded-2xl max-w-md space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-burgundy-accent/15 border border-burgundy-accent/35 flex items-center justify-center mx-auto text-burgundy-accent text-xl font-bold font-serif">
            !
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-semibold text-white">
              {language === "ar" ? "حدث خطأ ما" : "Encountered an Issue"}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              {error || (language === "ar" ? "لم يتم تحديد أي قديس لعرض تفاصيله." : "No saint selected to view details.")}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="w-full px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs hover:bg-gold-accent hover:text-canvas hover:border-gold-accent transition-all duration-300 cursor-pointer"
          >
            {language === "ar" ? "العودة للأرشيف" : "Return to Archive"}
          </button>
        </div>
      </div>
    );
  }

  const youtubeId = selectedSaint ? (selectedSaint.videoUrl ? getYouTubeId(selectedSaint.videoUrl) : null) : null;
  const isEnriched = selectedSaint ? selectedSaint.id in ENRICHED_DB : false;
  const dbEnriched = (isEnriched && selectedSaint) ? ENRICHED_DB[selectedSaint.id] : null;

  const enriched = {
    quoteText: dbEnriched?.quoteText || {
      ar: selectedSaint?.quote || selectedSaint?.subtitle ? `«${selectedSaint.quote || selectedSaint.subtitle}»` : "«الحب وحده هو القوة المبدعة»",
      en: selectedSaint?.quote || selectedSaint?.subtitle ? `“${selectedSaint.quote || selectedSaint.subtitle}”` : "“Love alone is the creative force.”"
    },
    bioTitle: dbEnriched?.bioTitle || {
      ar: "مسيرة التقديس والشهادة العظمى",
      en: "The Way of Witness & Sacred Legacy"
    },
    bioParagraphs: dbEnriched?.bioParagraphs || {
      ar: [
        selectedSaint?.biography || "كان شهادة حية ورسولاً للأمل والمحبة في وجه المحن والاضطهاد والنزاعات الكبرى.",
        "تحولت حياتهم إلى منارة للأمل وتذكير روحي بمعدن التضحية الصادقة وقوة الإيمان في الأوقات الصعبة."
      ],
      en: [
        selectedSaint?.biography || "They stood as a living testament and messenger of hope and love in the face of great trials, persecution, and conflict.",
        "Their life transformed into a beacon of hope and a spiritual reminder of the essence of true sacrifice and unwavering faith."
      ]
    },
    timeline: selectedSaint?.rawTimeline && selectedSaint.rawTimeline.length > 0
      ? selectedSaint.rawTimeline.map((item: any) => ({
          year: item.date ? (item.date.match(/\d{4}/)?.[0] || item.date) : "١٩٠٠",
          title: { ar: item.title, en: item.title },
          desc: { ar: item.description, en: item.description }
        }))
      : dbEnriched?.timeline || [
          {
            year: selectedSaint?.era?.split("–")[0]?.trim() || "١٩٠٠",
            title: { ar: "الميلاد والبداية الروحية", en: "Birth and Spiritual Awakening" },
            desc: { ar: "ولد في عائلة متداعية وبدأ مسيرته الروحية مكرساً نفسه لخدمة الله والكلمة.", en: "Born into a humble background, starting his path dedicated to serving God's word." }
          }
        ],
    exhibits: selectedSaint?.sacredGallery && selectedSaint.sacredGallery.length > 0
      ? selectedSaint.sacredGallery.map((item: any) => ({
          image: item.imageUrl || selectedSaint.image,
          title: { ar: item.title, en: item.title },
          desc: { ar: item.title, en: item.title }
        }))
      : dbEnriched?.exhibits || [
          {
            image: selectedSaint?.image || "",
            title: { ar: "مقتنيات الشاهد المباركة", en: "Relics of the Blessed Witness" },
            desc: { ar: "أدوات ملموسة رافقت القديس في أيام خدمته وصلواته اليومية.", en: "Tangible items that accompanied the saint during active ministry and prayers." }
          }
        ],
    stories: dbEnriched?.stories || {
      archive: { ar: `يحتفظ الأرشيف بكافة التسجيلات والمقالات التي تعبر عن هويته الروحية.`, en: `The archive preserves all key documents.` },
      liturgy: { ar: "تميزت حياته بعلاقة وثيقة بالليتورجيا الإلهية.", en: "His life was heavily anchored in the divine liturgy." },
      panel: { ar: "تظهر لوحاته وأيقوناته المباركة نظرة مليئة بالحنان والرجاء.", en: "His holy icons display an aura filled with mercy and hope." },
      chapel: { ar: "مصلى تذكاري هادئ يرتاده المصلون لطلب شفاعته.", en: "A quiet memorial chapel visited by believers." }
    },
    monastery: selectedSaint?.burialPlace
      ? {
          name: { ar: selectedSaint.burialPlace.name, en: selectedSaint.burialPlace.name },
          desc: { ar: selectedSaint.burialPlace.description || "يمثل هذا المقام مزاراً مقدساً وباباً مفتوحاً للصلاة والتأمل الروحي.", en: selectedSaint.burialPlace.description || "This sacred shrine represents a door of prayer and spiritual reflection." },
          locationText: { ar: selectedSaint.burialPlace.address, en: selectedSaint.burialPlace.address },
          image: selectedSaint.burialPlace.coverImage || selectedSaint.image
        }
      : dbEnriched?.monastery || {
          name: { ar: `ضريح كنيسة ${selectedSaint?.name}`, en: `The Shrine Cathedral of ${selectedSaint?.name}` },
          desc: { ar: `يمثل هذا الضريح والمركز الروحي مزاراً مقدساً وباباً مفتوحاً للصلاة.`, en: `This spiritual center serves as a sacred shrine.` },
          locationText: { ar: selectedSaint?.location || "", en: selectedSaint?.location || "" },
          image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"
        }
  };

  const getSaintBadge = () => {
    if (!selectedSaint) return { ar: "", en: "" };
    if (selectedSaint.id === "oscar-salvador") return { ar: "شهيد معاصر", en: "Contemporary Martyr" };
    if (selectedSaint.id === "maximilian-kolbe") return { ar: "شهيد المحبة", en: "Martyr of Charity" };
    if (selectedSaint.id === "maria-shadows") return { ar: "شاهدة صامتة", en: "Silent Witness" };
    return { ar: "شاهد معاصر", en: "Contemporary Witness" };
  };

  // NOTE : there is a action about name not found
  const getSaintCustomName = () => {
    if (!selectedSaint) return { ar: "", en: "" };
    if (selectedSaint.id === "oscar-salvador") return { ar: "القديس أوسكار روميرو", en: "Saint Oscar Romero" };
    if (selectedSaint.id === "maximilian-kolbe") return { ar: "القديس مكسيميليان كولبي", en: "St. Maximilian Kolbe" };
    if (selectedSaint.id === "maria-shadows") return { ar: "القديسة ماريا وراء الظلال", en: "St. Maria of the Shadows" };
    return { ar: selectedSaint.name, en: selectedSaint.name };
  };

  const getSaintCustomQuote = () => {
    if (!selectedSaint) return { ar: "", en: "" };
    if (selectedSaint.id === "oscar-salvador") return { ar: "«لا تطمح لتمتلك المزيد، بل لتكون أكثر»", en: "“Aspire not to have more, but to be more.”" };
    if (selectedSaint.id === "maximilian-kolbe") return { ar: "«الحب وحده هو القوة المبدعة»", en: "“Only love is a creative force.”" };
    if (selectedSaint.id === "maria-shadows") return { ar: "«في صمت الروح يُحرس اللهيب الأزلي»", en: "“In the silence of the heart, the eternal flame is guarded.”" };
    return { ar: `«${selectedSaint.quote || selectedSaint.subtitle}»`, en: `“${selectedSaint.quote || selectedSaint.subtitle}”` };
  };

  const handleScrollToTimeline = () => {
    const el = document.getElementById("holy-path-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenPrayer = () => {
    if (selectedSaint) {
      setDefaultSaintForPrayer(selectedSaint.name);
      setIsPrayerModalOpen(true);
    }
  };

  if (!selectedSaint) return null;

  return (
    <div className="min-h-screen bg-canvas pb-24 text-white/90 selection:bg-gold-accent/30 selection:text-white" id="saint-details-page">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto pt-8 px-4 md:px-8 relative z-10 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gold-accent font-mono text-xs tracking-wider uppercase bg-white/5 border border-white/10 rounded-lg px-4 py-2 hover:bg-gold-accent/15 hover:border-gold-accent/40 hover:text-white transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "ar" ? "رجوع للأرشيف" : "Back to Archive"}</span>
        </button>

        <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] hidden md:inline">
          {language === "ar" ? "تفاصيل الشاهد المعاصر" : "Hagiographical Details"}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 space-y-16 relative z-10">
        <HeroSection
          image={selectedSaint.image}
          name={getSaintCustomName()[language]}
          badge={getSaintBadge()[language]}
          quote={getSaintCustomQuote()[language]}
          language={language}
          isAmbientPlaying={isAmbientPlaying}
          onToggleSermon={() => setIsAmbientPlaying(!isAmbientPlaying)}
          onScrollToTimeline={handleScrollToTimeline}
        />

        <BiographySection
          title={language === "ar" ? "السيرة الذاتية" : "Biography"}
          quote={enriched.quoteText[language]}
          author={getSaintCustomName()[language]}
          bioTitle={enriched.bioTitle[language]}
          bioParagraphs={enriched.bioParagraphs[language]}
          language={language}
        />

        {youtubeId && (
          <section className="space-y-8" id="video-section">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
                {language === "ar" ? "التسجيل المقدس والفيلم الوثائقي" : "Sacred Video & Documentary"}
              </h2>
              <div className="w-16 h-1 bg-gold-accent/60 mt-2 rounded" />
            </div>

            <div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={language === "ar" ? "الفيلم الوثائقي للحقائق" : "Sacred Story Documentary"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <div id="holy-path-section">
          <SacredTimeline
            title={language === "ar" ? "المسار المقدس" : "The Holy Path"}
            subtitle={language === "ar" ? "التسلسل الزمني لحياة بذلت من أجل الآخرين." : "Chronological sequence of a life spent for others."}
            timelineItems={enriched.timeline.map((item: any) => ({
              year: item.year,
              title: item.title[language],
              desc: item.desc[language]
            }))}
            language={language}
          />
        </div>

        <SacredGallery
          title={language === "ar" ? "معروضات مقدسة" : "Sacred Exhibits"}
          items={enriched.exhibits.map((ex: any) => ({
            image: ex.image,
            title: ex.title[language],
            desc: ex.desc[language]
          }))}
          prominentImage={selectedSaint.id === "oscar-salvador" ? "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"}
          language={language}
        />

        <LocationShowcase
          title={enriched.monastery.name[language]}
          desc={enriched.monastery.desc[language]}
          locationText={enriched.monastery.locationText[language]}
          image={enriched.monastery.image}
          language={language}
        />
        <section className="space-y-8" id="stories-section">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
              {language === "ar" ? "قصص مقدسة" : "Sacred Stories"}
            </h2>
            <p className="text-[11px] text-white/40 tracking-wider font-mono">
              {language === "ar" ? "* تتطرق القصص إلى تفاصيل روحية هامة" : "* Stories touch on vital spiritual details"}
            </p>
            <div className="w-16 h-[1px] bg-gold-accent/50 mx-auto mt-2" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { id: "archive", label: { ar: "الأرشيف", en: "The Archive" } },
              { id: "liturgy", label: { ar: "الليتورجيا", en: "The Liturgy" } },
              { id: "panel", label: { ar: "اللوح والأيقونات", en: "The Panel" } },
              { id: "chapel", label: { ar: "المصلى والمزار", en: "The Chapel" } }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStoryTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-full font-serif text-xs md:text-sm transition-all duration-300 border cursor-pointer ${
                  activeStoryTab === tab.id
                    ? "bg-gold-accent text-canvas border-gold-accent font-semibold shadow-md shadow-gold-accent/10"
                    : "bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab.label[language]}
              </button>
            ))}
          </div>

          <div className="max-w-2xl mx-auto min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-panel border border-gold-accent/15 bg-gold-accent/[0.01] p-6 md:p-8 rounded-xl text-center"
              >
                <p className="font-serif text-sm md:text-base leading-relaxed text-white/80 italic">
                  {enriched.stories[activeStoryTab][language]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        

        <div className="text-center py-6">
          <button
            onClick={handleOpenPrayer}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gold-accent text-canvas font-serif font-bold tracking-wider hover:bg-white hover:text-canvas transition-all duration-300 transform active:scale-95 cursor-pointer shadow-lg shadow-gold-accent/15"
          >
            <Sparkles className="w-5 h-5" />
            <span>{language === "ar" ? "طلب شفاعة وصلاة مخصصة" : "Seek Bespoke Litany"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}