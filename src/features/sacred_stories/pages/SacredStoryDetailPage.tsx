// File: src/features/sacred_stories/pages/SacredStoryDetailPage.tsx

import React, { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Saint, SAINTS_DATA } from "../../../data";
import { useSacredStore } from "../../../shared/store/sacredStore";
import { useSacredStoryDetail } from "../logic/useSacredStoryDetail";
import { mapApiDetailToSaint } from "../../../shared/services/archivesService";
import { HeroSection, BiographySection, LocationShowcase } from "../../saint-details/LexComponents";
import { StoryTimeline } from "../widgets/StoryTimeline";
import { SacredGallery } from "../widgets/SacredGallery";

// Enrichment data matching the 3 main featured saints
const ENRICHED_DB: Record<string, any> = {
  "oscar-salvador": {
    quoteText: {
      ar: "«بصفتي راعياً، أنا ملزم بتقديم حياتي لمن أحبهم، أي لجميع السلفادوريين.»",
      en: "“As a shepherd, I am bound by divine love to give my life for those I love, which is all Salvadorans.”"
    },
    bioTitle: {
      ar: "صوت من لا صوت لهم والشهادة بالدم",
      en: "The Voice of the Voiceless & Martyrdom"
    },
    bioParagraphs: {
      ar: [
        "ولد رئيس الأساقفة أوسكار روميرو في السلفادور، وبرز كواحد من أكثر المدافعين شجاعة في القرن العشرين عن السلام، والعدالة الاجتماعية، وحقوق الإنسان والمحتاجين.",
        "في مواجهة أعمال العنف والاضطهاد الحكومي الشديد، استغل منبر الوعظ الأسبوعي لشجب الانتهاكات الجسيمة ومساندة الضعفاء وإدانة الظلم.",
        "في ٢٤ مارس ١٩٨٠، وأثناء الاحتفال بالقداس الإلهي في كنيسة مستشفى العناية الإلهية، تعرض لرصاصة غادرة أودت بحياته، ليوثق استشهاده كشاهد دائم على حقيقة الإنجيل."
      ],
      en: [
        "Archbishop Óscar Romero of El Salvador emerged as one of the 20th century's most courageous defenders of social justice, peace, and human dignity.",
        "In a period of severe social conflict and government oppression, he utilized his weekly sermons to broadcast pleas for justice, denounce violence, and advocate for the poor.",
        "On March 24, 1980, while celebrating Mass in the chapel of Divine Providence Hospital, he was assassinated by a lone gunman, sealing his lifetime of pastoral fidelity with martyrdom."
      ]
    },
    timeline: [
      { year: "١٩١٧", title: { ar: "ميلاد المدافع", en: "Birth of a Defender" }, desc: { ar: "ولد في سيوداد باريوس بالسلفادور في عائلة متواضعة وعاش حياة البساطة.", en: "Born in Ciudad Barrios, El Salvador, into a humble family, learning early values of simplicity." } },
      { year: "١٩٤٢", title: { ar: "السيامة الكهنوتية في روما", en: "Ordination in Rome" }, desc: { ar: "سيم كاهناً وبدأ خدمته الروحية كرسول ومبشر بالحب والسلام.", en: "Ordained a priest in Rome, beginning a lifelong pastoral journey of deep theological reflection." } },
      { year: "١٩٧٧", title: { ar: "رئيس أساقفة سان سلفادور", en: "Archbishop of San Salvador" }, desc: { ar: "عُين رئيساً للأساقفة في فترة حرجة من تاريخ البلاد المليء بالاضطرابات.", en: "Appointed Archbishop during a turbulent era of severe social and political division." } },
      { year: "١٩٨٠", title: { ar: "أكاليل الشهادة المقدسة", en: "The Crown of Martyrdom" }, desc: { ar: "اغتيل على المذبح أثناء تقديس الحمل المقدس في المذبح الإلهي.", en: "Assassinated at the altar while celebrating the Holy Eucharist." } }
    ],
    exhibits: [
      {
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "الثوب الكهنوتي الملطخ بالدماء", en: "Blood-Stained Alb" },
        desc: { ar: "الرداء الأبيض الذي كان يرتديه وقت اغتياله والملطخ بدم الشهادة الطاهرة.", en: "The white vestment worn during his celebration of Mass, stained with his blood." }
      },
      {
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "ميكروفون إذاعة الحقيقة", en: "Sermon Radio Microphone" },
        desc: { ar: "المذياع التاريخي الذي أطلق من خلاله صرخات الحق والدفاع عن الأرواح البريئة.", en: "The microphone through which he broadcasted pleas for justice." }
      },
      {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "كتاب القداس ونظاراته", en: "Mass Missal & Spectacles" },
        desc: { ar: "مقتنيات شخصية رافقته على المذبح وسقطت معه لحظة إطلاق الرصاص.", en: "Personal items that lay upon the altar, falling beside him." }
      }
    ],
    stories: {
      archive: {
        ar: "يحتفظ الأرشيف بكافة التسجيلات والمقالات التي تعبر عن هويته الروحية ودوره التاريخي في إرشاد المؤمنين.",
        en: "The archive preserves all key documents, journals, and articles expressing his profound spirituality and historical guidance."
      },
      liturgy: {
        ar: "تميزت حياته بعلاقة وثيقة بالليتورجيا الإلهية التي كانت نبعاً متدفقاً للقوة والتعزية الروحية لكافة المؤمنين.",
        en: "His life was heavily anchored in the divine liturgy, which acted as a flowing fountain of strength and comfort to his flock."
      },
      panel: {
        ar: "تظهر لوحاته وأيقوناته المباركة نظرة مليئة بالحنان والرجاء، تذكر بنعمة التضحية وبذل الذات من أجل الحق.",
        en: "His holy icons display an aura filled with mercy and hope, reminding us of the grace of sacrifice and truth."
      },
      chapel: {
        ar: "مصلى تذكاري هادئ يرتاده المصلون لطلب شفاعته وطلب العزاء والقوة الروحية في الصعاب والمحن.",
        en: "A quiet memorial chapel visited by believers to seek his intercession, comfort, and peace in daily trials."
      }
    },
    monastery: {
      name: { ar: "ضريح كاتدرائية سان سلفادور", en: "The Crypt of San Salvador Cathedral" },
      desc: { ar: "يستريح جسد القديس أوسكار روميرو في ضريح برونزي مهيب داخل قبو الكاتدرائية الكبرى، وهو مزار دائم للحجاج الساعين لروح العدالة والسلام.", en: "The bronze tomb of St. Oscar Romero lies beneath the high altar of the Metropolitan Cathedral, attracting global pilgrims seeking prayers for justice." },
      locationText: { ar: "سان سلفادور، السلفادور", en: "San Salvador, El Salvador" },
      image: "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=800"
    }
  },
  "maximilian-kolbe": {
    quoteText: {
      ar: "«الكراهية ليست قوة خلاقة. الحب وحده هو القوة المبدعة والمحررة للروح.»",
      en: "“Hatred is not a creative force. Only love is the creative and liberating power of the soul.”"
    },
    bioTitle: {
      ar: "قديس معسكر أوشفيتز وبطل العطاء",
      en: "The Knight of the Immaculata & Martyr of Charity"
    },
    bioParagraphs: {
      ar: [
        "ولد مكسيميليان كولبي في بولندا، وكان راهباً فرنسيسكانياً كرس حياته للتبشير ونشر الكلمة مستخدماً وسائل الصحافة الحديثة والمطبوعات والعمل الروحي الدؤوب.",
        "أثناء الحرب العالمية الثانية واحتلال بولندا، وفر حماية إنسانية لأكثر من ألفي لاجئ، حتى اعتقاله من قبل الجستابو وإرساله إلى معسكر الموت أوشفيتز.",
        "في يوليو ١٩٤١، وعندما حُكم على عشرة رجال بالموت جوعاً انتقاماً لهروب سجين، تطوع كولبي بشجاعة فائقة ليأخذ مكان رب أسرة مكرس، مقدماً حياته فداءً لأخيه الإنسان."
      ],
      en: [
        "Maximilian Kolbe was a Polish Franciscan friar who dedicated his intellect and physical strength to spiritual publications and missions across Asia.",
        "During the occupation of Poland in World War II, his monastery provided sanctuary to thousands of displaced refugees before his arrest and subsequent deportation to Auschwitz.",
        "In July 1941, when a prisoner escaped and ten men were condemned to die in the starvation bunker, Father Kolbe stepped forward to take the place of Franciszek Gajowniczek, a family man."
      ]
    },
    timeline: [
      { year: "١٨٩٤", title: { ar: "الميلاد والنشأة في بولندا", en: "Birth in Zduńska Wola" }, desc: { ar: "ولد في بولندا باسم رايموند كولبي ونشأ بروح تقية وتأملية عميقة.", en: "Born Raymond Kolbe, showing early devotion and receiving a mystical vision." } },
      { year: "١٩١٨", title: { ar: "التأسيس والسيامة الروحية", en: "Ordination & Scholarship" }, desc: { ar: "نال سر الكهنوت المقدس في روما وواصل تعليمه اللاهوتي بامتياز.", en: "Ordained a priest in Rome, establishing the Militia Immaculatae." } },
      { year: "١٩٣٠", title: { ar: "الرسالة التبشيرية في آسيا", en: "Asian Mission Initiatives" }, desc: { ar: "سافر إلى اليابان والهند وبنى مراكز تبشيرية لنشر رسالة المحبة الإلهية.", en: "Traveled to Nagasaki, Japan, establishing a vibrant monastery." } },
      { year: "١٩٤١", title: { ar: "شمس الشهادة والتضحية الفائقة", en: "Starvation Bunker Offering" }, desc: { ar: "دخل زنزانة الموت طوعاً بدلاً من أخيه الإنسان ليتمم سر التضحية العظمى.", en: "Gave his life in place of a fellow prisoner at Auschwitz." } }
    ],
    exhibits: [
      {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "ساعة جيبه الشخصية ونظاراته", en: "Pocketwatch & Spectacles" },
        desc: { ar: "الأدوات البسيطة التي رافقته في تأملاته ودراساته وكتابة مقالاته الصحفية.", en: "The simple instruments accompanying him in writing circulars." }
      },
      {
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "مخطوط تذكرة السجن الأصلية", en: "Prison Registry Record" },
        desc: { ar: "الوثيقة التاريخية المحفوظة التي تسجل نقله لمعسكر الموت ورقم سجنه.", en: "The preserved Auschwitz camp card showing his serial number." }
      },
      {
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "رداء الكهنوت الرمادي", en: "Grey Franciscan Habit" },
        desc: { ar: "الثوب الرهباني البسيط المميز للرهبان الفرنسيسكان الصغار الذي ارتداه لسنوات.", en: "The humble Franciscan habit worn during his monastic life." }
      }
    ],
    stories: {
      archive: {
        ar: "يحتفظ الأرشيف بكافة التسجيلات والمقالات التي تعبر عن هويته الروحية ودوره التاريخي في إرشاد المؤمنين.",
        en: "The archive preserves all key documents, journals, and articles expressing his profound spirituality and historical guidance."
      },
      liturgy: {
        ar: "تميزت حياته بعلاقة وثيقة بالليتورجيا الإلهية التي كانت نبعاً متدفقاً للقوة والتعزية الروحية لكافة المؤمنين.",
        en: "His life was heavily anchored in the divine liturgy, which acted as a flowing fountain of strength and comfort to his flock."
      },
      panel: {
        ar: "تظهر لوحاته وأيقوناته المباركة نظرة مليئة بالحنان والرجاء، تذكر بنعمة التضحية وبذل الذات من أجل الحق.",
        en: "His holy icons display an aura filled with mercy and hope, reminding us of the grace of sacrifice and truth."
      },
      chapel: {
        ar: "مصلى تذكاري هادئ يرتاده المصلون لطلب شفاعته وطلب العزاء والقوة الروحية في الصعاب والمحن.",
        en: "A quiet memorial chapel visited by believers to seek his intercession, comfort, and peace in daily trials."
      }
    },
    monastery: {
      name: { ar: "دير نيبوكالانو للفرنسيسكان", en: "Niepokalanów Franciscan Monastery" },
      desc: { ar: "المدينة الروحية التي أسسها القديس مكسيميليان كولبي في بولندا، وتعد حالياً مزاراً كبيراً ومركزاً روحياً وثقافياً نابضاً بالحب والرجاء.", en: "The sprawling city of the Immaculata founded by Father Kolbe near Warsaw, functioning as a primary shrine." },
      locationText: { ar: "تيريسين، بولندا", en: "Teresin, Poland" },
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"
    }
  }
};

export default function SacredStoryDetailPage() {
  const {
    setSelectedSaint,
    selectedSaintId,
    setSelectedSaintId,
    previousTab,
    setCurrentTab,
    setIsPrayerModalOpen,
    setDefaultSaintForPrayer,
    language,
    isAmbientPlaying,
    setIsAmbientPlaying
  } = useSacredStore();

  const {
    selectedStory,
    loadingDetail: loading,
    error,
    loadStoryById,
    clearStoryDetail
  } = useSacredStoryDetail();

  const [localFallbackSaint, setLocalFallbackSaint] = useState<Saint | null>(null);
  const [activeStoryTab, setActiveStoryTab] = useState<"archive" | "liturgy" | "panel" | "chapel">("archive");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Load detailed saint from Redux / fall back to local DB
  useEffect(() => {
    if (!selectedSaintId) return;

    let isMounted = true;
    const fetchDetail = async () => {
      setLocalFallbackSaint(null);
      try {
        await loadStoryById(selectedSaintId);
      } catch (err) {
        console.warn("Failed to fetch saint details from Redux API, seeking local database", err);
        const local = SAINTS_DATA.find((s) => s.id === selectedSaintId);
        if (local && isMounted) {
          setLocalFallbackSaint(local);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedSaintId, loadStoryById]);

  // Map Redux story item to Saint model, or use the local fallback saint
  const selectedSaint = selectedStory ? mapApiDetailToSaint(selectedStory) : localFallbackSaint;

  const handleBack = () => {
    setSelectedSaint(null);
    setSelectedSaintId("");
    clearStoryDetail();
    setCurrentTab(previousTab || "saints");
  };

  // Helper to extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center text-white/90 relative" id="saint-details-loading">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
        <div className="space-y-6 relative z-10 flex flex-col items-center">
          <RefreshCw className="w-10 h-10 text-gold-accent animate-spin" />
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

  // Attempt to load rich custom data, otherwise fallback dynamically
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
      ? selectedSaint.rawTimeline.map((item) => ({
          year: item.date ? (item.date.match(/\d{4}/)?.[0] || item.date) : "١٩٠٠",
          title: { ar: item.title, en: item.title },
          desc: { ar: item.description, en: item.description }
        }))
      : dbEnriched?.timeline || [
          {
            year: selectedSaint?.era.split("–")[0]?.trim() || "١٩٠٠",
            title: { ar: "الميلاد والبداية الروحية", en: "Birth and Spiritual Awakening" },
            desc: { ar: "ولد في عائلة متواضعة وبدأ مسيرته الروحية مكرساً نفسه لخدمة الله والكلمة.", en: "Born into a humble background, starting his path dedicated to serving God's word." }
          },
          {
            year: "١٩٥٠",
            title: { ar: "خدمة الكلمة والشعب", en: "Pastoral Ministry & Service" },
            desc: { ar: "عمل بتفانٍ متميز في حقل الدعوة والتبشير رعايةً للنفوس وتقوية للضعفاء.", en: "Worked with outstanding devotion, nourishing souls and strengthening the weak." }
          },
          {
            year: selectedSaint?.era.split("–")[1]?.trim() || "١٩٨٠",
            title: { ar: "شهادة الاستشهاد والخلود", en: "Martyrdom & Eternal Reward" },
            desc: { ar: "قدم حياته شهادة للمحبة والإيمان الراسخ، مسجلاً اسمه في لوح قديسي السلام.", en: "Laid down his life as a final testament, engraving his name among the saints of peace." }
          }
        ],
    exhibits: selectedSaint?.sacredGallery && selectedSaint.sacredGallery.length > 0
      ? selectedSaint.sacredGallery.map((item) => ({
          image: item.imageUrl || selectedSaint.image,
          title: { ar: item.title, en: item.title },
          desc: { ar: item.title, en: item.title }
        }))
      : dbEnriched?.exhibits || [
          {
            image: selectedSaint?.image || "",
            title: { ar: "مقتنيات الشاهد المباركة", en: "Relics of the Blessed Witness" },
            desc: { ar: "أدوات ملموسة رافقت القديس في أيام خدمته وصلواته اليومية.", en: "Tangible items that accompanied the saint during active ministry and prayers." }
          },
          {
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300",
            title: { ar: "صليب الخدمة الخشبي", en: "The Pastoral Cross" },
            desc: { ar: "الصليب الذي بارك به المؤمنين وكان حامياً له في المصاعب.", en: "The cross with which he blessed his flock and drew comfort in trials." }
          },
          {
            image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300",
            title: { ar: "المخطوط التاريخي للصلوات", en: "Historical Prayer Scroll" },
            desc: { ar: "أوراق تحتوي على الصلوات اليومية والابتهالات التي كتبها بخط يده.", en: "Foliages of handwritten litanies and daily petitions penned by him." }
          }
        ],
    stories: dbEnriched?.stories || {
      archive: {
        ar: "يحتفظ الأرشيف بكافة التسجيلات والمقالات التي تعبر عن هويته الروحية ودوره التاريخي في إرشاد المؤمنين.",
        en: "The archive preserves all key documents, journals, and articles expressing his profound spirituality and historical guidance."
      },
      liturgy: {
        ar: "تميزت حياته بعلاقة وثيقة بالليتورجيا الإلهية التي كانت نبعاً متدفقاً للقوة والتعزية الروحية لكافة المؤمنين.",
        en: "His life was heavily anchored in the divine liturgy, which acted as a flowing fountain of strength and comfort to his flock."
      },
      panel: {
        ar: "تظهر لوحاته وأيقوناته المباركة نظرة مليئة بالحنان والرجاء، تذكر بنعمة التضحية وبذل الذات من أجل الحق.",
        en: "His holy icons display an aura filled with mercy and hope, reminding us of the grace of sacrifice and truth."
      },
      chapel: {
        ar: "مصلى تذكاري هادئ يرتاده المصلون لطلب شفاعته وطلب العزاء والقوة الروحية في الصعاب والمحن.",
        en: "A quiet memorial chapel visited by believers to seek his intercession, comfort, and peace in daily trials."
      }
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
          desc: { ar: `يمثل هذا الضريح والمركز الروحي مزاراً مقدساً وباباً مفتوحاً للصلاة، مكرساً بالكامل لإحياء سيرة هذا البطل وتخليد رسالته الروحية للأجيال القادمة.`,
                  en: `This spiritual center serves as a sacred shrine and door of prayer, entirely dedicated to commemorating the life and preserving his message for future generations.` },
          locationText: { ar: selectedSaint?.location || "", en: selectedSaint?.location || "" },
          image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"
        }
  };

  const getSaintBadge = () => {
    if (!selectedSaint) return { ar: "", en: "" };
    if (selectedSaint.id === "oscar-salvador") {
      return { ar: "شهيد معاصر", en: "Contemporary Martyr" };
    } else if (selectedSaint.id === "maximilian-kolbe") {
      return { ar: "شهيد المحبة", en: "Martyr of Charity" };
    } else if (selectedSaint.id === "maria-shadows") {
      return { ar: "شاهدة صامتة", en: "Silent Witness" };
    } else {
      return { ar: "شاهد معاصر", en: "Contemporary Witness" };
    }
  };

  const getSaintCustomName = () => {
    if (!selectedSaint) return { ar: "", en: "" };
    if (selectedSaint.id === "oscar-salvador") {
      return { ar: "القديس أوسكار روميرو", en: "Saint Oscar Romero" };
    } else if (selectedSaint.id === "maximilian-kolbe") {
      return { ar: "القديس مكسيميليان كولبي", en: "St. Maximilian Kolbe" };
    } else if (selectedSaint.id === "maria-shadows") {
      return { ar: "القديسة ماريا وراء الظلال", en: "St. Maria of the Shadows" };
    } else {
      return { ar: selectedSaint.name, en: selectedSaint.name };
    }
  };

  const getSaintCustomQuote = () => {
    if (!selectedSaint) return { ar: "", en: "" };
    if (selectedSaint.id === "oscar-salvador") {
      return { ar: "«لا تطمح لتمتلك المزيد، بل لتكون أكثر»", en: "“Aspire not to have more, but to be more.”" };
    } else if (selectedSaint.id === "maximilian-kolbe") {
      return { ar: "«الحب وحده هو القوة المبدعة»", en: "“Only love is a creative force.”" };
    } else if (selectedSaint.id === "maria-shadows") {
      return { ar: "«في صمت الروح يُحرس اللهيب الأزلي»", en: "“In the silence of the heart, the eternal flame is guarded.”" };
    } else {
      return { ar: `«${selectedSaint.quote || selectedSaint.subtitle}»`, en: `“${selectedSaint.quote || selectedSaint.subtitle}”` };
    }
  };

  const handleScrollToTimeline = () => {
    const el = document.getElementById("holy-path-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
      {/* Dynamic atmospheric canvas grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Elegant Header with Back Navigation */}
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
        
        {/* HERO SECTION COMPONENT */}
        <HeroSection
          image={selectedSaint.image}
          name={getSaintCustomName()[language]}
          badge={getSaintBadge()[language]}
          quote={getSaintCustomQuote()[language]}
          language={language}
          isAmbientPlaying={isAmbientPlaying}
          onToggleSermon={() => setIsVideoModalOpen(true)}
          onScrollToTimeline={handleScrollToTimeline}
        />

        {/* BIOGRAPHY SECTION COMPONENT */}
        <BiographySection
          title={language === "ar" ? "السيرة الذاتية" : "Biography"}
          quote={enriched.quoteText[language]}
          author={getSaintCustomName()[language]}
          bioTitle={enriched.bioTitle[language]}
          bioParagraphs={enriched.bioParagraphs[language]}
          language={language}
        />

        {/* SACRED TIMELINE WIDGET */}
        <div id="holy-path-section">
          <StoryTimeline
            title={language === "ar" ? "المسار المقدس" : "The Holy Path"}
            subtitle={language === "ar" ? "التسلسل الزمني لحياة بذلت من أجل الآخرين." : "Chronological sequence of a life spent for others."}
            timelineItems={enriched.timeline.map(item => ({
              year: item.year,
              title: item.title[language],
              desc: item.desc[language]
            }))}
            language={language}
          />
        </div>

        {/* SACRED GALLERY WIDGET */}
        <SacredGallery
          title={language === "ar" ? "معروضات مقدسة" : "Sacred Exhibits"}
          items={enriched.exhibits.map(ex => ({
            image: ex.image,
            title: ex.title[language],
            desc: ex.desc[language]
          }))}
          prominentImage={selectedSaint.id === "oscar-salvador" ? "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=800" : "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"}
          language={language}
        />

        {/* SECTION D: SACRED STORIES TABS */}
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

          {/* Tab buttons */}
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

          {/* Active Tab Content block */}
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

        {/* LOCATION SHOWCASE COMPONENT */}
        <LocationShowcase
          title={enriched.monastery.name[language]}
          desc={enriched.monastery.desc[language]}
          locationText={enriched.monastery.locationText[language]}
          image={enriched.monastery.image}
          language={language}
        />

        {/* SEEK BESPOKE LITANY / INTERCESSION ACTION */}
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

      {/* VIDEO POPUP MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && youtubeId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            {/* Backdrop click to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsVideoModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-[#0c0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-accent animate-pulse" />
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {language === "ar" ? "مشاهدة الفيلم الوثائقي" : "Watch Documentary Film"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Aspect Video Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title={language === "ar" ? "الفيلم الوثائقي للحقائق" : "Sacred Story Documentary"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
