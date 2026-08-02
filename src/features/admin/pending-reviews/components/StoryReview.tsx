/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Clock, 
  User, 
  Calendar,
  Sparkles,
  Play,
  Bookmark,
  Loader2
} from 'lucide-react';
import { SacredStory, EditorialChecks } from '../types';

interface StoryReviewProps {
  story: SacredStory;
  onGoBack: () => void;
  onApprove: (storyId: string, comments: string, checks: EditorialChecks) => void;
  onReject: (storyId: string, comments: string) => void;
  onRequestRevisions: (storyId: string, comments: string) => void;
}

export default function StoryReview({ story, onGoBack, onApprove, onReject, onRequestRevisions }: StoryReviewProps) {
  const [comments, setComments] = useState(story.editorialComments || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checks, setChecks] = useState<EditorialChecks>({
    authenticityVerified: story.editorialChecks?.authenticityVerified || false,
    historicalCorroboration: story.editorialChecks?.historicalCorroboration || false,
    accessPermissionsChecked: story.editorialChecks?.accessPermissionsChecked || false,
    relicVenerationDocumented: story.editorialChecks?.relicVenerationDocumented || false,
  });

  const handleToggleCheck = (key: keyof EditorialChecks) => {
    setChecks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isAllChecked = Object.values(checks).every(Boolean);

  const handleAcceptClick = async () => {
    try {
      setIsSubmitting(true);
      await onApprove(story.id, comments, checks);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    if (window.confirm(`Are you sure you want to REJECT this story: ${story.sacredName}?`)) {
      try {
        setIsSubmitting(true);
        await onReject(story.id, comments);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRevisionClick = async () => {
    try {
      setIsSubmitting(true);
      await onRequestRevisions(story.id, comments);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="review-container" className="flex-1 overflow-y-auto p-8 bg-[#FAF9F5]/30 space-y-8 animate-in fade-in duration-200">
      {/* Editorial Navigation and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <button
            id="btn-back-to-queue"
            onClick={onGoBack}
            disabled={isSubmitting}
            className="text-stone-500 hover:text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>RETURN TO QUEUE</span>
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">{story.sacredName}</h2>
            <span className="bg-amber-600/10 text-amber-900 border border-amber-600/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide animate-pulse">
              URGENT REVIEW REQUIRED
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* REJECT (status = 2) */}
          <button
            id="btn-reject"
            disabled={isSubmitting}
            onClick={handleRejectClick}
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold py-2 px-4 rounded-lg border border-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} className="text-stone-500" />}
            <span>Reject Entry (2)</span>
          </button>

          {/* REQUEST REVISIONS (status = 0) */}
          <button
            id="btn-request-revisions"
            disabled={isSubmitting}
            onClick={handleRevisionClick}
            className="bg-white hover:bg-stone-50 text-amber-700 hover:text-amber-800 text-xs font-semibold py-2 px-4 rounded-lg border border-amber-600/20 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <AlertCircle size={15} className="text-amber-600" />}
            <span>Request Revisions (0)</span>
          </button>

          {/* ACCEPT / APPROVE (status = 1) */}
          <button
            id="btn-approve"
            disabled={!isAllChecked || isSubmitting}
            onClick={handleAcceptClick}
            className={`text-xs font-bold py-2 px-5 rounded-lg flex items-center gap-1.5 shadow transition-all ${
              isAllChecked && !isSubmitting
                ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            <span>Accept & Publish (1)</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout Grid */}
      <div id="review-layout-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-3">Editorial Biography</h3>
            <p className="font-serif text-stone-700 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-3 first-letter:float-left">
              {story.veneratedNarrative || 'No narrative description available.'}
            </p>
            {story.definingUtterance && (
              <div className="pt-4 border-t border-stone-100 italic text-stone-500 text-sm flex gap-2 items-start bg-amber-50/20 p-4 rounded-lg mt-6">
                <Bookmark size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  "<strong>Defining Utterance:</strong> {story.definingUtterance}"
                </span>
              </div>
            )}
          </div>

          {/* Timeline */}
          {story.chronology && story.chronology.length > 0 && (
            <div className="bg-white border border-stone-200 p-8 rounded-xl shadow-sm space-y-6">
              <h3 className="font-serif text-lg font-bold text-stone-800 border-b border-stone-100 pb-3">Eternal Timeline</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200 pl-2">
                {story.chronology.map((event) => (
                  <div key={event.id} className="relative pl-10 flex gap-4">
                    <span className="absolute left-1.5 top-1.5 w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-sm ring-1 ring-amber-600/50" />
                    <div className="space-y-1">
                      <span className="font-serif text-amber-700 text-sm font-bold block">{event.year}</span>
                      <h4 className="font-bold text-stone-900 text-sm">{event.eventTitle}</h4>
                      <p className="text-stone-600 text-xs leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {story.gallery && story.gallery.length > 0 && (
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
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Verification Checklist */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-600" />
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles size={18} className="text-amber-600" />
              <span>Verification Integrity</span>
            </h3>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50/50 hover:bg-stone-50 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={checks.authenticityVerified}
                  onChange={() => handleToggleCheck('authenticityVerified')}
                  className="w-4 h-4 rounded text-amber-600 border-stone-300 mt-0.5 focus:ring-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-800">Authenticity of Relics Verified</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50/50 hover:bg-stone-50 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={checks.historicalCorroboration}
                  onChange={() => handleToggleCheck('historicalCorroboration')}
                  className="w-4 h-4 rounded text-amber-600 border-stone-300 mt-0.5 focus:ring-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-800">Historical Corroboration</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50/50 hover:bg-stone-50 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={checks.accessPermissionsChecked}
                  onChange={() => handleToggleCheck('accessPermissionsChecked')}
                  className="w-4 h-4 rounded text-amber-600 border-stone-300 mt-0.5 focus:ring-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-800">Access Permissions Checked</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50/50 hover:bg-stone-50 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={checks.relicVenerationDocumented}
                  onChange={() => handleToggleCheck('relicVenerationDocumented')}
                  className="w-4 h-4 rounded text-amber-600 border-stone-300 mt-0.5 focus:ring-amber-500 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-stone-800">Relic Veneration Documented</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submission Metadata */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">Submission Metadata</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400 font-semibold uppercase">Submitted By</span>
                <span className="text-stone-800 font-bold flex items-center gap-1">
                  <User size={13} className="text-stone-400" />
                  {story.submittedBy}
                </span>
              </div>

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
            </div>
          </div>

          {/* Editorial Comments Textarea */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="font-serif text-sm font-bold text-stone-800 flex items-center gap-1">
              <Clock size={16} className="text-amber-600" />
              <span>Editorial Comments</span>
            </h3>
            <textarea
              id="review-comments-textarea"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback or revision notes..."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}