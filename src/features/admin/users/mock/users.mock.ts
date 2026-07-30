/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortalUser } from '../types';

export const INITIAL_USERS: PortalUser[] = [
  {
    id: 'usr-1',
    name: 'Nikolaos of Myra',
    email: 'n.myra@sacredstories.org',
    role: 'Archivist',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-01-10',
    permissions: ['Create Entry', 'Edit Entry', 'Review Queue', 'Manage Users', 'Access Settings']
  },
  {
    id: 'usr-2',
    name: 'Scribe Perpetua',
    email: 'vibia.p@sacredstories.org',
    role: 'Senior Scribe',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-03-15',
    permissions: ['Create Entry', 'Edit Entry', 'Publish Own Drafts']
  },
  {
    id: 'usr-3',
    name: 'Brother Elias',
    email: 'elias.chapel@sacredstories.org',
    role: 'Contributor',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    verified: false,
    joinDate: '2025-06-01',
    permissions: ['Create Entry', 'Save Drafts']
  },
  {
    id: 'usr-4',
    name: 'Lead Historian Anna',
    email: 'a.comnena@sacredstories.org',
    role: 'Chief Editor',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-02-20',
    permissions: ['Create Entry', 'Edit Entry', 'Review Queue', 'Approve Entry', 'Reject Entry']
  },
  {
    id: 'usr-5',
    name: 'John Damascene',
    email: 'john.d@sacredstories.org',
    role: 'Iconographer',
    status: 'Inactive',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    verified: true,
    joinDate: '2024-05-11',
    permissions: ['Upload Assets', 'Edit Metadata']
  }
];
