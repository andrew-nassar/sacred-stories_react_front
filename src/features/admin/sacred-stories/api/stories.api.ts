/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeApiCall } from '../../shared/api/base';
import { SacredStory, StoryStatus } from '../types';
import { INITIAL_STORIES } from '../mock/stories.mock';
import { PaginatedResponse } from '../../shared/types';
import { fetchSacredStories } from '@/src/shared/sacred_stories/services/sacredStoryService';
import { apiFetch } from '@/src/shared/services/httpService';

const LOCAL_STORAGE_KEY = 'sacred_stories_data';

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

/**
 * Maps raw backend item properties to UI SacredStory model safely
 */
export function mapBackendItemToSacredStory(item: any): SacredStory {
  const statusNum = item.status !== undefined ? Number(item.status) : 1;
  const statusStr: StoryStatus = statusNum === 0 ? 'Pending' : statusNum === 2 ? 'Rejected' : 'Published';
  const typeNum = item.type !== undefined ? Number(item.type) : undefined;
  const categoryStr = typeNum !== undefined && SACRED_STORY_TYPES[typeNum]
    ? SACRED_STORY_TYPES[typeNum]
    : (item.devotionalCategory || item.category || 'General');

  const galleryItems = Array.isArray(item.sacredGallery) && item.sacredGallery.length > 0
    ? item.sacredGallery.map((g: any, idx: number) => ({
        id: String(g.id || idx + 1),
        title: String(g.title || 'Gallery Image'),
        imageUrl: String(g.imageUrl || ''),
        category: 'Gallery'
      }))
    : (Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery
      : (item.coverImage ? [{ id: '1', imageUrl: item.coverImage, title: 'Cover Image', category: 'Cover' }] : []));

  const timelineEvents = Array.isArray(item.timeline) && item.timeline.length > 0
    ? item.timeline.map((t: any, idx: number) => {
        let yearStr = 'N/A';
        if (t.date) {
          const parsed = new Date(t.date);
          if (!isNaN(parsed.getTime())) {
            yearStr = String(parsed.getFullYear());
          } else {
            yearStr = String(t.date);
          }
        }
        return {
          id: String(t.id || idx + 1),
          year: yearStr,
          eventTitle: String(t.title || t.eventTitle || ''),
          description: String(t.description || t.narrativeDetails || '')
        };
      })
    : (item.chronology || []);

  const bpName = item.burialPlace?.name || item.burialPlace?.sanctuaryName || 'Unknown Sanctuary';
  const bpDesc = item.burialPlace?.description || '';
  const bpAddress = item.burialPlace?.address || item.burialPlace?.physicalAddress || '';
  const bpLat = String(item.burialPlace?.latitude ?? '0');
  const bpLng = String(item.burialPlace?.longitude ?? '0');

  return {
    id: String(item.id ?? item.Id ?? `story-${Math.random()}`),
    sacredName: String(item.name || item.sacredName || item.SacredName || item.storyName || 'Untitled Chronicle'),
    devotionalCategory: categoryStr,
    canonizationYear: String(item.canonizationYear || item.CanonizationYear || 'N/A'),
    definingUtterance: String(item.famousQuote || item.definingUtterance || item.DefiningUtterance || ''),
    veneratedNarrative: String(item.biography || item.veneratedNarrative || item.description || item.Description || ''),
    accessControl: item.accessControl || { publicArchive: true, liturgicalCalendarTag: 'General' },
    burialPlace: {
      sanctuaryName: bpName,
      physicalAddress: bpAddress,
      latitude: bpLat,
      longitude: bpLng,
      siteTypology: item.burialPlace?.siteTypology || 'Tomb',
      translationDate: item.burialPlace?.translationDate || '',
      description: bpDesc,
    },
    chronology: timelineEvents,
    gallery: galleryItems,
    documentaryMedia: item.documentaryMedia || { title: 'Documentary', duration: '', url: item.videoUrl || '' },
    status: statusStr,
    submittedBy: String(item.submittedBy || item.SubmittedBy || 'Anonymous Curator'),
    dateSubmitted: String(item.dateSubmitted || item.DateSubmitted || new Date().toISOString().split('T')[0]),
    editorialComments: String(item.editorialComments || item.EditorialComments || ''),
    editorialChecks: item.editorialChecks || {
      authenticityVerified: false,
      historicalCorroboration: false,
      accessPermissionsChecked: false,
      relicVenerationDocumented: false,
    },
  };
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
    // Local fallback preparation
    const allStories = getStoredStories();
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

    const totalItemsLocal = filtered.length;
    const totalPagesLocal = Math.max(1, Math.ceil(totalItemsLocal / params.limit));
    const currentPageLocal = Math.min(params.page, totalPagesLocal);
    const startIdx = (currentPageLocal - 1) * params.limit;
    const paginatedLocalData = filtered.slice(startIdx, startIdx + params.limit);

    const mockResult: PaginatedResponse<SacredStory> = {
      data: paginatedLocalData,
      totalItems: totalItemsLocal,
      totalPages: totalPagesLocal,
      currentPage: currentPageLocal,
      pageSize: params.limit
    };

    return executeApiCall(
      async () => {
        // Map UI params to backend query parameters
        let statusNum: number | undefined = undefined;
        if (params.status === 'Pending') statusNum = 0;
        else if (params.status === 'Published') statusNum = 1;
        else if (params.status === 'Rejected') statusNum = 2;

        let typeNum: number | undefined = undefined;
        if (params.category && params.category !== 'ALL_CATEGORIES') {
          if (!isNaN(Number(params.category))) {
            typeNum = Number(params.category);
          } else if (SACRED_STORY_TYPES_REVERSE[params.category] !== undefined) {
            typeNum = SACRED_STORY_TYPES_REVERSE[params.category];
          }
        }

        const backendRes = await fetchSacredStories({
          searchTerm: params.search?.trim() || undefined,
          type: typeNum,
          status: statusNum,
          pageNumber: params.page,
          pageSize: params.limit,
        });

        const items = backendRes.data?.items || [];
        const totalCount = backendRes.data?.totalCount ?? items.length;
        const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

        const mapped = items.map(mapBackendItemToSacredStory);

        return {
          data: mapped,
          totalItems: totalCount,
          totalPages: totalPages,
          currentPage: params.page,
          pageSize: params.limit,
        };
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
        const isExisting = index >= 0 && story.id && !story.id.startsWith('story-');
        const endpoint = isExisting ? `/api/SacredStories/${story.id}` : '/api/SacredStories';
        const method = isExisting ? 'PUT' : 'POST';

        const lat = typeof story.burialPlace?.latitude === 'number'
          ? story.burialPlace.latitude
          : parseFloat(story.burialPlace?.latitude || '0') || 0;

        const lng = typeof story.burialPlace?.longitude === 'number'
          ? story.burialPlace.longitude
          : parseFloat(story.burialPlace?.longitude || '0') || 0;

        const payload = {
          id: story.id,
          type: SACRED_STORY_TYPES_REVERSE[story.devotionalCategory] ?? 0,
          name: story.sacredName,
          coverImage: story.gallery?.[0]?.imageUrl || '',
          famousQuote: story.definingUtterance || '',
          videoUrl: story.documentaryMedia?.url || '',
          biography: story.veneratedNarrative || '',
          burialPlace: {
            name: story.burialPlace?.sanctuaryName || (story.burialPlace as any)?.name || '',
            description: story.burialPlace?.description || '',
            address: story.burialPlace?.physicalAddress || (story.burialPlace as any)?.address || '',
            latitude: lat,
            longitude: lng,
            googleMapsUrl: (story.burialPlace as any)?.googleMapsUrl || '',
            coverImage: (story.burialPlace as any)?.coverImage || '',
          },
          timeline: (story.chronology || []).map((t: any) => ({
            date: t.date || (t.year && !isNaN(Number(t.year)) ? `${t.year}-01-01T00:00:00.000Z` : new Date().toISOString()),
            title: t.title || t.eventTitle || '',
            description: t.description || t.narrativeDetails || '',
          })),
          sacredGallery: (story.gallery || []).map((g: any) => ({
            title: g.title || '',
            imageUrl: g.imageUrl || '',
          })),
        };

        const res = await apiFetch<any>(endpoint, {
          method,
          body: JSON.stringify(payload),
        });

        const data = res?.data || res;
        return mapBackendItemToSacredStory(data || story);
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
        await apiFetch(`/api/SacredStories/${id}`, {
          method: 'DELETE',
        });
        return true;
      },
      true,
      `deleteStory(${id})`
    );
  }
};

