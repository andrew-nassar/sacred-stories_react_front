export interface Saint {
  id: string;
  name: string;
  era: string;
  title: string;
  subtitle: string;
  image: string;
  biography: string;
  reflection: string;
  canonized: string;
  feastDay: string;
  patronage: string;
  location: string;
  quote: string;
  colorTheme: string; // 'gold' | 'burgundy' | 'navy'
  videoUrl?: string;
  burialPlace?: {
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    googleMapsUrl: string;
    coverImage: string;
  } | null;
  rawTimeline?: Array<{
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
}

export interface Church {
  id: string;
  name: string;
  location: string;
  description: string;
  dedication: string;
  historicalNote: string;
  image: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  saintId?: string;
  importance: 'high' | 'medium' | 'low';
}

export type TabId = "home" | "saints" | "churches" | "timeline" | "about" | "saint-details";
