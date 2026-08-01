import { apiFetch } from "../../services/httpService";
import { SacredStoriesResponse, SacredStoryItem, SacredStoryType } from "../models/sacred_Story_model";

export interface FetchStoriesParams {
  searchTerm?: string;
  type?: number;
  status?: number; // 0: Pending, 1: Published, 2: Rejected (اختياري)
  pageNumber?: number;
  pageSize?: number;
}

/**
 * جلب القصص مع دعم البحث، النوع، الحالة، والتصفح
 * لا يوجد status افتراضي لكي لا يؤثر على باقي أجزاء الموقع
 */
export async function fetchSacredStories(
  params: FetchStoriesParams = {}
): Promise<SacredStoriesResponse> {
  try {
    const { status, searchTerm, type, pageNumber, pageSize } = params;

    const query = new URLSearchParams();

    if (searchTerm) {
      query.append("SearchTerm", searchTerm);
    }
    if (type !== undefined && type !== null) {
      query.append("Type", type.toString());
    }
    // يتم إرسال Status فقط إذا تم تمريره صراحةً عند الاستدعاء
    if (status !== undefined && status !== null) {
      query.append("Status", status.toString());
    }
    if (pageNumber !== undefined) {
      query.append("PageNumber", pageNumber.toString());
    }
    if (pageSize !== undefined) {
      query.append("PageSize", pageSize.toString());
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";
    
    return await apiFetch<SacredStoriesResponse>(`/api/SacredStories${queryString}`);
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
 * جلب أنواع القصص المتاحة
 */
export async function fetchStoryTypes(): Promise<SacredStoryType[]> {
  try {
    return await apiFetch<SacredStoryType[]>('/api/SacredStories/types');
  } catch (error) {
    console.error("Error in fetchStoryTypes:", error);
    return [];
  }
}