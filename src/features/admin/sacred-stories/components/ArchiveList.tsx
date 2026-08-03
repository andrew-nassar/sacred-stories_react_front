/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Eye, 
  Trash2, 
  Sliders,
  Sparkles,
  BookOpen,
  Calendar,
  Pencil
} from 'lucide-react';
import { SacredStory } from '../types';
import Pagination from '../../shared/components/Pagination';

interface ArchiveListProps {
  stories: SacredStory[];
  categories: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string, order: 'asc' | 'desc') => void;
  onSelectStory: (id: string) => void;
  onEditStory: (story: SacredStory) => void;
  onDeleteStory: (id: string) => void;

  // Pagination State
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading: boolean;
}

export default function ArchiveList({
  stories,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSelectStory,
  onEditStory,
  onDeleteStory,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isLoading
}: ArchiveListProps) {
  return (
    <div id="archive-list-panel" className="flex-1 overflow-y-auto p-8 bg-[#FAF9F5]/30 space-y-6 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5 shrink-0">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Hagiographical Archive</h2>
            <p className="text-stone-500 text-xs font-medium">Browse, review, and curate verified historical narratives in the museum records.</p>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-xs bg-white border border-stone-200 px-3.5 py-1.5 rounded-lg font-semibold shadow-sm">
            <BookOpen size={14} className="text-amber-600" />
            <span>{totalItems} EXUVIAL CHRONICLES MATCHED</span>
          </div>
        </div>

        {/* High Fidelity Filter Panel */}
        <div id="filter-controls" className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 relative">
          {isLoading && (
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-100 overflow-hidden">
              <div className="w-full h-full bg-amber-600 origin-left animate-[loading_1s_infinite_linear]" style={{
                animationName: 'shimmer',
                animationDuration: '1.5s',
                animationIterationCount: 'infinite'
              }} />
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search size={16} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search sacred name, quote, category..."
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter size={16} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL_CATEGORIES">All Devotional Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Sliders size={16} className="text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              id="sort-filter"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                const field = parts[0];
                const order = parts[1] as 'asc' | 'desc';
                onSortChange(field, order);
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-xs text-stone-800 focus:outline-none cursor-pointer appearance-none font-semibold"
            >
              <option value="sacredName-asc">Name (A-Z)</option>
              <option value="sacredName-desc">Name (Z-A)</option>
              <option value="dateSubmitted-desc">Newest Submitted</option>
              <option value="dateSubmitted-asc">Oldest Submitted</option>
              <option value="canonizationYear-asc">Chronological Era (Asc)</option>
              <option value="canonizationYear-desc">Chronological Era (Desc)</option>
            </select>
          </div>

          {/* Diagnostic Status Tag */}
          <div className="flex items-center justify-end">
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-600/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
              <Sparkles size={12} className="text-emerald-600" />
              <span>EXHIBITIONS SYNCED WITH ARTIFACTS</span>
            </span>
          </div>
        </div>

        {/* Grid of Archive Cards */}
        {stories.length === 0 ? (
          <div id="empty-archive" className="bg-white border border-stone-200 rounded-xl p-16 text-center space-y-3">
            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mx-auto border border-stone-100">
              <Sliders size={20} />
            </div>
            <p className="font-serif text-stone-800 font-bold">No Chronicles Match Search</p>
            <p className="text-stone-400 text-xs max-w-sm mx-auto leading-normal">
              Refine your query or check for spelling errors. Verified items in queue must be approved before appearing in the archive.
            </p>
          </div>
        ) : (
          <div id="archive-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] z-10 rounded-xl" />
            )}

            {stories.map((story) => (
              <div
                id={`story-card-${story.id}`}
                key={story.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Card Image and Category tag */}
                <div className="h-40 bg-stone-100 relative overflow-hidden">
                  <img
                    src={
                      story.gallery[0]?.imageUrl ||
                      'https://images.unsplash.com/photo-1548623917-2fbf0f6a5b3a?auto=format&fit=crop&q=80&w=400'
                    }
                    alt={story.sacredName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">
                    {story.devotionalCategory}
                  </span>
                  {story.accessControl.publicArchive && (
                    <span className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[8px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">
                      Live
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-stone-900 line-clamp-1">{story.sacredName}</h3>
                    <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed italic">
                      "{story.definingUtterance}"
                    </p>
                  </div>

                  {/* Sanctuary detail */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold uppercase">
                    <MapPin size={12} className="text-amber-600" />
                    <span className="truncate">{story.burialPlace.sanctuaryName}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="border-t border-stone-100 p-3 bg-stone-50/50 flex items-center justify-between gap-1.5">
                  <button
                    id={`btn-archive-view-${story.id}`}
                    onClick={() => onSelectStory(story.id)}
                    className="bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-950 font-semibold py-1.5 px-2.5 rounded text-[11px] border border-stone-200 shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                    title="View Immersive Exhibit"
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>

                  <button
                    id={`btn-archive-edit-${story.id}`}
                    onClick={() => onEditStory(story)}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold py-1.5 px-2.5 rounded text-[11px] border border-amber-200/60 shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                    title="Edit Story"
                  >
                    <Pencil size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    id={`btn-archive-delete-${story.id}`}
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to permanently DELETE the chronicle: ${story.sacredName}? This action is irreversible.`)) {
                        onDeleteStory(story.id);
                      }
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-1.5 px-2.5 rounded text-[11px] border border-red-200/60 transition-colors cursor-pointer flex items-center gap-1"
                    title="Delete Story"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reusable Pagination Controls */}
      <div className="pt-6">
        <Pagination
          id="stories-pagination"
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
