/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PortalUser } from '../types';
import { UsersApi } from '../api/users.api';

export function useUsers() {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination parameters stored in sessionStorage
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const val = sessionStorage.getItem('users_currentPage');
      return val ? parseInt(val, 10) : 1;
    }
    return 1;
  });
  
  const [pageSize, setPageSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const val = sessionStorage.getItem('users_pageSize');
      return val ? parseInt(val, 10) : 10;
    }
    return 10;
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('users_searchQuery') || '';
    }
    return '';
  });

  const [statusFilter, setStatusFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('users_statusFilter') || 'ALL';
    }
    return 'ALL';
  });

  const [sortBy, setSortBy] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('users_sortBy') || 'name';
    }
    return 'name';
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    if (typeof window !== 'undefined') {
      return (sessionStorage.getItem('users_sortOrder') as 'asc' | 'desc') || 'asc';
    }
    return 'asc';
  });

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Sync state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users_currentPage', String(currentPage));
    }
  }, [currentPage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users_pageSize', String(pageSize));
    }
  }, [pageSize]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users_searchQuery', searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users_statusFilter', statusFilter);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users_sortBy', sortBy);
    }
  }, [sortBy]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('users_sortOrder', sortOrder);
    }
  }, [sortOrder]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await UsersApi.getUsers({
        pageNumber: currentPage,
        pageSize,
        searchTerm: searchQuery,
        role: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setUsers(res.items);
      setTotalItems(res.totalCount);
      const computedPages = Math.max(1, Math.ceil(res.totalCount / pageSize));
      setTotalPages(computedPages);
      
      if (res.pageNumber !== currentPage && res.pageNumber > 0 && res.pageNumber <= computedPages) {
        setCurrentPage(res.pageNumber);
      }
    } catch (err: any) {
      console.error('[useUsers] Load error:', err);
      setError(err.message || 'Failed to fetch users from server');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, statusFilter]);

  useEffect(() => {
    loadUsers();

    // Sync refresh-users across layout
    const handleRefresh = () => {
      loadUsers();
    };
    window.addEventListener('refresh-users', handleRefresh);
    return () => {
      window.removeEventListener('refresh-users', handleRefresh);
    };
  }, [loadUsers]);

  // Reset to page 1 on filter, search, sort changes
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }, [sortBy]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const selectedUser = useMemo(() => {
    return users.find(u => u.id === selectedUserId) || null;
  }, [users, selectedUserId]);

  const handleUpdateUser = useCallback(async (updatedUser: PortalUser) => {
    try {
      await UsersApi.updateUser(updatedUser);
      await loadUsers();
      window.dispatchEvent(new Event('refresh-users'));
    } catch (err: any) {
      alert('Failed to update user: ' + err.message);
    }
  }, [loadUsers]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      const success = await UsersApi.deleteUser(userId);
      if (success) {
        if (selectedUserId === userId) {
          setSelectedUserId(null);
        }
        await loadUsers();
        window.dispatchEvent(new Event('refresh-users'));
      }
    } catch (err: any) {
      alert('Failed to delete user: ' + err.message);
    }
  }, [selectedUserId, loadUsers]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Returns first active archivist as the currentUser for demo
  const currentUser = useMemo(() => {
    return users.find(u => u.role === 'Archivist') || users[0] || null;
  }, [users]);

  return {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    sortBy,
    sortOrder,
    handleSortChange,
    selectedUserId,
    setSelectedUserId,
    selectedUser,
    currentUser,
    handleUpdateUser,
    handleDeleteUser,
    refreshUsers: loadUsers,

    // Expose Pagination State
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange
  };
}
