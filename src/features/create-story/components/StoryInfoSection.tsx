/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoryTypeOption, CreateStoryPayload, FormValidationErrors } from '../types';
import { Type, Image, Quote, Video, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface StoryInfoSectionProps {
  formData: CreateStoryPayload;
  storyTypes: StoryTypeOption[];
  isLoadingTypes: boolean;
  errors: FormValidationErrors;
  onChangeField: <K extends keyof CreateStoryPayload>(key: K, value: CreateStoryPayload[K]) => void;
}

export const StoryInfoSection: React.FC<StoryInfoSectionProps> = ({
  formData,
  storyTypes,
  isLoadingTypes,
  errors,
  onChangeField,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold-accent" />
          <span>Story Basic Information</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          Enter the essential identity, title, type, and detailed biography of the saint or sacred figure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Story Type */}
        <div className="space-y-2">
          <label htmlFor="public-story-type" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>Story Type *</span>
          </label>
          <select
            id="public-story-type"
            value={formData.type}
            onChange={(e) => onChangeField('type', parseInt(e.target.value, 10))}
            disabled={isLoadingTypes}
            className={`w-full bg-white/5 border ${
              errors.type ? 'border-red-500/80 ring-1 ring-red-500/40' : 'border-white/15 focus:border-gold-accent/60'
            } rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none transition-colors disabled:opacity-50 cursor-pointer`}
          >
            {storyTypes.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#121620] text-white">
                {t.id} - {t.name} ({t.displayName})
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.type}</span>
            </p>
          )}
        </div>

        {/* Story Name */}
        <div className="space-y-2">
          <label htmlFor="public-story-name" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent">
            Story Name / Title *
          </label>
          <input
            id="public-story-name"
            type="text"
            value={formData.name}
            onChange={(e) => onChangeField('name', e.target.value)}
            placeholder="e.g., Saint Nicholas of Myra"
            className={`w-full bg-white/5 border ${
              errors.name ? 'border-red-500/80 ring-1 ring-red-500/40' : 'border-white/15 focus:border-gold-accent/60'
            } rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors`}
          />
          {errors.name && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Cover Image URL & Preview */}
      <div className="space-y-2">
        <label htmlFor="public-cover-image" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5" />
          <span>Cover Image URL *</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1 w-full">
            <input
              id="public-cover-image"
              type="text"
              value={formData.coverImage}
              onChange={(e) => onChangeField('coverImage', e.target.value)}
              placeholder="https://images.unsplash.com/photo-1548625149-fc4a29cf7092..."
              className={`w-full bg-white/5 border ${
                errors.coverImage ? 'border-red-500/80 ring-1 ring-red-500/40' : 'border-white/15 focus:border-gold-accent/60'
              } rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors`}
            />
            {errors.coverImage && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.coverImage}</span>
              </p>
            )}
            <p className="text-[11px] text-white/40 mt-1">
              Direct HTTPS image URL for main story header.
            </p>
          </div>

          {/* Image Thumbnail Preview */}
          {formData.coverImage && (
            <div className="w-full sm:w-28 h-28 rounded-xl border border-white/20 overflow-hidden relative group bg-black/40 shrink-0">
              <img
                src={formData.coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=300';
                }}
              />
              <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/70 px-1.5 py-0.5 rounded text-white/80">
                Preview
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Famous Quote */}
        <div className="space-y-2">
          <label htmlFor="public-famous-quote" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5" />
            <span>Famous Quote</span>
          </label>
          <textarea
            id="public-famous-quote"
            rows={3}
            value={formData.famousQuote}
            onChange={(e) => onChangeField('famousQuote', e.target.value)}
            placeholder="«The spirit of faith lives in humble deeds...»"
            className="w-full bg-white/5 border border-white/15 focus:border-gold-accent/60 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Video URL */}
        <div className="space-y-2">
          <label htmlFor="public-video-url" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" />
            <span>Documentary / Video URL</span>
          </label>
          <input
            id="public-video-url"
            type="text"
            value={formData.videoUrl}
            onChange={(e) => onChangeField('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full bg-white/5 border ${
              errors.videoUrl ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
            } rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors`}
          />
          {errors.videoUrl && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.videoUrl}</span>
            </p>
          )}
          <p className="text-[11px] text-white/40">Optional link to video or documentary.</p>
        </div>
      </div>

      {/* Biography */}
      <div className="space-y-2">
        <label htmlFor="public-biography" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biography / Sacred Narrative *</span>
          </span>
          <span className="text-white/40 font-normal text-[11px]">
            {formData.biography.length} characters
          </span>
        </label>
        <textarea
          id="public-biography"
          rows={6}
          value={formData.biography}
          onChange={(e) => onChangeField('biography', e.target.value)}
          placeholder="Detailed life narrative, spiritual impact, miracles, and legacy..."
          className={`w-full bg-white/5 border ${
            errors.biography ? 'border-red-500/80 ring-1 ring-red-500/40' : 'border-white/15 focus:border-gold-accent/60'
          } rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-y`}
        />
        {errors.biography && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.biography}</span>
          </p>
        )}
      </div>
    </div>
  );
};
