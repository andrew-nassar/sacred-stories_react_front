import { GetStoriesParams, PaginatedList, SacredStoryDetail, SacredStoryListItem, StoryStatus, StoryType } from "../../domain/entities/sacredStory";
import { ISacredStoriesRepository } from "../../domain/repositories/sacredStoriesRepository";
import { ApiDetailResponseDto, ApiStoriesResponseDto, ApiStoryItemDto, SacredStoriesApiDataSource } from "../datasources/sacredStoriesApiDataSource";

export class SacredStoriesRepositoryImpl implements ISacredStoriesRepository {
  constructor(private dataSource: SacredStoriesApiDataSource) {}

  async getStories(params?: GetStoriesParams): Promise<PaginatedList<SacredStoryListItem>> {
    const response: ApiStoriesResponseDto = await this.dataSource.fetchStories(params);
    if (!response || !response.succeeded || !response.data) {
      throw new Error(response?.message || "Failed to retrieve sacred stories from backend API.");
    }

    const items: SacredStoryListItem[] = (response.data.items || []).map((dto: ApiStoryItemDto) => ({
      id: dto.id,
      type: (dto.type ?? 0) as StoryType,
      name: dto.name || "",
      coverImage: dto.coverImage || "",
      famousQuote: dto.famousQuote || "",
      status: (dto.status ?? 1) as StoryStatus,
    }));

    return {
      items,
      totalCount: response.data.totalCount || items.length,
      pageNumber: response.data.pageNumber || 1,
      pageSize: response.data.pageSize || 10,
    };
  }

  async getStoryById(id: string): Promise<SacredStoryDetail> {
    const response: ApiDetailResponseDto = await this.dataSource.fetchStoryById(id);
    if (!response || !response.succeeded || !response.data) {
      throw new Error(response?.message || `Failed to retrieve details for sacred story ID '${id}'.`);
    }

    const d = response.data;
    return {
      id: d.id,
      type: (d.type ?? 0) as StoryType,
      name: d.name || "",
      coverImage: d.coverImage || "",
      famousQuote: d.famousQuote || "",
      status: (d.status ?? 1) as StoryStatus,
      videoUrl: d.videoUrl,
      biography: d.biography || "",
      rejectionReason: d.rejectionReason,
      burialPlace: d.burialPlace
        ? {
            name: d.burialPlace.name || "",
            description: d.burialPlace.description || "",
            address: d.burialPlace.address || "",
            latitude: d.burialPlace.latitude || 0,
            longitude: d.burialPlace.longitude || 0,
            googleMapsUrl: d.burialPlace.googleMapsUrl || "#",
            coverImage: d.burialPlace.coverImage || "",
          }
        : null,
      timeline: (d.timeline || []).map((t) => ({
        id: t.id,
        date: t.date,
        title: t.title,
        description: t.description,
      })),
      sacredGallery: (d.sacredGallery || []).map((g) => ({
        id: g.id,
        title: g.title,
        imageUrl: g.imageUrl,
      })),
    };
  }
}
