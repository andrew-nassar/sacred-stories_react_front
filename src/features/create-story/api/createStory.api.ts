/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '@/src/features/admin/services/auth.service';
import { CreateStoryPayload, StoryTypeOption } from '../types';
import { DEFAULT_STORY_TYPES } from '../constants';

export const PublicCreateStoryApi = {
  /**
   * Fetch available story types from GET /api/SacredStories/types
   */
  getStoryTypes: async (): Promise<StoryTypeOption[]> => {
    try {
      const response = await api.get('/api/SacredStories/types');
      const data = response.data?.data || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return DEFAULT_STORY_TYPES;
    } catch (error) {
      console.warn('[PublicCreateStoryApi] Failed to fetch story types, using default options:', error);
      return DEFAULT_STORY_TYPES;
    }
  },

  /**
   * Submit a new sacred story via POST /api/SacredStories
   */
  createStory: async (payload: CreateStoryPayload): Promise<any> => {
    const response = await api.post('/api/SacredStories', payload);
    return response.data?.data || response.data;
  }
};
