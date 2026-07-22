import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization of Gemini client to avoid crashes on missing keys
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Dynamic features will fall back.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Seed data for Sacred Stories REST endpoints
  const MOCK_SACRED_STORIES = [
    {
      id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
      type: 3, // Holy Martyr
      status: 1, // Published
      name: "St. Maximilian Kolbe",
      coverImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800",
      famousQuote: "Hatred is not a creative force. Only love is creative.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      biography: "Maximilian Kolbe was a Franciscan friar who pioneered modern publishing and media to spread spiritual devotion. During WWII, he was arrested for sheltering refugees in his monastery. Sent to Auschwitz, he maintained his priestly dignity under brutal labor conditions. When a prisoner escaped and ten men were condemned to starve in retaliation, Kolbe stepped forward to take the place of Franciszek Gajowniczek, a husband and father. He led the dying prisoners in songs and prayers until his martyrdom on August 14, 1941.",
      rejectionReason: null,
      burialPlace: {
        name: "Niepokalanów Shrine & Auschwitz Memorial",
        description: "A sanctuary of self-giving love where millions gather to remember Kolbe's heroic martyrdom.",
        address: "Teresin, near Warsaw, Poland",
        latitude: 52.2033,
        longitude: 20.4042,
        googleMapsUrl: "https://maps.google.com/?q=Niepokalanow+Poland",
        coverImage: "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=800"
      },
      timeline: [
        { id: "t-101", date: "1894-01-08", title: "Birth in Zduńska Wola", description: "Born into a devout family dedicated to simple labor and deep piety." },
        { id: "t-102", date: "1927-10-01", title: "Niepokalanów Founding", description: "Established the legendary monastery that specialized in mass spiritual publishing." },
        { id: "t-103", date: "1941-08-14", title: "Supreme Sacrifice in Auschwitz", description: "Volunteered to starve in place of a complete stranger inside Auschwitz." }
      ],
      sacredGallery: [
        { id: "g-101", title: "Prison Habit No. 16670", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300" },
        { id: "g-102", title: "Manual Printing Press", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300" },
        { id: "g-103", title: "Personal Wooden Cross", imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300" }
      ]
    },
    {
      id: "a3b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
      type: 1, // Pope
      status: 1, // Published
      name: "St. Oscar Romero",
      coverImage: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600&h=800",
      famousQuote: "If they kill me, I will rise again in the Salvadoran people.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      biography: "Oscar Romero began his ministry as a quiet, bookish scholar. However, witnessing the severe oppression and state-sanctioned violence against the rural poor of El Salvador transformed him into an outspoken defender of human rights. Through his weekly radio sermons, he became the primary voice of truth for an entire nation. On March 24, 1980, while celebrating Mass in a small hospital chapel, he was assassinated by a lone marksman, sealing his testimony of sacrificial love.",
      rejectionReason: null,
      burialPlace: {
        name: "Chapel of Divine Providence & Metropolitan Cathedral",
        description: "The serene hospital chapel where Archbishop Oscar Romero celebrated his final Mass on March 24, 1980.",
        address: "San Salvador, El Salvador",
        latitude: 13.6929,
        longitude: -89.2182,
        googleMapsUrl: "https://maps.google.com/?q=Metropolitan+Cathedral+San+Salvador",
        coverImage: "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=800"
      },
      timeline: [
        { id: "t-201", date: "1917-08-15", title: "Birth in Ciudad Barrios", description: "Born in a humble mountain town, his spiritual calling shone early." },
        { id: "t-202", date: "1977-02-23", title: "Appointed Archbishop", description: "Became Archbishop of San Salvador during growing national conflict." },
        { id: "t-203", date: "1980-03-24", title: "Martyrdom at the Altar", description: "Assassinated while elevating the Host during Holy Mass." }
      ],
      sacredGallery: [
        { id: "g-201", title: "Blood-Stained Alb", imageUrl: "https://images.unsplash.com/photo-1548625361-155deee223d0?auto=format&fit=crop&q=80&w=400&h=300" },
        { id: "g-202", title: "Radio Broadcast Microphone", imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300" },
        { id: "g-203", title: "Personal Spectacles and Missal", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300" }
      ]
    },
    {
      id: "c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f",
      type: 3, // Holy Martyr
      status: 1, // Published
      name: "St. Maria of the Shadows",
      coverImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600&h=800",
      famousQuote: "In the silence of the heart, the eternal flame is guarded.",
      videoUrl: null,
      biography: "St. Maria of the Shadows operated in secret behind occupied lines, running an underground network of shelters shielding those persecuted by totalitarian regimes. Committing herself to a life of spiritual silence, she prayed in the dark corridors of ruined abbeys, leaving behind a legacy of quiet holiness.",
      rejectionReason: null,
      burialPlace: {
        name: "Abbey Ruins of Our Lady of Shadows",
        description: "An architectural sanctuary of medieval brickwork where light enters only through narrow glass apertures.",
        address: "Northern Plains, Germany",
        latitude: 51.1657,
        longitude: 10.4515,
        googleMapsUrl: "https://maps.google.com/?q=Northern+Plains+Abbey",
        coverImage: "https://images.unsplash.com/photo-1438263308735-65a251ef958a?auto=format&fit=crop&q=80&w=800"
      },
      timeline: [
        { id: "t-301", date: "1920-04-12", title: "Birth in the Plains", description: "Grew up in a quiet farming community, practicing contemplation." },
        { id: "t-302", date: "1940-11-05", title: "Underground Shelters", description: "Organized a secret supply chain and safe shelters." },
        { id: "t-303", date: "1944-12-04", title: "Silent Martyrdom", description: "Arrested in winter, embracing her witness with serene quietude." }
      ],
      sacredGallery: [
        { id: "g-301", title: "Handwritten Book of Psalms", imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=300" },
        { id: "g-302", title: "Wooden Rosary Beads", imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=400&h=300" },
        { id: "g-303", title: "Brass Oil Lamp", imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400&h=300" }
      ]
    },
    {
      id: "e9f0a1b2-c3d4-4e5f-6a7b-8c9d0e1f2a3b",
      type: 0, // Saint
      status: 1, // Published
      name: "St. Edith Stein",
      coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800",
      famousQuote: "Do not accept anything as love which lacks truth, and do not accept anything as truth which lacks love.",
      videoUrl: null,
      biography: "Born into an orthodox Jewish family, Edith Stein became a renowned German philosopher. Her search for truth led her to read the autobiography of St. Teresa of Avila, prompting her conversion and entrance into Carmel as Sister Teresa Benedicta of the Cross. She met her end in Auschwitz, comforting frightened children and leading her sisters in calm prayer.",
      rejectionReason: null,
      burialPlace: {
        name: "Carmel of Cologne & Auschwitz Shrine",
        description: "A sanctuary dedicated to the philosopher who crossed intellect into deep contemplation.",
        address: "Cologne / Auschwitz, Germany & Poland",
        latitude: 50.9375,
        longitude: 6.9603,
        googleMapsUrl: "https://maps.google.com/?q=Carmel+Cologne",
        coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
      },
      timeline: [
        { id: "t-401", date: "1891-10-12", title: "Birth in Breslau", description: "Born into a Jewish family, showing brilliant academic gift." },
        { id: "t-402", date: "1933-10-14", title: "Entered Carmelite Order", description: "Crossed from academic philosophy to Carmelite contemplative vows." },
        { id: "t-403", date: "1942-08-09", title: "Martyrdom in Auschwitz", description: "Passed into eternal light, remaining serene until her final breath." }
      ],
      sacredGallery: [
        { id: "g-401", title: "Philosophical Manuscripts", imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=300" }
      ]
    },
    {
      id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
      type: 4, // Monk
      status: 1, // Published
      name: "Fr. Alexander Men",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800",
      famousQuote: "Christianity is not an ideology, it is a life-giving stream of love.",
      videoUrl: null,
      biography: "Father Alexander Men was an Orthodox priest and intellectual who worked underground during the height of Soviet state atheism. Armed with deep knowledge of history, science, and world religions, he wrote monumental works explaining spiritual history, preaching to packed halls and restoring faith to thousands.",
      rejectionReason: null,
      burialPlace: {
        name: "Church of the Protection of the Mother of God",
        description: "The village parish outside Moscow where Fr. Alexander ministered to thousands of seekers.",
        address: "Semkhoz, Moscow Region, Russia",
        latitude: 56.3158,
        longitude: 38.1358,
        googleMapsUrl: "https://maps.google.com/?q=Semkhoz+Moscow",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
      },
      timeline: [
        { id: "t-501", date: "1935-01-22", title: "Birth in Moscow", description: "Born during the Soviet era into an underground Christian household." },
        { id: "t-502", date: "1960-09-01", title: "Ordination to Priesthood", description: "Began decades of fearless pastoral work and writing." },
        { id: "t-503", date: "1990-09-09", title: "Martyrdom in Semkhoz", description: "Struck down on his path to celebrate divine liturgy." }
      ],
      sacredGallery: [
        { id: "g-501", title: "Historical Theology Scrolls", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=300" }
      ]
    },
    {
      id: "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
      type: 2, // Apostle
      status: 1, // Published
      name: "The Martyrs of the Shore",
      coverImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600&h=800",
      famousQuote: "Our feet are on the shore of mortality, but our eyes behold the starry gates of the heavenly kingdom.",
      videoUrl: null,
      biography: "Twenty-one courageous migrant workers who stood unified on a Mediterranean beach, whispering prayers and chanting ancient hymns in their final hour, stunning the world with their unshakeable grace.",
      rejectionReason: null,
      burialPlace: {
        name: "Cathedral of the Martyrs of Faith",
        description: "A coastline sanctuary whose ceiling is designed like a cosmic starry vault.",
        address: "Al-Our, Minya, Egypt",
        latitude: 28.0871,
        longitude: 30.7618,
        googleMapsUrl: "https://maps.google.com/?q=Al-Our+Minya+Egypt",
        coverImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800"
      },
      timeline: [
        { id: "t-601", date: "2015-02-15", title: "Martyrdom on the Beach", description: "Stood steadfast on the azure Mediterranean shore with songs of praise." }
      ],
      sacredGallery: [
        { id: "g-601", title: "Constellation Dome Vault", imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400&h=300" }
      ]
    }
  ];

  // GET /api/SacredStories (Paginated list)
  const handleGetSacredStories = (req: express.Request, res: express.Response) => {
    try {
      const searchTerm = req.query.SearchTerm ? String(req.query.SearchTerm).trim().toLowerCase() : "";
      const typeFilter = req.query.Type !== undefined && req.query.Type !== "" ? parseInt(String(req.query.Type), 10) : undefined;
      const statusFilter = req.query.Status !== undefined && req.query.Status !== "" ? parseInt(String(req.query.Status), 10) : undefined;
      const pageNumber = Math.max(1, parseInt(String(req.query.PageNumber || 1), 10));
      const pageSize = Math.max(1, parseInt(String(req.query.PageSize || 10), 10));

      let filtered = [...MOCK_SACRED_STORIES];

      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.famousQuote.toLowerCase().includes(searchTerm) ||
            item.biography.toLowerCase().includes(searchTerm)
        );
      }

      if (typeFilter !== undefined && !isNaN(typeFilter)) {
        filtered = filtered.filter((item) => item.type === typeFilter);
      }

      if (statusFilter !== undefined && !isNaN(statusFilter)) {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }

      const totalCount = filtered.length;
      const startIndex = (pageNumber - 1) * pageSize;
      const paginatedItems = filtered.slice(startIndex, startIndex + pageSize).map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        coverImage: item.coverImage,
        famousQuote: item.famousQuote,
        status: item.status,
      }));

      return res.json({
        statusCode: 200,
        succeeded: true,
        message: "Sacred stories list fetched successfully.",
        data: {
          items: paginatedItems,
          totalCount,
          pageNumber,
          pageSize,
        },
      });
    } catch (error: any) {
      console.error("Error in GET /api/SacredStories:", error);
      return res.status(500).json({
        statusCode: 500,
        succeeded: false,
        message: "Failed to retrieve sacred stories",
        data: null,
      });
    }
  };

  app.get("/api/SacredStories", handleGetSacredStories);
  app.get("/api/sacredstories", handleGetSacredStories);

  // GET /api/SacredStories/:id (Detail view)
  const handleGetSacredStoryById = (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const story = MOCK_SACRED_STORIES.find((s) => s.id === id || s.id.toLowerCase() === id.toLowerCase() || s.name.toLowerCase().includes(id.toLowerCase()));

      if (!story) {
        return res.status(404).json({
          statusCode: 404,
          succeeded: false,
          message: `Sacred story with id '${id}' was not found.`,
          data: null,
        });
      }

      return res.json({
        statusCode: 200,
        succeeded: true,
        message: "Sacred story details fetched successfully.",
        data: story,
      });
    } catch (error: any) {
      console.error("Error in GET /api/SacredStories/:id:", error);
      return res.status(500).json({
        statusCode: 500,
        succeeded: false,
        message: "Failed to retrieve sacred story detail",
        data: null,
      });
    }
  };

  app.get("/api/SacredStories/:id", handleGetSacredStoryById);
  app.get("/api/sacredstories/:id", handleGetSacredStoryById);

  // API Route: Search the archives (Dynamic Saint synthesis using Gemini!)
  app.post("/api/search-archives", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ 
          error: "API key not configured",
          message: "Please configure GEMINI_API_KEY in Secrets to enable dynamic saint search." 
        });
      }

      const prompt = `You are a professional historical theologian and curator of Christian archives. 
Search for or synthesize a high-fidelity biography for a saint, martyr, or witness of faith matching this name or concept: "${query}".
The response must be a valid, beautiful, and deeply moving biographical record. 
If the figure is a well-known historical saint (e.g. St. Francis of Assisi, St. Joan of Arc, St. Augustine), write highly accurate details. 
If the search is general or conceptual, find the closest matching historical Christian saint or martyr.
Return the result in JSON adhering to this schema:
{
  "name": "Full liturgical/liturgical name (e.g., St. Francis of Assisi)",
  "era": "Lifespan or century (e.g., 1181 – 1226)",
  "title": "A poetic, reverent, and powerful descriptive title (e.g., The Troubadour of God)",
  "subtitle": "A one-sentence moving summary of their spiritual presence and witness.",
  "biography": "A deeply engaging, professionally written paragraph (4-5 sentences) about their historical life, trials, accomplishments, and witness.",
  "reflection": "A beautiful spiritual reflection of 2-3 sentences discussing how their sacrifice or lifestyle inspires modern believers today.",
  "canonized": "Date or century of canonization (or 'Pre-Congregation' if ancient, or 'Venerated globally')",
  "feastDay": "Feast day (e.g., October 4th)",
  "patronage": "What they are patrons of (e.g., Ecology, Animals, Merchants)",
  "location": "Main geographical region where they served (e.g., Assisi, Italy)",
  "quote": "A powerful, verifiable, or representative quote by or about them.",
  "colorTheme": "Choose 'gold' (for joy/divinity/humility), 'burgundy' (for sacrifice/martyrdom/passion), or 'navy' (for contemplation/eternity/peace) based on their story."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              era: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              biography: { type: Type.STRING },
              reflection: { type: Type.STRING },
              canonized: { type: Type.STRING },
              feastDay: { type: Type.STRING },
              patronage: { type: Type.STRING },
              location: { type: Type.STRING },
              quote: { type: Type.STRING },
              colorTheme: { type: Type.STRING }
            },
            required: ["name", "era", "title", "subtitle", "biography", "reflection", "canonized", "feastDay", "patronage", "location", "quote", "colorTheme"]
          }
        }
      });

      if (!response.text) {
        throw new Error("Empty response from Gemini");
      }

      const saintData = JSON.parse(response.text.trim());
      // Append a beautiful high-quality Unsplash image keyword-based fallback
      const encodedKeyword = encodeURIComponent(saintData.name || query);
      saintData.image = `https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=600&h=800`; // elegant forest/sky fallback
      
      // Let's customize unsplash fallbacks for better visual pairing:
      if (saintData.colorTheme === "burgundy") {
        saintData.image = `https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=600&h=800`; // solemn interior light
      } else if (saintData.colorTheme === "gold") {
        saintData.image = `https://images.unsplash.com/photo-1548625361-155deee26151?auto=format&fit=crop&q=80&w=600&h=800`; // divine light/arches
      } else {
        saintData.image = `https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=600&h=800`; // quiet nature/starry
      }

      saintData.id = "dynamic-" + Date.now();

      return res.json({ saint: saintData });
    } catch (error: any) {
      console.error("Error in saint search synthesis:", error);
      return res.status(500).json({ error: "Failed to search archives", message: error.message });
    }
  });

  // API Route: Ask the Sacred Archivist anything (Chat with history)
  app.post("/api/archivist-chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ 
          error: "API key not configured",
          message: "Please configure GEMINI_API_KEY in Secrets to use the interactive archivist." 
        });
      }

      // Convert history to Gemini chat contents format if provided, or initialize new chat
      const systemInstruction = `You are the reverent and wise "Sacred Stories Archivist," a digital custodian of Christian martyrology, hagiography, and sacred history. 
Your tone is deeply respectful, editorial, scholarly, and serene. You speak with high-fidelity, humble prose, honoring the memory of those who sacrificed their lives.
Provide historical details, theological reflections, liturgical context, or gentle answers to any question regarding Christian saints, martyrs, monasteries, liturgy, scriptures, or the spiritual life. 
Keep answers scannable and beautiful, using small elegant paragraphs, monospaced labels for dates, and bulleted lessons when useful. 
Avoid sales-pitch terms or contemporary slang. Let your answers feel like reading an ancient, beautifully preserved manuscript under the light of a cathedral window.`;

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.8
        },
        history: history || []
      });

      const response = await chat.sendMessage({ message });
      return res.json({ response: response.text });
    } catch (error: any) {
      console.error("Error in archivist-chat:", error);
      return res.status(500).json({ error: "Failed to connect to archivist", message: error.message });
    }
  });

  // API Route: Dynamic Personal Prayer / Reflection Generator
  app.post("/api/generate-reflection", async (req, res) => {
    try {
      const { situation, saintName } = req.body;
      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({ 
          error: "API key not configured",
          message: "Please configure GEMINI_API_KEY in Secrets to generate custom reflections." 
        });
      }

      const prompt = `Compose a deeply personal and solemn 'Liturgical Prayer & Reflection' for a modern believer who is going through or meditating on: "${situation || "seeking quietude and strength in a busy world"}".
${saintName ? `Gracefully connect this prayer and reflection with the life, virtues, and spiritual wisdom of ${saintName}.` : "You may connect this reflection with the overarching theme of modern sacrifice, silent witness, or unshakeable faith."}
Format your output with:
1. **The Invitation**: A short, beautiful call to quietness.
2. **The Witness**: A brief paragraph connecting their situation to the history of saints/martyrs who faced corresponding spiritual or physical trials.
3. **The Litany/Prayer**: An elegant 3-4 line prayer written in high editorial theological style.
4. **The Daily Action**: A simple, powerful contemplative exercise to practice today.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.9
        }
      });

      return res.json({ reflection: response.text });
    } catch (error: any) {
      console.error("Error generating reflection:", error);
      return res.status(500).json({ error: "Failed to generate reflection", message: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
