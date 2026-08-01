import { apiFetch } from "@/src/shared/services/httpService";
import { ADMIN_CONFIG } from "../shared/config";
import { ApiResponse } from "../../auth/types/api.types";

export interface BackendMetrics {
  totalStoriesCount: number;
  publishedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalUsersCount: number;
  recentActivity?: [];
}

export const DashboardService = {
  getMetrics: async (): Promise<BackendMetrics> => {
    try {
      // apiFetch automatically handles VITE_API_BASE_URL resolution and tokens
      const response = await apiFetch<ApiResponse<BackendMetrics>>('/api/Dashboard/metrics');
      
      // Extract data from the Swagger envelope { statusCode, data: { ... } }
      const responseData = response?.data;

      if (!responseData) {
        throw new Error('Invalid response structure received from server.');
      }

      return {
        totalStoriesCount: responseData.totalStoriesCount ?? 0,
        publishedCount: responseData.publishedCount ?? 0,
        pendingCount: responseData.pendingCount ?? 0,
        rejectedCount: responseData.rejectedCount ?? 0,
        totalUsersCount: responseData.totalUsersCount ?? 0,
        recentActivity: responseData.recentActivity ?? [],
      };
    } catch (error) {
      console.error('[DashboardService] Error fetching metrics:', error);
      throw error;
    }
  },
};