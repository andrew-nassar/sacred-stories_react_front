/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '@/src/features/admin/services/auth.service';
import { PortalUser } from '../types';

export interface GetUsersParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  role?: string;
}

export interface GetUsersResult {
  items: PortalUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const UsersApi = {
  getUsers: async (params: GetUsersParams): Promise<GetUsersResult> => {
    let roleParam: number | string | undefined = undefined;
    if (params.role && params.role !== 'ALL' && params.role.trim() !== '') {
      roleParam = /^\d+$/.test(params.role.trim()) ? parseInt(params.role.trim(), 10) : params.role.trim();
    }

    const response = await api.get('/api/Auth/users', {
      params: {
        searchTerm: params.searchTerm && params.searchTerm.trim() !== '' ? params.searchTerm.trim() : undefined,
        role: roleParam,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      },
    });

    const resBody = response.data;
    const dataContainer = resBody?.data || resBody;

    let rawItems: any[] = [];
    if (Array.isArray(dataContainer)) {
      rawItems = dataContainer;
    } else if (Array.isArray(dataContainer?.items)) {
      rawItems = dataContainer.items;
    } else if (Array.isArray(dataContainer?.Items)) {
      rawItems = dataContainer.Items;
    } else if (Array.isArray(resBody?.items)) {
      rawItems = resBody.items;
    } else if (Array.isArray(resBody?.Items)) {
      rawItems = resBody.Items;
    }

    const totalCount = Number(
      dataContainer?.totalCount ??
      dataContainer?.TotalCount ??
      resBody?.totalCount ??
      resBody?.TotalCount ??
      rawItems.length
    );

    const pageNumber = Number(
      dataContainer?.pageNumber ??
      dataContainer?.PageNumber ??
      resBody?.pageNumber ??
      resBody?.PageNumber ??
      params.pageNumber
    );

    const pageSize = Number(
      dataContainer?.pageSize ??
      dataContainer?.PageSize ??
      resBody?.pageSize ??
      resBody?.PageSize ??
      params.pageSize
    );

    const items: PortalUser[] = rawItems.map((u: any) => {
      const isEmailConfirmed = Boolean(
        u.isEmailConfirmed ?? u.IsEmailConfirmed ?? u.verified ?? u.Verified ?? false
      );
      const memberSince = String(
        u.memberSince || u.MemberSince || u.joinDate || u.JoinDate || u.createdDate || u.CreatedDate || new Date().toISOString()
      );

      return {
        id: String(u.id || u.Id || `user-${Math.random()}`),
        name: String(u.name || u.Name || 'Unknown User'),
        email: String(u.email || u.Email || ''),
        role: String(u.role || u.Role || 'Contributor'),
        isEmailConfirmed,
        memberSince,
        status: isEmailConfirmed ? 'Active' : 'Pending',
        avatarUrl: String(
          u.avatarUrl ||
          u.AvatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.Name || 'User')}&background=d97706&color=fff`
        ),
        verified: isEmailConfirmed,
        joinDate: memberSince,
        permissions: u.permissions || u.Permissions || ['Create Entry', 'Save Drafts'],
      };
    });

    return {
      items,
      totalCount,
      pageNumber,
      pageSize,
    };
  },

  updateUser: async (user: PortalUser): Promise<PortalUser> => {
    const response = await api.put(`/api/Auth/users/${user.id}`, user);
    return response.data?.data || response.data || user;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    await api.delete(`/api/Auth/users/${id}`);
    return true;
  }
};
