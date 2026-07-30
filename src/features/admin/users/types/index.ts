/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatarUrl: string;
  verified: boolean;
  joinDate: string;
  permissions: string[];
}
