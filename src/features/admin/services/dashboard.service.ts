import { apiFetch } from "@/src/shared/services/httpService";
import { ADMIN_CONFIG } from "../shared/config";

export interface BackendMetrics {
  totalStoriesCount: number;
  publishedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalUsersCount: number;
}

// Swagger API response structure
export interface ApiResponse<T> {
  statusCode: number;
  meta: string;
  succeeded: boolean;
  message: string;
  errors: any;
  data: T;
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
      // apiFetch automatically handles VITE_API_BASE_URL resolution
      const response = await apiFetch<ApiResponse<BackendMetrics>>('/api/Dashboard/metrics');
      
      // Extract data from the Swagger envelope { statusCode, data: { ... } }
      const responseData = response?.data;

      if (!responseData) {
        throw new Error('Invalid response structure received from server.');
      }

      return {
        totalStoriesCount: responseData.totalStoriesCount ?? mockMetrics.totalStoriesCount,
        publishedCount: responseData.publishedCount ?? mockMetrics.publishedCount,
        pendingCount: responseData.pendingCount ?? mockMetrics.pendingCount,
        rejectedCount: responseData.rejectedCount ?? mockMetrics.rejectedCount,
        totalUsersCount: responseData.totalUsersCount ?? mockMetrics.totalUsersCount,
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