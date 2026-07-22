// File: src/features/sacred_stories/models/sacred_story.ts

export interface SacredStory {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: number;
}

export interface PaginatedStoriesResponse {
  statusCode: number;
  succeeded: boolean;
  message: string;
  data: {
    items: SacredStory[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface FetchStoriesParams {
  searchTerm?: string;
  type?: number;
  status?: number;
  pageNumber?: number;
  pageSize?: number;
}
