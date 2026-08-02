/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiFetch } from '@/src/shared/services/httpService';
import { DashboardData } from '../types';

export const DashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      const response = await apiFetch<DashboardData>('/api/dashboard/data');
      return response;
    } catch (error) {
      console.error('[DashboardApi] Error fetching dashboard data:', error);
      throw error;
    }
  }
};