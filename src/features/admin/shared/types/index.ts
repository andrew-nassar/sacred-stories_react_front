/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StoryStatus = 'Published' | 'Pending' | 'Rejected';

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

export interface TimelineEvent {
  id: string;
  year: string;
  eventTitle: string;
  description: string;
}

export interface GalleryAsset {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export interface EditorialChecks {
  authenticityVerified: boolean;
  historicalCorroboration: boolean;
  accessPermissionsChecked: boolean;
  relicVenerationDocumented: boolean;
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
  chronology: TimelineEvent[];
  gallery: GalleryAsset[];
  documentaryMedia: {
    title: string;
    duration: string;
    url: string;
  };
  status: StoryStatus;
  submittedBy: string;
  dateSubmitted: string;
  editorialComments: string;
  editorialChecks: EditorialChecks;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

