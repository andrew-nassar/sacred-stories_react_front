import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Award, Quote, Sparkles, MapPin, Heart, BookOpen, Compass, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Saint, SAINTS_DATA } from "../../data";
import { useSacredStore } from "../../shared/store/sacredStore";
import { archivesAdapter } from "../../shared/services/archivesService";
import { HeroSection, BiographySection, SacredTimeline, LocationShowcase, SacredGallery } from "./LexComponents";

// Enrichment data matching the uploaded screenshots for the 3 main featured saints
interface SaintEnrichedData {
  quoteText: { ar: string; en: string };
  bioTitle: { ar: string; en: string };
  bioParagraphs: { ar: string[]; en: string[] };
  timeline: Array<{
    year: string;
    title: { ar: string; en: string };
    desc: { ar: string; en: string };
  }>;
  exhibits: Array<{
    image: string;
    title: { ar: string; en: string };
    desc: { ar: string; en: string };
  }>;
  stories: {
    archive: { ar: string; en: string };
    liturgy: { ar: string; en: string };
    panel: { ar: string; en: string };
    chapel: { ar: string; en: string };
  };
  monastery: {
    name: { ar: string; en: string };
    desc: { ar: string; en: string };
    locationText: { ar: string; en: string };
    image: string;
  };
}

const ENRICHED_DB: Record<string, SaintEnrichedData> = {
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
        "في سن العاشرة، ظهرت له العذراء مريم حاملة تاجين: الأبيض يرمز للطهارة والأحمر للاستشهاد. سألته أيهما يختار، فاختار كلاهما بقبول ورع. هذا الحدث المفصلي شكل مسار حياته بالكامل نحو القداسة المطلقة والخدمة الروحية العميقة.",
        "أسس «كتيبة مريم الكلية الطهارة» لنشر التكريس المريمي حول العالم، وأنشأ «مدينة المريمية» (نيبوكالانو) في بولندا لتضم مئات الرهبان، فغدت أكبر دير في العالم منارة للنشر والتبشير الحديث وخدمة الكلمة المقدسة."
      ],
      en: [
        "At the age of ten, the Virgin Mary appeared to him in a vision holding two crowns: the white representing purity and the red representing martyrdom. She asked him which he would choose, and he humbly chose both. This pivotal moment shaped his entire life toward absolute sanctity.",
        "He founded the 'Militia Immaculatae' to spread devotion to the Virgin Mary worldwide, and established 'Niepokalanów' (City of the Immaculata) in Poland, which housed hundreds of friars and became a pioneering modern publishing house for sacred communication."
      ]
    },
    timeline: [
      {
        year: "١٨٩٤",
        title: { ar: "الميلاد في بولندا", en: "Birth in Poland" },
        desc: { ar: "ولد لعائلة متدينة مكرسة للفضيلة والتقوى والخدمة البسيطة.", en: "Born into a deeply devout family, dedicated to simple labor and deep piety." }
      },
      {
        year: "١٩٢٧",
        title: { ar: "تأسيس مدينة المريمية", en: "Niepokalanów Founding" },
        desc: { ar: "أنشأ الدير الرسولي العملاق الذي تخصص في النشر والصحافة الروحية.", en: "Established the legendary monastery that specialized in mass spiritual media." }
      },
      {
        year: "١٩٤١",
        title: { ar: "الاستشهاد والتضحية", en: "Supreme Martyrdom" },
        desc: { ar: "قدم حياته فداءً لأب عائلة في زنزانة الجوع بمعسكر أوشفيتز.", en: "Volunteered to starve in place of a complete stranger inside Auschwitz." }
      }
    ],
    exhibits: [
      {
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "رداء السجن رقم ١٦٦٧٠", en: "Prison Habit No. 16670" },
        desc: { ar: "الرداء المخطط الأصلي الذي ارتداه في غياهب معسكر الموت.", en: "The original striped uniform worn inside the dark death camp." }
      },
      {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "آلات المطبعة اليدوية", en: "Manual Printing Press" },
        desc: { ar: "الأدوات التي استعملها كولبي لنشر فكر المحبة والسلام وصوت الإيمان.", en: "The physical presses used by Kolbe to publish magazines of hope." }
      },
      {
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "صليب الخلوة الخشبي", en: "Personal Wooden Cross" },
        desc: { ar: "صليب رهباني بسيط رافقه في صلواته الفردية وخلواته الطويلة.", en: "A simple monastic cross that accompanied his private prayers." }
      }
    ],
    stories: {
      archive: {
        ar: "يحتوي الأرشيف على مقالات ورسائل رعوية كتبها مكسيميليان تدعو للثبات والرجاء، مؤكدة أن المحبة وحدها قادرة على بناء عالم تسوده العدالة والسلام.",
        en: "The archive contains letters and pastoral articles penned by Maximilian, advocating for steadfastness and asserting that love alone can construct a world of peace."
      },
      liturgy: {
        ar: "كان يحيي الليتورجيات سراً في غرف السجن المعتمة، يوزع الكلمة والتعزية الروحية على المساجين المحكومين بالإعدام، ويبدد خوف الموت بالتسبيح والترتيل.",
        en: "He celebrated secret liturgies in the dim prison cells, offering spiritual solace to condemned inmates and dispelling the fear of death with hymns."
      },
      panel: {
        ar: "تجسد اللوحة والأيقونات التاريخية القديس حاملاً تاجي الطهارة والاستشهاد، مجمعاً بين زهد الرهبنة الفرنسيسكانية وتضحية السجين البطل.",
        en: "The historic icons depict the saint holding the crowns of purity and martyrdom, uniting the Franciscan ascetic life with the sacrifice of a prisoner."
      },
      chapel: {
        ar: "مزار وبيت للصلاة الصامتة والتأمل في سر البذل والتضحية المطلقة، حيث يلتمس المؤمنون نعمة المحبة والصمود في مواجهة تحديات الحياة اليومية.",
        en: "A shrine and sanctuary for silent prayer, reflecting on the mystery of self-gift, where believers pray for endurance in modern daily struggles."
      }
    },
    monastery: {
      name: { ar: "دير نيبوكالانو (مدينة المريمية)", en: "Niepokalanów (City of the Immaculata)" },
      desc: { ar: "يُعد هذا الدير في بولندا المركز الروحي الأبرز الذي أسسه القديس كولبي، حيث كان يضم مطبعة عملاقة ومحطة إذاعية لخدمة رسالة المحبة، مما جعلها في وقت من الأوقات أكبر مجمع رهباني نشط في العالم.",
              en: "This historic monastery in Poland was the premier spiritual center founded by St. Kolbe, housing a massive printing house and radio transmitter entirely devoted to spreading spiritual light." },
      locationText: { ar: "تيريسين، بالقرب من وارسو، بولندا", en: "Teresin, near Warsaw, Poland" },
      image: "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=800"
    }
  },
  "oscar-salvador": {
    quoteText: {
      ar: "«الحب وحده هو القوة التي تحرر»",
      en: "“If they kill me, I will rise again in the Salvadoran people. Let my blood be a seed of freedom.”"
    },
    bioTitle: {
      ar: "صوت المستضعفين ورسالة الحق",
      en: "The Voice for the Voiceless & Message of Truth"
    },
    bioParagraphs: {
      ar: [
        "بدأ أوسكار روميرو خدمته الكهنوتية كعالم هادئ ومنعزل، لكن تعيينه كبيراً لأساقفة سان سلفادور غير نظرته تماماً بعد أن شهد الفظائع والاضطهاد الممنهج المسلط على عائلات المزارعين والفقراء.",
        "تحول بشجاعة منقطعة النظير إلى مدافع شرس عن حقوق الإنسان، جاعلاً من منبره الإذاعي الأسبوعي منارة وحيدة للحقيقة في بلاده. دفع ثمن أمانته لرسالة الإنجيل حياً، حيث اغتيل برصاص الغدر على المذبح وهو يرفع الكأس المقدسة."
      ],
      en: [
        "Oscar Romero began his ecclesiastical path as a quiet, scholarly booklover. However, his appointment as Archbishop of San Salvador completely altered his horizon after witnessing systemic oppression of poor peasant families.",
        "With unprecedented courage, he transformed into an outspoken human rights champion, turning his weekly radio sermons into the nation's single beacon of absolute truth. He paid the ultimate price, assassinated at the altar while holding the Holy Chalice."
      ]
    },
    timeline: [
      {
        year: "١٩١٧",
        title: { ar: "الميلاد في سيوداد باريوس", en: "Birth in Ciudad Barrios" },
        desc: { ar: "ولد في بلدة جبلية متواضعة وبدت ملامح دعوته الروحية والكهنوتية واضحة منذ مطلع صباه.", en: "Born in a humble mountain town, his spiritual calling shone bright from early childhood." }
      },
      {
        year: "١٩٧٧",
        title: { ar: "التحول الجذري في الدعوة", en: "The Radical Transformation" },
        desc: { ar: "بعد مقتل صديقه الأب غراندي، كرس حياته كلياً لرفع الظلم عن المزارعين والمسحوقين.", en: "Following the murder of his close friend Fr. Grande, he dedicated his life to defend the poor." }
      },
      {
        year: "١٩٨٠",
        title: { ar: "الاستشهاد على المذبح المقدس", en: "Martyrdom at the Altar" },
        desc: { ar: "أصيب برصاصة قاتلة في صدره أثناء الاحتفال بالذبيحة الإلهية في مصلى صغير.", en: "Assassinated by a single sniper bullet while celebrating Holy Mass in a hospital chapel." }
      }
    ],
    exhibits: [
      {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuInXIx3zQtHg0SRiTOBpqmQ_V6XePfcdI2HOZFVGk5bZPQcWHvwKb5jbVfC2UmC9bAVj2Yl6C6XRSPbmtcVFOBYmFUqps5m6MTTwqeeDxKJ4yJPMdRaHmoEESwDJZiCwerLnWGxl4G35qSya6e5dWbbq22ADsPw7byYYji8EVBNP4kakytTjS5MRicw8HQwU34H6Vg0w34TGTVXfgOGDdSwggEBzW9OLRyMCqZHq40jIFu3mieaDcU2A",
        title: { ar: "الثوب الكهنوتي الملطخ بالدماء", en: "Blood-Stained Alb" },
        desc: { ar: "الرداء الأبيض الذي كان يرتديه وقت اغتياله والملطخ بدم الشهادة الطاهرة.", en: "The white vestment worn during his celebration of Mass, stained with his blood." }
      },
      {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmZ9XB-Mm_SVvlTg-ifcUGllOEncTfucUyq_hV2A_DVQBRyHa5gJlcfKT9u_L7NZ3paHw-1c2AEKAYJpgRAchh1vc5Ej4zBkWQB5owmjj4gQm2NMxfwE2CFIG_EVNir_z70awBFXU62ZxvSJkHCpxPyqRHNQ5NxfoDpoW4cf0gzcpV4uT4tZAGck88t39sf5IGzSdto-5Emmn6AQosu62ffKF9c8NPg-HIa_Jf1qdEfZspKWmuianFYg",
        title: { ar: "ميكروفون إذاعة الحقيقة", en: "Sermon Radio Microphone" },
        desc: { ar: "المذياع التاريخي الذي أطلق من خلاله صرخات الحق والدفاع عن الأرواح البريئة.", en: "The microphone through which he broadcasted pleas for justice and sanctity of life." }
      },
      {
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZRXMPSghwq2rRJmJnuiIxxKGDBf7vDcqsxmrchvqbbYJdmK7oh__ibmyv67PO-MS-CAesiM5CGSEYH4vqzVNA8vPzz2VH4taWKLkqce-K30eEgwzm0ZmwEaUM56fyjZYF1obwnBBdyYidi5wwhAjDlyyk8M7n29oq-6PG_B-IRSnsxSDhwLO4xApfrJEoqvZOzwsWA0OPdTfudzrhXN_ThayNd57HCjky9cmmgscBFj6Q7Gs4T48f8Q",
        title: { ar: "كتاب القداس ونظاراته", en: "Mass Missal & Spectacles" },
        desc: { ar: "مقتنيات شخصية رافقته على المذبح وسقطت معه لحظة إطلاق الرصاص.", en: "Personal items that lay upon the altar, falling beside him as he was struck." }
      }
    ],
    stories: {
      archive: {
        ar: "تضم السجلات تسجيلات نادرة لعظاته التي كانت تبث عبر الراديو الوطني، والتي شكلت الصوت الوحيد المتبقي للحقيقة للعديد من الأسر المضطهدة والمحاصرة.",
        en: "The records preserve rare magnetic tapes of his national radio broadcasts, which represented the sole source of truth and hope for thousands of poor families."
      },
      liturgy: {
        ar: "كان يرى في الذبيحة الإلهية التعبير الأسمى لشركة المؤمنين وتضامنهم الأخوي والروحي مع المتألمين والجائعين والأبرياء المظلومين في كل مكان.",
        en: "He saw the Holy Mass as the peak of spiritual communion and solidarity with those suffering, hungry, and marginalized in every town."
      },
      panel: {
        ar: "تزخر الكنائس بجداريات ملونة وأيقونات شعبية تصوره رافعاً القربان المقدس محاطاً بالمزارعين الفقراء وأغصان الزيتون وعلامات السلام والعدل.",
        en: "Churches boast vivid murals and traditional icons showing him raising the host, surrounded by peasant farmers, olive branches, and symbols of peace."
      },
      chapel: {
        ar: "مصلى مستشفى العناية الإلهية حيث روى تراب المذبح بدمه، تاركاً شهادة حية ستبقى دافعاً للسلام الحقيقي والمغفرة والإيمان الواعد.",
        en: "The chapel of Divine Providence Hospital where his blood drenched the altar, leaving a living testimony of absolute peace and forgiveness."
      }
    },
    monastery: {
      name: { ar: "كاتدرائية سان سلفادور الكبرى", en: "Metropolitan Cathedral of San Salvador" },
      desc: { ar: "تقع هذه الكاتدرائية المهيبة في قلب العاصمة، وتضم في قبوها الروحي ضريح القديس الأسقف أوسكار روميرو، مما يجعلها قبلة للزوار الساعين خلف العدالة وبناء السلام من شتى أقطار المعمورة.",
              en: "This majestic cathedral stands in the heart of the capital, safeguarding the crypt tomb of Saint Oscar Romero, welcoming pilgrims from across the globe seeking peace." },
      locationText: { ar: "سان سلفادور، السلفادور", en: "San Salvador, El Salvador" },
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"
    }
  },
  "maria-shadows": {
    quoteText: {
      ar: "«في صمت الروح يُحرس اللهيب الأزلي»",
      en: "“In the silence of the heart, the eternal flame is guarded. The shadows cannot extinguish what they do not comprehend.”"
    },
    bioTitle: {
      ar: "الصمت الإلهي والشهادة الخفية",
      en: "The Divine Silence and Hidden Witness"
    },
    bioParagraphs: {
      ar: [
        "عاشت القديسة ماريا في خضم صراع القرن العشرين الأكثر سوداوية. قادت بشجاعة فائقة شبكة خفية من الملاجئ تحت الأرض لحماية العائلات الملاحقة والنازحين الفارين من بطش الآلة العسكرية في السهول الشمالية.",
        "فضلت الصمت التام والصلوات الليلية الهادئة في أديرة مدمرة على أي احتجاج صاخب، لإبقاء الرجاء وسراج الإيمان متقداً في قلوب المتعبين. اعتقلت في ثلج شتاء ١٩٤٤ لتقدم روحها بسلام تام صدم الجلادين."
      ],
      en: [
        "Saint Maria of the Shadows operated in the midst of the darkest mid-century European conflicts. With remarkable bravery, she maintained a underground safety network, sheltering fleeing families from military purges.",
        "She preferred absolute spiritual silence and nighttime prayer vigils in ruined monastic halls over loud debates, protecting the inner flame of hope. She was captured in the heavy winter of 1944, embracing her martyrdom with a peaceful serenity."
      ]
    },
    timeline: [
      {
        year: "١٩٢٠",
        title: { ar: "الميلاد في السهول الشمالية", en: "Birth in the Northern Plains" },
        desc: { ar: "نشأت في بلدة زراعية هادئة حيث اعتادت الصلاة والاعتكاف الروحي منذ صغرها.", en: "Grew up in a quiet farming community, practicing contemplation and quiet retreat early on." }
      },
      {
        year: "١٩٤٠",
        title: { ar: "إطلاق الملاجئ السرية", en: "Establishing Underground Sanctuaries" },
        desc: { ar: "شيدت الملاجئ ونسقت قوافل الإغاثة السرية لتهريب الأبرياء وحمايتهم من الملاحقات.", en: "Organized a secret supply chain and safe shelters to shield persecuted refugees." }
      },
      {
        year: "١٩٤٤",
        title: { ar: "الشهادة الصامتة في الثلوج", en: "The Silent Martyrdom" },
        desc: { ar: "اعتقلت واستشهدت متمسكة بعهد الصلاة، تاركةً شهادة غامرة بالصبر والصمت الروحي.", en: "Arrested and martyred, holding her vow of prayer, leaving behind an aura of quiet faith." }
      }
    ],
    exhibits: [
      {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "مخطوطة المزامير الخاصة بها", en: "Handwritten Book of Psalms" },
        desc: { ar: "الدفتر الورقي البالي الذي كتبت فيه صلواتها وتأملاتها الليلية وهي في الملاجئ.", en: "The fragile notebook in which she scribbled her nocturnal prayers in the dark." }
      },
      {
        image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "سبحتها الخشبية البسيطة", en: "Simple Wooden Rosary" },
        desc: { ar: "المسبحة العتيقة التي بقيت بين يديها طوال فترة اعتقالها وحتى اللحظة الأخيرة.", en: "The old rosary beads she clung onto throughout her captivity until her final breath." }
      },
      {
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300",
        title: { ar: "مصباح الزيت النحاسي", en: "Contemplative Oil Lamp" },
        desc: { ar: "السراج الصغير الذي أنار صلواتها وسراديب الملاجئ الداكنة لسنوات طويلة.", en: "The small brass lamp that lit up her secret crypts and midnight prayer vigils." }
      }
    ],
    stories: {
      archive: {
        ar: "تضم المخطوطات مذكراتها الشخصية وصوراً عتيقة تكشف عن عمق روحانيتها، مؤكدة أن الصمت ليس هروباً بل هو مساحة للقاء الروح الإلهية.",
        en: "The archives preserve her personal journals and faded photos revealing her spiritual depth, illustrating that silence is a fortress of strength."
      },
      liturgy: {
        ar: "كانت ترتب الصلوات الهادئة تحت الأرض، حيث يتلو المؤمنون التراتيل بهمس، لتبقى الليتورجيا حية رغم الظروف العسكرية القاسية.",
        en: "She organized hushed prayers underground, where families chanted hymns in whispers to keep the liturgy alive amidst extreme conditions."
      },
      panel: {
        ar: "تظهر الأيقونة الأثرية ماريا بملابس داكنة تحمل صليباً صغيراً وسراجاً نحاسياً متوهجاً، معبرةً عن الإيمان المحفوظ في غياهب الظلمة.",
        en: "The devotional icon portrays Maria in simple dark vestments, holding a small wooden cross and a glowing oil lamp amid the shadows."
      },
      chapel: {
        ar: "قبو الدير القديم المهدم الذي حولته بصلواتها الدائمة إلى كنيسة سرية، ممتلئة بالسكينة والسلام الروحي للنازحين المحتمين بصلواتها.",
        en: "The ancient abbey crypt which her persistent prayers turned into a hidden chapel, radiating celestial serenity to the refugees she shielded."
      }
    },
    monastery: {
      name: { ar: "أطلال دير سيدة الظلال الأثري", en: "The Abbey Ruins of Our Lady of Shadows" },
      desc: { ar: "يقع هذا المعلم الروحي النادر في السهول الشمالية الهادئة، وهو اليوم ملاذ للتأمل الروحي، يضم الكهوف والمخابئ المكتشفة التي شهدت على صلوات القديسة ماريا وبطولتها الصامتة.",
              en: "This rare spiritual monument in the peaceful Northern Plains is now a sanctuary for silent retreats, preserving the safe caves and vaults that witnessed Saint Maria's prayers." },
      locationText: { ar: "السهول الشمالية، بولندا", en: "Northern Plains, Poland" },
      image: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=800"
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
    currentTab,
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
    // If we have selectedSaint but no selectedSaintId, sync it
    if (selectedSaint && !selectedSaintId) {
      setSelectedSaintId(selectedSaint.id);
    }
  }, [selectedSaint, selectedSaintId, setSelectedSaintId]);

  useEffect(() => {
    if (!selectedSaintId) return;

    // If the already loaded saint matches the id, we don't need to load again
    if (selectedSaint && selectedSaint.id === selectedSaintId && selectedSaint.biography && selectedSaint.reflection) {
      return;
    }

    let isMounted = true;
    const loadSaint = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch detailed data from server using the ID
        const detailedSaint = await archivesAdapter.getSacredStoryById(selectedSaintId);
        if (isMounted) {
          setSelectedSaint(detailedSaint);
        }
      } catch (err) {
        console.warn("Failed to fetch saint details from API, seeking local database", err);
        // Fallback to local SAINTS_DATA matching the ID
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
        ar: `يحتفظ الأرشيف بكافة التسجيلات والمقالات التي تعبر عن هويته الروحية ودوره التاريخي في إرشاد المؤمنين.`,
        en: `The archive preserves all key documents, journals, and articles expressing his profound spirituality and historical guidance.`
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
          onToggleSermon={() => setIsAmbientPlaying(!isAmbientPlaying)}
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

        {/* SECTION: SACRED VIDEO ARCHIVE (التسجيل المقدس والفيلم الوثائقي) */}
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

        {/* SACRED TIMELINE COMPONENT */}
        <div id="holy-path-section">
          <SacredTimeline
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

        {/* SACRED GALLERY COMPONENT */}
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

        {/* SECTION D: SACRED STORIES TABS (قصص مقدسة) */}
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
    </div>
  );
}
