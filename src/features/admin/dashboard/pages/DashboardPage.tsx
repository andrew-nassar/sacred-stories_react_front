/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import Dashboard from '../components/Dashboard';

interface DashboardPageProps {
  onNavigate: (view: string) => void;
  onReviewStory: (storyId: string) => void;
}

export default function DashboardPage({ onNavigate, onReviewStory }: DashboardPageProps) {
  const { 
    stories, 
    users, 
    metrics, 
    loading, 
    error,
    currentPage,
    pageSize,
    totalPendingItems,
    totalPages,
    onPageChange
  } = useDashboard();

  if (loading) {
    return (
      <div id="dashboard-loading" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-stone-600">Syncing Sanctuary Telemetry...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard-error" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-600 font-bold">✙ Telemetry Error</p>
          <p className="text-stone-500 text-xs leading-normal">{error}</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <Dashboard
      stories={stories}
      users={users}
      metrics={metrics}
      onNavigate={onNavigate}
      onReviewStory={onReviewStory}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPendingItems={totalPendingItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
