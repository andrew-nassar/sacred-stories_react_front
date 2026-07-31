/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from './auth.service';
import { ADMIN_CONFIG } from '../features/admin/shared/config';

export interface BackendMetrics {
  totalStoriesCount: number;
  publishedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalUsersCount: number;
}

export const DashboardService = {
  getMetrics: async (): Promise<BackendMetrics> => {
    const mockMetrics: BackendMetrics = {
      totalStoriesCount: 20,
      publishedCount: 0,
      pendingCount: 16,
      rejectedCount: 4,
      totalUsersCount: 3,
    };

    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockMetrics;
    }

    try {
      const response = await api.get('/api/Dashboard/metrics');
      // The requirement specifies Expected Response: { "data": { ... } }
      const data = response.data?.data || response.data;
      
      return {
        totalStoriesCount: Number(data.totalStoriesCount ?? mockMetrics.totalStoriesCount),
        publishedCount: Number(data.publishedCount ?? mockMetrics.publishedCount),
        pendingCount: Number(data.pendingCount ?? mockMetrics.pendingCount),
        rejectedCount: Number(data.rejectedCount ?? mockMetrics.rejectedCount),
        totalUsersCount: Number(data.totalUsersCount ?? mockMetrics.totalUsersCount),
      };
    } catch (error) {
      console.error('[DashboardService] Error fetching metrics:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[DashboardService] Falling back to mock metrics');
        return mockMetrics;
      }
      throw error;
    }
  },
};
