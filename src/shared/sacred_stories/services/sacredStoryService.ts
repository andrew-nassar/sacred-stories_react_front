import { SacredStoriesResponse, SacredStoryItem, SacredStoryType } from "../models/sacred_Story_model";

// قراءة الـ API Base URL من بيئة العمل (Vite env) مع Fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7131";

export interface FetchStoriesParams {
  searchTerm?: string;
  type?: number;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * جلب القصص مع دعم البحث، النوع، والتصفح (بدون Status)
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
    if (params.pageNumber !== undefined) {
      query.append("PageNumber", params.pageNumber.toString());
    }
    if (params.pageSize !== undefined) {
      query.append("PageSize", params.pageSize.toString());
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await fetch(`${API_BASE_URL}/api/SacredStories${queryString}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchSacredStories:", error);
    throw error;
  }
}

/**
 * جلب أبرز القصص (Featured Stories)
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
 * جلب أنواع القصص المتاحة (من 0 إلى 5)
 */
export async function fetchStoryTypes(): Promise<SacredStoryType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/SacredStories/types`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch story types: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchStoryTypes:", error);
    return [];
  }
}