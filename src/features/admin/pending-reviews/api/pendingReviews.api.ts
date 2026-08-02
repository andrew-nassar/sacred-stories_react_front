import { apiFetch } from '../../../../shared/services/httpService';
import { SacredStory, EditorialChecks } from '../types';
import { PaginatedResponse } from '../../shared/types';
import { fetchSacredStories } from '@/src/shared/sacred_stories/services/sacredStoryService';
import { getSacredStoryById } from '@/src/features/saint-details/api/saintDetailsApi';

// Category mapping helper
export const SACRED_STORY_TYPES: Record<number, string> = {
  0: 'Hermit',
  1: 'Saint',
  2: 'Martyr',
  3: 'Patriarch',
  4: 'Archpriest',
  5: 'Pope',
};

export const SACRED_STORY_TYPES_REVERSE: Record<string, number> = {
  'Hermit': 0,
  'Saint': 1,
  'Martyr': 2,
  'Patriarch': 3,
  'Archpriest': 4,
  'Pope': 5,
};

export interface FetchPendingParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

/**
 * Helper to map backend story object to internal SacredStory model
 */
export function mapStoryToUIModel(item: any): SacredStory {
  return {
    id: item.id?.toString() || '',
    sacredName: item.name || item.sacredName || 'Untitled',
    devotionalCategory: SACRED_STORY_TYPES[item.type] ?? item.devotionalCategory ?? 'General',
    canonizationYear: (item.canonizationYear || new Date().getFullYear()).toString(),
    definingUtterance: item.famousQuote || item.definingUtterance || '',
    veneratedNarrative: item.veneratedNarrative || item.description || '',
    accessControl: item.accessControl || { publicArchive: true, liturgicalCalendarTag: '' },
    burialPlace: item.burialPlace || {
      sanctuaryName: item.burialPlace?.sanctuaryName || '',
      physicalAddress: item.burialPlace?.physicalAddress || '',
      latitude: item.burialPlace?.latitude || '',
      longitude: item.burialPlace?.longitude || '',
      siteTypology: item.burialPlace?.siteTypology || '',
      translationDate: item.burialPlace?.translationDate || '',
      description: item.burialPlace?.description || '',
    },
    chronology: item.chronology || [],
    gallery: item.coverImage
      ? [{ id: 'cover', title: 'Cover Image', imageUrl: item.coverImage, category: 'Cover' }]
      : item.gallery || [],
    documentaryMedia: item.documentaryMedia || null,
    status: item.status === 0 ? 'Pending' : item.status === 1 ? 'Published' : 'Rejected',
    submittedBy: item.submittedBy || item.authorName || 'Anonymous',
    dateSubmitted: item.dateSubmitted || new Date().toISOString().split('T')[0],
    editorialComments: item.editorialComments || '',
    editorialChecks: item.editorialChecks || {
      authenticityVerified: false,
      historicalCorroboration: false,
      accessPermissionsChecked: false,
      relicVenerationDocumented: false,
    },
  };
}

export const PendingReviewsApi = {
  /**
   * Fetch pending stories list using status = 0
   */
  getPendingReviews: async (params: FetchPendingParams): Promise<PaginatedResponse<SacredStory>> => {
    let categoryType: number | undefined = undefined;
    if (params.category && params.category !== 'ALL_CATEGORIES') {
      if (!isNaN(Number(params.category))) {
        categoryType = Number(params.category);
      } else if (SACRED_STORY_TYPES_REVERSE[params.category] !== undefined) {
        categoryType = SACRED_STORY_TYPES_REVERSE[params.category];
      }
    }

    const response = await fetchSacredStories({
      status: 0, // Fetch status 0 (Pending)
      pageNumber: params.page,
      pageSize: params.limit,
      searchTerm: params.search?.trim() || undefined,
      type: categoryType,
    });

    const items = response.data?.items || [];
    const totalCount = response.data?.totalCount || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

    const mappedStories: SacredStory[] = items.map(mapStoryToUIModel);

    return {
      data: mappedStories,
      totalItems: totalCount,
      totalPages,
      currentPage: params.page,
      pageSize: params.limit,
    };
  },

  /**
   * Fetch full story details by ID using getSacredStoryById from saintDetailsApi.ts
   */
  getStoryById: async (id: string): Promise<SacredStory> => {
    const rawDetails = await getSacredStoryById(id);
    return mapStoryToUIModel(rawDetails);
  },

  /**
   * Update story status (PUT /api/SacredStories/{id}/status)
   * status = 1 (Accept/Publish)
   * status = 2 (Reject)
   * status = 0 (Revisions/Pending)
   */
  updateStoryStatus: async (
    storyId: string, 
    status: number, 
    comments: string = '', 
    checks?: EditorialChecks
  ): Promise<boolean> => {
    await apiFetch(`/api/SacredStories/${storyId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status, // 1: Accept, 2: Reject, 0: Revision
        editorialComments: comments,
        editorialChecks: checks,
      }),
    });
    return true;
  },
};