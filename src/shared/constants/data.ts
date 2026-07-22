import { Saint, Church, TimelineEvent } from "../types";

export const SAINTS_DATA: Saint[] = [
  {
    id: "maria-shadows",
    name: "St. Maria of the Shadows",
    era: "1920 – 1944",
    title: "The Silent Witness of the Northern Plains",
    subtitle: "A silent light enduring through the deepest darkness of the mid-century conflict, preserving faith in hidden sanctuaries.",
    image: "/src/assets/images/maria_shadows_portrait_1784383647571.jpg",
    biography: "St. Maria of the Shadows lived during one of the most tumultuous periods of modern history. Operating in secret behind occupied lines, she ran a network of underground shelters, shielding those persecuted by totalitarian regimes. Rather than speaking out and risking her charges, she committed herself to a life of complete spiritual silence, praying in the dark corridors of ruined abbeys. She was captured in the winter of 1944, leaving behind only a handwritten Psalter and a reputation for miraculous quietude that calmed even her captors.",
    reflection: "In a world dominated by noise, the witness of silence is a powerful form of resistance. Maria teaches us that our deepest work often happens in the shadows, unobserved by the world but radiating eternal light.",
    canonized: "October 12, 1994",
    feastDay: "December 4th",
    patronage: "The Silent, the Persecuted, Spiritual Directors",
    location: "The Northern Plains",
    quote: "In the silence of the heart, the eternal flame is guarded. The shadows cannot extinguish what they do not comprehend.",
    colorTheme: "burgundy"
  },
  {
    id: "oscar-salvador",
    name: "Oscar of San Salvador",
    era: "1952 – 1980",
    title: "Voice for the Voiceless",
    subtitle: "A modern prophet of peace who stood with the oppressed, speaking truth to power until his final breath at the altar.",
    image: "/src/assets/images/oscar_salvador_portrait_1784383657074.jpg",
    biography: "An archbishop of deep humility, Oscar Romero began his ministry as a quiet, bookish scholar. However, witnessing the severe oppression and state-sanctioned violence against the rural poor of El Salvador transformed him into an outspoken defender of human rights. Through his weekly radio sermons, he became the primary source of truth for an entire nation. On March 24, 1980, while celebrating Mass in a small hospital chapel, he was assassinated by a lone marksman, sealing his testimony of sacrificial love.",
    reflection: "True faith requires us to step out of comfortable complacency. Oscar reminds us that our voices must be lent to those who have been silenced by injustice, even when the cost of speaking is absolute.",
    canonized: "October 14, 2018",
    feastDay: "March 24th",
    patronage: "Human Rights Defenders, Americas, Broadcasters",
    location: "San Salvador",
    quote: "If they kill me, I will rise again in the Salvadoran people. Let my blood be a seed of freedom and a sign of hope.",
    colorTheme: "gold"
  },
  {
    id: "shore-martyrs",
    name: "The Martyrs of the Shore",
    era: "1985 – 2015",
    title: "Eternal Faith by the Azure Sea",
    subtitle: "Twenty-one courageous witnesses who sang liturgies of hope under a celestial sky, remaining steadfast in their final hour.",
    image: "/src/assets/images/shore_martyrs_portrait_1784383668675.jpg",
    biography: "The Martyrs of the Shore refers to a group of migrant workers captured in North Africa. Faced with renouncing their ancestral heritage or paying the ultimate penalty, they stood unified on a rocky beach. Onlookers and historical transcripts record that in their final moments, they quietly whispered the name of their Savior and chanted ancient hymns of hope, their eyes fixed on the starry expanse above. Their dignity and unshakable grace stunned the world, leaving a testimony written on the sands.",
    reflection: "The shore represents the boundary between the temporal world and the infinite ocean of eternity. These young witnesses remind us that true strength is gentle, unwavering, and beautifully anchored in community.",
    canonized: "May 11, 2015",
    feastDay: "February 15th",
    patronage: "Migrant Workers, Sailors, Unjustly Accused",
    location: "The Mediterranean Shore",
    quote: "Our feet are on the shore of mortality, but our eyes behold the starry gates of the heavenly kingdom.",
    colorTheme: "navy"
  },
  {
    id: "maximilian-kolbe",
    name: "St. Maximilian Kolbe",
    era: "1894 – 1941",
    title: "The Apostle of Auschwitz",
    subtitle: "A Polish friar who offered his life to spare a stranger in the hunger bunker of Auschwitz, turning a cell of death into a temple of praise.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800",
    biography: "Maximilian Kolbe was a Franciscan friar who pioneered modern publishing and media to spread spiritual devotion. During WWII, he was arrested for sheltering thousands of refugees, including Jewish families, in his monastery. Sent to Auschwitz, he maintained his priestly dignity under brutal labor conditions. When a prisoner escaped and ten men were condemned to starve in retaliation, Kolbe stepped forward to take the place of Franciszek Gajowniczek, a man with a wife and children. He led the dying prisoners in songs and prayers until his martyrdom on August 14, 1941.",
    reflection: "Kolbe redefined victory. In the heart of an engine of hatred, he proved that sacrificial love is the final word, illuminating the dark night of humanity with a brilliant, golden light.",
    canonized: "October 10, 1982",
    feastDay: "August 14th",
    patronage: "Families, Journalists, Political Prisoners",
    location: "Auschwitz, Poland",
    quote: "Hatred is not a creative force. Only love is creative.",
    colorTheme: "gold"
  },
  {
    id: "edith-stein",
    name: "St. Edith Stein",
    era: "1891 – 1942",
    title: "Philosopher of the Cross",
    subtitle: "A brilliant phenomenologist who crossed from intellectual skepticism to the contemplative depth of Carmel, embracing martyrdom.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800",
    biography: "Born into an orthodox Jewish family, Edith Stein became a renowned German philosopher and assistant to Edmund Husserl. Her search for truth led her to read the autobiography of St. Teresa of Avila, prompting her conversion. She entered the Carmelites as Sister Teresa Benedicta of the Cross. As persecution mounted, she was transferred to the Netherlands, but was eventually arrested by the Gestapo. She met her end in the chambers of Auschwitz, comforting frightened children and leading her sisters in unwavering calm.",
    reflection: "Edith Stein bridged the intellect and the spirit. She teaches us that the rigorous search for truth leads ultimately to the mystery of the Cross, where all wisdom finds its peaceful resolution.",
    canonized: "October 11, 1998",
    feastDay: "August 9th",
    patronage: "Europe, Philosophers, Converts",
    location: "Auschwitz / Cologne",
    quote: "Do not accept anything as love which lacks truth, and do not accept anything as truth which lacks love.",
    colorTheme: "burgundy"
  },
  {
    id: "alexander-men",
    name: "Fr. Alexander Men",
    era: "1935 – 1990",
    title: "A Light in the Soviet Winter",
    subtitle: "A brave theologian who guided thousands of intellectuals back to sacred roots during the collapse of the Soviet Union.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800",
    biography: "Father Alexander Men was an Orthodox priest and intellectual who worked underground during the height of Soviet state atheism. Armed with deep knowledge of history, science, and world religions, he wrote monumental works explaining the spiritual history of humanity. As state restrictions eased, he preached to packed lecture halls, restoring the soul of an entire generation of scientists and artists. On September 9, 1990, while walking to his church to celebrate liturgy, he was struck down by an unknown assailant, sealing his apostolate of hope.",
    reflection: "Fr. Alexander represents the triumph of intellectual faith over materialist despair. His legacy shows that the hunger for the transcendent is indestructible and will always bloom after the winter.",
    canonized: "Formally venerated in global calendars",
    feastDay: "September 9th",
    patronage: "Theologians, Scientists, Russian Writers",
    location: "Moscow",
    quote: "Christianity is not an ideology, it is a life-giving stream of love. It is only beginning to dawn on humanity.",
    colorTheme: "navy"
  }
];

export const CHURCHES_DATA: Church[] = [
  {
    id: "chapel-divine-providence",
    name: "Chapel of Divine Providence",
    location: "San Salvador, El Salvador",
    description: "The small, serene hospital chapel where Archbishop Oscar Romero celebrated his final Mass on March 24, 1980.",
    dedication: "St. Oscar Romero",
    historicalNote: "It remains a site of perpetual prayer and silent remembrance, preserved exactly as it was, containing the vestments and chalice from that faithful day.",
    image: "https://images.unsplash.com/photo-1548625361-155deee26151?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: "sanctuary-silent-plains",
    name: "Sanctuary of the Silent Plains",
    location: "Ancient Abbey Ruins, Germany",
    description: "The underground crypt where St. Maria of the Shadows held clandestine liturgies for those she rescued.",
    dedication: "St. Maria of the Shadows",
    historicalNote: "An architectural marvel of medieval brickwork, where light enters only through narrow glass apertures, casting subtle beams on the altar stone.",
    image: "https://images.unsplash.com/photo-1438263308735-65a251ef958a?auto=format&fit=crop&q=80&w=1200&h=800"
  },
  {
    id: "shrine-shore",
    name: "The Shrine of Azure Shores",
    location: "Stony Coastline, Egypt",
    description: "A gorgeous modern cathedral constructed on the rugged coastline overlooking the sea where the 21 witnesses gave their final testimony.",
    dedication: "The Martyrs of the Shore",
    historicalNote: "The sanctuary's ceiling is designed like a cosmic starry vault, mirroring the exact constellations that shone in the night sky during their sacrifice.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200&h=800"
  }
];

export const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: "1916",
    title: "Charles de Foucauld in the Sahara",
    subtitle: "Hermit of the Desert",
    description: "Charles de Foucauld is martyred in his Sahara hermitage, leaving a legacy of contemplative presence and quiet, universal brotherhood.",
    importance: "medium"
  },
  {
    year: "1941",
    title: "The Sacrifice of Maximilian Kolbe",
    subtitle: "The Cell of Charity",
    description: "Maximilian Kolbe steps forward in Auschwitz to exchange places with a condemned husband, redefining love in the depths of human darkness.",
    saintId: "maximilian-kolbe",
    importance: "high"
  },
  {
    year: "1942",
    title: "Edith Stein enters Auschwitz",
    subtitle: "Science of the Cross",
    description: "The philosopher Edith Stein is taken from the Dutch Carmel, walking with serene dignity into the darkness, comforting everyone she meets.",
    saintId: "edith-stein",
    importance: "high"
  },
  {
    year: "1944",
    title: "The Arrest of Maria of the Shadows",
    subtitle: "The Echoes of Silence",
    description: "St. Maria of the Shadows is captured after guiding her final group to safety, leaving a legacy of quiet holiness on the plains.",
    saintId: "maria-shadows",
    importance: "high"
  },
  {
    year: "1980",
    title: "The Martyrdom of Oscar Romero",
    subtitle: "Sermon at the Altar",
    description: "Archbishop Oscar Romero is assassinated while elevating the host, giving his life as a peaceful sacrifice for his suffering flock.",
    saintId: "oscar-salvador",
    importance: "high"
  },
  {
    year: "1990",
    title: "The striking down of Alexander Men",
    subtitle: "Winter's End in Moscow",
    description: "Fr. Alexander Men, the pioneer of religious freedom in the USSR, is martyred on his path to church, having revived faith in millions of hearts.",
    saintId: "alexander-men",
    importance: "high"
  },
  {
    year: "2015",
    title: "Witness of the Shore",
    subtitle: "Liturgies on the Beach",
    description: "The 21 migrant workers stand steadfast on the Mediterranean shore, whispering prayers as they pass from temporal life to cosmic eternity.",
    saintId: "shore-martyrs",
    importance: "high"
  }
];
