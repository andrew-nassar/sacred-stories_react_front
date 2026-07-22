// File: src/features/saints/adapters/saintsAdapter.ts

import { apiFetch } from "../../../shared/services/httpService";
import { 
  ApiStoryItem, 
  SacredStoryDetail, 
  PaginatedResponse, 
  GetStoriesParams 
} from "../store/types";

export const saintsAdapter = {
  async getSacredStories(params: GetStoriesParams = {}): Promise<PaginatedResponse<ApiStoryItem>> {
    const queryParts: string[] = [];
    if (params.searchTerm) queryParts.push(`SearchTerm=${encodeURIComponent(params.searchTerm)}`);
    if (params.type !== undefined) queryParts.push(`Type=${params.type}`);
    if (params.status !== undefined) queryParts.push(`Status=${params.status}`);
    if (params.pageNumber !== undefined) queryParts.push(`PageNumber=${params.pageNumber}`);
    if (params.pageSize !== undefined) queryParts.push(`PageSize=${params.pageSize}`);
    
    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    return apiFetch<PaginatedResponse<ApiStoryItem>>(`/api/SacredStories${queryString}`);
  },

  async getSacredStoryById(id: string): Promise<PaginatedResponse<SacredStoryDetail>> {
    return apiFetch<PaginatedResponse<SacredStoryDetail>>(`/api/SacredStories/${id}`);
  }
};
