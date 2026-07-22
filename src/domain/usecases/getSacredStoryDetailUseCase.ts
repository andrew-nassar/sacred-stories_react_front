import { SacredStoryDetail } from "../entities/sacredStory";
import { ISacredStoriesRepository } from "../repositories/sacredStoriesRepository";

export class GetSacredStoryDetailUseCase {
  constructor(private repository: ISacredStoriesRepository) {}

  async execute(id: string): Promise<SacredStoryDetail> {
    if (!id || !id.trim()) {
      throw new Error("Sacred Story ID is required.");
    }
    return this.repository.getStoryById(id);
  }
}
