/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Navigation, Map, Globe } from 'lucide-react';
import ImageUploader from './ImageUploader';

export interface BurialPlaceData {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  coverImage: string;
}

interface BurialPlaceFormProps {
  data: BurialPlaceData;
  onChange: (updated: BurialPlaceData) => void;
}

export default function BurialPlaceForm({ data, onChange }: BurialPlaceFormProps) {
  return (
    <div className="space-y-5 text-xs text-stone-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin size={14} className="text-amber-600" />
            Sanctuary / Burial Place Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="e.g. Saint Mina Monastery Shrine"
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 font-semibold text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Navigation size={14} className="text-amber-600" />
            Physical Address
          </label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange({ ...data, address: e.target.value })}
            placeholder="e.g. Mariout Desert, Alexandria, Egypt"
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="font-bold text-stone-700 uppercase tracking-wider">
          Burial Shrine Description
        </label>
        <textarea
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Details about the shrine, pilgrimage tradition, or architectural features..."
          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 leading-relaxed text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
        />
      </div>

      {/* Coordinates & Maps URL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-stone-100/70 border border-stone-200 rounded-xl">
        <div className="space-y-1">
          <label className="font-bold text-stone-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Map size={13} className="text-amber-600" />
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={data.latitude ?? 0}
            onChange={(e) => onChange({ ...data, latitude: parseFloat(e.target.value) || 0 })}
            placeholder="30.846"
            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono text-xs text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-stone-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Map size={13} className="text-amber-600" />
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={data.longitude ?? 0}
            onChange={(e) => onChange({ ...data, longitude: parseFloat(e.target.value) || 0 })}
            placeholder="29.664"
            className="w-full bg-white border border-stone-300 rounded-lg p-2 font-mono text-xs text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-stone-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Globe size={13} className="text-amber-600" />
            Google Maps URL
          </label>
          <input
            type="text"
            value={data.googleMapsUrl || ''}
            onChange={(e) => onChange({ ...data, googleMapsUrl: e.target.value })}
            placeholder="https://maps.google.com/?q=..."
            className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Burial Place Cover Image */}
      <ImageUploader
        label="Burial Place Cover / Shrine Photo"
        value={data.coverImage || ''}
        onChange={(url) => onChange({ ...data, coverImage: url })}
        placeholder="https://example.com/shrine.jpg"
        helperText="Photographic view of the tomb or sanctuary location."
      />
    </div>
  );
}
