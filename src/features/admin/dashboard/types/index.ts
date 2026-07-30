/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AccessControl {
  publicArchive: boolean;
  liturgicalCalendarTag: string;
}

export interface BurialPlace {
  sanctuaryName: string;
  physicalAddress: string;
  latitude: string;
  longitude: string;
  siteTypology: string;
  translationDate: string;
  description: string;
}

export interface SacredStory {
  id: string;
  sacredName: string;
  devotionalCategory: string;
  canonizationYear: string;
  definingUtterance: string;
  veneratedNarrative: string;
  accessControl: AccessControl;
  burialPlace: BurialPlace;
  status: 'Published' | 'Pending' | 'Rejected';
  submittedBy: string;
  dateSubmitted: string;
  gallery: Array<{ id: string; imageUrl: string; title: string }>;
}

export interface PortalUser {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface DashboardActivity {
  id: string;
  text: string;
  time: string;
  type: string;
}

export interface DashboardMetrics {
  totalStoriesCount: number;
  publishedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalUsersCount: number;
  recentActivity: DashboardActivity[];
}

export interface DashboardData {
  stories: SacredStory[];
  users: PortalUser[];
  metrics: DashboardMetrics;
}
