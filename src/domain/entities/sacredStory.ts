export enum StoryType {
  Saint = 0,
  Pope = 1,
  Apostle = 2,
  Martyr = 3,
  Monk = 4,
  BiblicalCharacter = 5,
}

export enum StoryStatus {
  UnderReview = 0,
  Published = 1,
  Archived = 2,
}

export interface SacredStoryListItem {
  id: string;
  type: StoryType;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: StoryStatus;
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

export interface SacredStoryDetail extends SacredStoryListItem {
  videoUrl?: string | null;
  biography: string;
  rejectionReason?: string | null;
  burialPlace?: BurialPlace | null;
  timeline?: TimelineItem[];
  sacredGallery?: SacredGalleryItem[];
}

export interface PaginatedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface GetStoriesParams {
  searchTerm?: string;
  type?: StoryType;
  status?: StoryStatus;
  pageNumber?: number;
  pageSize?: number;
}
