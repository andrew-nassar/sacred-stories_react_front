/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from './auth.service';
import { ADMIN_CONFIG } from '../features/admin/shared/config';
import { SacredStory } from '../features/admin/pending-reviews/types';
import { INITIAL_PENDING_STORIES } from '../features/admin/pending-reviews/mock/pendingStories.mock';

export interface PaginatedStoriesResult {
  items: SacredStory[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const SacredStoriesService = {
  getPendingStories: async (
    pageNumber: number,
    pageSize: number,
    search?: string,
    category?: string
  ): Promise<PaginatedStoriesResult> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let pending = INITIAL_PENDING_STORIES;

      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        pending = pending.filter(story => {
          return (
            story.sacredName?.toLowerCase().includes(q) ||
            story.devotionalCategory?.toLowerCase().includes(q) ||
            story.definingUtterance?.toLowerCase().includes(q) ||
            story.veneratedNarrative?.toLowerCase().includes(q)
          );
        });
      }

      if (category && category !== 'ALL_CATEGORIES') {
        pending = pending.filter(s => s.devotionalCategory === category);
      }

      const totalCount = pending.length;
      const startIdx = (pageNumber - 1) * pageSize;
      const paginatedItems = pending.slice(startIdx, startIdx + pageSize);
      return {
        items: paginatedItems,
        totalCount,
        pageNumber,
        pageSize,
      };
    }

    try {
      // VerificationStatus: Pending = 0
      const response = await api.get('/api/SacredStories', {
        params: {
          Status: 0,
          PageNumber: pageNumber,
          PageSize: pageSize,
          Search: search || undefined,
          Category: category === 'ALL_CATEGORIES' ? undefined : category,
        },
      });

      // Expected response structure, handle possible wrappers or direct payload
      const responseData = response.data;
      const data = responseData?.data || responseData;

      const items = (data?.items || data?.Items || responseData?.items || responseData?.Items || []) as any[];
      const totalCount = Number(data?.totalCount ?? data?.TotalCount ?? responseData?.totalCount ?? responseData?.TotalCount ?? items.length);
      const resPageNumber = Number(data?.pageNumber ?? data?.PageNumber ?? responseData?.pageNumber ?? responseData?.PageNumber ?? pageNumber);
      const resPageSize = Number(data?.pageSize ?? data?.PageSize ?? responseData?.pageSize ?? responseData?.PageSize ?? pageSize);

      // Map backend fields to frontend SacredStory properties to prevent UI failures
      const mappedItems: SacredStory[] = items.map((item: any) => {
        return {
          id: String(item.id || item.Id || `story-${Math.random()}`),
          sacredName: String(item.sacredName || item.SacredName || item.storyName || item.StoryName || 'Unnamed Chronicle'),
          devotionalCategory: String(item.devotionalCategory || item.DevotionalCategory || item.storyType || item.StoryType || 'Chronicle'),
          definingUtterance: String(item.definingUtterance || item.DefiningUtterance || item.famousQuote || item.FamousQuote || ''),
          veneratedNarrative: String(item.veneratedNarrative || item.VeneratedNarrative || item.description || item.Description || ''),
          submittedBy: String(item.submittedBy || item.SubmittedBy || 'Anonymous Curator'),
          dateSubmitted: String(item.dateSubmitted || item.DateSubmitted || new Date().toISOString().split('T')[0]),
          canonizationYear: String(item.canonizationYear || item.CanonizationYear || 'N/A'),
          status: 'Pending',
          accessControl: item.accessControl || item.AccessControl || {
            publicArchive: true,
            liturgicalCalendarTag: 'General',
          },
          burialPlace: item.burialPlace || item.BurialPlace || {
            sanctuaryName: 'Unknown Sanctuary',
            physicalAddress: '',
            latitude: '0',
            longitude: '0',
            siteTypology: 'Tomb',
            translationDate: '',
            description: '',
          },
          chronology: item.chronology || item.Chronology || [],
          gallery: item.gallery || item.Gallery || (item.coverImage || item.CoverImage ? [{ id: '1', imageUrl: item.coverImage || item.CoverImage, title: 'Cover Image', category: 'Cover' }] : []),
          documentaryMedia: item.documentaryMedia || item.DocumentaryMedia || {
            title: '',
            duration: '',
            url: '',
          },
          editorialComments: String(item.editorialComments || item.EditorialComments || ''),
          editorialChecks: item.editorialChecks || item.EditorialChecks || {
            authenticityVerified: false,
            historicalCorroboration: false,
            accessPermissionsChecked: false,
            relicVenerationDocumented: false,
          },
        };
      });

      return {
        items: mappedItems,
        totalCount,
        pageNumber: resPageNumber,
        pageSize: resPageSize,
      };
    } catch (error) {
      console.error('[SacredStoriesService] Error fetching pending stories:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[SacredStoriesService] Falling back to mock pending stories');
        const totalCount = INITIAL_PENDING_STORIES.length;
        const startIdx = (pageNumber - 1) * pageSize;
        const paginatedItems = INITIAL_PENDING_STORIES.slice(startIdx, startIdx + pageSize);
        return {
          items: paginatedItems,
          totalCount,
          pageNumber,
          pageSize,
        };
      }
      throw error;
    }
  },

  getStoryTypes: async (): Promise<Array<{ id: number; name: string; displayName: string }>> => {
    const mockTypes = [
      { id: 0, name: 'Hermit', displayName: 'متوحد' },
      { id: 1, name: 'Martyr', displayName: 'شهيد' },
      { id: 2, name: 'Confessor', displayName: 'معترف' },
      { id: 3, name: 'Apostle', displayName: 'رسول' },
    ];

    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return mockTypes;
    }

    try {
      const response = await api.get('/api/SacredStories/types');
      return response.data || mockTypes;
    } catch (error) {
      console.error('[SacredStoriesService] Error fetching story types:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[SacredStoriesService] Falling back to mock story types');
        return mockTypes;
      }
      throw error;
    }
  },

  createStory: async (storyData: any): Promise<any> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id: `story-${Math.floor(Math.random() * 100000)}`, ...storyData, status: 'Pending' };
    }

    try {
      const response = await api.post('/api/SacredStories', storyData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('[SacredStoriesService] Error creating story:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[SacredStoriesService] Falling back to mock story creation');
        return { id: `story-${Math.floor(Math.random() * 100000)}`, ...storyData, status: 'Pending' };
      }
      throw error;
    }
  },

  updateStory: async (id: string, storyData: any): Promise<any> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, ...storyData };
    }

    try {
      const response = await api.put(`/api/SacredStories/${id}`, storyData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('[SacredStoriesService] Error updating story:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[SacredStoriesService] Falling back to mock story update');
        return { id, ...storyData };
      }
      throw error;
    }
  },

  changeStoryStatus: async (id: string, statusValue: number): Promise<any> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { id, status: statusValue === 0 ? 'Pending' : statusValue === 1 ? 'Approved' : 'Rejected' };
    }

    try {
      const response = await api.put(`/api/SacredStories/${id}/status`, statusValue, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('[SacredStoriesService] Error changing story status:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[SacredStoriesService] Falling back to mock story status update');
        return { id, status: statusValue === 0 ? 'Pending' : statusValue === 1 ? 'Approved' : 'Rejected' };
      }
      throw error;
    }
  },
};
