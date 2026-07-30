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
  Play,
  Check,
  CheckCircle2,
  Sliders,
  Eye,
  BookOpen
} from 'lucide-react';
import { TimelineEvent, GalleryAsset, SacredStory } from '../types';

interface CreatorFlowProps {
  onGoBack: () => void;
  formState: any;
}

export default function CreatorFlow({ onGoBack, formState }: CreatorFlowProps) {
  const {
    activeStep,
    setActiveStep,
    isSuccessfullyPublished,
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
    gallery,
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
  } = formState;

  // Local helper states for individual step forms
  const [newYear, setNewYear] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Relic Art');
  const [newAssetUrl, setNewAssetUrl] = useState('');

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear || !newTitle) return;
    addTimelineItem({
      id: `t-custom-${Date.now()}`,
      year: newYear,
      eventTitle: newTitle,
      description: newDesc
    });
    setNewYear('');
    setNewTitle('');
    setNewDesc('');
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetTitle) return;
    const defaultImg = newAssetUrl || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=400';
    addGalleryItem({
      id: `g-custom-${Date.now()}`,
      title: newAssetTitle,
      imageUrl: defaultImg,
      category: newAssetCategory
    });
    setNewAssetTitle('');
    setNewAssetUrl('');
  };

  const stepsList = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Burial Place' },
    { num: 3, label: 'Timeline' },
    { num: 4, label: 'Gallery' },
    { num: 5, label: 'Preview' },
    { num: 6, label: 'Publish' }
  ];

  if (isSuccessfullyPublished) {
    return (
      <div id="publish-success-panel" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30 text-center animate-in fade-in duration-300">
        <div className="bg-white border border-stone-200 p-12 rounded-2xl shadow-lg max-w-lg space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-stone-900">{sacredName}</h3>
            <p className="text-amber-700 uppercase font-semibold text-xs tracking-widest">{devotionalCategory} • ARCHIVE REGISTERED</p>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">
            The sacred chronicle has been successfully authenticated, sealed, and committed to the public hagiographical database. It is now live in the global museum archives.
          </p>
          <div className="flex gap-4 w-full pt-4">
            <button
              id="btn-success-view-portal"
              onClick={onGoBack}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 px-4 rounded-lg text-sm transition-all cursor-pointer"
            >
              Back to Portal
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
              <h2 className="font-serif text-xl font-bold text-stone-900">Archive Entry Wizard</h2>
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
                {/* Step Circle */}
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

                {/* Connecting Line */}
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

      {/* Main Form/Content Workspace (Middle section) */}
      <div id="creator-workspace" className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* STEP 1: IDENTITY */}
          {activeStep === 1 && (
            <div id="step-identity-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Primary Identity</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Establish the foundational details of the soul\'s journey. Use names as they are recorded in liturgical or historical texts.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Sacred Name</label>
                    <input 
                      id="input-sacred-name"
                      type="text" 
                      value={sacredName}
                      onChange={(e) => setSacredName(e.target.value)}
                      placeholder="e.g. Saint Nicholas of Myra"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 text-stone-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Devotional Category</label>
                      <select
                        id="select-category"
                        value={devotionalCategory}
                        onChange={(e) => setDevotionalCategory(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-stone-800 cursor-pointer"
                      >
                        <option>Bishop & Confessor</option>
                        <option>Early Christian Martyr</option>
                        <option>Missionary Priest</option>
                        <option>Contemplative Nun</option>
                        <option>Desert Hermit</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Canonization Year</label>
                      <input 
                        id="input-canonization-year"
                        type="text" 
                        value={canonizationYear}
                        onChange={(e) => setCanonizationYear(e.target.value)}
                        placeholder="e.g. Pre-Congregation, or 1920 AD"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Defining Utterance (Quote)</label>
                    <textarea 
                      id="input-defining-utterance"
                      rows={2}
                      value={definingUtterance}
                      onChange={(e) => setDefiningUtterance(e.target.value)}
                      placeholder="A historical quote attributed to the holy individual..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 text-stone-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Venerated Narrative (Biography)</label>
                    <textarea 
                      id="input-venerated-narrative"
                      rows={6}
                      value={veneratedNarrative}
                      onChange={(e) => setVeneratedNarrative(e.target.value)}
                      placeholder="Write the full hagiography, describing acts of virtue, suffering, and miracles..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 text-stone-800 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 Sidebar */}
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2">Iconographic Cover</h4>
                  
                  <div className="h-44 border-2 border-dashed border-stone-200 hover:border-amber-500/50 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-amber-500/[0.02] transition-all relative overflow-hidden group">
                    {coverPhoto ? (
                      <>
                        <img 
                          src={coverPhoto} 
                          alt="Preset cover preview" 
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-stone-900/40 flex flex-col items-center justify-center text-white p-2">
                          <Upload size={24} />
                          <span className="text-xs font-semibold mt-2">Replace Cover Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={32} className="text-stone-300 mb-2" />
                        <span className="text-xs font-semibold text-stone-600">Click to upload or drag cover photo</span>
                        <span className="text-[10px] text-stone-400 mt-1">PNG, JPG up to 10MB</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">OR PASTE DIRECT URL</label>
                    <input 
                      id="input-cover-photo-url"
                      type="text" 
                      value={coverPhoto}
                      onChange={(e) => setCoverPhoto(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs focus:outline-none text-stone-700"
                    />
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2">Access Controls</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">Public Archive Live</p>
                      <p className="text-[10px] text-stone-400">Expose immediately on museum screens</p>
                    </div>
                    <input 
                      id="toggle-public-archive"
                      type="checkbox"
                      checked={publicArchive}
                      onChange={() => setPublicArchive(!publicArchive)}
                      className="w-4 h-4 rounded text-amber-600 border-stone-300 focus:ring-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-100">
                    <label className="text-xs font-bold text-stone-500 uppercase">Liturgical Calendar Tag</label>
                    <input 
                      id="input-calendar-tag"
                      type="text" 
                      value={liturgicalCalendarTag}
                      onChange={(e) => setLiturgicalCalendarTag(e.target.value)}
                      placeholder="e.g. December 6"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs focus:outline-none text-stone-700"
                    />
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
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Specify the earthly resting place of the holy remains. These details will render coordinates dynamically on the global map view.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Church / Sanctuary Name</label>
                    <input 
                      id="input-sanctuary-name"
                      type="text" 
                      value={sanctuaryName}
                      onChange={(e) => setSanctuaryName(e.target.value)}
                      placeholder="e.g. Basilica di San Nicola"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Sanctuary Description / Relic Status</label>
                    <textarea 
                      id="input-sanctuary-desc"
                      rows={3}
                      value={burialDescription}
                      onChange={(e) => setBurialDescription(e.target.value)}
                      placeholder="e.g. The relics exude miraculous manna..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase">Physical Address</label>
                    <input 
                      id="input-sanctuary-address"
                      type="text" 
                      value={physicalAddress}
                      onChange={(e) => setPhysicalAddress(e.target.value)}
                      placeholder="e.g. Largo Abate Elia, 13, 70122 Bari, Italy"
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Latitude</label>
                      <input 
                        id="input-sanctuary-lat"
                        type="text" 
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="e.g. 41.1304"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-500 uppercase">Longitude</label>
                      <input 
                        id="input-sanctuary-lng"
                        type="text" 
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="e.g. 16.8703"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none text-stone-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 Sidebar */}
              <div className="space-y-6">
                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2">Interactive Map Preview</h4>
                  
                  {/* Map preview block */}
                  <div className="h-44 bg-[#E0D8C3] rounded-lg relative overflow-hidden flex items-center justify-center border border-stone-200">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C5BA9E_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                    <div className="absolute top-1/3 left-0 right-0 h-1 bg-[#D1C8AD]" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-[#D1C8AD]" />

                    <div className="relative flex flex-col items-center select-none">
                      <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping absolute top-0" />
                      <MapPin size={28} className="text-red-600 drop-shadow-md relative" fill="red" />
                    </div>

                    <div className="absolute bottom-2 bg-white/95 px-3 py-1 text-[9px] font-bold text-stone-700 rounded border shadow-sm">
                      MARKER AT: {latitude}° N, {longitude}° E
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Site Typology</label>
                      <input 
                        id="input-typology"
                        type="text" 
                        value={siteTypology}
                        onChange={(e) => setSiteTypology(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded p-1.5 text-xs text-stone-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase">Translation Date</label>
                      <input 
                        id="input-translation-date"
                        type="text" 
                        value={translationDate}
                        onChange={(e) => setTranslationDate(e.target.value)}
                        className="bg-stone-50 border border-stone-200 rounded p-1.5 text-xs text-stone-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TIMELINE BUILDER */}
          {activeStep === 3 && (
            <div id="step-timeline-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Timeline Builder</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Construct the temporal journey. Arrange the sequence of events of the sacred chronicle.</p>
                </div>

                <div className="space-y-3">
                  {timeline.length === 0 ? (
                    <p className="text-sm text-stone-400 italic py-4 text-center">No timeline events added yet.</p>
                  ) : (
                    timeline.map((event: TimelineEvent, idx: number) => (
                      <div 
                        id={`event-item-${event.id}`}
                        key={event.id} 
                        className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-lg text-sm group"
                      >
                        <div className="flex gap-4">
                          <div className="flex flex-col gap-1 justify-center shrink-0">
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
                            <span className="font-serif text-xs font-bold text-amber-700">{event.year}</span>
                            <h5 className="font-bold text-stone-800">{event.eventTitle}</h5>
                            <p className="text-stone-500 text-xs max-w-lg leading-relaxed">{event.description}</p>
                          </div>
                        </div>

                        <button
                          id={`btn-delete-event-${idx}`}
                          onClick={() => removeTimelineItem(event.id)}
                          className="text-stone-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Step 3 Sidebar */}
              <div className="space-y-6">
                <form onSubmit={handleAddTimeline} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2 flex items-center gap-1">
                    <Plus size={16} className="text-amber-600" />
                    <span>Add Event</span>
                  </h4>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Year / Era</label>
                    <input 
                      id="input-event-year"
                      type="text" 
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      placeholder="e.g. 270 AD"
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Event Title</label>
                    <input 
                      id="input-event-title"
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Birth in Patara"
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Description</label>
                    <textarea 
                      id="input-event-desc"
                      rows={3}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Brief historic context..."
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <button
                    id="btn-add-timeline-item"
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Insert Chronicle Event
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 4: VISUAL CHRONICLE / GALLERY */}
          {activeStep === 4 && (
            <div id="step-gallery-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
              <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Visual Chronicle</h3>
                  <p className="text-stone-400 text-xs mt-1 leading-relaxed">Curate visual assets. Upload and arrange high-fidelity relics and artworks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {gallery.map((asset: GalleryAsset, idx: number) => (
                    <div 
                      id={`gallery-item-${asset.id}`}
                      key={asset.id} 
                      className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden relative flex flex-col justify-between group"
                    >
                      <img 
                        src={asset.imageUrl} 
                        alt={asset.title} 
                        className="w-full h-32 object-cover border-b border-stone-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-3 space-y-1">
                        <span className="text-[8px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {asset.category}
                        </span>
                        <h6 className="font-bold text-stone-800 text-xs truncate mt-1">{asset.title}</h6>
                      </div>

                      <button
                        id={`btn-delete-asset-${idx}`}
                        type="button"
                        onClick={() => removeGalleryItem(asset.id)}
                        className="absolute top-2 right-2 bg-red-600/95 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center p-4 text-center text-stone-400 h-full min-h-[160px]">
                    <Sliders size={20} className="mb-2 text-stone-300" />
                    <span className="text-[10px] font-semibold">Asset Slot Active</span>
                  </div>
                </div>
              </div>

              {/* Step 4 Sidebar */}
              <div className="space-y-6">
                <form onSubmit={handleAddGallery} className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2 flex items-center gap-1">
                    <Upload size={16} className="text-amber-600" />
                    <span>Upload Relic Asset</span>
                  </h4>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Asset Title</label>
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
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Category</label>
                    <select
                      id="select-asset-category"
                      value={newAssetCategory}
                      onChange={(e) => setNewAssetCategory(e.target.value)}
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none cursor-pointer"
                    >
                      <option>Relic Art</option>
                      <option>Sanctuary</option>
                      <option>Scripture</option>
                      <option>Iconography</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Image URL</label>
                    <input 
                      id="input-asset-url"
                      type="text" 
                      value={newAssetUrl}
                      onChange={(e) => setNewAssetUrl(e.target.value)}
                      placeholder="Paste online image URL..."
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none"
                    />
                  </div>

                  <button
                    id="btn-add-gallery-item"
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Insert Relic to Gallery
                  </button>
                </form>

                <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif text-sm font-bold text-stone-800 uppercase border-b border-stone-100 pb-2">Global Settings</h4>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Presentation Mode</label>
                    <select
                      id="select-presentation-mode"
                      value={presentationMode}
                      onChange={(e) => setPresentationMode(e.target.value as any)}
                      className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 focus:outline-none cursor-pointer"
                    >
                      <option>Cinematic Grid</option>
                      <option>Standard List</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-100">
                    <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase">
                      <span>Global Color Filter</span>
                      <span>{colorFilter}% Warmth</span>
                    </div>
                    <input 
                      id="input-color-filter"
                      type="range" 
                      min="0" 
                      max="100" 
                      value={colorFilter}
                      onChange={(e) => setColorFilter(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer h-1 bg-stone-200 rounded-lg appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: IMMERSIVE PREVIEW MODE */}
          {activeStep === 5 && (
            <div id="step-preview-panel" className="animate-in fade-in duration-300 space-y-6">
              <div className="bg-amber-50/50 border border-amber-600/20 p-4 rounded-xl flex gap-3 items-start text-stone-700 text-xs">
                <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-serif font-bold text-stone-800 text-sm">Museum Immersive Preview Active</p>
                  <p className="text-stone-500 leading-normal">
                    This is an exact facsimile of how the hagiographical chronicle will display on high-fidelity screens. Review layout rendering before publishing.
                  </p>
                </div>
              </div>

              {/* Exact replication of a story page */}
              <div className="bg-white border border-stone-200 p-8 rounded-xl space-y-6">
                <div className="border-b border-stone-200 pb-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 border border-amber-600/10 px-2 py-0.5 rounded">
                      {devotionalCategory}
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-stone-950 mt-2">{sacredName}</h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-400">Canonization: {canonizationYear}</span>
                </div>

                <p className="font-serif text-stone-700 text-lg leading-relaxed italic">
                  "{definingUtterance}"
                </p>

                <p className="font-serif text-stone-600 text-base leading-relaxed whitespace-pre-line">
                  {veneratedNarrative}
                </p>

                <div className="border-t border-stone-100 pt-4 text-xs text-stone-500 flex justify-between">
                  <span>Sanctuary resting place: <strong>{sanctuaryName}</strong></span>
                  <span>Liturgical Feasts: {liturgicalCalendarTag}</span>
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
                <h3 className="font-serif text-2xl font-bold text-stone-900">Authorize Eternal Entry</h3>
                <p className="text-stone-500 text-xs leading-relaxed">
                  By executing this command, you seal this hagiography with hagiographical verification seals. The chronicle will become instantly available to public museum feeds.
                </p>
              </div>

              <div className="border-t border-b border-stone-100 py-4 text-left text-xs space-y-3">
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Biography Profile</span>
                  <span className="text-stone-800 font-bold">{sacredName}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Devotional Category</span>
                  <span className="text-stone-800 font-bold">{devotionalCategory}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Timeline Sequences</span>
                  <span className="text-stone-800 font-bold">{timeline.length} milestone events</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-400 uppercase">Sanctuary Location</span>
                  <span className="text-stone-800 font-bold">{sanctuaryName}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  id="btn-return-form"
                  onClick={() => setActiveStep(1)}
                  className="flex-1 border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold py-2.5 rounded-lg text-xs cursor-pointer"
                >
                  Edit Chronicle Fields
                </button>
                <button
                  id="btn-submit-publish"
                  onClick={handlePublishStory}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-lg text-xs shadow hover:shadow-md transition-all cursor-pointer"
                >
                  Commit Entry & Publish
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls footer */}
          {!isSuccessfullyPublished && (
            <div id="creator-nav-footer" className="mt-8 border-t border-stone-200 pt-6 flex items-center justify-between">
              <button
                id="btn-wizard-prev"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => prev - 1)}
                className={`py-2 px-5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border select-none ${
                  activeStep === 1
                    ? 'text-stone-300 border-stone-150 bg-stone-50/50 cursor-not-allowed'
                    : 'text-stone-600 border-stone-200 hover:bg-stone-50 cursor-pointer'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Prev Step</span>
              </button>

              <button
                id="btn-wizard-next"
                disabled={activeStep === 6}
                onClick={() => setActiveStep(prev => prev + 1)}
                className={`py-2 px-5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border select-none ${
                  activeStep === 6
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
