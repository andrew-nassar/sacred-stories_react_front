import { GetStoriesParams, PaginatedList, SacredStoryListItem } from "../entities/sacredStory";
import { ISacredStoriesRepository } from "../repositories/sacredStoriesRepository";

export class GetSacredStoriesUseCase {
  constructor(private repository: ISacredStoriesRepository) {}

  async execute(params?: GetStoriesParams): Promise<PaginatedList<SacredStoryListItem>> {
    return this.repository.getStories(params);
  }
}
