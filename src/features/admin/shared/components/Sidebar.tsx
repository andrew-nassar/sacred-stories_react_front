/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  Users as UsersIcon, 
  PenTool, 
  Settings as SettingsIcon,
  Plus,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { PortalUser } from '../types';
import { AuthService } from '../../../../services/auth.service';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: PortalUser;
  pendingCount: number;
}

export default function Sidebar({ currentView, onNavigate, currentUser, pendingCount }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'archive', label: 'Sacred Stories', icon: BookOpen },
    { 
      id: 'pending', 
      label: 'Pending Reviews', 
      icon: ClipboardCheck,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'creator', label: 'Create Story', icon: PenTool },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside id="sidebar-panel" className="w-64 bg-white border-r border-stone-200 flex flex-col h-full shrink-0">
      {/* Sidebar Header */}
      <div id="sidebar-header" className="p-6 border-b border-stone-100 flex flex-col gap-1 select-none">
        <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-wide flex items-center gap-2">
          <span className="text-amber-600">✙</span> Sacred Stories
        </h1>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-max">
          Curator Portal
        </p>
      </div>

      {/* Primary Actions */}
      <div className="p-4 border-b border-stone-100">
        <button
          id="btn-sidebar-new-entry"
          onClick={() => onNavigate('creator')}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 text-sm select-none"
        >
          <Plus size={16} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav id="sidebar-nav" className="flex-1 py-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id || (item.id === 'creator' && currentView.startsWith('creator'));
          
          return (
            <button
              id={`nav-${item.id}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between py-3 px-6 text-sm transition-all relative select-none ${
                isActive 
                  ? 'text-amber-900 bg-amber-500/5 font-semibold border-l-4 border-amber-600' 
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent size={18} className={isActive ? 'text-amber-700' : 'text-stone-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[1.5rem] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer - Current User Profile */}
      <div id="sidebar-footer" className="p-4 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-amber-600/20"
              referrerPolicy="no-referrer"
            />
            {currentUser.verified && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-sm">
                <ShieldCheck size={10} />
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-stone-800 truncate leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
          <button
            id="btn-sidebar-logout"
            onClick={() => AuthService.logout()}
            title="Logout"
            className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer shrink-0 animate-in fade-in duration-200"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
