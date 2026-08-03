/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePendingReviews } from '../hooks/usePendingReviews';
import PendingReviews from '../components/PendingReviews';
import StoryReview from '../components/StoryReview';

export default function PendingReviewsPage() {
  const {
    pendingStories,
    loading,
    error,
    setActiveReviewId,
    activeReviewStory,
    loadingDetails,
    handleApprove,
    handleReject,
    handleRequestRevisions,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    onPageChange,
    onPageSizeChange
  } = usePendingReviews();

  if (loadingDetails) {
    return (
      <div id="pending-details-loading" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-stone-600">Retrieving Sacred Story Details...</span>
        </div>
      </div>
    );
  }

  if (loading && pendingStories.length === 0) {
    return (
      <div id="pending-loading" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-stone-600">Retrieving Editorial Queue...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="pending-error" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-600 font-bold">✙ Editorial Queue Error</p>
          <p className="text-stone-500 text-xs leading-normal">{error}</p>
        </div>
      </div>
    );
  }

  if (activeReviewStory) {
    return (
      <StoryReview
        story={activeReviewStory}
        onGoBack={() => setActiveReviewId(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestRevisions={handleRequestRevisions}
      />
    );
  }

  return (
    <PendingReviews
      stories={pendingStories}
      onReviewStory={setActiveReviewId}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      categories={categories}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      isLoading={loading}
    />
  );
}
