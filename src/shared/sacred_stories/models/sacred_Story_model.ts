export interface SacredStoryItem {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: number;
}

export interface SacredStoriesResponse {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: any;
  data: {
    items: SacredStoryItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}