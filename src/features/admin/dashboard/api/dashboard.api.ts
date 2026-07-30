/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeApiCall } from '../../shared/api/base';
import { DashboardMetrics, SacredStory, PortalUser, DashboardData } from '../types';
import { INITIAL_MOCK_METRICS, INITIAL_MOCK_STORIES, INITIAL_MOCK_USERS } from '../mock/dashboard.mock';

const STORIES_KEY = 'sacred_stories_data';
const USERS_KEY = 'sacred_users_data';

function getStories(): SacredStory[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_STORIES;
  const stored = localStorage.getItem(STORIES_KEY);
  if (!stored) return INITIAL_MOCK_STORIES;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MOCK_STORIES;
  }
}

function getUsers(): PortalUser[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_USERS;
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) return INITIAL_MOCK_USERS;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MOCK_USERS;
  }
}

export const DashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    const stories = getStories();
    const users = getUsers();

    const publishedStories = stories.filter(s => s.status === 'Published');
    const pendingStories = stories.filter(s => s.status === 'Pending');
    const rejectedStories = stories.filter(s => s.status === 'Rejected');

    const totalStoriesCount = 3105 + (stories.length - 6);
    const publishedCount = 2891 + (publishedStories.length - 3);
    const pendingCount = pendingStories.length;
    const rejectedCount = 56 + (rejectedStories.length - 1);
    const totalUsersCount = 12482 + (users.length - 5);

    const metrics: DashboardMetrics = {
      totalStoriesCount,
      publishedCount,
      pendingCount,
      rejectedCount,
      totalUsersCount,
      recentActivity: INITIAL_MOCK_METRICS.recentActivity
    };

    return executeApiCall(
      async () => {
        const response = await fetch('/api/dashboard/data');
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      { stories, users, metrics },
      'getDashboardData'
    );
  }
};
