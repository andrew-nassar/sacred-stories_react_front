/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '../../services/dashboard.service';
import { SacredStoriesService } from '../../services/sacredStories.service';
import { SacredStory, PortalUser, DashboardMetrics } from '../types';

export function useDashboard() {
  const [stories, setStories] = useState<SacredStory[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPendingItems, setTotalPendingItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Pagination for Dashboard Pending Reviews list
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const val = sessionStorage.getItem('dashboard_pendingPage');
    return val ? Number(val) : 1;
  });
  const pageSize = 5; // Dashboard list is dense, shows 5 items per page

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch metrics and stories in parallel
      const [metricsData, storiesData] = await Promise.all([
        DashboardService.getMetrics(),
        SacredStoriesService.getPendingStories(currentPage, pageSize)
      ]);
      
      setStories(storiesData.items);
      setTotalPendingItems(storiesData.totalCount);
      setTotalPages(Math.max(1, Math.ceil(storiesData.totalCount / pageSize)));
      
      // Map to DashboardMetrics expected format (with activity log mock)
      setMetrics({
        totalStoriesCount: metricsData.totalStoriesCount,
        publishedCount: metricsData.publishedCount,
        pendingCount: metricsData.pendingCount,
        rejectedCount: metricsData.rejectedCount,
        totalUsersCount: metricsData.totalUsersCount,
        recentActivity: [
          { id: 'act-1', text: 'New hagiographical chronicle submitted for review', time: '12 mins ago', type: 'submission' },
          { id: 'act-2', text: 'St. Catherine chronicle published to public archive', time: '2 hours ago', type: 'system' },
          { id: 'act-3', text: 'Archivist account of Thomas Aquinas activated', time: '5 hours ago', type: 'user' },
          { id: 'act-4', text: 'Revised editorial checklist applied for liturgical records', time: '1 day ago', type: 'system' },
        ]
      });
    } catch (err: any) {
      setError(err.message || 'Failed to sync sanctuary analytics');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadDashboardData();

    // Re-trigger sync when changes happen across features via custom events
    const syncData = () => {
      loadDashboardData();
    };
    window.addEventListener('refresh-stories', syncData);
    window.addEventListener('refresh-users', syncData);
    
    return () => {
      window.removeEventListener('refresh-stories', syncData);
      window.removeEventListener('refresh-users', syncData);
    };
  }, [loadDashboardData]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    sessionStorage.setItem('dashboard_pendingPage', String(page));
  }, []);

  return {
    stories,
    users,
    metrics,
    loading,
    error,
    refreshDashboard: loadDashboardData,
    currentPage,
    pageSize,
    totalPendingItems,
    totalPages,
    onPageChange: handlePageChange
  };
}

