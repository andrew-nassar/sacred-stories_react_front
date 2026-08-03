/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, Eye, RefreshCw } from 'lucide-react';

export interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
}

interface GalleryEditorProps {
  items: GalleryItem[];
  onChange: (updated: GalleryItem[]) => void;
}

export default function GalleryEditor({ items, onChange }: GalleryEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceTargetIndex = useRef<number | null>(null);

  const handleAddImage = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: 'Sacred Icon',
      imageUrl: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof GalleryItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = String(event.target.result);
          if (replaceTargetIndex.current !== null) {
            handleUpdateItem(replaceTargetIndex.current, 'imageUrl', url);
            replaceTargetIndex.current = null;
          } else {
            const newItem: GalleryItem = {
              id: `gal-${Date.now()}`,
              title: file.name.replace(/\.[^/.]+$/, ''),
              imageUrl: url,
            };
            onChange([...items, newItem]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUploadForReplace = (index: number) => {
    replaceTargetIndex.current = index;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 text-xs text-stone-800">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header & Add Actions */}
      <div className="flex items-center justify-between bg-stone-100 p-3 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2">
          <ImageIcon className="text-amber-600" size={16} />
          <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
            Sacred Gallery & Icons ({items.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              replaceTargetIndex.current = null;
              fileInputRef.current?.click();
            }}
            className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <Upload size={14} />
            <span>Upload Image</span>
          </button>

          <button
            type="button"
            onClick={handleAddImage}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer text-xs"
          >
            <Plus size={14} />
            <span>Add Gallery Item</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50 space-y-2">
          <ImageIcon className="mx-auto text-stone-300" size={28} />
          <p className="font-semibold text-stone-600">No gallery images added yet.</p>
          <p className="text-stone-400 text-[11px]">
            Click "Add Gallery Item" or "Upload Image" to include historical icons and artifacts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden p-3 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-300 transition-colors"
            >
              {/* Preview Box */}
              <div className="relative h-36 bg-stone-900 rounded-lg overflow-hidden flex items-center justify-center group">
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 hover:bg-white text-stone-900 p-2 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => triggerFileUploadForReplace(index)}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg font-bold text-[11px] flex items-center gap-1 shadow cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>Replace</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3 text-stone-400 space-y-1">
                    <ImageIcon size={24} className="mx-auto text-stone-500" />
                    <span className="text-[11px]">No Image URL</span>
                  </div>
                )}
              </div>

              {/* Form Inputs */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 text-[11px]">Image Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                    placeholder="e.g. Ancient Fresco Detail"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-semibold text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 text-[11px]">Image URL</label>
                  <input
                    type="text"
                    value={item.imageUrl}
                    onChange={(e) => handleUpdateItem(index, 'imageUrl', e.target.value)}
                    placeholder="https://example.com/icon.jpg"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => triggerFileUploadForReplace(index)}
                  className="text-amber-700 hover:text-amber-800 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Replace Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <Trash2 size={12} />
                  <span>Remove Item</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
