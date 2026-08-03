/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from './auth.service';
import { ADMIN_CONFIG } from '../shared/config';
import { PortalUser } from '../users/types';
import { INITIAL_USERS } from '../users/mock/users.mock';

export interface PaginatedUsersResult {
  items: PortalUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const UsersService = {
  getUsers: async (
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
    role?: string
  ): Promise<PaginatedUsersResult> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...INITIAL_USERS];

      if (searchTerm && searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      }

      if (role && role !== 'ALL') {
        filtered = filtered.filter(u => u.role === role);
      }

      const totalCount = filtered.length;
      const startIdx = (pageNumber - 1) * pageSize;
      const paginatedItems = filtered.slice(startIdx, startIdx + pageSize);

      return {
        items: paginatedItems,
        totalCount,
        pageNumber,
        pageSize,
      };
    }

    try {
      let roleParam: number | string | undefined = undefined;
      if (typeof role === 'number') {
        roleParam = role;
      } else if (typeof role === 'string' && role !== 'ALL' && role.trim() !== '') {
        roleParam = /^\d+$/.test(role.trim()) ? parseInt(role.trim(), 10) : role.trim();
      }

      const response = await api.get('/api/Auth/users', {
        params: {
          searchTerm: searchTerm && searchTerm.trim() !== '' ? searchTerm.trim() : undefined,
          role: roleParam,
          pageNumber,
          pageSize,
        },
      });

      const responseData = response.data;
      const dataContainer = responseData?.data || responseData;

      let items: any[] = [];
      if (Array.isArray(dataContainer)) {
        items = dataContainer;
      } else if (Array.isArray(dataContainer?.items)) {
        items = dataContainer.items;
      } else if (Array.isArray(dataContainer?.Items)) {
        items = dataContainer.Items;
      } else if (Array.isArray(responseData?.items)) {
        items = responseData.items;
      } else if (Array.isArray(responseData?.Items)) {
        items = responseData.Items;
      }

      const totalCount = Number(
        dataContainer?.totalCount ??
        dataContainer?.TotalCount ??
        responseData?.totalCount ??
        responseData?.TotalCount ??
        items.length
      );
      const resPageNumber = Number(
        dataContainer?.pageNumber ??
        dataContainer?.PageNumber ??
        responseData?.pageNumber ??
        responseData?.PageNumber ??
        pageNumber
      );
      const resPageSize = Number(
        dataContainer?.pageSize ??
        dataContainer?.PageSize ??
        responseData?.pageSize ??
        responseData?.PageSize ??
        pageSize
      );

      const mappedUsers: PortalUser[] = items.map((u: any) => {
        let userStatus: 'Active' | 'Inactive' | 'Pending' = 'Active';
        const rawStatus = String(u.status || u.Status || 'Active').trim();
        if (rawStatus === 'Inactive' || rawStatus.toLowerCase() === 'inactive') {
          userStatus = 'Inactive';
        } else if (rawStatus === 'Pending' || rawStatus.toLowerCase() === 'pending') {
          userStatus = 'Pending';
        }

        const isConfirmed = Boolean(
          u.isEmailConfirmed ??
          u.IsEmailConfirmed ??
          u.verified ??
          u.Verified ??
          true
        );

        const memberSinceRaw = u.memberSince || u.MemberSince || u.joinDate || u.JoinDate || u.createdDate || u.CreatedDate;
        let formattedJoinDate = new Date().toISOString().split('T')[0];
        if (memberSinceRaw) {
          try {
            formattedJoinDate = new Date(memberSinceRaw).toISOString().split('T')[0];
          } catch {
            formattedJoinDate = String(memberSinceRaw);
          }
        }

        return {
          id: String(u.id || u.Id || `user-${Math.random()}`),
          name: String(u.name || u.Name || 'Unknown User'),
          email: String(u.email || u.Email || ''),
          role: String(u.role || u.Role || 'Contributor'),
          isEmailConfirmed: isConfirmed,
          memberSince: formattedJoinDate,
          status: userStatus,
          avatarUrl: String(
            u.avatarUrl ||
            u.AvatarUrl ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
          ),
          verified: isConfirmed,
          joinDate: formattedJoinDate,
          permissions: u.permissions || u.Permissions || ['Create Entry', 'Save Drafts'],
        };
      });

      return {
        items: mappedUsers,
        totalCount,
        pageNumber: resPageNumber,
        pageSize: resPageSize,
      };
    } catch (error) {
      console.error('[UsersService] Error fetching users from API:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[UsersService] Falling back to mock users list');
        let filtered = [...INITIAL_USERS];

        if (searchTerm && searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
          );
        }

        if (role && role !== 'ALL') {
          filtered = filtered.filter(u => u.role === role);
        }

        const totalCount = filtered.length;
        const startIdx = (pageNumber - 1) * pageSize;
        const paginatedItems = filtered.slice(startIdx, startIdx + pageSize);

        return {
          items: paginatedItems,
          totalCount,
          pageNumber,
          pageSize,
        };
      }
      throw error;
    }
  },

  updateUser: async (user: PortalUser): Promise<PortalUser> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return user;
    }

    try {
      const response = await api.put(`/api/Auth/users/${user.id}`, user);
      return response.data?.data || response.data || user;
    } catch (error) {
      console.error('[UsersService] Error updating user:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[UsersService] Falling back to mock user update');
        return user;
      }
      throw error;
    }
  },

  deleteUser: async (id: string): Promise<boolean> => {
    if (ADMIN_CONFIG.useMockOnly) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return true;
    }

    try {
      await api.delete(`/api/Auth/users/${id}`);
      return true;
    } catch (error) {
      console.error('[UsersService] Error deleting user:', error);
      if (ADMIN_CONFIG.autoFallbackToMock) {
        console.warn('[UsersService] Falling back to mock user deletion');
        return true;
      }
      throw error;
    }
  }
};
