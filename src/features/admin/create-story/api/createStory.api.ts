/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '@/src/features/admin/services/auth.service';
import { CreateStoryPayload, StoryTypeOption } from '../types';

export const CreateStoryApi = {
  getStoryTypes: async (): Promise<StoryTypeOption[]> => {
    try {
      const response = await api.get('/api/SacredStories/types');
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch (error) {
      console.error('[CreateStoryApi] Failed to fetch story types:', error);
      return [
        { id: 0, name: "Hermit", displayName: "متوحد" },
        { id: 1, name: "Saint", displayName: "قديس" },
        { id: 2, name: "Martyr", displayName: "شهيد" },
        { id: 3, name: "Patriarch", displayName: "بطريرك" },
        { id: 4, name: "Archpriest", displayName: "قمص" },
        { id: 5, name: "Pope", displayName: "بابا" }
      ];
    }
  },

  createStory: async (payload: CreateStoryPayload): Promise<any> => {
    const response = await api.post('/api/SacredStories', payload);
    return response.data?.data || response.data;
  }
};
