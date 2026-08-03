/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BurialPlacePayload, FormValidationErrors } from '../types';
import { MapPin, Globe, Compass, Image, AlertCircle } from 'lucide-react';

interface BurialPlaceSectionProps {
  burialPlace: BurialPlacePayload;
  errors: FormValidationErrors;
  onChangeBurialField: <K extends keyof BurialPlacePayload>(key: K, value: BurialPlacePayload[K]) => void;
}

export const BurialPlaceSection: React.FC<BurialPlaceSectionProps> = ({
  burialPlace,
  errors,
  onChangeBurialField,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-accent" />
          <span>Burial Place & Shrine Details</span>
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-1">
          Specify location details, geographical coordinates, and shrine description for pilgrims.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shrine Name */}
        <div className="space-y-2">
          <label htmlFor="burial-name" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent">
            Shrine / Burial Location Name *
          </label>
          <input
            id="burial-name"
            type="text"
            value={burialPlace.name}
            onChange={(e) => onChangeBurialField('name', e.target.value)}
            placeholder="e.g., Basilica of Saint Nicholas, Bari"
            className={`w-full bg-white/5 border ${
              errors['burialPlace.name'] ? 'border-red-500/80 ring-1 ring-red-500/40' : 'border-white/15 focus:border-gold-accent/60'
            } rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors`}
          />
          {errors['burialPlace.name'] && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors['burialPlace.name']}</span>
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label htmlFor="burial-address" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent">
            Street Address / Region
          </label>
          <input
            id="burial-address"
            type="text"
            value={burialPlace.address}
            onChange={(e) => onChangeBurialField('address', e.target.value)}
            placeholder="Largo Abate Elia 13, 70122 Bari BA, Italy"
            className="w-full bg-white/5 border border-white/15 focus:border-gold-accent/60 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="burial-description" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent">
          Shrine & Pilgrimage History Description
        </label>
        <textarea
          id="burial-description"
          rows={3}
          value={burialPlace.description}
          onChange={(e) => onChangeBurialField('description', e.target.value)}
          placeholder="Brief description of the cathedral, monastery, or holy tomb where the relics reside..."
          className="w-full bg-white/5 border border-white/15 focus:border-gold-accent/60 rounded-xl p-3.5 text-sm text-white placeholder-white/30 focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Coordinates & Google Maps Link */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="burial-latitude" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Latitude</span>
          </label>
          <input
            id="burial-latitude"
            type="number"
            step="any"
            value={burialPlace.latitude || 0}
            onChange={(e) => onChangeBurialField('latitude', parseFloat(e.target.value) || 0)}
            placeholder="41.1303"
            className="w-full bg-white/5 border border-white/15 focus:border-gold-accent/60 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="burial-longitude" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Longitude</span>
          </label>
          <input
            id="burial-longitude"
            type="number"
            step="any"
            value={burialPlace.longitude || 0}
            onChange={(e) => onChangeBurialField('longitude', parseFloat(e.target.value) || 0)}
            placeholder="16.8711"
            className="w-full bg-white/5 border border-white/15 focus:border-gold-accent/60 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="burial-maps-url" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Google Maps URL</span>
          </label>
          <input
            id="burial-maps-url"
            type="text"
            value={burialPlace.googleMapsUrl}
            onChange={(e) => onChangeBurialField('googleMapsUrl', e.target.value)}
            placeholder="https://maps.google.com/..."
            className={`w-full bg-white/5 border ${
              errors['burialPlace.googleMapsUrl'] ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
            } rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors`}
          />
          {errors['burialPlace.googleMapsUrl'] && (
            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors['burialPlace.googleMapsUrl']}</span>
            </p>
          )}
        </div>
      </div>

      {/* Burial Place Cover Image */}
      <div className="space-y-2">
        <label htmlFor="burial-cover-image" className="block text-xs font-mono font-semibold uppercase tracking-wider text-gold-accent flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5" />
          <span>Shrine Cover Image URL</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <input
            id="burial-cover-image"
            type="text"
            value={burialPlace.coverImage}
            onChange={(e) => onChangeBurialField('coverImage', e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className={`flex-1 w-full bg-white/5 border ${
              errors['burialPlace.coverImage'] ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
            } rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors`}
          />

          {burialPlace.coverImage && (
            <div className="w-full sm:w-28 h-20 rounded-xl border border-white/20 overflow-hidden relative bg-black/40 shrink-0">
              <img
                src={burialPlace.coverImage}
                alt="Shrine Cover"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=300';
                }}
              />
            </div>
          )}
        </div>
        {errors['burialPlace.coverImage'] && (
          <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors['burialPlace.coverImage']}</span>
          </p>
        )}
      </div>
    </div>
  );
};
