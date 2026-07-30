/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeApiCall } from '../../shared/api/base';
import { SacredStory } from '../types';
import { INITIAL_STORIES } from '../mock/stories.mock';
import { PaginatedResponse } from '../../shared/types';

const LOCAL_STORAGE_KEY = 'sacred_stories_data';

export function getStoredStories(): SacredStory[] {
  if (typeof window === 'undefined') return INITIAL_STORIES;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STORIES));
    return INITIAL_STORIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_STORIES;
  }
}

export function saveStoredStories(stories: SacredStory[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
  }
}

export const StoriesApi = {
  getStories: async (params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<SacredStory>> => {
    const allStories = getStoredStories();

    // 1. Filter
    let filtered = [...allStories];

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(s => s.status === params.status);
    }

    if (params.category && params.category !== 'ALL_CATEGORIES') {
      filtered = filtered.filter(s => s.devotionalCategory === params.category);
    }

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(story => {
        const matchesName = story.sacredName?.toLowerCase().includes(q);
        const matchesCategory = story.devotionalCategory?.toLowerCase().includes(q);
        const matchesUtterance = story.definingUtterance?.toLowerCase().includes(q);
        const matchesNarrative = story.veneratedNarrative?.toLowerCase().includes(q);
        const matchesSite = story.burialPlace?.sanctuaryName?.toLowerCase().includes(q);

        return matchesName || matchesCategory || matchesUtterance || matchesNarrative || matchesSite;
      });
    }

    // 2. Sort
    if (params.sortBy) {
      const key = params.sortBy as keyof SacredStory;
      const order = params.sortOrder || 'asc';
      filtered.sort((a, b) => {
        const valA = String(a[key] ?? '').toLowerCase();
        const valB = String(b[key] ?? '').toLowerCase();
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 3. Paginate
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));
    const currentPage = Math.min(params.page, totalPages);
    const startIdx = (currentPage - 1) * params.limit;
    const paginatedData = filtered.slice(startIdx, startIdx + params.limit);

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
          category: params.category || '',
          status: params.status || '',
          sortBy: params.sortBy || '',
          sortOrder: params.sortOrder || 'asc'
        });
        const response = await fetch(`/api/stories?${queryParams.toString()}`);
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      mockResult,
      'getStories'
    );
  },

  saveStory: async (story: SacredStory): Promise<SacredStory> => {
    const stories = getStoredStories();
    const index = stories.findIndex(s => s.id === story.id);
    const updated = [...stories];

    if (index >= 0) {
      updated[index] = story;
    } else {
      updated.push(story);
    }
    saveStoredStories(updated);

    return executeApiCall(
      async () => {
        const url = index >= 0 ? `/api/stories/${story.id}` : '/api/stories';
        const method = index >= 0 ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(story),
        });
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      story,
      `saveStory(${story.id})`
    );
  },

  deleteStory: async (id: string): Promise<boolean> => {
    const stories = getStoredStories();
    const updated = stories.filter(s => s.id !== id);
    saveStoredStories(updated);

    return executeApiCall(
      async () => {
        const response = await fetch(`/api/stories/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('API failed');
        return true;
      },
      true,
      `deleteStory(${id})`
    );
  }
};
