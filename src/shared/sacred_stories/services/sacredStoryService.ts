import { SacredStoriesResponse, SacredStoryItem, SacredStoryType } from "../models/sacred_Story_model";
import { apiFetch } from "@/src/shared/services/httpService"; // Adjust relative path if needed

export interface FetchStoriesParams {
  searchTerm?: string;
  type?: number;
  status?: number;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Fetch stories with support for search, type, status (including pending = 0), and pagination.
 * Automatically attaches Authorization Bearer token via apiFetch.
 */
export async function fetchSacredStories(params: FetchStoriesParams = {}): Promise<SacredStoriesResponse> {
  try {
    const query = new URLSearchParams();

    if (params.searchTerm) {
      query.append("SearchTerm", params.searchTerm);
    }
    if (params.type !== undefined && params.type !== null) {
      query.append("Type", params.type.toString());
    }
    if (params.status !== undefined && params.status !== null) {
      query.append("Status", params.status.toString());
    }
    if (params.pageNumber !== undefined) {
      query.append("PageNumber", params.pageNumber.toString());
    }
    if (params.pageSize !== undefined) {
      query.append("PageSize", params.pageSize.toString());
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";

    return await apiFetch<SacredStoriesResponse>(`/api/SacredStories${queryString}`, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
  } catch (error) {
    console.error("Error in fetchSacredStories:", error);
    throw error;
  }
}

/**
 * Fetch featured stories
 */
export async function fetchFeaturedStories(pageSize: number = 3): Promise<SacredStoryItem[]> {
  try {
    const result = await fetchSacredStories({ pageSize });
    if (result.succeeded && result.data?.items) {
      return result.data.items;
    }
    return [];
  } catch (error) {
    console.error("Error in fetchFeaturedStories:", error);
    throw error;
  }
}

/**
 * Fetch available story types
 */
export async function fetchStoryTypes(): Promise<SacredStoryType[]> {
  try {
    return await apiFetch<SacredStoryType[]>('/api/SacredStories/types', {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    });
  } catch (error) {
    console.error("Error in fetchStoryTypes:", error);
    return [];
  }
}