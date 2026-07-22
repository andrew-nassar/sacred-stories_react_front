import { SacredStoriesApiDataSource } from "../data/datasources/sacredStoriesApiDataSource";
import { SacredStoriesRepositoryImpl } from "../data/repositories/sacredStoriesRepositoryImpl";
import { GetSacredStoriesUseCase } from "../domain/usecases/getSacredStoriesUseCase";
import { GetSacredStoryDetailUseCase } from "../domain/usecases/getSacredStoryDetailUseCase";

const apiDataSource = new SacredStoriesApiDataSource();
export const sacredStoriesRepository = new SacredStoriesRepositoryImpl(apiDataSource);

export const getSacredStoriesUseCase = new GetSacredStoriesUseCase(sacredStoriesRepository);
export const getSacredStoryDetailUseCase = new GetSacredStoryDetailUseCase(sacredStoriesRepository);
