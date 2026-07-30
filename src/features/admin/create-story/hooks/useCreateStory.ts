/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { SacredStory, TimelineEvent, GalleryAsset } from '../types';
import { SacredStoriesService } from '../../../../services/sacredStories.service';

export function useCreateStory() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSuccessfullyPublished, setIsSuccessfullyPublished] = useState(false);

  // New story form fields
  const [sacredName, setSacredName] = useState('Saint Nicholas of Myra');
  const [devotionalCategory, setDevotionalCategory] = useState('Bishop & Confessor');
  const [canonizationYear, setCanonizationYear] = useState('Pre-Congregation');
  const [definingUtterance, setDefiningUtterance] = useState('The giver of every good and perfect gift has called upon us to mimic His generosity in the shadows of the world.');
  const [veneratedNarrative, setVeneratedNarrative] = useState('Born in Patara to wealthy Christian parents, Nicholas dedicated his life and inheritance to secret acts of charity. As Bishop of Myra during the Diocletianic Persecution, he suffered imprisonment for the faith. His legendary rescue of three daughters from destitution established his renown as a protector of the vulnerable, laying the foundations for centuries of saintly veneration. His relics, later translated to Bari, Italy, remain a focal point of ecumenical pilgrimage and devotion.');
  const [publicArchive, setPublicArchive] = useState(true);
  const [liturgicalCalendarTag, setLiturgicalCalendarTag] = useState('December 6');
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400');

  // Burial Place state
  const [sanctuaryName, setSanctuaryName] = useState('Basilica di San Nicola');
  const [physicalAddress, setPhysicalAddress] = useState('Largo Abate Elia, 13, 70122 Bari BA, Italy');
  const [latitude, setLatitude] = useState('41.1304');
  const [longitude, setLongitude] = useState('16.8703');
  const [siteTypology, setSiteTypology] = useState('Major Pontifical Basilica');
  const [translationDate, setTranslationDate] = useState('May 9, 1087 AD');
  const [burialDescription, setBurialDescription] = useState('The crypt contains the original tomb of Saint Nicholas, which continues to exude "Manna", a sweet-smelling liquid venerated by pilgrims for its miraculous properties.');

  // Timeline state
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: 't-1',
      year: '270 AD',
      eventTitle: 'Birth in Patara',
      description: 'Born to devout Christian parents who left him a vast inheritance, which he used for covert acts of generosity.'
    },
    {
      id: 't-2',
      year: '300 AD',
      eventTitle: 'Bishop of Myra',
      description: 'Consecrated as the Bishop of Myra, known for his pastoral care and fierce defense of orthodox theology.'
    },
    {
      id: 't-3',
      year: '325 AD',
      eventTitle: 'First Council of Nicaea',
      description: 'Attended the historic council, defending the divinity of Christ against Arianism.'
    },
    {
      id: 't-4',
      year: '343 AD',
      eventTitle: 'Dormition',
      description: 'Entered eternal rest in Myra; his tomb quickly became a site of miraculous healing.'
    }
  ]);

  // Gallery state
  const [gallery, setGallery] = useState<GalleryAsset[]>([
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
    },
    {
      id: 'g-3',
      title: 'Gold Leaf Manuscript',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400',
      category: 'Scripture'
    }
  ]);

  // UI state
  const [presentationMode, setPresentationMode] = useState<'Cinematic Grid' | 'Standard List'>('Cinematic Grid');
  const [colorFilter, setColorFilter] = useState<number>(30);
  const [aiAltText, setAiAltText] = useState(true);

  // Operations
  const moveTimelineItem = useCallback((index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === timeline.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...timeline];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTimeline(updated);
  }, [timeline]);

  const addTimelineItem = useCallback((item: TimelineEvent) => {
    setTimeline(prev => [...prev, item]);
  }, []);

  const removeTimelineItem = useCallback((id: string) => {
    setTimeline(prev => prev.filter(item => item.id !== id));
  }, []);

  const addGalleryItem = useCallback((item: GalleryAsset) => {
    setGallery(prev => [...prev, item]);
  }, []);

  const removeGalleryItem = useCallback((id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  }, []);

  const handlePublishStory = useCallback(async () => {
    const payload = {
      type: 0,
      name: sacredName,
      coverImage: coverPhoto,
      famousQuote: definingUtterance,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      biography: veneratedNarrative,
      burialPlace: {
        sanctuaryName,
        physicalAddress,
        latitude,
        longitude,
        siteTypology,
        translationDate,
        description: burialDescription
      },
      timeline: timeline.map(t => ({
        year: t.year,
        eventTitle: t.eventTitle,
        description: t.description
      })),
      sacredGallery: gallery.map(g => ({
        title: g.title,
        imageUrl: g.imageUrl,
        category: g.category
      }))
    };

    try {
      await SacredStoriesService.createStory(payload);
      setIsSuccessfullyPublished(true);
      window.dispatchEvent(new Event('refresh-stories'));
    } catch (e) {
      alert('Failed to publish story');
    }
  }, [
    sacredName,
    coverPhoto,
    definingUtterance,
    veneratedNarrative,
    sanctuaryName,
    physicalAddress,
    latitude,
    longitude,
    siteTypology,
    translationDate,
    burialDescription,
    timeline,
    gallery
  ]);

  const resetForm = useCallback(() => {
    setIsSuccessfullyPublished(false);
    setActiveStep(1);
    setSacredName('Saint Nicholas of Myra');
    setDevotionalCategory('Bishop & Confessor');
    setCanonizationYear('Pre-Congregation');
    setDefiningUtterance('The giver of every good and perfect gift has called upon us to mimic His generosity in the shadows of the world.');
    setVeneratedNarrative('Born in Patara to wealthy Christian parents, Nicholas dedicated his life and inheritance to secret acts of charity. As Bishop of Myra during the Diocletianic Persecution, he suffered imprisonment for the faith. His legendary rescue of three daughters from destitution established his renown as a protector of the vulnerable, laying the foundations for centuries of saintly veneration. His relics, later translated to Bari, Italy, remain a focal point of ecumenical pilgrimage and devotion.');
    setPublicArchive(true);
    setLiturgicalCalendarTag('December 6');
    setCoverPhoto('https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400');
    setSanctuaryName('Basilica di San Nicola');
    setPhysicalAddress('Largo Abate Elia, 13, 70122 Bari BA, Italy');
    setLatitude('41.1304');
    setLongitude('16.8703');
    setSiteTypology('Major Pontifical Basilica');
    setTranslationDate('May 9, 1087 AD');
    setBurialDescription('The crypt contains the original tomb of Saint Nicholas, which continues to exude "Manna", a sweet-smelling liquid venerated by pilgrims for its miraculous properties.');
    setTimeline([
      {
        id: 't-1',
        year: '270 AD',
        eventTitle: 'Birth in Patara',
        description: 'Born to devout Christian parents who left him a vast inheritance, which he used for covert acts of generosity.'
      }
    ]);
    setGallery([]);
  }, []);

  return {
    activeStep,
    setActiveStep,
    isSuccessfullyPublished,
    setIsSuccessfullyPublished,
    sacredName,
    setSacredName,
    devotionalCategory,
    setDevotionalCategory,
    canonizationYear,
    setCanonizationYear,
    definingUtterance,
    setDefiningUtterance,
    veneratedNarrative,
    setVeneratedNarrative,
    publicArchive,
    setPublicArchive,
    liturgicalCalendarTag,
    setLiturgicalCalendarTag,
    coverPhoto,
    setCoverPhoto,
    sanctuaryName,
    setSanctuaryName,
    physicalAddress,
    setPhysicalAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    siteTypology,
    setSiteTypology,
    translationDate,
    setTranslationDate,
    burialDescription,
    setBurialDescription,
    timeline,
    setTimeline,
    gallery,
    setGallery,
    presentationMode,
    setPresentationMode,
    colorFilter,
    setColorFilter,
    aiAltText,
    setAiAltText,
    moveTimelineItem,
    addTimelineItem,
    removeTimelineItem,
    addGalleryItem,
    removeGalleryItem,
    handlePublishStory,
    resetForm
  };
}
