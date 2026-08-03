/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { CreateStoryApi } from '../api/createStory.api';
import { TimelineEventItem, GalleryAssetItem, CreateStoryPayload, StoryTypeOption } from '../types';

export function useCreateStory() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccessfullyPublished, setIsSuccessfullyPublished] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Story types state (fetched from GET /api/SacredStories/types)
  const [storyTypes, setStoryTypes] = useState<StoryTypeOption[]>([
    { id: 0, name: "Hermit", displayName: "متوحد" },
    { id: 1, name: "Saint", displayName: "قديس" },
    { id: 2, name: "Martyr", displayName: "شهيد" },
    { id: 3, name: "Patriarch", displayName: "بطريرك" },
    { id: 4, name: "Archpriest", displayName: "قمص" },
    { id: 5, name: "Pope", displayName: "بابا" }
  ]);
  const [isLoadingTypes, setIsLoadingTypes] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingTypes(true);
    CreateStoryApi.getStoryTypes().then(types => {
      if (isMounted && types && types.length > 0) {
        setStoryTypes(types);
      }
    }).catch(err => {
      console.error('[useCreateStory] Failed loading story types:', err);
    }).finally(() => {
      if (isMounted) setIsLoadingTypes(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Story information
  const [storyType, setStoryType] = useState<number>(0);
  const [name, setName] = useState('Saint Nicholas of Myra');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400');
  const [famousQuote, setFamousQuote] = useState('The giver of every good and perfect gift has called upon us to mimic His generosity in the shadows of the world.');
  const [videoUrl, setVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [biography, setBiography] = useState('Born in Patara to wealthy Christian parents, Nicholas dedicated his life and inheritance to secret acts of charity. As Bishop of Myra during the Diocletianic Persecution, he suffered imprisonment for the faith. His legendary rescue of three daughters from destitution established his renown as a protector of the vulnerable.');

  // Burial Place details
  const [burialName, setBurialName] = useState('Basilica di San Nicola');
  const [burialDescription, setBurialDescription] = useState('The crypt contains the original tomb of Saint Nicholas, which continues to exude Manna.');
  const [burialAddress, setBurialAddress] = useState('Largo Abate Elia, 13, 70122 Bari BA, Italy');
  const [latitude, setLatitude] = useState<number>(41.1304);
  const [longitude, setLongitude] = useState<number>(16.8703);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('https://maps.google.com/?q=41.1304,16.8703');
  const [burialCoverImage, setBurialCoverImage] = useState('https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=400');

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineEventItem[]>([
    {
      id: 't-1',
      date: '270-01-01',
      title: 'Birth in Patara',
      description: 'Born to devout Christian parents who left him a vast inheritance, which he used for covert acts of generosity.'
    },
    {
      id: 't-2',
      date: '300-01-01',
      title: 'Bishop of Myra',
      description: 'Consecrated as the Bishop of Myra, known for his pastoral care and defense of orthodox theology.'
    }
  ]);

  // Sacred Gallery state
  const [gallery, setGallery] = useState<GalleryAssetItem[]>([
    {
      id: 'g-1',
      title: 'Ancient Mosaic Portrait',
      imageUrl: 'https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400',
      category: 'Relic Art'
    },
    {
      id: 'g-2',
      title: 'Relic Shrine in Bari',
      imageUrl: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=400',
      category: 'Sanctuary'
    }
  ]);

  // Image preview modal state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Timeline operations
  const addTimelineItem = useCallback((item: Omit<TimelineEventItem, 'id'>) => {
    const newItem: TimelineEventItem = {
      ...item,
      id: `t-${Date.now()}`
    };
    setTimeline(prev => [...prev, newItem]);
  }, []);

  const updateTimelineItem = useCallback((id: string, updated: Partial<TimelineEventItem>) => {
    setTimeline(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  }, []);

  const removeTimelineItem = useCallback((id: string) => {
    setTimeline(prev => prev.filter(item => item.id !== id));
  }, []);

  const moveTimelineItem = useCallback((index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === timeline.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setTimeline(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  }, [timeline.length]);

  // Gallery operations
  const addGalleryItem = useCallback((item: Omit<GalleryAssetItem, 'id'>) => {
    const newItem: GalleryAssetItem = {
      ...item,
      id: `g-${Date.now()}`
    };
    setGallery(prev => [...prev, newItem]);
  }, []);

  const updateGalleryItem = useCallback((id: string, updated: Partial<GalleryAssetItem>) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  }, []);

  const removeGalleryItem = useCallback((id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  }, []);

  // Validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!name || !name.trim()) {
      errors.name = 'Story name is required';
    }
    if (!biography || !biography.trim()) {
      errors.biography = 'Biography is required';
    }
    if (!coverImage || !coverImage.trim()) {
      errors.coverImage = 'Cover image URL is required';
    }
    if (!burialName || !burialName.trim()) {
      errors.burialName = 'Burial place name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [name, biography, coverImage, burialName]);

  // Submit handler
  const handlePublishStory = useCallback(async (onSuccessCallback?: () => void) => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: CreateStoryPayload = {
        type: Number(storyType),
        name: name.trim(),
        coverImage: coverImage.trim(),
        famousQuote: famousQuote.trim(),
        videoUrl: videoUrl.trim(),
        biography: biography.trim(),
        burialPlace: {
          name: burialName.trim(),
          description: burialDescription.trim(),
          address: burialAddress.trim(),
          latitude: Number(latitude) || 0,
          longitude: Number(longitude) || 0,
          googleMapsUrl: googleMapsUrl.trim() || `https://maps.google.com/?q=${latitude},${longitude}`,
          coverImage: burialCoverImage.trim() || coverImage.trim()
        },
        timeline: timeline.map(t => {
          let dateIso = t.date;
          if (t.date && !t.date.includes('T')) {
            try {
              const parsed = new Date(t.date);
              if (!isNaN(parsed.getTime())) {
                dateIso = parsed.toISOString();
              }
            } catch {
              // keep as is
            }
          }
          return {
            date: dateIso || new Date().toISOString(),
            title: t.title.trim(),
            description: t.description.trim()
          };
        }),
        sacredGallery: gallery.map(g => ({
          title: g.title.trim(),
          imageUrl: g.imageUrl.trim()
        }))
      };

      await CreateStoryApi.createStory(payload);
      setIsSuccessfullyPublished(true);
      window.dispatchEvent(new Event('refresh-stories'));
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      return true;
    } catch (err: any) {
      console.error('[useCreateStory] Failed to create story:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to submit sacred story';
      setSubmitError(errMsg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    storyType,
    name,
    coverImage,
    famousQuote,
    videoUrl,
    biography,
    burialName,
    burialDescription,
    burialAddress,
    latitude,
    longitude,
    googleMapsUrl,
    burialCoverImage,
    timeline,
    gallery
  ]);

  const resetForm = useCallback(() => {
    setIsSuccessfullyPublished(false);
    setSubmitError(null);
    setValidationErrors({});
    setActiveStep(1);
    setStoryType(0);
    setName('');
    setFamousQuote('');
    setBiography('');
    setCoverImage('');
    setVideoUrl('');
    setBurialName('');
    setBurialDescription('');
    setBurialAddress('');
    setLatitude(0);
    setLongitude(0);
    setGoogleMapsUrl('');
    setBurialCoverImage('');
    setTimeline([]);
    setGallery([]);
  }, []);

  return {
    activeStep,
    setActiveStep,
    isSubmitting,
    submitError,
    setSubmitError,
    isSuccessfullyPublished,
    setIsSuccessfullyPublished,
    validationErrors,
    setValidationErrors,

    storyTypes,
    isLoadingTypes,
    storyType,
    setStoryType,
    name,
    setName,
    coverImage,
    setCoverImage,
    famousQuote,
    setFamousQuote,
    videoUrl,
    setVideoUrl,
    biography,
    setBiography,

    burialName,
    setBurialName,
    burialDescription,
    setBurialDescription,
    burialAddress,
    setBurialAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    googleMapsUrl,
    setGoogleMapsUrl,
    burialCoverImage,
    setBurialCoverImage,

    timeline,
    addTimelineItem,
    updateTimelineItem,
    removeTimelineItem,
    moveTimelineItem,

    gallery,
    addGalleryItem,
    updateGalleryItem,
    removeGalleryItem,

    previewImage,
    setPreviewImage,

    validateForm,
    handlePublishStory,
    resetForm
  };
}
