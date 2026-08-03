/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreateStoryPayload } from '../types';

export function isFormDirty(current: CreateStoryPayload, initial: CreateStoryPayload): boolean {
  if (current.name !== initial.name) return true;
  if (current.type !== initial.type) return true;
  if (current.coverImage !== initial.coverImage) return true;
  if (current.famousQuote !== initial.famousQuote) return true;
  if (current.videoUrl !== initial.videoUrl) return true;
  if (current.biography !== initial.biography) return true;

  if (current.burialPlace.name !== initial.burialPlace.name) return true;
  if (current.burialPlace.description !== initial.burialPlace.description) return true;
  if (current.burialPlace.address !== initial.burialPlace.address) return true;
  if (current.burialPlace.coverImage !== initial.burialPlace.coverImage) return true;

  if (current.timeline.length !== initial.timeline.length) return true;
  if (current.sacredGallery.length !== initial.sacredGallery.length) return true;

  return false;
}

export function formatCoordinate(val: number): string {
  if (isNaN(val)) return '0.0000';
  return val.toFixed(4);
}
