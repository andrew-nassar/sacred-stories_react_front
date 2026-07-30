/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardMetrics, SacredStory, PortalUser } from '../types';

export const INITIAL_MOCK_METRICS: DashboardMetrics = {
  totalStoriesCount: 3105,
  publishedCount: 2891,
  pendingCount: 2,
  rejectedCount: 56,
  totalUsersCount: 12482,
  recentActivity: [
    { id: 'act-1', text: 'Scribe Perpetua submitted Saint Vibia Perpetua for review', time: '2h ago', type: 'pending' },
    { id: 'act-2', text: 'Lead Historian Anna approved Icons of the Steppe', time: '1d ago', type: 'approved' },
    { id: 'act-3', text: 'Brother Elias created draft "The Silence of Brother Elias"', time: '2d ago', type: 'draft' },
    { id: 'act-4', text: 'System backup completed successfully (2.4 TB archived)', time: '3d ago', type: 'system' }
  ]
};

export const INITIAL_MOCK_STORIES: SacredStory[] = [
  {
    id: 'st-perpetua',
    sacredName: 'Saint Vibia Perpetua',
    devotionalCategory: 'Early Christian Martyr',
    canonizationYear: 'Pre-Congregation',
    definingUtterance: 'Stand fast in the faith, and love one another, and be not offended at our sufferings.',
    veneratedNarrative: 'A young noblewoman of Carthage...',
    accessControl: { publicArchive: true, liturgicalCalendarTag: 'March 7' },
    burialPlace: {
      sanctuaryName: 'Basilica Major of Carthage',
      physicalAddress: 'Carthage, Tunisia',
      latitude: '36.8528',
      longitude: '10.3333',
      siteTypology: 'Ruins',
      translationDate: 'N/A',
      description: 'Ruins of Carthage'
    },
    status: 'Pending',
    submittedBy: 'Scribe Perpetua',
    dateSubmitted: '2026-07-20',
    gallery: []
  }
];

export const INITIAL_MOCK_USERS: PortalUser[] = [
  { id: 'usr-1', name: 'Nikolaos of Myra', role: 'Archivist', status: 'Active' }
];
