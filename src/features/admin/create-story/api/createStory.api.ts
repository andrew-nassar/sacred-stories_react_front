/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeApiCall } from '../../shared/api/base';
import { SacredStory } from '../types';

const STORIES_LOCAL_STORAGE_KEY = 'sacred_stories_data';

function getStoredStories(): SacredStory[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORIES_LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

function saveStoredStories(stories: SacredStory[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORIES_LOCAL_STORAGE_KEY, JSON.stringify(stories));
  }
}

export const CreateStoryApi = {
  publishStory: async (story: SacredStory): Promise<SacredStory> => {
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
        const response = await fetch('/api/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(story),
        });
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      story,
      `publishStory(${story.id})`
    );
  }
};
