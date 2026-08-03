/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TimelineItemPayload, FormValidationErrors } from '../types';
import { Calendar, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react';

interface TimelineSectionProps {
  timeline: TimelineItemPayload[];
  errors: FormValidationErrors;
  onAddEvent: () => void;
  onUpdateEvent: (index: number, updated: Partial<TimelineItemPayload>) => void;
  onDeleteEvent: (index: number) => void;
  onMoveEvent: (fromIndex: number, toIndex: number) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  timeline,
  errors,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMoveEvent,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold-accent" />
            <span>Timeline Events</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Build chronological milestones for major life events, ordinations, and miracle accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddEvent}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gold-accent text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-accent/90 transition-all cursor-pointer shadow-md shadow-gold-accent/10 shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {timeline.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
          <Calendar className="w-8 h-8 text-white/30 mx-auto mb-2" />
          <p className="text-sm text-white/60 font-medium">No timeline events added yet.</p>
          <p className="text-xs text-white/40 mt-1">Click "Add Event" above to add key historical dates.</p>
          <button
            type="button"
            onClick={onAddEvent}
            className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-gold-accent hover:bg-white/15 text-xs font-mono font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Milestone</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const dateError = errors[`timeline[${index}].date`];
            const titleError = errors[`timeline[${index}].title`];
            const descError = errors[`timeline[${index}].description`];

            return (
              <div
                key={index}
                className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-gold-accent/30 transition-all space-y-4 relative group"
              >
                {/* Header Header Control Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <span className="font-mono text-xs font-bold text-gold-accent bg-gold-accent/10 px-2.5 py-1 rounded-full border border-gold-accent/20">
                    Event #{index + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    <button
                      type="button"
                      onClick={() => onMoveEvent(index, index - 1)}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer transition-all"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      type="button"
                      onClick={() => onMoveEvent(index, index + 1)}
                      disabled={index === timeline.length - 1}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 cursor-pointer transition-all"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => onDeleteEvent(index)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-all ml-2"
                      title="Remove Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Event Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-white/70">Date / Period *</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => onUpdateEvent(index, { date: e.target.value })}
                      placeholder="e.g., 270 AD"
                      className={`w-full bg-white/5 border ${
                        dateError ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
                      } rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors`}
                    />
                    {dateError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{dateError}</span>
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-mono text-white/70">Milestone Title *</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => onUpdateEvent(index, { title: e.target.value })}
                      placeholder="e.g., Consecration as Bishop of Myra"
                      className={`w-full bg-white/5 border ${
                        titleError ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
                      } rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors`}
                    />
                    {titleError && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{titleError}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-white/70">Description *</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => onUpdateEvent(index, { description: e.target.value })}
                    placeholder="Brief description of historical events or recorded testimonies..."
                    className={`w-full bg-white/5 border ${
                      descError ? 'border-red-500/80' : 'border-white/15 focus:border-gold-accent/60'
                    } rounded-xl p-3 text-sm text-white focus:outline-none transition-colors resize-none`}
                  />
                  {descError && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{descError}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
