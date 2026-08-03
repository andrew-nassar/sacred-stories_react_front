/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Calendar, Clock } from 'lucide-react';

export interface TimelineItem {
  id?: string;
  date: string;
  title: string;
  description: string;
}

interface TimelineEditorProps {
  items: TimelineItem[];
  onChange: (updated: TimelineItem[]) => void;
}

export default function TimelineEditor({ items, onChange }: TimelineEditorProps) {
  const handleAddItem = () => {
    const newItem: TimelineItem = {
      id: `tl-${Date.now()}`,
      date: new Date().toISOString(),
      title: '',
      description: '',
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof TimelineItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDeleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4 text-xs text-stone-800">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between bg-stone-100 p-3 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2">
          <Clock className="text-amber-600" size={16} />
          <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
            Chronological Timeline Events ({items.length})
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer text-xs"
        >
          <Plus size={14} />
          <span>Add Timeline Event</span>
        </button>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50 space-y-2">
          <Calendar className="mx-auto text-stone-300" size={28} />
          <p className="font-semibold text-stone-600">No timeline events added yet.</p>
          <p className="text-stone-400 text-[11px]">
            Click "Add Timeline Event" above to create chronological milestones.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="p-4 bg-stone-50 border border-stone-200 rounded-xl shadow-xs space-y-3 relative group hover:border-amber-300 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-black">
                    {index + 1}
                  </span>
                  Milestone #{index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded text-stone-500 hover:bg-stone-200 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded text-stone-500 hover:bg-stone-200 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="p-1.5 rounded text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer ml-1"
                    title="Delete Timeline Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-600 text-[11px]">Date / Era</label>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => handleUpdateItem(index, 'date', e.target.value)}
                    placeholder="e.g. 2026-08-02 or 303 AD"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-stone-600 text-[11px]">Event Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                    placeholder="e.g. Departure from Rome or Martyrdom"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 font-semibold text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-600 text-[11px]">Event Description</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                  placeholder="Detailed narrative describing this event..."
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
