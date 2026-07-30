/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStories } from '../hooks/useStories';
import ArchiveList from '../components/ArchiveList';
import ImmersivePreview from '../components/ImmersivePreview';
import { Sliders } from 'lucide-react';

export default function ArchivePage() {
  const {
    stories,
    categories,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    sortOrder,
    handleSortChange,
    activeStoryId,
    setActiveStoryId,
    activeStory,
    handleDeleteStory,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    onPageChange,
    onPageSizeChange
  } = useStories();

  if (loading && stories.length === 0) {
    return (
      <div id="archive-loading" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-stone-600">Accessing Historical Records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="archive-error" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-600 font-bold">✙ Error Loading Archive</p>
          <p className="text-stone-500 text-xs leading-normal">{error}</p>
        </div>
      </div>
    );
  }

  if (activeStory) {
    return (
      <ImmersivePreview
        story={activeStory}
        onGoBack={() => setActiveStoryId(null)}
      />
    );
  }

  return (
    <ArchiveList
      stories={stories}
      categories={categories}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={(field, order) => {
        handleSortChange(field, order);
      }}
      onSelectStory={setActiveStoryId}
      onDeleteStory={handleDeleteStory}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      isLoading={loading}
    />
  );
}
