/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SacredGalleryItemPayload, FormValidationErrors } from '../types';
import { Image, Plus, Trash2, Eye, RefreshCw, AlertCircle, X } from 'lucide-react';

interface GallerySectionProps {
  gallery: SacredGalleryItemPayload[];
  errors: FormValidationErrors;
  onAddImage: (url?: string, title?: string) => void;
  onUpdateImage: (index: number, updated: Partial<SacredGalleryItemPayload>) => void;
  onDeleteImage: (index: number) => void;
  onReplaceImage: (index: number, newUrl: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  errors,
  onAddImage,
  onUpdateImage,
  onDeleteImage,
  onReplaceImage,
}) => {
  // Lightbox preview modal state
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Suggested stock iconography URLs for quick addition
  const SAMPLE_ICONS = [
    {
      title: 'Byzantine Fresco',
      url: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Cathedral Shrine Reliquary',
      url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Illuminated Manuscript',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-gold-accent" />
            <span>Sacred Gallery</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Add holy icons, historical frescoes, manuscripts, and relic artwork to enrich the archival record.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAddImage()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-md shadow-gold-accent/10 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Image</span>
        </button>
      </div>

      {/* Suggested quick presets */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-3 sm:p-4">
        <span className="text-xs font-mono font-semibold text-white/70 block mb-2">
          Quick Add Sample Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_ICONS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAddImage(sample.url, sample.title)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-gold-accent/40 text-xs text-white/80 hover:text-white font-sans transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-gold-accent" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {gallery.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
          <Image className="w-8 h-8 text-white/30 mx-auto mb-2" />
          <p className="text-sm text-white/60 font-medium">No gallery items added yet.</p>
          <p className="text-xs text-white/40 mt-1">Upload image URLs or select preset icons above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((item, index) => {
            const titleError = errors[`gallery[${index}].title`];
            const urlError = errors[`gallery[${index}].imageUrl`];

            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col group hover:border-gold-accent/40 transition-all"
              >
                {/* Image Thumbnail Header with overlay actions */}
                <div className="h-44 bg-black/60 relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title || `Gallery Item ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=600';
                    }}
                  />

                  {/* Overlay buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {/* Full Preview */}
                    <button
                      type="button"
                      onClick={() => setPreviewImage({ url: item.imageUrl, title: item.title })}
                      className="p-2 rounded-full bg-black/70 text-white hover:text-gold-accent transition-colors cursor-pointer"
                      title="Preview Image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Replace Image */}
                    <button
                      type="button"
                      onClick={() => {
                        const newUrl = prompt('Enter new image URL:', item.imageUrl);
                        if (newUrl && newUrl.trim()) {
                          onReplaceImage(index, newUrl.trim());
                        }
                      }}
                      className="p-2 rounded-full bg-black/70 text-white hover:text-gold-accent transition-colors cursor-pointer"
                      title="Replace Image URL"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteImage(index)}
                      className="p-2 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-colors cursor-pointer"
                      title="Remove Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="absolute top-2 left-2 text-[10px] font-mono bg-black/70 px-2 py-0.5 rounded-full text-white/90 border border-white/10">
                    #{index + 1}
                  </span>
                </div>

                {/* Form Controls */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-mono text-white/60 mb-1">
                        Artwork Title *
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => onUpdateImage(index, { title: e.target.value })}
                        placeholder="e.g., Icon of Saint Nicholas"
                        className={`w-full bg-white/5 border ${
                          titleError ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
                        } rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors`}
                      />
                      {titleError && (
                        <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{titleError}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white/60 mb-1">
                        Image URL *
                      </label>
                      <input
                        type="text"
                        value={item.imageUrl}
                        onChange={(e) => onUpdateImage(index, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        className={`w-full bg-white/5 border ${
                          urlError ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
                        } rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors font-mono`}
                      />
                      {urlError && (
                        <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{urlError}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                    <button
                      type="button"
                      onClick={() => setPreviewImage({ url: item.imageUrl, title: item.title })}
                      className="hover:text-gold-accent transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Full Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteImage(index)}
                      className="text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="max-w-3xl w-full bg-[#121620] border border-white/20 rounded-2xl p-4 space-y-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white truncate max-w-[80%]">
                {previewImage.title || 'Gallery Preview'}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-hidden rounded-xl border border-white/10 bg-black flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[65vh] w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
