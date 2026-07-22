import { SacredStoriesResponse, SacredStoryItem } from "../models/sacred_Story_model";

// قراءة الـ API Base URL من بيئة العمل (Vite env)
// وفي حالة عدم وجوده يتم الرجوع للعنوان الافتراضي (Fallback)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7131";

export async function fetchFeaturedStories(pageSize: number = 3): Promise<SacredStoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/SacredStories?PageSize=${pageSize}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    const result: SacredStoriesResponse = await response.json();

    if (result.succeeded && result.data?.items) {
      return result.data.items;
    }

    return [];
  } catch (error) {
    console.error("Error in fetchFeaturedStories:", error);
    throw error;
  }
}