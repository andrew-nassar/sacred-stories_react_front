/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { SacredStory, StoryStatus } from '../types';
import { StoriesApi, getStoredStories } from '../api/stories.api';

export function useStories() {
  const [stories, setStories] = useState<SacredStory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination parameters stored in sessionStorage to remember when navigating within same feature
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const val = sessionStorage.getItem('stories_currentPage');
      return val ? parseInt(val, 10) : 1;
    }
    return 1;
  });
  
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const val = sessionStorage.getItem('stories_pageSize');
      return val ? parseInt(val, 10) : 10;
    }
    return 10;
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('stories_searchQuery') || '';
    }
    return '';
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('stories_selectedCategory') || 'ALL_CATEGORIES';
    }
    return 'ALL_CATEGORIES';
  });

  const [selectedStatus, setSelectedStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('stories_selectedStatus') || 'Published';
    }
    return 'Published';
  });

  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('stories_sortBy') || 'sacredName';
    }
    return 'sacredName';
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    if (typeof window !== 'undefined') {
      return (sessionStorage.getItem('stories_sortOrder') as 'asc' | 'desc') || 'asc';
    }
    return 'asc';
  });

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_currentPage', String(currentPage));
    }
  }, [currentPage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_pageSize', String(pageSize));
    }
  }, [pageSize]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_searchQuery', searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_selectedCategory', selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_selectedStatus', selectedStatus);
    }
  }, [selectedStatus]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_sortBy', sortBy);
    }
  }, [sortBy]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('stories_sortOrder', sortOrder);
    }
  }, [sortOrder]);

  // Load data based on params
  const loadStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await StoriesApi.getStories({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        sortBy,
        sortOrder
      });
      setStories(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
      
      if (res.currentPage !== currentPage) {
        setCurrentPage(res.currentPage);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sacred stories');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    loadStories();
    
    // Set up custom event listener to synchronize across tabs/view changes
    const handleRefresh = () => {
      loadStories();
    };

    const handleOpenPreview = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.storyId) {
        setSelectedStatus('ALL');
        setSelectedCategory('ALL_CATEGORIES');
        setActiveStoryId(customEvent.detail.storyId);
        setCurrentPage(1);
      }
    };

    window.addEventListener('refresh-stories', handleRefresh);
    window.addEventListener('open-story-preview', handleOpenPreview);
    return () => {
      window.removeEventListener('refresh-stories', handleRefresh);
      window.removeEventListener('open-story-preview', handleOpenPreview);
    };
  }, [loadStories]);

  // List of unique categories for filters
  const categories = useMemo(() => {
    const all = getStoredStories();
    const list = new Set<string>();
    all.forEach(s => {
      if (s.devotionalCategory) {
        list.add(s.devotionalCategory);
      }
    });
    return Array.from(list);
  }, [stories]); // recalculate when stories update in case a category is added/removed

  // Currently viewed story
  const activeStory = useMemo(() => {
    // If activeStory is not in current page, check the full stored list so we don't return null
    if (!activeStoryId) return null;
    const found = stories.find(s => s.id === activeStoryId);
    if (found) return found;
    const all = getStoredStories();
    return all.find(s => s.id === activeStoryId) || null;
  }, [stories, activeStoryId]);

  // Setters that reset page to 1
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string, explicitOrder?: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    if (explicitOrder) {
      setSortOrder(explicitOrder);
    } else if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  // Delete story
  const handleDeleteStory = useCallback(async (id: string) => {
    try {
      const success = await StoriesApi.deleteStory(id);
      if (success) {
        if (activeStoryId === id) {
          setActiveStoryId(null);
        }
        await loadStories();
        window.dispatchEvent(new Event('refresh-stories'));
      }
    } catch (err: any) {
      alert('Failed to delete story: ' + err.message);
    }
  }, [activeStoryId, loadStories]);

  // Update/Save a story
  const handleSaveStory = useCallback(async (story: SacredStory) => {
    try {
      const saved = await StoriesApi.saveStory(story);
      await loadStories();
      window.dispatchEvent(new Event('refresh-stories'));
      return saved;
    } catch (err: any) {
      alert('Failed to save story: ' + err.message);
      throw err;
    }
  }, [loadStories]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    stories, // currently paginated visible stories
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    sortBy,
    sortOrder,
    handleSortChange,
    activeStoryId,
    setActiveStoryId,
    activeStory,
    handleDeleteStory,
    handleSaveStory,
    refreshStories: loadStories,

    // Expose Pagination State
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    onPageChange: setCurrentPage,
    onPageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    }
  };
}
