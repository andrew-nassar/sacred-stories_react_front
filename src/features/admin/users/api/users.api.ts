/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { executeApiCall } from '../../shared/api/base';
import { PortalUser } from '../types';
import { INITIAL_USERS } from '../mock/users.mock';
import { PaginatedResponse } from '../../shared/types';

const LOCAL_STORAGE_KEY = 'sacred_users_data';

export function getStoredUsers(): PortalUser[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: PortalUser[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  }
}

export const UsersApi = {
  getUsers: async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<PortalUser>> => {
    const allUsers = getStoredUsers();

    // 1. Filter by search
    let filtered = [...allUsers];
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    }

    // Filter by status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(u => u.status === params.status);
    }

    // 2. Sort
    if (params.sortBy) {
      const key = params.sortBy as keyof PortalUser;
      const order = params.sortOrder || 'asc';
      filtered.sort((a, b) => {
        const valA = String(a[key] ?? '').toLowerCase();
        const valB = String(b[key] ?? '').toLowerCase();
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // 3. Paginate
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));
    const currentPage = Math.min(params.page, totalPages);
    const startIdx = (currentPage - 1) * params.limit;
    const paginatedData = filtered.slice(startIdx, startIdx + params.limit);

    const mockResult: PaginatedResponse<PortalUser> = {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage,
      pageSize: params.limit
    };

    return executeApiCall(
      async () => {
        const queryParams = new URLSearchParams({
          page: String(params.page),
          limit: String(params.limit),
          search: params.search || '',
          status: params.status || '',
          sortBy: params.sortBy || '',
          sortOrder: params.sortOrder || 'asc'
        });
        const response = await fetch(`/api/users?${queryParams.toString()}`);
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      mockResult,
      'getUsers'
    );
  },

  updateUser: async (user: PortalUser): Promise<PortalUser> => {
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index < 0) throw new Error('User not found');

    const updated = [...users];
    updated[index] = user;
    saveStoredUsers(updated);

    return executeApiCall(
      async () => {
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error('API failed');
        return response.json();
      },
      user,
      `updateUser(${user.id})`
    );
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const users = getStoredUsers();
    const updated = users.filter(u => u.id !== id);
    saveStoredUsers(updated);

    return executeApiCall(
      async () => {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('API failed');
        return true;
      },
      true,
      `deleteUser(${id})`
    );
  }
};
