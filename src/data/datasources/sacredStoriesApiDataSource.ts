import { apiFetch } from "../../core/http/apiClient";
import { GetStoriesParams } from "../../domain/entities/sacredStory";

export interface ApiStoryItemDto {
  id: string;
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  status: number;
}

export interface ApiStoriesResponseDto {
  statusCode: number;
  succeeded: boolean;
  message: string;
  data: {
    items: ApiStoryItemDto[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface ApiDetailResponseDto {
  statusCode: number;
  succeeded: boolean;
  message: string;
  data: {
    id: string;
    type: number;
    name: string;
    coverImage: string;
    famousQuote: string;
    status: number;
    videoUrl?: string | null;
    biography: string;
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

export class SacredStoriesApiDataSource {
  async fetchStories(params?: GetStoriesParams): Promise<ApiStoriesResponseDto> {
    const queryParts: string[] = [];
    if (params?.searchTerm) queryParts.push(`SearchTerm=${encodeURIComponent(params.searchTerm)}`);
    if (params?.type !== undefined && params?.type !== null) queryParts.push(`Type=${params.type}`);
    if (params?.status !== undefined && params?.status !== null) queryParts.push(`Status=${params.status}`);
    if (params?.pageNumber) queryParts.push(`PageNumber=${params.pageNumber}`);
    if (params?.pageSize) queryParts.push(`PageSize=${params.pageSize}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    return apiFetch<ApiStoriesResponseDto>(`api/SacredStories${queryString}`);
  }

  async fetchStoryById(id: string): Promise<ApiDetailResponseDto> {
    return apiFetch<ApiDetailResponseDto>(`api/SacredStories/${encodeURIComponent(id)}`);
  }
}
