/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Activity, 
  Plus, 
  CheckSquare, 
  ChevronRight,
  Database,
  Cpu,
  Quote
} from 'lucide-react';
import { SacredStory, PortalUser, DashboardMetrics } from '../types';
import Pagination from '../../shared/components/Pagination';

interface DashboardProps {
  stories: SacredStory[];
  users: PortalUser[];
  metrics: DashboardMetrics;
  onNavigate: (view: string) => void;
  onReviewStory: (storyId: string) => void;
  currentPage: number;
  pageSize: number;
  totalPendingItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Dashboard({ 
  stories, 
  users, 
  metrics, 
  onNavigate, 
  onReviewStory,
  currentPage,
  pageSize,
  totalPendingItems,
  totalPages,
  onPageChange
}: DashboardProps) {
  const stats = [
    { id: 'stat-total', label: 'Total Stories', value: metrics.totalStoriesCount.toLocaleString(), icon: FileText, color: 'text-stone-700 bg-stone-100/50' },
    { id: 'stat-pub', label: 'Published', value: metrics.publishedCount.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
    { id: 'stat-pend', label: 'Pending Queue', value: metrics.pendingCount, icon: Clock, color: 'text-amber-700 bg-amber-50' },
    { id: 'stat-rej', label: 'Rejected', value: metrics.rejectedCount, icon: AlertTriangle, color: 'text-red-700 bg-red-50' },
    { id: 'stat-users', label: 'Total Users', value: metrics.totalUsersCount.toLocaleString(), icon: Users, color: 'text-blue-700 bg-blue-50' },
  ];

  return (
    <div id="dashboard-container" className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAF9F5]/30">
      {/* Dashboard Header */}
      <div id="dashboard-header" className="flex justify-between items-center border-b border-stone-200 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">Sanctuary Overview</h2>
          <p className="text-stone-500 text-sm mt-1">Real-time status of the hagiographical archive and editorial pipelines.</p>
        </div>
        <div className="flex gap-3">
          <button
            id="btn-quick-create"
            onClick={() => onNavigate('creator')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div id="stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 select-none">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              id={stat.id}
              key={stat.id} 
              className="bg-white border border-stone-200 p-6 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{stat.label}</p>
                <p className="text-2xl font-serif font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div id="dashboard-content-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Pending Table */}
        <div id="pending-queue-card" className="bg-white border border-stone-200 rounded-xl shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50 select-none">
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              <span>Pending Review Queue</span>
            </h3>
            <button 
              id="btn-view-all-pending"
              onClick={() => onNavigate('pending')}
              className="text-amber-700 hover:text-amber-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {stories.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm italic">
                No stories pending in the review queue.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/30 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-b border-stone-100">
                    <th className="py-3 px-6">Sacred Name</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Submitted By</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm text-stone-600">
                  {stories.map((story) => (
                    <tr key={story.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="py-4 px-6 font-serif font-semibold text-stone-800">{story.sacredName}</td>
                      <td className="py-4 px-6">
                        <span className="bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded">
                          {story.devotionalCategory}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-stone-500">{story.submittedBy}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          id={`btn-review-${story.id}`}
                          onClick={() => onReviewStory(story.id)}
                          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Dashboard Queue Pagination */}
          {totalPendingItems > 0 && (
            <div className="p-4 border-t border-stone-100 bg-stone-50/50">
              <Pagination
                id="dashboard-pending-pagination"
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={totalPendingItems}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPageSizeChange={() => {}} // No resizing on dashboard card to keep UI dense and predictable
                showRowsPerPage={false} // Custom parameter in pagination component to hide rows per page selection inside dashboard widgets
              />
            </div>
          )}
        </div>

        {/* Sidebar Widgets */}
        <div id="dashboard-sidebar-widgets" className="space-y-6">
          {/* Quick Actions */}
          <div id="quick-actions-card" className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2 select-none">
              <Activity size={18} className="text-amber-600" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                id="qa-new-story"
                onClick={() => onNavigate('creator')}
                className="w-full text-left bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-500/30 rounded-lg p-3 flex items-center gap-3 transition-all group cursor-pointer"
              >
                <div className="p-2 bg-white rounded-md border border-stone-200 group-hover:border-amber-500/20 text-stone-500 group-hover:text-amber-700 transition-colors">
                  <Plus size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-amber-900">Create New Story</p>
                  <p className="text-[11px] text-stone-400">Launch step-by-step archivist guide</p>
                </div>
              </button>

              <button
                id="qa-review-queue"
                onClick={() => onNavigate('pending')}
                className="w-full text-left bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-500/30 rounded-lg p-3 flex items-center gap-3 transition-all group cursor-pointer"
              >
                <div className="p-2 bg-white rounded-md border border-stone-200 group-hover:border-amber-500/20 text-stone-500 group-hover:text-amber-700 transition-colors">
                  <CheckSquare size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-amber-900">Review Queue</p>
                  <p className="text-[11px] text-stone-400">Approve pending hagiographies</p>
                </div>
              </button>

              <button
                id="qa-manage-users"
                onClick={() => onNavigate('users')}
                className="w-full text-left bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-500/30 rounded-lg p-3 flex items-center gap-3 transition-all group cursor-pointer"
              >
                <div className="p-2 bg-white rounded-md border border-stone-200 group-hover:border-amber-500/20 text-stone-500 group-hover:text-amber-700 transition-colors">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-700 group-hover:text-amber-900">User Directory</p>
                  <p className="text-[11px] text-stone-400">Manage archivist permissions</p>
                </div>
              </button>
            </div>
          </div>

          {/* Activity Feed */}
          <div id="activity-feed-card" className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2 select-none">
              <Activity size={18} className="text-amber-600" />
              <span>Activity Log</span>
            </h3>
            <div className="space-y-4">
              {metrics.recentActivity.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs leading-normal">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-stone-700 font-medium">{act.text}</p>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Server Health & Storage */}
          <div id="sanctuary-health-card" className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-800 flex items-center gap-2 select-none">
              <Database size={18} className="text-amber-600" />
              <span>Sanctuary Health</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 flex flex-col items-center justify-center">
                <Cpu size={16} className="text-stone-400 mb-1" />
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Latency</span>
                <span className="text-base font-bold text-stone-800 mt-0.5">12ms</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 flex flex-col items-center justify-center">
                <Database size={16} className="text-stone-400 mb-1" />
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Storage</span>
                <span className="text-base font-bold text-stone-800 mt-0.5">2.4 / 10 TB</span>
              </div>
            </div>
          </div>

          {/* Inspiration Quote */}
          <div id="inspiration-quote-card" className="bg-amber-50/50 border border-amber-600/10 rounded-xl p-6 shadow-sm text-center relative overflow-hidden select-none">
            <Quote size={40} className="absolute -right-2 -bottom-2 text-amber-600/5 rotate-12" />
            <Quote size={20} className="text-amber-600/30 mx-auto mb-3" />
            <p className="font-serif italic text-stone-600 text-sm leading-relaxed">
              "The beautiful thing about historical memory is that it stores the sacred where moth and rust cannot destroy."
            </p>
            <span className="text-[10px] uppercase font-bold text-amber-800/60 block mt-3 tracking-widest">— Archivist Maxim</span>
          </div>
        </div>
      </div>
    </div>
  );
}
