import { GetStoriesParams, PaginatedList, SacredStoryDetail, SacredStoryListItem } from "../entities/sacredStory";

export interface ISacredStoriesRepository {
  getStories(params?: GetStoriesParams): Promise<PaginatedList<SacredStoryListItem>>;
  getStoryById(id: string): Promise<SacredStoryDetail>;
}
