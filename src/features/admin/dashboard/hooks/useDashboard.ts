import { useState, useEffect, useCallback } from 'react';
import { DashboardMetrics, SacredStory, PortalUser } from '../types';
import { DashboardService } from '../../services/dashboard.service';
import { fetchSacredStories, FetchStoriesParams } from '@/src/shared/sacred_stories/services/sacredStoryService';

const SACRED_STORY_TYPES: Record<number, { name: string; displayName: string }> = {
  0: { name: 'Hermit', displayName: 'متوحد' },
  1: { name: 'Saint', displayName: 'قديس' },
  2: { name: 'Martyr', displayName: 'شهيد' },
  3: { name: 'Patriarch', displayName: 'بطريرك' },
  4: { name: 'Archpriest', displayName: 'قمص' },
  5: { name: 'Pope', displayName: 'بابا' },
};

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [stories, setStories] = useState<SacredStory[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [totalPendingItems, setTotalPendingItems] = useState<number>(0);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending stories with status = 0
      const storyParams: FetchStoriesParams = {
        status: 0,
        pageNumber: currentPage,
        pageSize: pageSize,
      };

      const [backendMetrics, storiesResponse] = await Promise.all([
        DashboardService.getMetrics(),
        fetchSacredStories(storyParams),
      ]);

      setMetrics({
        totalStoriesCount: backendMetrics.totalStoriesCount,
        publishedCount: backendMetrics.publishedCount,
        pendingCount: backendMetrics.pendingCount,
        rejectedCount: backendMetrics.rejectedCount,
        totalUsersCount: backendMetrics.totalUsersCount,
        recentActivity: backendMetrics.recentActivity || [],
      });

      if (storiesResponse.succeeded && storiesResponse.data) {
        const items = storiesResponse.data.items || [];
        const mappedStories: SacredStory[] = items.map((item: any) => {
          const categoryInfo = SACRED_STORY_TYPES[item.type as number];
          const devotionalCategory = categoryInfo 
            ? categoryInfo.displayName 
            : (item.categoryName || "عام");

          return {
            id: item.id?.toString() || "",
            sacredName: item.name || item.title || item.sacredName || "بدون عنوان",
            definingUtterance: item.famousQuote || item.definingUtterance || "",
            devotionalCategory: devotionalCategory,
            submittedBy: item.submittedBy || item.authorName || "مجهول",
            status: item.status === 0 ? 'Pending' : item.status === 1 ? 'Published' : 'Rejected',
            canonizationYear: (item.canonizationYear || new Date().getFullYear()).toString(),
            veneratedNarrative: item.veneratedNarrative || "",
            dateSubmitted: item.dateSubmitted || new Date().toISOString(),
            accessControl: item.accessControl || { publicArchive: true, liturgicalCalendarTag: "" },
            burialPlace: item.burialPlace || { 
              sanctuaryName: "", 
              physicalAddress: "", 
              latitude: "", 
              longitude: "", 
              siteTypology: "", 
              translationDate: "", 
              description: "" 
            },
            gallery: item.coverImage 
              ? [{ id: "cover", imageUrl: item.coverImage, title: "Cover Image" }] 
              : (item.gallery || [])
          };
        });

        setStories(mappedStories);
        setTotalPendingItems(storiesResponse.data.totalCount ?? backendMetrics.pendingCount);
      }
    } catch (err: any) {
      console.error("[useDashboard] Error fetching pending stories:", err);
      setError(err.message || "Failed to sync sanctuary telemetry.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return {
    stories,
    users,
    metrics,
    loading,
    error,
    currentPage,
    pageSize,
    totalPendingItems,
    totalPages: Math.ceil(totalPendingItems / pageSize) || 1,
    onPageChange: handlePageChange,
    refetch: fetchDashboardData,
  };
}