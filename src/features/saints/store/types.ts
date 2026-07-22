// File: src/features/saints/store/types.ts

export interface ApiStoryItem {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: number;
}

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

export interface PaginatedResponse<T> {
  statusCode: number;
  succeeded: boolean;
  message: string;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface GetStoriesParams {
  searchTerm?: string;
  type?: number;
  status?: number;
  pageNumber?: number;
  pageSize?: number;
}
