export interface BurialPlace {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  coverImage: string;
}

export interface TimelineItemApi {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface SacredGalleryItemApi {
  id: string;
  title: string;
  imageUrl: string;
}

export interface SacredStoryData {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  videoUrl: string;
  biography: string;
  status: number;
  rejectionReason: string | null;
  burialPlace: BurialPlace | null;
  timeline: TimelineItemApi[];
  sacredGallery: SacredGalleryItemApi[];
}

export interface SacredStoryResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: any;
  data: SacredStoryData;
}