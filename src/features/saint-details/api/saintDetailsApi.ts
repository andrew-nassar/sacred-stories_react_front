import { SacredStoryResponse, SacredStoryData } from "../types/saintDetails.types";
import { apiFetch } from "@/src/shared/services/httpService";

export async function getSacredStoryById(id: string): Promise<SacredStoryData> {
  const result = await apiFetch<SacredStoryResponse>(`/api/SacredStories/${id}`);

  if (!result.succeeded || !result.data) {
    throw new Error(result.message || "Failed to retrieve sacred story details.");
  }

  return result.data;
}