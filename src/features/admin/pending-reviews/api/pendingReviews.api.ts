/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeApiCall } from '../../shared/api/base';
import { SacredStory, EditorialChecks } from '../types';
import { INITIAL_PENDING_STORIES } from '../mock/pendingStories.mock';
import { PaginatedResponse } from '../../shared/types';

const STORIES_LOCAL_STORAGE_KEY = 'sacred_stories_data';

function getStoredStories(): SacredStory[] {
  if (typeof window === 'undefined') return INITIAL_PENDING_STORIES;
  const stored = localStorage.getItem(STORIES_LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORIES_LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PENDING_STORIES));
    return INITIAL_PENDING_STORIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PENDING_STORIES;
  }
}

function saveStoredStories(stories: SacredStory[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORIES_LOCAL_STORAGE_KEY, JSON.stringify(stories));
  }
}

export const PendingReviewsApi = {
  getPendingReviews: async (params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
  }): Promise<PaginatedResponse<SacredStory>> => {
    const stories = getStoredStories();
    let pending = stories.filter(s => s.status === 'Pending');

    // 1. Filter by search
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      pending = pending.filter(story => {
        const matchesName = story.sacredName?.toLowerCase().includes(q);
        const matchesCategory = story.devotionalCategory?.toLowerCase().includes(q);
        const matchesUtterance = story.definingUtterance?.toLowerCase().includes(q);
        const matchesNarrative = story.veneratedNarrative?.toLowerCase().includes(q);
        const matchesSite = story.burialPlace?.sanctuaryName?.toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesUtterance || matchesNarrative || matchesSite;
      });
    }

    // 2. Filter by category
    if (params.category && params.category !== 'ALL_CATEGORIES') {
      pending = pending.filter(s => s.devotionalCategory === params.category);
    }

    // 3. Paginate
    const totalItems = pending.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));
    const currentPage = Math.min(params.page, totalPages);
    const startIdx = (currentPage - 1) * params.limit;
    const paginatedData = pending.slice(startIdx, startIdx + params.limit);

    const mockResult: PaginatedResponse<SacredStory> = {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage,
      pageSize: params.limit
    };

    return executeApiCall(
      async () => {
        const queryParams = new URLSearchParams({
          page: String(params.page),
          limit: String(params.limit),
          search: params.search || '',
          category: params.category || ''
        });
        const response = await fetch(`/api/pending-reviews?${queryParams.toString()}`);
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      mockResult,
      'getPendingReviews'
    );
  },

  approveStory: async (storyId: string, comments: string, checks: EditorialChecks): Promise<boolean> => {
    const stories = getStoredStories();
    const index = stories.findIndex(s => s.id === storyId);
    if (index >= 0) {
      stories[index] = {
        ...stories[index],
        status: 'Published',
        editorialComments: comments,
        editorialChecks: checks
      };
      saveStoredStories(stories);
    }

    return executeApiCall(
      async () => {
        const response = await fetch(`/api/pending-reviews/${storyId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments, checks }),
        });
        if (!response.ok) throw new Error('API failed');
        return true;
      },
      true,
      `approveStory(${storyId})`
    );
  },

  rejectStory: async (storyId: string, comments: string): Promise<boolean> => {
    const stories = getStoredStories();
    const index = stories.findIndex(s => s.id === storyId);
    if (index >= 0) {
      stories[index] = {
        ...stories[index],
        status: 'Rejected',
        editorialComments: comments
      };
      saveStoredStories(stories);
    }

    return executeApiCall(
      async () => {
        const response = await fetch(`/api/pending-reviews/${storyId}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments }),
        });
        if (!response.ok) throw new Error('API failed');
        return true;
      },
      true,
      `rejectStory(${storyId})`
    );
  },

  requestRevisions: async (storyId: string, comments: string): Promise<boolean> => {
    const stories = getStoredStories();
    const index = stories.findIndex(s => s.id === storyId);
    if (index >= 0) {
      stories[index] = {
        ...stories[index],
        editorialComments: comments
      };
      saveStoredStories(stories);
    }

    return executeApiCall(
      async () => {
        const response = await fetch(`/api/pending-reviews/${storyId}/revisions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments }),
        });
        if (!response.ok) throw new Error('API failed');
        return true;
      },
      true,
      `requestRevisions(${storyId})`
    );
  }
};
