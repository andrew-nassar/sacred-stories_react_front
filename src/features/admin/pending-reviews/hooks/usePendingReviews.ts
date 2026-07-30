/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SacredStory, EditorialChecks } from '../types';

import { SacredStoriesService } from '../../../../services/sacredStories.service';

export function usePendingReviews() {
  // Persistence key helpers
  const getSessionValue = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const item = sessionStorage.getItem(`pending_reviews_${key}`);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  };

  const setSessionValue = <T>(key: string, value: T) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`pending_reviews_${key}`, JSON.stringify(value));
    }
  };

  const [pendingStories, setPendingStories] = useState<SacredStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // Pagination and Filter States
  const [currentPage, setCurrentPageState] = useState<number>(() => getSessionValue('currentPage', 1));
  const [pageSize, setPageSizeState] = useState<number>(() => getSessionValue('pageSize', 10));
  const [searchQuery, setSearchQueryState] = useState<string>(() => getSessionValue('searchQuery', ''));
  const [selectedCategory, setSelectedCategoryState] = useState<string>(() => getSessionValue('selectedCategory', 'ALL_CATEGORIES'));
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const setCurrentPage = useCallback((p: number) => {
    setCurrentPageState(p);
    setSessionValue('currentPage', p);
  }, []);

  const setPageSize = useCallback((s: number) => {
    setPageSizeState(s);
    setSessionValue('pageSize', s);
    setCurrentPage(1); // Reset to page 1 on page size change
  }, [setCurrentPage]);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
    setSessionValue('searchQuery', q);
    setCurrentPage(1); // Reset to page 1 on search change
  }, [setCurrentPage]);

  const setSelectedCategory = useCallback((c: string) => {
    setSelectedCategoryState(c);
    setSessionValue('selectedCategory', c);
    setCurrentPage(1); // Reset to page 1 on category change
  }, [setCurrentPage]);

  // Load reviews from paginated API
  const loadPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await SacredStoriesService.getPendingStories(
        currentPage,
        pageSize,
        searchQuery,
        selectedCategory
      );
      setPendingStories(res.items);
      setTotalItems(res.totalCount);
      const computedPages = Math.max(1, Math.ceil(res.totalCount / pageSize));
      setTotalPages(computedPages);
      
      // Make sure current page stays valid
      if (res.pageNumber !== currentPage && res.pageNumber > 0) {
        setCurrentPageState(res.pageNumber);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending review queue');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedCategory]);


  useEffect(() => {
    loadPending();

    const handleRefresh = () => {
      loadPending();
    };

    const handleOpenReview = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.storyId) {
        setActiveReviewId(customEvent.detail.storyId);
      }
    };

    window.addEventListener('refresh-stories', handleRefresh);
    window.addEventListener('open-story-review', handleOpenReview);
    return () => {
      window.removeEventListener('refresh-stories', handleRefresh);
      window.removeEventListener('open-story-review', handleOpenReview);
    };
  }, [loadPending]);

  // Static standard devotional categories inside queue
  const categories = useMemo(() => {
    return ['Reliquaries', 'Sacred Text', 'Liturgical', 'Venerable Icon', 'Chronicle'];
  }, []);

  const activeReviewStory = useMemo(() => {
    if (!activeReviewId) return null;
    return pendingStories.find(s => s.id === activeReviewId) || null;
  }, [pendingStories, activeReviewId]);

  const handleApprove = useCallback(async (storyId: string, comments: string, checks: EditorialChecks) => {
    try {
      await SacredStoriesService.changeStoryStatus(storyId, 1);
      await loadPending();
      setActiveReviewId(null);
      window.dispatchEvent(new Event('refresh-stories'));
    } catch (err: any) {
      alert('Failed to approve story: ' + err.message);
    }
  }, [loadPending]);

  const handleReject = useCallback(async (storyId: string, comments: string) => {
    try {
      await SacredStoriesService.changeStoryStatus(storyId, 2);
      await loadPending();
      setActiveReviewId(null);
      window.dispatchEvent(new Event('refresh-stories'));
    } catch (err: any) {
      alert('Failed to reject story: ' + err.message);
    }
  }, [loadPending]);

  const handleRequestRevisions = useCallback(async (storyId: string, comments: string) => {
    try {
      await SacredStoriesService.changeStoryStatus(storyId, 0);
      await loadPending();
      setActiveReviewId(null);
      window.dispatchEvent(new Event('refresh-stories'));
    } catch (err: any) {
      alert('Failed to request revisions: ' + err.message);
    }
  }, [loadPending]);

  return {
    pendingStories,
    loading,
    error,
    activeReviewId,
    setActiveReviewId,
    activeReviewStory,
    handleApprove,
    handleReject,
    handleRequestRevisions,
    refreshQueue: loadPending,

    // Sorting/Pagination and Filtering State
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    onPageChange: setCurrentPage,
    onPageSizeChange: setPageSize
  };
}
