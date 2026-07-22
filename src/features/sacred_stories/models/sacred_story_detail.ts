// File: src/features/sacred_stories/models/sacred_story_detail.ts

export interface BurialPlace {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  coverImage: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface SacredGalleryItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface SacredStoryDetail {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: number;
  videoUrl?: string;
  biography: string;
  rejectionReason?: string | null;
  burialPlace: BurialPlace | null;
  timeline: TimelineItem[];
  sacredGallery: SacredGalleryItem[];
}
