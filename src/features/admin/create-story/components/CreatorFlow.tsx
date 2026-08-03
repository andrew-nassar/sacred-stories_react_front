/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  MapPin, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Sparkles,
  Check,
  CheckCircle2,
  Sliders,
  Eye,
  Edit2,
  X,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { TimelineEventItem, GalleryAssetItem } from '../types';

interface CreatorFlowProps {
  onGoBack: () => void;
  onNavigate?: (view: string) => void;
  formState: any;
}

export default function CreatorFlow({ onGoBack, onNavigate, formState }: CreatorFlowProps) {
  const {
    activeStep,
    setActiveStep,
    isSubmitting,
    submitError,
    setSubmitError,
    isSuccessfullyPublished,
    validationErrors,

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

    handlePublishStory,
    resetForm
  } = formState;

  // Local helper state for adding Timeline Event
  const [newTimelineDate, setNewTimelineDate] = useState('');
  const [newTimelineTitle, setNewTimelineTitle] = useState('');
  const [newTimelineDesc, setNewTimelineDesc] = useState('');
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);

  // Local helper state for adding Gallery Asset
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineTitle.trim()) return;
    addTimelineItem({
      date: newTimelineDate.trim() || new Date().toISOString().split('T')[0],
      title: newTimelineTitle.trim(),
      description: newTimelineDesc.trim()
    });
    setNewTimelineDate('');
    setNewTimelineTitle('');
    setNewTimelineDesc('');
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle.trim()) return;
    const defaultImg = newAssetUrl.trim() || 'https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400';
    addGalleryItem({
      title: newAssetTitle.trim(),
      imageUrl: defaultImg
    });
    setNewAssetTitle('');
    setNewAssetUrl('');
  };

  const stepsList = [
    { num: 1, label: 'Story Info' },
    { num: 2, label: 'Burial Place' },
    { num: 3, label: 'Timeline' },
    { num: 4, label: 'Sacred Gallery' },
    { num: 5, label: 'Preview' },
    { num: 6, label: 'Publish' }
  ];

  const handleSuccessRedirect = () => {
    if (onNavigate) {
      onNavigate('archive');
    } else {
      onGoBack();
    }
  };

  if (isSuccessfullyPublished) {
    return (
      <div id="publish-success-panel" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30 text-center animate-in fade-in duration-300">
        <div className="bg-white border border-stone-200 p-12 rounded-2xl shadow-lg max-w-lg space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-stone-900">{name}</h3>
            <p className="text-amber-700 uppercase font-semibold text-xs tracking-widest">SACRED STORY PUBLISHED SUCCESSFULLY</p>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">
            The sacred story has been submitted to the database and committed to the public archives via API.
          </p>
          <div className="flex gap-4 w-full pt-4">
            <button
              id="btn-success-view-portal"
              onClick={handleSuccessRedirect}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all cursor-pointer"
            >
              Back to Stories List
            </button>
            <button
              id="btn-success-reset"
              onClick={resetForm}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow transition-all cursor-pointer"
            >
              Add Another Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="creator-flow-container" className="flex-1 overflow-hidden flex flex-col bg-[#FAF9F5]/20">
      
      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div 
          id="gallery-lightbox" 
          className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] bg-white rounded-xl p-3 shadow-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              id="btn-close-lightbox"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-stone-900/70 hover:bg-stone-900 text-white p-2 rounded-full cursor-pointer z-10 transition-colors"
            >
              <X size={18} />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-[75vh] w-auto object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Top Banner & Stepper Header */}
      <div id="creator-header" className="p-6 bg-white border-b border-stone-200 shrink-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              id="btn-creator-back"
              onClick={onGoBack}
              className="text-stone-400 hover:text-stone-800 p-1 rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Create Sacred Story</h2>
              <p className="text-stone-400 text-xs mt-0.5 uppercase tracking-wider font-semibold">Step 0{activeStep} / 06 — {stepsList[activeStep - 1].label}</p>
            </div>
          </div>
          
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-600/10 shadow-sm select-none">
            {Math.round((activeStep / 6) * 100)}% COMPLETE
          </span>
        </div>

        {/* Stepper indicators */}
        <div id="stepper-bar" className="flex items-center justify-between max-w-4xl mx-auto w-full pt-2">
          {stepsList.map((step, idx) => {
            const isCompleted = activeStep > step.num;
            const isActive = activeStep === step.num;

            return (
              <React.Fragment key={step.num}>
                <button
                  id={`step-indicator-${step.num}`}
                  onClick={() => setActiveStep(step.num)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none group select-none cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                      : isActive 
                      ? 'bg-amber-500/10 text-amber-900 border-amber-600 ring-2 ring-amber-500/30 font-extrabold'
                      : 'bg-white text-stone-400 border-stone-200 group-hover:border-stone-300'
                  }`}>
                    {isCompleted ? <Check size={14} /> : step.num}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${
                    isActive ? 'text-amber-800' : 'text-stone-400 group-hover:text-stone-600'
                  }`}>
                    {step.label}
                  </span>
                </button>

                {idx < stepsList.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    activeStep > step.num ? 'bg-amber-600' : 'bg-stone-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Notification Banner */}
      {submitError && (
        <div id="create-story-error-banner" className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between text-xs text-red-700 font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError(null)} className="text-red-500 hover:text-red-800 p-1">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div id="creator-workspace" className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* STEP 1: STORY INFORMATION */}
          {activeStep === 1 && (
            <div id="step-identity-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Story Information</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Enter primary metadata for the sacred story.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Story Type *</label>
                      <select
                        id="select-story-type"
                        value={storyType}
                        onChange={(e) => setStoryType(Number(e.target.value))}
                        disabled={isLoadingTypes}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-stone-800 cursor-pointer disabled:opacity-50"
                      >
                        {storyTypes?.map((t: any) => (
                          <option key={t.id} value={t.id}>
                            {t.id} - {t.name} ({t.displayName})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Sacred Name *</label>
                      <input 
                        id="input-sacred-name"
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Saint Nicholas of Myra"
                        className={`w-full bg-stone-50 border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 ${
                          validationErrors.name ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                        }`}
                      />
                      {validationErrors.name && (
                        <span className="text-[11px] text-red-600 font-semibold">{validationErrors.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Famous Quote</label>
                    <textarea 
                      id="input-defining-utterance"
                      rows={2}
                      value={famousQuote}
                      onChange={(e) => setFamousQuote(e.target.value)}
                      placeholder="Famous or defining quote..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Video URL</label>
                    <input 
                      id="input-video-url"
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Biography *</label>
                    <textarea 
                      id="input-venerated-narrative"
                      rows={6}
                      value={biography}
                      onChange={(e) => setBiography(e.target.value)}
                      placeholder="Full biographical narrative..."
                      className={`w-full bg-stone-50 border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 leading-relaxed ${
                        validationErrors.biography ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                      }`}
                    />
                    {validationErrors.biography && (
                      <span className="text-[11px] text-red-600 font-semibold">{validationErrors.biography}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Cover Image */}
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2">Cover Image *</h4>
                  
                  <div className="h-44 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group bg-stone-50">
                    {coverImage ? (
                      <>
                        <img 
                          src={coverImage} 
                          alt="Cover preview" 
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-900/40 flex flex-col items-center justify-center text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload size={24} />
                          <span className="text-xs font-semibold mt-2">Replace Cover Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={32} className="text-stone-300 mb-2" />
                        <span className="text-xs font-semibold text-stone-600">Cover photo preview</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">COVER IMAGE URL</label>
                    <input 
                      id="input-cover-photo-url"
                      type="text" 
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="Paste image URL..."
                      className={`w-full bg-stone-50 border rounded-lg p-2.5 text-xs focus:outline-none text-stone-700 ${
                        validationErrors.coverImage ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                      }`}
                    />
                    {validationErrors.coverImage && (
                      <span className="text-[11px] text-red-600 font-semibold">{validationErrors.coverImage}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BURIAL PLACE DETAILS */}
          {activeStep === 2 && (
            <div id="step-burial-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Burial Place Details</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Specify details regarding the sacred burial location.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Burial Place Name *</label>
                    <input 
                      id="input-sanctuary-name"
                      type="text" 
                      value={burialName}
                      onChange={(e) => setBurialName(e.target.value)}
                      placeholder="e.g. Basilica di San Nicola"
                      className={`w-full bg-stone-50 border rounded-lg p-3 text-sm focus:outline-none text-stone-700 ${
                        validationErrors.burialName ? 'border-red-400 bg-red-50/20' : 'border-stone-200'
                      }`}
                    />
                    {validationErrors.burialName && (
                      <span className="text-[11px] text-red-600 font-semibold">{validationErrors.burialName}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Description</label>
                    <textarea 
                      id="input-sanctuary-desc"
                      rows={3}
                      value={burialDescription}
                      onChange={(e) => setBurialDescription(e.target.value)}
                      placeholder="Description of sanctuary / relic status..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Physical Address</label>
                    <input 
                      id="input-sanctuary-address"
                      type="text" 
                      value={burialAddress}
                      onChange={(e) => setBurialAddress(e.target.value)}
                      placeholder="e.g. Largo Abate Elia, 13, 70122 Bari, Italy"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Latitude</label>
                      <input 
                        id="input-sanctuary-lat"
                        type="number" 
                        step="any"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 41.1304"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Longitude</label>
                      <input 
                        id="input-sanctuary-lng"
                        type="number" 
                        step="any"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 16.8703"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Google Maps URL</label>
                    <input 
                      id="input-gmaps-url"
                      type="text" 
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="e.g. https://maps.google.com/?q=41.1304,16.8703"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Burial Cover Image URL</label>
                    <input 
                      id="input-burial-cover-url"
                      type="text" 
                      value={burialCoverImage}
                      onChange={(e) => setBurialCoverImage(e.target.value)}
                      placeholder="Paste image URL for burial site..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 Sidebar */}
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2">Location Map</h4>
                  
                  <div className="h-44 bg-[#E0D8C3] rounded-lg relative overflow-hidden flex items-center justify-center border border-stone-200">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C5BA9E_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                    <div className="relative flex flex-col items-center select-none">
                      <MapPin size={28} className="text-red-600 drop-shadow-md relative" fill="red" />
                    </div>

                    <div className="absolute bottom-2 bg-white/95 px-3 py-1 text-[9px] font-bold text-stone-700 rounded border shadow-sm">
                      {latitude}° N, {longitude}° E
                    </div>
                  </div>

                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 mt-2 inline-block"
                    >
                      <ExternalLink size={14} />
                      <span>Open in Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC TIMELINE */}
          {activeStep === 3 && (
            <div id="step-timeline-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Dynamic Timeline</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Add, edit, reorder, or delete timeline events for the story.</p>
                </div>

                <div className="space-y-4">
                  {timeline.length === 0 ? (
                    <div className="text-sm text-stone-400 italic py-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
                      No timeline events added yet. Use the form on the right to add an event.
                    </div>
                  ) : (
                    timeline.map((event: TimelineEventItem, idx: number) => {
                      const isEditing = editingTimelineId === event.id;

                      return (
                        <div 
                          id={`event-item-${event.id}`}
                          key={event.id} 
                          className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-sm space-y-3"
                        >
                          {isEditing ? (
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-amber-300 shadow-sm">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input 
                                  type="text"
                                  value={event.date}
                                  onChange={(e) => updateTimelineItem(event.id, { date: e.target.value })}
                                  placeholder="Date / Year"
                                  className="border border-stone-200 p-2 text-xs rounded bg-stone-50"
                                />
                                <input 
                                  type="text"
                                  value={event.title}
                                  onChange={(e) => updateTimelineItem(event.id, { title: e.target.value })}
                                  placeholder="Event Title"
                                  className="border border-stone-200 p-2 text-xs rounded font-bold bg-stone-50"
                                />
                              </div>
                              <textarea 
                                rows={2}
                                value={event.description}
                                onChange={(e) => updateTimelineItem(event.id, { description: e.target.value })}
                                placeholder="Description"
                                className="w-full border border-stone-200 p-2 text-xs rounded bg-stone-50"
                              />
                              <button 
                                onClick={() => setEditingTimelineId(null)}
                                className="bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded cursor-pointer"
                              >
                                Done Editing
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-3 items-start">
                                <div className="flex flex-col gap-1 justify-center shrink-0 pt-1">
                                  <button 
                                    id={`btn-move-up-${idx}`}
                                    onClick={() => moveTimelineItem(idx, 'up')}
                                    disabled={idx === 0}
                                    className={`p-1 rounded hover:bg-stone-200/50 cursor-pointer ${idx === 0 ? 'text-stone-300' : 'text-stone-500'}`}
                                  >
                                    <MoveUp size={14} />
                                  </button>
                                  <button 
                                    id={`btn-move-down-${idx}`}
                                    onClick={() => moveTimelineItem(idx, 'down')}
                                    disabled={idx === timeline.length - 1}
                                    className={`p-1 rounded hover:bg-stone-200/50 cursor-pointer ${idx === timeline.length - 1 ? 'text-stone-300' : 'text-stone-500'}`}
                                  >
                                    <MoveDown size={14} />
                                  </button>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="font-serif text-xs font-bold text-amber-700">{event.date}</span>
                                  <h5 className="font-bold text-stone-800">{event.title}</h5>
                                  <p className="text-stone-500 text-xs max-w-lg leading-relaxed">{event.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  id={`btn-edit-event-${idx}`}
                                  onClick={() => setEditingTimelineId(event.id)}
                                  className="text-stone-400 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
                                  title="Edit event"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  id={`btn-delete-event-${idx}`}
                                  onClick={() => removeTimelineItem(event.id)}
                                  className="text-stone-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete event"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Step 3 Sidebar: Add Event */}
              <div className="space-y-6">
                <form onSubmit={handleAddTimeline} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2 flex items-center gap-1">
                    <Plus size={16} className="text-amber-600" />
                    <span>Add Timeline Event</span>
                  </h4>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Date / Year</label>
                    <input 
                      id="input-event-year"
                      type="text" 
                      value={newTimelineDate}
                      onChange={(e) => setNewTimelineDate(e.target.value)}
                      placeholder="e.g. 270-01-01 or 270 AD"
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Event Title *</label>
                    <input 
                      id="input-event-title"
                      type="text" 
                      value={newTimelineTitle}
                      onChange={(e) => setNewTimelineTitle(e.target.value)}
                      placeholder="e.g. Birth in Patara"
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Description</label>
                    <textarea 
                      id="input-event-desc"
                      rows={3}
                      value={newTimelineDesc}
                      onChange={(e) => setNewTimelineDesc(e.target.value)}
                      placeholder="Event description..."
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <button
                    id="btn-add-timeline-item"
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Insert Timeline Event
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 4: DYNAMIC SACRED GALLERY */}
          {activeStep === 4 && (
            <div id="step-gallery-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Dynamic Sacred Gallery</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Manage gallery items: add images, edit titles, replace URLs, remove, or preview.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((asset: GalleryAssetItem, idx: number) => {
                    const isEditing = editingGalleryId === asset.id;

                    return (
                      <div 
                        id={`gallery-item-${asset.id}`}
                        key={asset.id} 
                        className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden relative flex flex-col justify-between group shadow-sm"
                      >
                        <div className="h-40 bg-stone-200 relative overflow-hidden">
                          <img 
                            src={asset.imageUrl} 
                            alt={asset.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              id={`btn-preview-asset-${idx}`}
                              onClick={() => setPreviewImage(asset.imageUrl)}
                              className="bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow cursor-pointer"
                              title="Preview Image"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              id={`btn-edit-asset-${idx}`}
                              onClick={() => setEditingGalleryId(isEditing ? null : asset.id)}
                              className="bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow cursor-pointer"
                              title="Edit Asset"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              id={`btn-delete-asset-${idx}`}
                              onClick={() => removeGalleryItem(asset.id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow cursor-pointer"
                              title="Remove Asset"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Details / Edit Form */}
                        <div className="p-3 bg-white space-y-2">
                          {isEditing ? (
                            <div className="space-y-2 pt-1">
                              <input 
                                type="text"
                                value={asset.title}
                                onChange={(e) => updateGalleryItem(asset.id, { title: e.target.value })}
                                placeholder="Image Title"
                                className="w-full border border-stone-200 p-1.5 text-xs rounded bg-stone-50"
                              />
                              <input 
                                type="text"
                                value={asset.imageUrl}
                                onChange={(e) => updateGalleryItem(asset.id, { imageUrl: e.target.value })}
                                placeholder="Image URL"
                                className="w-full border border-stone-200 p-1.5 text-xs rounded bg-stone-50"
                              />
                              <button 
                                onClick={() => setEditingGalleryId(null)}
                                className="w-full bg-amber-600 text-white font-bold text-xs py-1 rounded cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </div>
                          ) : (
                            <div>
                              <h6 className="font-bold text-stone-800 text-sm truncate">{asset.title}</h6>
                              <p className="text-[10px] text-stone-400 truncate mt-0.5">{asset.imageUrl}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4 Sidebar: Add Image */}
              <div className="space-y-6">
                <form onSubmit={handleAddGallery} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2 flex items-center gap-1">
                    <Upload size={16} className="text-amber-600" />
                    <span>Add Sacred Gallery Image</span>
                  </h4>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Image Title *</label>
                    <input 
                      id="input-asset-title"
                      type="text" 
                      value={newAssetTitle}
                      onChange={(e) => setNewAssetTitle(e.target.value)}
                      placeholder="e.g. Relic Shrine in Bari"
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Image URL</label>
                    <input 
                      id="input-asset-url"
                      type="text" 
                      value={newAssetUrl}
                      onChange={(e) => setNewAssetUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <button
                    id="btn-add-gallery-item"
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Insert Image to Gallery
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW */}
          {activeStep === 5 && (
            <div id="step-preview-panel" className="animate-in fade-in duration-300 space-y-6">
              <div className="bg-amber-50/50 border border-amber-600/20 p-4 rounded-xl flex gap-3 items-start text-stone-700 text-xs">
                <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-serif font-bold text-stone-800 text-sm">Story Preview</p>
                  <p className="text-stone-500 leading-normal">
                    Review your story data before submitting to the backend API.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-8 rounded-xl space-y-6 shadow-sm">
                <div className="border-b border-stone-200 pb-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-600/10 px-2 py-0.5 rounded">
                      Type {storyType}: {storyTypes?.find((t: any) => t.id === storyType)?.name || 'Custom'} ({storyTypes?.find((t: any) => t.id === storyType)?.displayName || ''})
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-stone-950 mt-2">{name}</h3>
                  </div>
                </div>

                {famousQuote && (
                  <p className="font-serif text-stone-700 text-lg leading-relaxed italic border-l-2 border-amber-600 pl-4 py-1">
                    "{famousQuote}"
                  </p>
                )}

                <p className="font-serif text-stone-600 text-base leading-relaxed whitespace-pre-line">
                  {biography}
                </p>

                <div className="border-t border-stone-100 pt-4 text-xs text-stone-500 flex flex-col gap-1">
                  <span>Burial Sanctuary: <strong>{burialName}</strong> ({burialAddress})</span>
                  <span>Timeline Events: {timeline.length} items | Gallery Images: {gallery.length} items</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PUBLISH VERIFICATION */}
          {activeStep === 6 && (
            <div id="step-publish-panel" className="max-w-2xl mx-auto bg-white border border-stone-200 p-8 rounded-xl shadow-md text-center space-y-6 animate-in fade-in duration-200">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <Sparkles size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900">Publish Sacred Story</h3>
                <p className="text-stone-500 text-xs leading-relaxed">
                  Submit story request to backend POST /api/SacredStories.
                </p>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-700 font-medium text-left">
                  ❌ {submitError}
                </div>
              )}

              <div className="border-t border-b border-stone-100 py-4 text-left text-xs space-y-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Story Name</span>
                  <span className="text-stone-800 font-bold">{name}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Story Type</span>
                  <span className="text-stone-800 font-bold">
                    {storyType} - {storyTypes?.find((t: any) => t.id === storyType)?.name} ({storyTypes?.find((t: any) => t.id === storyType)?.displayName})
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Timeline Events</span>
                  <span className="text-stone-800 font-bold">{timeline.length} milestone events</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Gallery Items</span>
                  <span className="text-stone-800 font-bold">{gallery.length} images</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Burial Place</span>
                  <span className="text-stone-800 font-bold">{burialName}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  id="btn-return-form"
                  disabled={isSubmitting}
                  onClick={() => setActiveStep(1)}
                  className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold py-2.5 rounded-lg text-xs cursor-pointer disabled:opacity-50"
                >
                  Edit Chronicle Fields
                </button>
                <button
                  id="btn-submit-publish"
                  disabled={isSubmitting}
                  onClick={() => handlePublishStory(handleSuccessRedirect)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-xs shadow hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting Story...</span>
                    </>
                  ) : (
                    <span>Submit & Save Story</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls Footer */}
          {!isSuccessfullyPublished && (
            <div id="creator-nav-footer" className="mt-8 border-t border-stone-200 pt-6 flex items-center justify-between">
              <button
                id="btn-wizard-prev"
                disabled={activeStep === 1 || isSubmitting}
                onClick={() => setActiveStep((prev: number) => prev - 1)}
                className={`py-2 px-5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border select-none ${
                  activeStep === 1 || isSubmitting
                    ? 'text-stone-300 border-stone-150 bg-stone-50/50 cursor-not-allowed'
                    : 'text-stone-600 border-stone-200 hover:bg-stone-50 cursor-pointer'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Prev Step</span>
              </button>

              <button
                id="btn-wizard-next"
                disabled={activeStep === 6 || isSubmitting}
                onClick={() => setActiveStep((prev: number) => prev + 1)}
                className={`py-2 px-5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border select-none ${
                  activeStep === 6 || isSubmitting
                    ? 'text-stone-300 border-stone-150 bg-stone-50/50 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 text-white border-transparent cursor-pointer'
                }`}
              >
                <span>Next Step</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
