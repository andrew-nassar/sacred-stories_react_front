import { api } from './../../services/auth.service';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SacredStory, EditorialChecks } from '../types';
import { PendingReviewsApi, SACRED_STORY_TYPES } from '../api/pendingReviews.api';

export function usePendingReviews() {
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
  
  // ID and Detailed Data State
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [activeStoryDetails, setActiveStoryDetails] = useState<SacredStory | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

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
    setCurrentPage(1);
  }, [setCurrentPage]);

  const setSearchQuery = useCallback((q: string) => {
    setSearchQueryState(q);
    setSessionValue('searchQuery', q);
    setCurrentPage(1);
  }, [setCurrentPage]);

  const setSelectedCategory = useCallback((c: string) => {
    setSelectedCategoryState(c);
    setSessionValue('selectedCategory', c);
    setCurrentPage(1);
  }, [setCurrentPage]);

  // Fetch pending list
  const loadPending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await PendingReviewsApi.getPendingReviews({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        category: selectedCategory,
      });

      setPendingStories(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);

      if (res.currentPage !== currentPage && res.currentPage > 0) {
        setCurrentPageState(res.currentPage);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending review queue');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedCategory]);

  // Fetch story details by ID when activeReviewId changes
  useEffect(() => {
    if (!activeReviewId) {
      setActiveStoryDetails(null);
      return;
    }

    async function fetchStoryDetails() {
      try {
        setLoadingDetails(true);
        const storyData = await PendingReviewsApi.getStoryById(activeReviewId!);
        setActiveStoryDetails(storyData);
      } catch (err: any) {
        alert('Failed to load story details: ' + err.message);
        setActiveReviewId(null);
      } finally {
        setLoadingDetails(false);
      }
    }

    fetchStoryDetails();
  }, [activeReviewId]);

  useEffect(() => {
    loadPending();

    const handleRefresh = () => loadPending();
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

  const categories = useMemo(() => Object.values(SACRED_STORY_TYPES), []);

  // Accept / Approve Story (status = 1)
  const handleApprove = useCallback(async (storyId: string, comments: string, checks: EditorialChecks) => {
    try {
      await PendingReviewsApi.updateStoryStatus(storyId, 1, comments, checks);
      await loadPending();
      setActiveReviewId(null);
      setActiveStoryDetails(null);
      window.dispatchEvent(new Event('refresh-stories'));
    } catch (err: any) {
      alert('Failed to approve story: ' + err.message);
    }
  }, [loadPending]);

  // Reject Story (status = 2)
  const handleReject = useCallback(async (storyId: string, comments: string) => {
    try {
      await PendingReviewsApi.updateStoryStatus(storyId, 2, comments);
      await loadPending();
      setActiveReviewId(null);
      setActiveStoryDetails(null);
      window.dispatchEvent(new Event('refresh-stories'));
    } catch (err: any) {
      alert('Failed to reject story: ' + err.message);
    }
  }, [loadPending]);

  // Request Revisions (status = 0)
  const handleRequestRevisions = useCallback(async (storyId: string, comments: string) => {
    try {
      await PendingReviewsApi.updateStoryStatus(storyId, 0, comments);
      await loadPending();
      setActiveReviewId(null);
      setActiveStoryDetails(null);
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
    activeReviewStory: activeStoryDetails,
    activeStoryDetails,
    loadingDetails,
    handleApprove,
    handleReject,
    handleRequestRevisions,
    refreshQueue: loadPending,

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
    onPageSizeChange: setPageSize,
  };
}