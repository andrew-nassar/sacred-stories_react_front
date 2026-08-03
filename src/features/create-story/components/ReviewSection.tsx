/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreateStoryPayload, StoryTypeOption, FormValidationErrors } from '../types';
import { BookOpen, MapPin, Calendar, Image, CheckCircle2, AlertCircle, Quote, Video } from 'lucide-react';

interface ReviewSectionProps {
  formData: CreateStoryPayload;
  storyTypes: StoryTypeOption[];
  errors: FormValidationErrors;
  onJumpToStep: (stepNumber: number) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  formData,
  storyTypes,
  errors,
  onJumpToStep,
}) => {
  const currentType = storyTypes.find((t) => t.id === formData.type);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gold-accent" />
          <span>Review Story Submission</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          Review your entered information before publishing to the sacred stories collection.
        </p>
      </div>

      {hasErrors && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>Form contains incomplete or invalid fields</span>
          </div>
          <ul className="text-xs space-y-1 pl-7 list-disc text-red-300/90">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>
                <span className="font-mono text-[11px] font-bold uppercase">{key}:</span> {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Story Summary Card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Banner */}
        <div className="h-48 relative bg-black">
          {formData.coverImage ? (
            <img
              src={formData.coverImage}
              alt={formData.name || 'Story Cover'}
              className="w-full h-full object-cover opacity-80"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/40 font-mono text-xs">
              No Cover Image Provided
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1017] via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase bg-gold-accent/20 text-gold-accent border border-gold-accent/40 px-2.5 py-0.5 rounded-full font-bold">
                {currentType ? `${currentType.id} - ${currentType.name} (${currentType.displayName})` : `Type ${formData.type}`}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {formData.name || 'Untitled Sacred Story'}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onJumpToStep(1)}
              className="text-xs font-mono text-gold-accent hover:underline bg-black/60 px-3 py-1.5 rounded-lg border border-white/10"
            >
              Edit Info
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-6">
          {/* Quote & Video */}
          {(formData.famousQuote || formData.videoUrl) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/5 pb-4">
              {formData.famousQuote && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-white/50 uppercase flex items-center gap-1">
                    <Quote className="w-3 h-3 text-gold-accent" />
                    <span>Quote</span>
                  </span>
                  <p className="text-xs text-white/90 italic font-serif">«{formData.famousQuote}»</p>
                </div>
              )}

              {formData.videoUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-white/50 uppercase flex items-center gap-1">
                    <Video className="w-3 h-3 text-gold-accent" />
                    <span>Video Link</span>
                  </span>
                  <p className="text-xs text-gold-accent font-mono truncate">{formData.videoUrl}</p>
                </div>
              )}
            </div>
          )}

          {/* Biography Excerpt */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-white/50 uppercase block">Biography Overview</span>
            <p className="text-xs text-white/80 leading-relaxed line-clamp-4">
              {formData.biography || 'No biography text entered.'}
            </p>
          </div>

          {/* Burial Place Overview */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gold-accent flex items-center gap-1.5 uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>Burial Shrine</span>
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(2)}
                className="text-[11px] font-mono text-gold-accent hover:underline"
              >
                Edit Shrine
              </button>
            </div>
            <p className="text-sm font-semibold text-white">{formData.burialPlace.name || 'Not specified'}</p>
            {formData.burialPlace.address && (
              <p className="text-xs text-white/60">{formData.burialPlace.address}</p>
            )}
          </div>

          {/* Counts */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/50 uppercase block">Timeline Events</span>
                <span className="text-lg font-bold text-white">{formData.timeline.length} Milestones</span>
              </div>
              <button
                type="button"
                onClick={() => onJumpToStep(3)}
                className="text-xs font-mono text-gold-accent hover:underline"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/50 uppercase block">Sacred Gallery</span>
                <span className="text-lg font-bold text-white">{formData.sacredGallery.length} Artworks</span>
              </div>
              <button
                type="button"
                onClick={() => onJumpToStep(4)}
                className="text-xs font-mono text-gold-accent hover:underline"
              >
                <Image className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
