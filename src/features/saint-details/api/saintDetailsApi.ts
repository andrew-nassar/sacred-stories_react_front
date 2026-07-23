import { SacredStoryResponse, SacredStoryData } from "../types/saintDetails.types";

const API_BASE_URL = "https://localhost:7131/api/SacredStories";

export async function getSacredStoryById(id: string): Promise<SacredStoryData> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "accept": "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sacred story: ${response.statusText}`);
  }

  const result: SacredStoryResponse = await response.json();

  if (!result.succeeded || !result.data) {
    throw new Error(result.message || "Failed to retrieve sacred story details.");
  }

  return result.data;
}