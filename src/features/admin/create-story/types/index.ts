/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StoryTypeOption {
  id: number;
  name: string;
  displayName: string;
}

export interface BurialPlacePayload {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  coverImage: string;
}

export interface TimelineEventPayload {
  date: string;
  title: string;
  description: string;
}

export interface SacredGalleryPayload {
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
  timeline: TimelineEventPayload[];
  sacredGallery: SacredGalleryPayload[];
}

export interface TimelineEventItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface SacredStory {
  id?: string;
  sacredName?: string;
  devotionalCategory?: string;
  canonizationYear?: string;
  definingUtterance?: string;
  veneratedNarrative?: string;
  status?: string;
  submittedBy?: string;
}

export interface GalleryAssetItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
}
