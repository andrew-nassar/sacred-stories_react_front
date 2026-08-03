/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SacredStory } from '../types';
import { SACRED_STORY_TYPES, SACRED_STORY_TYPES_REVERSE } from '../api/stories.api';
import StoryForm, { StoryBasicData } from './editor/StoryForm';
import BurialPlaceForm, { BurialPlaceData } from './editor/BurialPlaceForm';
import TimelineEditor, { TimelineItem } from './editor/TimelineEditor';
import GalleryEditor, { GalleryItem } from './editor/GalleryEditor';

interface EditStoryModalProps {
  story: SacredStory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStory: SacredStory) => Promise<void>;
}

type TabType = 'basic' | 'burial' | 'timeline' | 'gallery';

export default function EditStoryModal({ story, isOpen, onClose, onSave }: EditStoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sub-form state objects
  const [basicData, setBasicData] = useState<StoryBasicData>({
    name: '',
    type: 1,
    coverImage: '',
    famousQuote: '',
    videoUrl: '',
    biography: '',
  });

  const [burialData, setBurialData] = useState<BurialPlaceData>({
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    googleMapsUrl: '',
    coverImage: '',
  });

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [initialJson, setInitialJson] = useState<string>('');

  // Populate state whenever story prop changes
  useEffect(() => {
    if (story) {
      const typeNum = SACRED_STORY_TYPES_REVERSE[story.devotionalCategory] ?? 1;
      const initialCover = story.gallery?.[0]?.imageUrl || '';
      const initialVideo = story.documentaryMedia?.url || '';

      const basic: StoryBasicData = {
        name: story.sacredName || '',
        type: typeNum,
        coverImage: initialCover,
        famousQuote: story.definingUtterance || '',
        videoUrl: initialVideo,
        biography: story.veneratedNarrative || '',
      };

      const bp = story.burialPlace;
      const burial: BurialPlaceData = {
        name: bp?.sanctuaryName || (bp as any)?.name || '',
        description: bp?.description || '',
        address: bp?.physicalAddress || (bp as any)?.address || '',
        latitude: typeof bp?.latitude === 'number' ? bp.latitude : parseFloat(bp?.latitude || '0') || 0,
        longitude: typeof bp?.longitude === 'number' ? bp.longitude : parseFloat(bp?.longitude || '0') || 0,
        googleMapsUrl: (bp as any)?.googleMapsUrl || '',
        coverImage: (bp as any)?.coverImage || '',
      };

      const tl: TimelineItem[] = (story.chronology || []).map((t, idx) => ({
        id: t.id || `tl-${idx + 1}`,
        date: t.year || (t as any).date || '',
        title: t.eventTitle || (t as any).title || '',
        description: t.description || '',
      }));

      const gal: GalleryItem[] = (story.gallery || []).map((g, idx) => ({
        id: g.id || `gal-${idx + 1}`,
        title: g.title || '',
        imageUrl: g.imageUrl || '',
      }));

      setBasicData(basic);
      setBurialData(burial);
      setTimelineItems(tl);
      setGalleryItems(gal);
      setValidationErrors({});
      setErrorMessage(null);
      setSuccessMessage(null);

      const stateSnapshot = JSON.stringify({ basic, burial, tl, gal });
      setInitialJson(stateSnapshot);
    }
  }, [story]);

  if (!isOpen || !story) return null;

  // Unsaved changes check
  const currentStateJson = JSON.stringify({
    basic: basicData,
    burial: burialData,
    tl: timelineItems,
    gal: galleryItems,
  });
  const isDirty = initialJson !== '' && currentStateJson !== initialJson;

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes in this Sacred Story. Are you sure you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!basicData.name.trim()) {
      errors.name = 'Sacred Story Name is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) {
      setActiveTab('basic');
      setErrorMessage('Please fix validation errors before saving.');
      return;
    }

    try {
      setSaving(true);

      // Reconstruct SacredStory object maintaining full UI structure & custom fields
      const categoryStr = SACRED_STORY_TYPES[basicData.type] || 'Saint';

      const updatedGallery = galleryItems.length > 0
        ? galleryItems.map((g, idx) => ({
            id: g.id || String(idx + 1),
            title: g.title || 'Sacred Icon',
            imageUrl: g.imageUrl || '',
            category: 'Gallery',
          }))
        : basicData.coverImage
        ? [{ id: '1', title: 'Cover Image', imageUrl: basicData.coverImage, category: 'Cover' }]
        : [];

      // Ensure primary cover image is first in gallery if specified
      if (basicData.coverImage && updatedGallery.length > 0 && updatedGallery[0].imageUrl !== basicData.coverImage) {
        updatedGallery.unshift({ id: 'cover-0', title: 'Main Cover', imageUrl: basicData.coverImage, category: 'Cover' });
      }

      const updatedChronology = timelineItems.map((t, idx) => ({
        id: t.id || String(idx + 1),
        year: t.date || 'N/A',
        eventTitle: t.title || 'Timeline Event',
        description: t.description || '',
      }));

      const updatedStory: SacredStory = {
        ...story,
        sacredName: basicData.name,
        devotionalCategory: categoryStr,
        definingUtterance: basicData.famousQuote,
        veneratedNarrative: basicData.biography,
        documentaryMedia: {
          title: story.documentaryMedia?.title || 'Documentary',
          duration: story.documentaryMedia?.duration || '',
          url: basicData.videoUrl,
        },
        burialPlace: {
          ...story.burialPlace,
          sanctuaryName: burialData.name,
          physicalAddress: burialData.address,
          description: burialData.description,
          latitude: String(burialData.latitude),
          longitude: String(burialData.longitude),
          // Custom properties carried via type assertion for API sync
          ...(burialData.googleMapsUrl ? { googleMapsUrl: burialData.googleMapsUrl } : {}),
          ...(burialData.coverImage ? { coverImage: burialData.coverImage } : {}),
        } as any,
        chronology: updatedChronology,
        gallery: updatedGallery,
      };

      await onSave(updatedStory);
      setSuccessMessage('Sacred Story saved successfully!');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to save Sacred Story. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-2xl shadow-2xl w-full max-w-4xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Edit Sacred Chronicle
                {isDirty && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono px-2 py-0.5 rounded-full font-normal">
                    Unsaved Changes
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400">
                Editing: <span className="text-amber-300 font-semibold">{story.sacredName}</span> (ID: {story.id})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseAttempt}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close Editor"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen size={15} />
            <span>1. Story Details</span>
            {validationErrors.name && <span className="w-2 h-2 rounded-full bg-red-500" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('burial')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'burial'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin size={15} />
            <span>2. Shrine & Burial Place</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock size={15} />
            <span>3. Timeline ({timelineItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon size={15} />
            <span>4. Sacred Gallery ({galleryItems.length})</span>
          </button>
        </div>

        {/* Banners */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2 shrink-0">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shrink-0">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Content Container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'basic' && (
            <StoryForm
              data={basicData}
              onChange={setBasicData}
              errors={validationErrors}
            />
          )}

          {activeTab === 'burial' && (
            <BurialPlaceForm
              data={burialData}
              onChange={setBurialData}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineEditor
              items={timelineItems}
              onChange={setTimelineItems}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryEditor
              items={galleryItems}
              onChange={setGalleryItems}
            />
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
              {isDirty ? (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertTriangle size={13} />
                  Unsaved changes detected. Click "Save Changes" to publish PUT request.
                </span>
              ) : (
                <span>All edits in sync.</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCloseAttempt}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer text-xs disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving to API...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
