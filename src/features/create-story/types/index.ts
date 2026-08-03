/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BurialPlacePayload {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  coverImage: string;
}

export interface TimelineItemPayload {
  date: string;
  title: string;
  description: string;
}

export interface SacredGalleryItemPayload {
  title: string;
  imageUrl: string;
}

export interface CreateStoryPayload {
  type: number;
  name: string;
  coverImage: string;
  famousQuote: string;
  videoUrl: string;
  biography: string;
  burialPlace: BurialPlacePayload;
  timeline: TimelineItemPayload[];
  sacredGallery: SacredGalleryItemPayload[];
}

export interface StoryTypeOption {
  id: number;
  name: string;
  displayName: string;
}

export interface FormValidationErrors {
  [key: string]: string;
}
