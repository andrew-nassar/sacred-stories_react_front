/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, X, Link, Eye } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  placeholder = 'https://example.com/image.jpg',
  helperText,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(String(event.target.result));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-bold text-stone-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon size={14} className="text-amber-600" />
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <X size={12} />
            <span>Remove</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            title="Upload local image file"
          >
            <Upload size={14} />
            <span>Upload</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Live Preview Container */}
        {value && (
          <div className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-900 h-32 flex items-center justify-center">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-white p-1.5 rounded-md text-[10px] font-semibold flex items-center gap-1 shadow backdrop-blur-sm"
            >
              <Eye size={12} />
              <span>Full Preview</span>
            </a>
          </div>
        )}

        {helperText && <p className="text-[11px] text-stone-500">{helperText}</p>}
      </div>
    </div>
  );
}
