import { apiFetch } from "./httpService";
import { Saint } from "../../../data";

export interface SearchResponse {
  saint: Saint;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

export interface ChatResponse {
  response: string;
}

export interface ReflectionResponse {
  reflection: string;
}

export interface ApiStoryItem {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: number;
}

export interface ApiStoriesResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: any;
  data: {
    items: ApiStoryItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface ApiDetailResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: any;
  data: {
    id: string;
    type: number;
    name: string;
    coverImage: string;
    famousQuote: string;
    videoUrl?: string;
    biography: string;
    status: number;
    rejectionReason?: string | null;
    burialPlace?: {
      name: string;
      description: string;
      address: string;
      latitude: number;
      longitude: number;
      googleMapsUrl: string;
      coverImage: string;
    } | null;
    timeline?: Array<{
      id: string;
      date: string;
      title: string;
      description: string;
    }>;
    sacredGallery?: Array<{
      id: string;
      title: string;
      imageUrl: string;
    }>;
  };
}

export function getSaintTitleByType(type: number): string {
  switch (type) {
    case 0: return "Saint of the Holy Church";
    case 1: return "Pope & Bishop of Rome";
    case 2: return "Apostle of Christ";
    case 3: return "Holy Martyr";
    case 4: return "Venerable Monk";
    case 5: return "Biblical Character";
    default: return "Sacred Story Witness";
  }
}

export function getSaintTypeLabel(type: number): string {
  switch (type) {
    case 0: return "Saints";
    case 1: return "Popes";
    case 2: return "Apostles";
    case 3: return "Martyrs";
    case 4: return "Monks";
    case 5: return "Biblical Characters";
    default: return "Holy Witnesses";
  }
}

export function getSaintEraByType(type: number): string {
  switch (type) {
    case 2: case 5: return "Biblical Era";
    case 0: case 1: case 3: case 4: return "Historic Era";
    default: return "Unknown Era";
  }
}

export function getColorThemeByType(type: number): string {
  switch (type) {
    case 3: return "burgundy"; // Martyr
    case 1: case 4: return "navy"; // Pope, Monk
    default: return "gold"; // Saint, Apostle, Biblical Character
  }
}

export function mapApiStoryToSaint(item: ApiStoryItem): Saint {
  const type = item.type ?? 0;
  return {
    id: item.id || "",
    name: item.name || "",
    era: getSaintEraByType(type),
    title: getSaintTitleByType(type),
    subtitle: item.famousQuote || "",
    image: item.coverImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    biography: "",
    reflection: "",
    canonized: "N/A",
    feastDay: "N/A",
    patronage: getSaintTypeLabel(type),
    location: "N/A",
    quote: item.famousQuote || "",
    colorTheme: getColorThemeByType(type),
  };
}

export function mapApiDetailToSaint(detail: any): Saint {
  const type = detail.type ?? 0;
  
  let era = getSaintEraByType(type);
  if (detail.timeline && detail.timeline.length > 0) {
    const dates = detail.timeline
      .map((t: any) => {
        if (!t.date) return null;
        const match = t.date.match(/\d{4}/);
        return match ? parseInt(match[0], 10) : null;
      })
      .filter((y: any): y is number => y !== null);
    if (dates.length > 0) {
      const minYear = Math.min(...dates);
      const maxYear = Math.max(...dates);
      era = minYear === maxYear ? `${minYear}` : `${minYear} – ${maxYear}`;
    }
  }

  return {
    id: detail.id || "",
    name: detail.name || "",
    era: era,
    title: getSaintTitleByType(type),
    subtitle: detail.famousQuote || "",
    image: detail.coverImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    biography: detail.biography || "",
    reflection: detail.burialPlace?.description || detail.famousQuote || "A beautiful witness of faith and contemplation.",
    canonized: detail.timeline?.length ? detail.timeline[detail.timeline.length - 1].date : "N/A",
    feastDay: "N/A",
    patronage: getSaintTypeLabel(type),
    location: detail.burialPlace?.name || detail.burialPlace?.address || "N/A",
    quote: detail.famousQuote || "",
    colorTheme: getColorThemeByType(type),
    videoUrl: detail.videoUrl,
    burialPlace: detail.burialPlace,
    rawTimeline: detail.timeline,
    sacredGallery: detail.sacredGallery,
  };
}

export const archivesAdapter = {
  async searchArchives(query: string): Promise<SearchResponse> {
    return apiFetch<SearchResponse>("/api/search-archives", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  async archivistChat(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    return apiFetch<ChatResponse>("/api/archivist-chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  },

  async generateReflection(situation: string, saintName?: string): Promise<ReflectionResponse> {
    return apiFetch<ReflectionResponse>("/api/generate-reflection", {
      method: "POST",
      body: JSON.stringify({ situation, saintName }),
    });
  },

  async getSacredStories(params: {
    searchTerm?: string;
    type?: number;
    status?: number;
    pageNumber?: number;
    pageSize?: number;
  } = {}): Promise<ApiStoriesResponse> {
    const queryParts: string[] = [];
    if (params.searchTerm) queryParts.push(`SearchTerm=${encodeURIComponent(params.searchTerm)}`);
    if (params.type !== undefined) queryParts.push(`Type=${params.type}`);
    if (params.status !== undefined) queryParts.push(`Status=${params.status}`);
    if (params.pageNumber !== undefined) queryParts.push(`PageNumber=${params.pageNumber}`);
    if (params.pageSize !== undefined) queryParts.push(`PageSize=${params.pageSize}`);
    
    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    return apiFetch<ApiStoriesResponse>(`/SacredStories${queryString}`);
  },

  async getSacredStoryById(id: string): Promise<Saint> {
    const response = await apiFetch<ApiDetailResponse>(`/SacredStories/${id}`);
    if (response && response.succeeded && response.data) {
      return mapApiDetailToSaint(response.data);
    }
    throw new Error("Failed to load details for the selected sacred story.");
  }
};
