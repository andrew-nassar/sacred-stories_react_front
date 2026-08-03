/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreateStoryPayload, StoryTypeOption } from '../types';

export const DEFAULT_STORY_TYPES: StoryTypeOption[] = [
  { id: 0, name: "Hermit", displayName: "متوحد" },
  { id: 1, name: "Saint", displayName: "قديس" },
  { id: 2, name: "Martyr", displayName: "شهيد" },
  { id: 3, name: "Patriarch", displayName: "بطريرك" },
  { id: 4, name: "Archpriest", displayName: "قمص" },
  { id: 5, name: "Pope", displayName: "بابا" }
];

export const INITIAL_FORM_STATE: CreateStoryPayload = {
  type: 1, // Default to Saint
  name: '',
  coverImage: '',
  famousQuote: '',
  videoUrl: '',
  biography: '',
  burialPlace: {
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    googleMapsUrl: '',
    coverImage: ''
  },
  timeline: [
    {
      date: '300 AD',
      title: 'Early Life & Dedicated Calling',
      description: 'Devoted life to prayer, ascetical study, and serving the community.'
    }
  ],
  sacredGallery: []
};

export const FORM_STEPS = [
  { id: 1, key: 'info', label: 'Story Information', labelAr: 'معلومات القصة' },
  { id: 2, key: 'burial', label: 'Burial Place', labelAr: 'مكان المزار' },
  { id: 3, key: 'timeline', label: 'Timeline Events', labelAr: 'الخط الزمني' },
  { id: 4, key: 'gallery', label: 'Sacred Gallery', labelAr: 'معرض الصور' },
  { id: 5, key: 'review', label: 'Review & Submit', labelAr: 'مراجعة وإرسال' }
];
