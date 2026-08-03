/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Quote, Video, FileText, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';

export interface StoryBasicData {
  name: string;
  type: number;
  coverImage: string;
  famousQuote: string;
  videoUrl: string;
  biography: string;
}

interface StoryFormProps {
  data: StoryBasicData;
  onChange: (updated: StoryBasicData) => void;
  errors?: Record<string, string>;
}

export const STORY_TYPE_OPTIONS = [
  { value: 0, label: 'Hermit' },
  { value: 1, label: 'Saint' },
  { value: 2, label: 'Martyr' },
  { value: 3, label: 'Patriarch' },
  { value: 4, label: 'Archpriest' },
  { value: 5, label: 'Pope' },
];

export default function StoryForm({ data, onChange, errors = {} }: StoryFormProps) {
  return (
    <div className="space-y-5 text-xs text-stone-800">
      {/* Title & Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1 md:col-span-2">
          <label className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen size={14} className="text-amber-600" />
            Sacred Story Name / Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="e.g. Saint Mina the Miraculous"
            className={`w-full bg-stone-50 border ${
              errors.name ? 'border-red-500 bg-red-50/50' : 'border-stone-300'
            } rounded-lg p-2.5 font-serif font-bold text-sm text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none`}
          />
          {errors.name && (
            <p className="text-red-600 text-[11px] font-semibold flex items-center gap-1 mt-1">
              <AlertCircle size={12} />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-bold text-stone-700 uppercase tracking-wider">
            Category / Type <span className="text-red-500">*</span>
          </label>
          <select
            value={data.type}
            onChange={(e) => onChange({ ...data, type: Number(e.target.value) })}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-semibold text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          >
            {STORY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Famous Quote */}
      <div className="space-y-1">
        <label className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Quote size={14} className="text-amber-600" />
          Famous Quote / Defining Utterance
        </label>
        <input
          type="text"
          value={data.famousQuote}
          onChange={(e) => onChange({ ...data, famousQuote: e.target.value })}
          placeholder='e.g. "Take heart, I have overcome the world."'
          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 italic text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
        />
      </div>

      {/* Biography */}
      <div className="space-y-1">
        <label className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <FileText size={14} className="text-amber-600" />
          Biography / Venerated Narrative
        </label>
        <textarea
          rows={5}
          value={data.biography}
          onChange={(e) => onChange({ ...data, biography: e.target.value })}
          placeholder="Detailed biography or hagiographical account..."
          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 leading-relaxed font-serif text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
        />
      </div>

      {/* Cover Image & Video URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-stone-200">
        <ImageUploader
          label="Main Cover Image"
          value={data.coverImage}
          onChange={(url) => onChange({ ...data, coverImage: url })}
          placeholder="https://example.com/cover.jpg"
          helperText="Appears as the primary banner and preview card image."
        />

        <div className="space-y-1.5">
          <label className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Video size={14} className="text-amber-600" />
            Documentary Video URL
          </label>
          <input
            type="text"
            value={data.videoUrl}
            onChange={(e) => onChange({ ...data, videoUrl: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
          <p className="text-[11px] text-stone-500">
            Link to a documentary video or liturgical audio recording.
          </p>

          {data.videoUrl && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-2">
              <Video size={14} className="text-amber-600 shrink-0" />
              <span className="truncate">Connected: {data.videoUrl}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
