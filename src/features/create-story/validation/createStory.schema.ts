/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreateStoryPayload, FormValidationErrors } from '../types';

export function isValidUrl(urlString: string): boolean {
  if (!urlString || !urlString.trim()) return false;
  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export function validateCreateStoryForm(formData: CreateStoryPayload): FormValidationErrors {
  const errors: FormValidationErrors = {};

  // Story Info Validation
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Story name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Story name must be at least 2 characters';
  }

  if (formData.type === undefined || formData.type === null || isNaN(formData.type)) {
    errors.type = 'Please select a valid story type';
  }

  if (!formData.coverImage || !formData.coverImage.trim()) {
    errors.coverImage = 'Cover image URL is required';
  } else if (!isValidUrl(formData.coverImage)) {
    errors.coverImage = 'Please provide a valid image URL starting with http:// or https://';
  }

  if (!formData.biography || !formData.biography.trim()) {
    errors.biography = 'Biography is required';
  } else if (formData.biography.trim().length < 20) {
    errors.biography = 'Biography should be at least 20 characters long';
  }

  if (formData.videoUrl && formData.videoUrl.trim() && !isValidUrl(formData.videoUrl)) {
    errors.videoUrl = 'Please provide a valid video URL (YouTube, Vimeo, etc.)';
  }

  // Burial Place Validation
  if (!formData.burialPlace.name || !formData.burialPlace.name.trim()) {
    errors['burialPlace.name'] = 'Burial place name is required';
  }

  if (formData.burialPlace.coverImage && formData.burialPlace.coverImage.trim() && !isValidUrl(formData.burialPlace.coverImage)) {
    errors['burialPlace.coverImage'] = 'Burial place cover image must be a valid URL';
  }

  if (formData.burialPlace.googleMapsUrl && formData.burialPlace.googleMapsUrl.trim() && !isValidUrl(formData.burialPlace.googleMapsUrl)) {
    errors['burialPlace.googleMapsUrl'] = 'Google Maps link must be a valid URL';
  }

  // Timeline Validation
  formData.timeline.forEach((item, index) => {
    if (!item.date || !item.date.trim()) {
      errors[`timeline[${index}].date`] = 'Timeline date is required';
    }
    if (!item.title || !item.title.trim()) {
      errors[`timeline[${index}].title`] = 'Timeline event title is required';
    }
    if (!item.description || !item.description.trim()) {
      errors[`timeline[${index}].description`] = 'Timeline description is required';
    }
  });

  // Sacred Gallery Validation
  formData.sacredGallery.forEach((item, index) => {
    if (!item.title || !item.title.trim()) {
      errors[`gallery[${index}].title`] = 'Gallery image title is required';
    }
    if (!item.imageUrl || !item.imageUrl.trim()) {
      errors[`gallery[${index}].imageUrl`] = 'Gallery image URL is required';
    } else if (!isValidUrl(item.imageUrl)) {
      errors[`gallery[${index}].imageUrl`] = 'Please enter a valid image URL';
    }
  });

  return errors;
}

export function validateStep(step: number, formData: CreateStoryPayload): FormValidationErrors {
  const errors: FormValidationErrors = {};

  if (step === 1) {
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Story name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Story name must be at least 2 characters';
    }

    if (formData.type === undefined || formData.type === null || isNaN(formData.type)) {
      errors.type = 'Please select a valid story type';
    }

    if (!formData.coverImage || !formData.coverImage.trim()) {
      errors.coverImage = 'Cover image URL is required';
    } else if (!isValidUrl(formData.coverImage)) {
      errors.coverImage = 'Please provide a valid image URL starting with http:// or https://';
    }

    if (!formData.biography || !formData.biography.trim()) {
      errors.biography = 'Biography is required';
    } else if (formData.biography.trim().length < 20) {
      errors.biography = 'Biography should be at least 20 characters long';
    }

    if (formData.videoUrl && formData.videoUrl.trim() && !isValidUrl(formData.videoUrl)) {
      errors.videoUrl = 'Please provide a valid video URL (YouTube, Vimeo, etc.)';
    }
  } else if (step === 2) {
    if (!formData.burialPlace.name || !formData.burialPlace.name.trim()) {
      errors['burialPlace.name'] = 'Burial place name is required';
    }

    if (formData.burialPlace.coverImage && formData.burialPlace.coverImage.trim() && !isValidUrl(formData.burialPlace.coverImage)) {
      errors['burialPlace.coverImage'] = 'Burial place cover image must be a valid URL';
    }

    if (formData.burialPlace.googleMapsUrl && formData.burialPlace.googleMapsUrl.trim() && !isValidUrl(formData.burialPlace.googleMapsUrl)) {
      errors['burialPlace.googleMapsUrl'] = 'Google Maps link must be a valid URL';
    }
  } else if (step === 3) {
    formData.timeline.forEach((item, index) => {
      if (!item.date || !item.date.trim()) {
        errors[`timeline[${index}].date`] = 'Timeline date is required';
      }
      if (!item.title || !item.title.trim()) {
        errors[`timeline[${index}].title`] = 'Timeline event title is required';
      }
      if (!item.description || !item.description.trim()) {
        errors[`timeline[${index}].description`] = 'Timeline description is required';
      }
    });
  } else if (step === 4) {
    formData.sacredGallery.forEach((item, index) => {
      if (!item.title || !item.title.trim()) {
        errors[`gallery[${index}].title`] = 'Gallery image title is required';
      }
      if (!item.imageUrl || !item.imageUrl.trim()) {
        errors[`gallery[${index}].imageUrl`] = 'Gallery image URL is required';
      } else if (!isValidUrl(item.imageUrl)) {
        errors[`gallery[${index}].imageUrl`] = 'Please enter a valid image URL';
      }
    });
  }

  return errors;
}
