/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Calendar,
  Sparkles,
  Play,
  Bookmark,
  ExternalLink,
  ShieldAlert,
  Pencil,
  Trash2
} from 'lucide-react';
import { SacredStory } from '../types';

interface ImmersivePreviewProps {
  story: SacredStory;
  onGoBack: () => void;
  onEditStory?: (story: SacredStory) => void;
  onDeleteStory?: (id: string) => void;
}

export default function ImmersivePreview({ story, onGoBack, onEditStory, onDeleteStory }: ImmersivePreviewProps) {
  return (
    <div id="immersive-preview-panel" className="flex-1 overflow-y-auto p-8 bg-[#FAF9F5]/30 space-y-8 animate-in fade-in duration-300">
      {/* Header and Return */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <button
            id="btn-preview-back"
            onClick={onGoBack}
            className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO ARCHIVE</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">{story.sacredName}</h2>
            <span className="bg-emerald-600/10 text-emerald-900 border border-emerald-600/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">
              IMMERSIVE ACTIVE EXHIBIT
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-600 flex items-center gap-1.5">
            <User size={12} className="text-stone-400" />
            <span>Submitted by: {story.submittedBy}</span>
          </span>

          {onEditStory && (
            <button
              id="btn-preview-edit"
              onClick={() => onEditStory(story)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Pencil size={14} />
              <span>Edit Story</span>
            </button>
          )}

          {onDeleteStory && (
            <button
              id="btn-preview-delete"
              onClick={() => {
                if (window.confirm(`Are you sure you want to permanently DELETE the chronicle: ${story.sacredName}? This action is irreversible.`)) {
                  onDeleteStory(story.id);
                  onGoBack();
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div id="preview-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Editorial Biography & Timeline & Gallery) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Biography View */}
          <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-3">Exhibited Biography</h3>
            <p className="font-serif text-stone-700 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-3 first-letter:float-left">
              {story.veneratedNarrative}
            </p>
            <div className="pt-4 border-t border-stone-100 italic text-stone-500 text-sm flex gap-2 items-start bg-amber-50/20 p-4 rounded-lg mt-6">
              <Bookmark size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                "<strong>Defining Utterance:</strong> {story.definingUtterance}"
              </span>
            </div>
          </div>

          {/* Eternal Timeline */}
          <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-3">Hagiographical Chronology</h3>
            {story.chronology.length === 0 ? (
              <p className="text-stone-400 text-xs italic">No temporal events recorded for this narrative.</p>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200 pl-2">
                {story.chronology.map((event) => (
                  <div id={`preview-chrono-${event.id}`} key={event.id} className="relative pl-10 flex gap-4">
                    <span className="absolute left-1.5 top-1.5 w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-sm ring-1 ring-amber-600/50" />
                    <div className="space-y-1">
                      <span className="font-serif text-amber-700 text-sm font-bold block">{event.year}</span>
                      <h4 className="font-bold text-stone-900 text-sm">{event.eventTitle}</h4>
                      <p className="text-stone-600 text-xs leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sacred Gallery */}
          {story.gallery.length > 0 && (
            <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-3">Sacred Relic & Art Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {story.gallery.map((asset) => (
                  <div key={asset.id} className="group relative rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-50">
                    <img 
                      src={asset.imageUrl} 
                      alt={asset.title} 
                      className="w-full h-32 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2 bg-white">
                      <p className="text-[10px] font-bold text-stone-800 truncate">{asset.title}</p>
                      <p className="text-[9px] text-stone-400 font-semibold uppercase">{asset.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentary Media */}
          {story.documentaryMedia && (
            <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-3">Documentary Media</h3>
              <div className="bg-stone-900 text-stone-100 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-600/20">
                <div className="space-y-1">
                  <p className="font-serif text-amber-400 font-bold text-base">{story.documentaryMedia.title}</p>
                  <p className="text-xs text-stone-400">Cinematic Short Document • Duration: {story.documentaryMedia.duration}</p>
                </div>
                <button
                  id="btn-preview-play-media"
                  onClick={() => alert(`Playing media stream simulation for: ${story.documentaryMedia.title}`)}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Play size={14} fill="white" />
                  <span>Play Documentary</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Verification Integrity & Metadata & Burial Card) */}
        <div className="space-y-8">
          {/* Verification Checklist */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles size={18} className="text-emerald-600" />
              <span>Verified Canon</span>
            </h3>
            <p className="text-stone-500 text-xs leading-normal">
              This chronicle is fully authenticated under rigorous hagiographical standards.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-50/50 bg-emerald-50/20">
                <span className="text-emerald-600 shrink-0 mt-0.5">✙</span>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-800">Relics Authenticated</p>
                  <p className="text-[10px] text-stone-400">Relics validated by ecclesiastical seal</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border border-emerald-50/50 bg-emerald-50/20">
                <span className="text-emerald-600 shrink-0 mt-0.5">✙</span>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-800">Historicity Corroborated</p>
                  <p className="text-[10px] text-stone-400">Cross-referenced with imperial records</p>
                </div>
              </div>
            </div>
          </div>

          {/* Burial Place Details Map Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin size={18} className="text-amber-600" />
              <span>Burial Place Context</span>
            </h3>

            {/* Custom map preview */}
            <div className="h-44 bg-[#E0D8C3] rounded-lg relative overflow-hidden flex items-center justify-center border border-stone-200">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C5BA9E_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
              <div className="absolute top-1/3 left-0 right-0 h-1 bg-[#D1C8AD]" />
              <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-[#D1C8AD]" />

              <div className="relative flex flex-col items-center">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-ping absolute top-0" />
                <MapPin size={32} className="text-red-600 drop-shadow-md relative" fill="red" />
              </div>

              <div className="absolute bottom-2 bg-white/95 px-3 py-1.5 rounded border border-amber-600/10 shadow-md text-center max-w-[90%]">
                <p className="text-[10px] font-bold text-stone-800 truncate">{story.burialPlace.sanctuaryName}</p>
                <p className="text-[8px] text-stone-400 font-semibold uppercase tracking-wider">{story.burialPlace.siteTypology}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <p><strong>Sanctuary:</strong> {story.burialPlace.sanctuaryName}</p>
              <p><strong>Address:</strong> {story.burialPlace.physicalAddress}</p>
              <p><strong>Coordinates:</strong> {story.burialPlace.latitude}° N, {story.burialPlace.longitude}° E</p>
              <p className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 italic">
                {story.burialPlace.description}
              </p>
            </div>
          </div>

          {/* Entry Metadata */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">Exhibit Metadata</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400 font-semibold uppercase">Submission Date</span>
                <span className="text-stone-800 font-bold flex items-center gap-1">
                  <Calendar size={13} className="text-stone-400" />
                  {story.dateSubmitted}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400 font-semibold uppercase">Category</span>
                <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded font-bold">
                  {story.devotionalCategory}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400 font-semibold uppercase">Canonization Year</span>
                <span className="text-stone-800 font-bold">
                  {story.canonizationYear}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Log */}
          {story.editorialComments && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-sm space-y-2">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">Archivist Notes</h3>
              <p className="text-stone-600 text-xs italic leading-relaxed">
                "{story.editorialComments}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
