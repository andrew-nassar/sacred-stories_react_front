/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ClipboardCheck, 
  User, 
  Calendar, 
  ShieldAlert, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { SacredStory } from '../types';
import Pagination from '../../shared/components/Pagination';

interface PendingReviewsProps {
  stories: SacredStory[];
  onReviewStory: (storyId: string) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  categories: string[];
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  isLoading: boolean;
}

export default function PendingReviews({ 
  stories, 
  onReviewStory,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onPageChange,
  onPageSizeChange,
  isLoading
}: PendingReviewsProps) {
  return (
    <div id="pending-reviews-container" className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FAF9F5]/30 animate-in fade-in duration-200">
      {/* Page Header */}
      <div id="pending-header" className="border-b border-stone-200 pb-5">
        <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <ClipboardCheck size={32} className="text-amber-600" />
          <span>Pending Editorial Reviews</span>
        </h2>
        <p className="text-stone-500 text-sm mt-1">Execute strict hagiographical and historical verification before committing chronicles to the public archive.</p>
      </div>

      {/* Filters Bar */}
      <div id="pending-filters" className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center relative shrink-0">
        {isLoading && (
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-100 overflow-hidden">
            <div className="w-full h-full bg-amber-600 origin-left animate-pulse" />
          </div>
        )}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="pending-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pending chronicles..."
            className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2 pl-9 pr-4 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Filter size={14} className="text-stone-400" />
          <select
            id="pending-category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg py-2 px-3 text-xs text-stone-800 focus:outline-none cursor-pointer font-semibold"
          >
            <option value="ALL_CATEGORIES">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div id="pending-reviews-card" className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center select-none">
          <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2">
            <span>Review Queue</span>
            <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {totalItems} pending
            </span>
          </h3>
        </div>

        {stories.length === 0 ? (
          <div id="no-pending-view" className="text-center p-16 space-y-4">
            <ClipboardCheck size={48} className="text-stone-300 mx-auto" />
            <h4 className="font-serif text-lg font-bold text-stone-800">No Pending Reviews Found</h4>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">There are no matching submitted hagiographies in this view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] z-10" />
            )}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/30 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-b border-stone-100">
                  <th className="py-4 px-6">Sacred Biography Name</th>
                  <th className="py-4 px-6">Devotional Category</th>
                  <th className="py-4 px-6">Submitted By</th>
                  <th className="py-4 px-6">Submission Date</th>
                  <th className="py-4 px-6">Verification Integrity</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm text-stone-600">
                {stories.map((story) => {
                  const checks = story.editorialChecks;
                  const totalChecks = Object.values(checks).length;
                  const completedChecks = Object.values(checks).filter(Boolean).length;
                  const isChecklistPerfect = completedChecks === totalChecks && totalChecks > 0;

                  return (
                    <tr id={`pending-row-${story.id}`} key={story.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="font-serif font-bold text-stone-900 text-base">{story.sacredName}</span>
                          <span className="text-xs text-stone-400 mt-0.5 select-none font-semibold">Canonization: {story.canonizationYear}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="bg-amber-50 text-amber-800 border border-amber-600/10 text-[11px] font-semibold px-2 py-0.5 rounded">
                          {story.devotionalCategory}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-stone-400" />
                          <span>{story.submittedBy}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-stone-400" />
                          <span>{story.dateSubmitted}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isChecklistPerfect ? 'bg-emerald-600' : 'bg-amber-500'}`}
                              style={{ width: `${totalChecks ? (completedChecks / totalChecks) * 100 : 0}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${isChecklistPerfect ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {completedChecks}/{totalChecks} checks
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button
                          id={`btn-review-queue-${story.id}`}
                          onClick={() => onReviewStory(story.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 px-4 rounded-md shadow-sm transition-all flex items-center gap-1 ml-auto group cursor-pointer"
                        >
                          <span>Review</span>
                          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Reusable Pagination Controls */}
        {stories.length > 0 && (
          <div className="p-4 border-t border-stone-100 bg-stone-50/50">
            <Pagination
              id="pending-reviews-pagination"
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Verification Code of Honor */}
      <div id="editorial-policy-card" className="bg-amber-50/30 border border-amber-600/10 p-6 rounded-xl flex gap-4 items-start shadow-sm">
        <ShieldAlert size={24} className="text-amber-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-stone-800 text-sm">Sacred Vow of Hagiographical Accuracy</h4>
          <p className="text-xs text-stone-600 leading-relaxed max-w-4xl">
            Each entry represents an eternal chronicle. Prior to clicking 'Approve Story', you must confirm that the associated relics have been verified by authorized historical archives, and the liturgical records are corroborated. Uncorroborated narratives must remain in 'Request Revisions' state.
          </p>
        </div>
      </div>
    </div>
  );
}