import React from "react";
import { Play, Pause, Calendar, Award, Quote, MapPin, BookOpen, Compass } from "lucide-react";

// ==========================================
// 1. HeroSection Component (Image 1)
// ==========================================
interface HeroSectionProps {
  image: string;
  name: string;
  badge: string;
  quote: string;
  language: "ar" | "en";
  isAmbientPlaying: boolean;
  onToggleSermon: () => void;
  onScrollToTimeline: () => void;
}

export function HeroSection({
  image,
  name,
  badge,
  quote,
  language,
  isAmbientPlaying,
  onToggleSermon,
  onScrollToTimeline,
}: HeroSectionProps) {
  const isAr = language === "ar";
  
  return (
    <div id="lex-hero-section" className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row relative bg-black min-h-[400px] shadow-2xl [direction:ltr]">
      {/* Portrait image (Left side) */}
      <div className="w-full md:w-1/2 relative min-h-[320px] md:min-h-[480px] bg-black shrink-0 overflow-hidden group">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover md:grayscale md:group-hover:grayscale-0 contrast-125 brightness-95 absolute inset-0 transition-all duration-700 group-hover:scale-102 group-hover:contrast-115"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0c0f0f]" />
      </div>

      {/* Details metadata (Right side) */}
      <div className={`flex-1 p-5 sm:p-8 md:p-14 flex flex-col justify-center bg-[#0c0f0f] relative gap-4 sm:gap-6 text-start ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}>
        <div className="space-y-4">
          {/* Dynamic badge with accent line */}
          <div className="flex items-center gap-3">
            {isAr ? (
              <>
                <div className="w-10 h-[1.5px] bg-[#D4AF37]" />
                <span className="text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-wider">
                  {badge}
                </span>
              </>
            ) : (
              <>
                <span className="text-[#D4AF37] font-sans text-xs font-bold uppercase tracking-wider">
                  {badge}
                </span>
                <div className="w-10 h-[1.5px] bg-[#D4AF37]" />
              </>
            )}
          </div>

          {/* Large Title */}
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {name}
          </h1>

          {/* Poetic Quote/Subtitle */}
          <p className="text-white/90 font-serif italic text-sm md:text-base leading-relaxed max-w-xl">
            {quote}
          </p>
        </div>

        {/* Action buttons matching the photo */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <button
            onClick={onToggleSermon}
            className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#b8952b] text-black font-serif font-bold text-xs md:text-sm flex items-center gap-2 transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md shadow-[#D4AF37]/10"
          >
            {isAmbientPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{isAr ? "إيقاف العظة" : "Pause Sermon"}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{isAr ? "الاستماع إلى فيلم" : "Watch the Movie"}</span>
              </>
            )}
          </button>

          <button
            onClick={onScrollToTimeline}
            className="px-6 py-2.5 rounded-lg bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/90 font-sans text-xs md:text-sm transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            {isAr ? "عرض الجدول الزمني" : "View Timeline"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. BiographySection Component (Image 2)
// ==========================================
interface BiographySectionProps {
  title: string;
  quote: string;
  author: string;
  bioTitle: string;
  bioParagraphs: string[];
  language: "ar" | "en";
}

export function BiographySection({
  title,
  quote,
  author,
  bioTitle,
  bioParagraphs,
  language,
}: BiographySectionProps) {
  const isAr = language === "ar";
  
  return (
    <section id="lex-biography-section" className={`space-y-10 ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}>
      {/* Centered title with gold underline indicator */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-wide">
          {title}
        </h2>
        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mt-12">
        {/* Left card: Quote (Quote block) */}
        <div className="md:col-span-4 bg-[#0d0f0f] border border-white/5 p-5 sm:p-8 rounded-2xl flex flex-col justify-center text-center relative min-h-[200px] sm:min-h-[250px] shadow-lg group hover:border-[#D4AF37]/20 transition-all duration-300">
          <Quote className="w-12 sm:w-16 h-12 sm:h-16 text-[#D4AF37]/10 absolute -left-2 -top-2 transform -rotate-182" />
          <div className="relative z-10 space-y-4">
            <span className="text-[#D4AF37] font-serif text-4xl sm:text-5xl font-bold leading-none block mb-2 select-none">
              99
            </span>
            <p className="text-[#D4AF37] font-serif text-base sm:text-lg md:text-xl font-medium leading-relaxed italic px-2">
              {quote}
            </p>
            <p className="text-white/40 font-sans text-xs mt-4 sm:mt-6 uppercase tracking-wider block">
              {author}
            </p>
          </div>
        </div>

        {/* Right card: Structured bio paragraphs */}
        <div className="md:col-span-8 bg-[#0d0f0f] border border-white/5 p-5 sm:p-8 md:p-10 rounded-2xl flex flex-col justify-between shadow-lg relative group hover:border-white/10 transition-all duration-300 text-right">
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-3 justify-start">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              <span>{bioTitle}</span>
            </h3>

            <div className="space-y-4 text-white/80 font-sans text-sm md:text-base leading-relaxed text-justify font-light">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 3. SacredTimeline Component (Image 3)
// ==========================================
interface TimelineItem {
  year: string;
  title: string;
  desc: string;
}

interface SacredTimelineProps {
  title: string;
  subtitle: string;
  timelineItems: TimelineItem[];
  language: "ar" | "en";
}

export function SacredTimeline({
  title,
  subtitle,
  timelineItems,
  language,
}: SacredTimelineProps) {
  const isAr = language === "ar";
  
  return (
    <section id="lex-timeline-section" className={`space-y-12 ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}>
      {/* Centered Header */}
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-wide">
          {title}
        </h2>
        <p className="text-[#D4AF37] font-sans text-xs md:text-sm tracking-wider">
          {subtitle}
        </p>
        <div className="w-16 h-[1px] bg-[#D4AF37]/50 mx-auto mt-4" />
      </div>

      {/* Timeline Layout */}
      <div className="max-w-4xl mx-auto relative pl-8 pr-4 py-8 md:pl-0 md:pr-0">
        {/* Continuous vertical gold line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/40 to-transparent -translate-x-1/2" />

        <div className="space-y-16 relative z-10">
          {timelineItems.map((event, index) => {
            // Alternate side alignments on desktop
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-stretch ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Spacer block to alternate content sides on desktop */}
                <div className="hidden md:block md:w-1/2" />

                {/* Circular node marker on the vertical line */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center mt-3">
                  <div className="w-5 h-5 rounded-full bg-black border-2 border-[#D4AF37] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping absolute" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  </div>
                </div>

                {/* Content card */}
                <div className={`md:w-1/2 pl-8 md:pl-12 md:pr-12 text-start ${isAr ? "text-right" : "text-left"}`}>
                  <div className="group transition-all duration-300">
                    <span className="font-mono text-xl font-bold text-[#D4AF37] block mb-2 transition-all duration-300 group-hover:translate-x-1">
                      {event.year}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-md">
                      {event.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. LocationShowcase Component (Image 4)
// ==========================================
interface LocationShowcaseProps {
  sectionTitle?: string; // عنوان القسم الرئيسي (اختياري)
  title: string;
  desc: string;
  locationText: string;
  image: string;
  language: "ar" | "en";
}

export function LocationShowcase({
  sectionTitle,
  title,
  desc,
  locationText,
  image,
  language,
}: LocationShowcaseProps) {
  const isAr = language === "ar";
  const defaultHeader = isAr ? "المزار الروحي والمقام" : "Spiritual Sanctuary";

  return (
    <section 
      id="lex-location-showcase" 
      className={`space-y-8 ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}
    >
      {/* 1. Centered Section Title matching screenshot design */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-wide">
          {sectionTitle || defaultHeader}
        </h2>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
      </div>

      {/* 2. Location Content Card */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 bg-[#0d0f0f] p-5 sm:p-8 md:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          
          {/* Text & Metadata */}
          <div className="flex-1 space-y-6 text-start">
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest uppercase flex items-center gap-1.5 justify-start">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                {isAr ? "الموقع الجغرافي والمزار" : "The Sacred Sanctuary"}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white tracking-wide">
                {title}
              </h3>
            </div>

            <p className="text-white/70 font-sans text-xs md:text-sm leading-relaxed text-justify font-light">
              {desc}
            </p>

            {/* Location Badge */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-[#D4AF37]">
                <MapPin className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                <span>{locationText}</span>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="w-full md:w-5/12 aspect-[16/11] md:h-72 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 relative group shadow-lg shadow-black/40">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover md:grayscale brightness-90 md:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-[#D4AF37]/30 transition-all duration-500 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
// ==========================================
// 5. SacredGallery Component (Image 5)
// ==========================================
interface GalleryItem {
  image: string;
  title: string;
  desc: string;
}

interface SacredGalleryProps {
  title: string;
  items: GalleryItem[]; // Array of 3 exhibits (alb, mural, microphone)
  prominentImage: string; // The massive, prominent vertical image on the right (church lighted)
  language: "ar" | "en";
}

export function SacredGallery({
  title,
  items,
  prominentImage,
  language,
}: SacredGalleryProps) {
  const isAr = language === "ar";
  
  // Standard exhibits list fallback if none are provided
  const exhibitsList = items && items.length >= 3 ? items : [
    {
      image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300",
      title: isAr ? "الثوب الكهنوتي الملطخ بالدماء" : "Blood-Stained Alb",
      desc: isAr ? "الرداء الأبيض الذي كان يرتديه وقت اغتياله والملطخ بدم الشهادة الطاهرة." : "The white vestment worn during his celebration of Mass, stained with his blood."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmZ9XB-Mm_SVvlTg-ifcUGllOEncTfucUyq_hV2A_DVQBRyHa5gJlcfKT9u_L7NZ3paHw-1c2AEKAYJpgRAchh1vc5Ej4zBkWQB5owmjj4gQm2NMxfwE2CFIG_EVNir_z70awBFXU62ZxvSJkHCpxPyqRHNQ5NxfoDpoW4cf0gzcpV4uT4tZAGck88t39sf5IGzSdto-5Emmn6AQosu62ffKF9c8NPg-HIa_Jf1qdEfZspKWmuianFYg",
      title: isAr ? "ميكروفون إذاعة الحقيقة" : "Sermon Radio Microphone",
      desc: isAr ? "المذياع التاريخي الذي أطلق من خلاله صرخات الحق والدفاع عن الأرواح البريئة." : "The microphone through which he broadcasted pleas for justice."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZRXMPSghwq2rRJmJnuiIxxKGDBf7vDcqsxmrchvqbbYJdmK7oh__ibmyv67PO-MS-CAesiM5CGSEYH4vqzVNA8vPzz2VH4taWKLkqce-K30eEgwzm0ZmwEaUM56fyjZYF1obwnBBdyYidi5wwhAjDlyyk8M7n29oq-6PG_B-IRSnsxSDhwLO4xApfrJEoqvZOzwsWA0OPdTfudzrhXN_ThayNd57HCjky9cmmgscBFj6Q7Gs4T48f8Q",
      title: isAr ? "كتاب القداس ونظاراته" : "Mass Missal & Spectacles",
      desc: isAr ? "مقتنيات شخصية رافقته على المذبح وسقطت معه لحظة إطلاق الرصاص." : "Personal items that lay upon the altar, falling beside him."
    }
  ];

  return (
    <section id="lex-gallery-section" className={`space-y-8 ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}>
      {/* Title */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-wide">
          {title}
        </h2>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
      </div>

      {/* Bento Grid layout exactly matching Screenshot 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 items-stretch">
        
        {/* Left column (Stacked smaller items) */}
        <div className="flex flex-col gap-4">
          {/* Top wide horizontal card (e.g., Blood-stained alb) */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black group aspect-[16/10] shadow-md keep-white-text">
            <img
              src={exhibitsList[0].image}
              alt={exhibitsList[0].title}
              className="w-full h-full object-cover md:grayscale brightness-90 md:group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-start">
              <h4 className="font-serif text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                {exhibitsList[0].title}
              </h4>
              <p className="text-white/60 text-xs mt-1 leading-relaxed max-w-md font-light line-clamp-2">
                {exhibitsList[0].desc}
              </p>
            </div>
            <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-[#D4AF37]/20 transition-all duration-500 pointer-events-none" />
          </div>

          {/* Bottom row of 2 equal square items (e.g., Mural, Radio Microphone) */}
          <div className="grid grid-cols-2 gap-4">
            {exhibitsList.slice(1, 3).map((ex, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-black group aspect-square shadow-md keep-white-text"
              >
                <img
                  src={ex.image}
                  alt={ex.title}
                  className="w-full h-full object-cover md:grayscale brightness-90 md:group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-start">
                  <h4 className="font-serif text-xs md:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                    {ex.title}
                  </h4>
                  <p className="text-white/60 text-[10px] md:text-xs mt-1 leading-relaxed line-clamp-2 font-light">
                    {ex.desc}
                  </p>
                </div>
                <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-[#D4AF37]/20 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Massive prominent vertical image (Shrine/Church) */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black group min-h-[350px] md:min-h-full shadow-lg keep-white-text">
          <img
            src={prominentImage}
            alt={title}
            className="w-full h-full object-cover md:grayscale brightness-90 md:group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700 absolute inset-0"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-start z-10 pointer-events-none">
            <span className="font-mono text-[9px] text-[#D4AF37] tracking-[0.2em] uppercase block mb-1">
              {isAr ? "القداسة والخلود" : "Holiness & Eternity"}
            </span>
            <h4 className="font-serif text-lg md:text-xl font-bold text-white">
              {isAr ? "المقام والكاتدرائية المقدسة" : "The Sacred Shrine & Cathedral"}
            </h4>
          </div>
          <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-[#D4AF37]/20 transition-all duration-500 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
