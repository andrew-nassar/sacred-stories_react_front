// File: src/features/sacred_stories/widgets/SacredGallery.tsx

import React from "react";

export interface GalleryExhibit {
  image: string;
  title: string;
  desc: string;
}

interface SacredGalleryProps {
  title: string;
  items: GalleryExhibit[];
  prominentImage: string;
  language?: "ar" | "en";
}

export function SacredGallery({
  title,
  items,
  prominentImage,
  language = "en",
}: SacredGalleryProps) {
  const isAr = language === "ar";
  
  // High fidelity default items as fallback
  const exhibitsList = items && items.length >= 3 ? items : [
    {
      image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300",
      title: isAr ? "الثوب الكهنوتي الملطخ بالدماء" : "Blood-Stained Alb",
      desc: isAr ? "الرداء الأبيض الذي كان يرتديه وقت اغتياله والملطخ بدم الشهادة الطاهرة." : "The white vestment worn during his celebration of Mass, stained with his blood."
    },
    {
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300",
      title: isAr ? "ميكروفون إذاعة الحقيقة" : "Sermon Radio Microphone",
      desc: isAr ? "المذياع التاريخي الذي أطلق من خلاله صرخات الحق والدفاع عن الأرواح البريئة." : "The microphone through which he broadcasted pleas for justice."
    },
    {
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300",
      title: isAr ? "كتاب القداس ونظاراته" : "Mass Missal & Spectacles",
      desc: isAr ? "مقتنيات شخصية رافقته على المذبح وسقطت معه لحظة إطلاق الرصاص." : "Personal items that lay upon the altar, falling beside him."
    }
  ];

  return (
    <section id="sacred-gallery-section" className={`space-y-8 ${isAr ? "[direction:rtl]" : "[direction:ltr]"}`}>
      {/* Title */}
      <div className="text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white font-semibold tracking-wide">
          {title}
        </h2>
        <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-4" />
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 items-stretch">
        
        {/* Left column (Stacked smaller items) */}
        <div className="flex flex-col gap-4">
          {/* Top wide horizontal card */}
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

          {/* Bottom row of 2 equal square items */}
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
