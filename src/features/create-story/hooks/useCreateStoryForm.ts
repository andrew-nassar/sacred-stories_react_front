/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CreateStoryPayload,
  BurialPlacePayload,
  TimelineItemPayload,
  SacredGalleryItemPayload,
  StoryTypeOption,
  FormValidationErrors
} from '../types';
import { INITIAL_FORM_STATE, DEFAULT_STORY_TYPES } from '../constants';
import { PublicCreateStoryApi } from '../api/createStory.api';
import { validateCreateStoryForm, validateStep } from '../validation/createStory.schema';
import { isFormDirty } from '../utils';

export function useCreateStoryForm() {
  const [formData, setFormData] = useState<CreateStoryPayload>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<FormValidationErrors>({});

  // Dynamic story types state
  const [storyTypes, setStoryTypes] = useState<StoryTypeOption[]>(DEFAULT_STORY_TYPES);
  const [isLoadingTypes, setIsLoadingTypes] = useState<boolean>(false);

  // Form Submission & UX States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Active step for multi-section view (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Validate step navigation
  const goToStep = useCallback((targetStep: number) => {
    if (targetStep <= activeStep) {
      setSubmitError(null);
      setActiveStep(targetStep);
      return true;
    }

    // Validate current step and any steps prior to targetStep
    for (let s = 1; s < targetStep; s++) {
      const stepErrors = validateStep(s, formData);
      if (Object.keys(stepErrors).length > 0) {
        setValidationErrors(stepErrors);
        setSubmitError(`Please fill all required fields in Step ${s} before proceeding.`);
        setActiveStep(s);
        return false;
      }
    }

    setValidationErrors({});
    setSubmitError(null);
    setActiveStep(targetStep);
    return true;
  }, [activeStep, formData]);

  // Unsaved changes confirmation modal trigger
  const [showConfirmLeave, setShowConfirmLeave] = useState<boolean>(false);

  // Fetch story types on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingTypes(true);

    PublicCreateStoryApi.getStoryTypes()
      .then((types) => {
        if (isMounted && types && types.length > 0) {
          setStoryTypes(types);
        }
      })
      .catch((err) => {
        console.error('[useCreateStoryForm] Error loading story types:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingTypes(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update top-level field
  const updateField = useCallback(<K extends keyof CreateStoryPayload>(key: K, value: CreateStoryPayload[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear field specific error
    setValidationErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  // Update Burial Place field
  const updateBurialField = useCallback(<K extends keyof BurialPlacePayload>(key: K, value: BurialPlacePayload[K]) => {
    setFormData((prev) => ({
      ...prev,
      burialPlace: {
        ...prev.burialPlace,
        [key]: value
      }
    }));
    setValidationErrors((prev) => {
      const errKey = `burialPlace.${key}`;
      if (!prev[errKey]) return prev;
      const next = { ...prev };
      delete next[errKey];
      return next;
    });
  }, []);

  // ==========================================
  // TIMELINE DYNAMIC COLLECTION HANDLERS
  // ==========================================
  const addTimelineItem = useCallback(() => {
    const newItem: TimelineItemPayload = {
      date: 'Date / Period',
      title: 'New Event Title',
      description: 'Event description details...'
    };
    setFormData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newItem]
    }));
  }, []);

  const updateTimelineItem = useCallback((index: number, updated: Partial<TimelineItemPayload>) => {
    setFormData((prev) => {
      const list = [...prev.timeline];
      if (list[index]) {
        list[index] = { ...list[index], ...updated };
      }
      return { ...prev, timeline: list };
    });
  }, []);

  const deleteTimelineItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  }, []);

  const moveTimelineItem = useCallback((fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      if (toIndex < 0 || toIndex >= prev.timeline.length) return prev;
      const list = [...prev.timeline];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...prev, timeline: list };
    });
  }, []);

  // ==========================================
  // SACRED GALLERY DYNAMIC COLLECTION HANDLERS
  // ==========================================
  const addGalleryItem = useCallback((imageUrl = '', title = '') => {
    const newItem: SacredGalleryItemPayload = {
      title: title || `Icon / Relic ${formData.sacredGallery.length + 1}`,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
    };
    setFormData((prev) => ({
      ...prev,
      sacredGallery: [...prev.sacredGallery, newItem]
    }));
  }, [formData.sacredGallery.length]);

  const updateGalleryItem = useCallback((index: number, updated: Partial<SacredGalleryItemPayload>) => {
    setFormData((prev) => {
      const list = [...prev.sacredGallery];
      if (list[index]) {
        list[index] = { ...list[index], ...updated };
      }
      return { ...prev, sacredGallery: list };
    });
  }, []);

  const deleteGalleryItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      sacredGallery: prev.sacredGallery.filter((_, i) => i !== index)
    }));
  }, []);

  const replaceGalleryImage = useCallback((index: number, newImageUrl: string) => {
    updateGalleryItem(index, { imageUrl: newImageUrl });
  }, [updateGalleryItem]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setValidationErrors({});
    setSubmitError(null);
    setIsSuccess(false);
    setSubmittedData(null);
    setActiveStep(1);
    setShowConfirmLeave(false);
  }, []);

  // Dirty state calculation
  const isDirty = isFormDirty(formData, INITIAL_FORM_STATE);

  // Submit handler
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setSubmitError(null);

    // Perform validation
    const errors = validateCreateStoryForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSubmitError('Please fix the validation errors highlighted in red before submitting.');
      // Auto switch to step with first error
      if (errors.name || errors.coverImage || errors.biography || errors.type || errors.videoUrl) {
        setActiveStep(1);
      } else if (errors['burialPlace.name'] || errors['burialPlace.coverImage'] || errors['burialPlace.googleMapsUrl']) {
        setActiveStep(2);
      } else if (Object.keys(errors).some((k) => k.startsWith('timeline'))) {
        setActiveStep(3);
      } else if (Object.keys(errors).some((k) => k.startsWith('gallery'))) {
        setActiveStep(4);
      }
      return false;
    }

    setIsSubmitting(true);

    try {
      const response = await PublicCreateStoryApi.createStory(formData);
      setIsSuccess(true);
      setSubmittedData(response);
      return true;
    } catch (err: any) {
      console.error('[useCreateStoryForm] Submission error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit sacred story. Please try again.';
      setSubmitError(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return {
    formData,
    setFormData,
    updateField,
    updateBurialField,

    // Timeline actions
    addTimelineItem,
    updateTimelineItem,
    deleteTimelineItem,
    moveTimelineItem,

    // Gallery actions
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    replaceGalleryImage,

    // Story types & form status
    storyTypes,
    isLoadingTypes,
    validationErrors,
    isSubmitting,
    submitError,
    isSuccess,
    submittedData,
    isDirty,

    // Navigation & UX
    activeStep,
    setActiveStep,
    goToStep,
    showConfirmLeave,
    setShowConfirmLeave,
    resetForm,
    handleSubmit
  };
}
