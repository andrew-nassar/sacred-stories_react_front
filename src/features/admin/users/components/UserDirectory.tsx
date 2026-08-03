/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  ShieldCheck, 
  X, 
  Mail, 
  Calendar, 
  Lock, 
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';
import { PortalUser } from '../types';
import Pagination from '../../shared/components/Pagination';

interface UserDirectoryProps {
  users: PortalUser[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  selectedUser: PortalUser | null;
  onSelectUser: (id: string | null) => void;
  onUpdateUser: (updatedUser: PortalUser) => void;
  onDeleteUser: (userId: string) => void;

  // Pagination State
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isTableLoading: boolean;
}

export default function UserDirectory({
  users,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  selectedUser,
  onSelectUser,
  onUpdateUser,
  onDeleteUser,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  isTableLoading
}: UserDirectoryProps) {
  const availablePermissions = [
    'Create Entry',
    'Edit Entry',
    'Review Queue',
    'Manage Users',
    'Access Settings',
    'Publish Own Drafts',
    'Upload Assets',
    'Edit Metadata'
  ];

  // Handle permission toggle
  const handleTogglePermission = (permission: string) => {
    if (!selectedUser) return;
    
    let updatedPermissions = [...selectedUser.permissions];
    if (updatedPermissions.includes(permission)) {
      updatedPermissions = updatedPermissions.filter(p => p !== permission);
    } else {
      updatedPermissions.push(permission);
    }

    const updated = { ...selectedUser, permissions: updatedPermissions };
    onUpdateUser(updated);
  };

  // Handle status toggle
  const handleStatusChange = (status: 'Active' | 'Inactive' | 'Pending') => {
    if (!selectedUser) return;
    const updated = { ...selectedUser, status };
    onUpdateUser(updated);
  };

  // Handle verified toggle
  const handleToggleVerified = () => {
    if (!selectedUser) return;
    const updated = { ...selectedUser, verified: !selectedUser.verified };
    onUpdateUser(updated);
  };

  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} className="text-stone-300 group-hover:text-stone-500 transition-colors" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp size={14} className="text-amber-700" />
      : <ArrowDown size={14} className="text-amber-700" />;
  };

  return (
    <div id="users-container" className="flex-1 overflow-hidden flex relative bg-[#FAF9F5]/30">
      {/* Primary Directory List (Left/Main Side) */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 h-full flex flex-col">
        {/* Page Header */}
        <div id="users-header" className="border-b border-stone-200 pb-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <UsersIcon size={32} className="text-amber-600" />
              <span>User Directory</span>
            </h2>
            <p className="text-stone-500 text-sm mt-1">Audit permissions and manage status for hagiographical curators and scribes.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div id="users-search" className="bg-white border border-stone-200 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                <Search size={18} />
              </span>
              <input
                id="user-search-input"
                type="text"
                placeholder="Search user profiles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-10 pr-4 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            {/* Role Filter Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-stone-400 shrink-0" />
              <select
                id="user-status-filter"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full sm:w-auto bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Archivist">Archivist</option>
                <option value="Contributor">Contributor</option>
                <option value="Theologian">Theologian</option>
                <option value="Chief Editor">Chief Editor</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-stone-400 font-semibold select-none shrink-0">
            {totalItems} USERS MATCHED
          </div>
        </div>

        {/* Directory Table */}
        <div id="users-table-card" className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px] relative">
          {isTableLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-stone-50 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-b border-stone-100 select-none">
                  <th 
                    className="py-4 px-6 cursor-pointer hover:bg-stone-100/50 transition-colors group"
                    onClick={() => onSortChange('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Name</span>
                      {renderSortIndicator('name')}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 cursor-pointer hover:bg-stone-100/50 transition-colors group"
                    onClick={() => onSortChange('email')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Email</span>
                      {renderSortIndicator('email')}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 cursor-pointer hover:bg-stone-100/50 transition-colors group"
                    onClick={() => onSortChange('role')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role</span>
                      {renderSortIndicator('role')}
                    </div>
                  </th>
                  <th className="py-4 px-6">Email Confirmed</th>
                  <th className="py-4 px-6">Member Since</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm text-stone-600">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400 italic font-serif">
                      No user records found matching your query.
                    </td>
                  </tr>
                ) : (
                  users.map((usr) => {
                    const isConfirmed = usr.isEmailConfirmed ?? usr.verified ?? false;
                    const dateRaw = usr.memberSince || usr.joinDate;
                    let formattedDate = 'N/A';
                    if (dateRaw) {
                      try {
                        const d = new Date(dateRaw);
                        formattedDate = isNaN(d.getTime()) ? String(dateRaw) : d.toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        });
                      } catch {
                        formattedDate = String(dateRaw);
                      }
                    }

                    return (
                      <tr 
                        id={`user-row-${usr.id}`}
                        key={usr.id} 
                        onClick={() => onSelectUser(usr.id)}
                        className={`hover:bg-amber-500/5 cursor-pointer transition-colors ${
                          selectedUser?.id === usr.id ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={usr.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(usr.name)}&background=d97706&color=fff`} 
                              alt={usr.name}
                              className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-serif font-bold text-stone-900 text-base">{usr.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-stone-600 font-medium">{usr.email}</td>
                        <td className="py-4 px-6">
                          <span className="bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-stone-200 inline-block">
                            {usr.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {isConfirmed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full select-none">
                              <span>✔ Confirmed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-full select-none">
                              <span>✖ Not Confirmed</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-stone-600 text-xs font-medium">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            id={`btn-view-${usr.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectUser(usr.id);
                            }}
                            className="text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reusable Pagination Controls - hidden when empty */}
        {users.length > 0 && (
          <div className="shrink-0 pt-4">
            <Pagination
              id="users-pagination"
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isTableLoading}
            />
          </div>
        )}
      </div>

      {/* Slide-out Profile Details Drawer (Right Side) */}
      {selectedUser && (
        <div 
          id="user-drawer"
          className="w-96 bg-white border-l border-stone-200 shadow-2xl h-full flex flex-col justify-between overflow-y-auto shrink-0 relative z-10 animate-in slide-in-from-right duration-200"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-800">User Profile Details</h3>
            <button 
              id="btn-close-drawer"
              onClick={() => onSelectUser(null)}
              className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Main Avatar / Name section */}
            <div className="text-center flex flex-col items-center gap-3">
              <div className="relative">
                <img 
                  src={selectedUser.avatarUrl} 
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-amber-600 shadow-md"
                  referrerPolicy="no-referrer"
                />
                {selectedUser.verified && (
                  <span className="absolute bottom-1 right-1 bg-amber-500 text-white p-1 rounded-full shadow-md">
                    <ShieldCheck size={16} />
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-serif text-xl font-bold text-stone-950">{selectedUser.name}</h4>
                <p className="text-xs uppercase tracking-widest font-bold text-amber-700">{selectedUser.role}</p>
              </div>
            </div>

            {/* Account Metadata Cards */}
            <div className="space-y-3">
              <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg flex items-center gap-3">
                <Mail size={16} className="text-stone-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Email Address</p>
                  <p className="text-xs font-semibold text-stone-800 truncate">{selectedUser.email}</p>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-100 p-3 rounded-lg flex items-center gap-3">
                <Calendar size={16} className="text-stone-400" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Commission Date</p>
                  <p className="text-xs font-semibold text-stone-800">{selectedUser.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Verification Status Setting */}
            <div className="border border-stone-200 rounded-xl p-4 space-y-3 bg-white">
              <h5 className="font-serif font-bold text-stone-800 text-sm">Account Status</h5>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs text-stone-400 font-semibold">ROLE ACCESS LEVEL</label>
                <select
                  id="drawer-status-select"
                  value={selectedUser.status}
                  onChange={(e) => handleStatusChange(e.target.value as 'Active' | 'Inactive' | 'Pending')}
                  className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Active">Active Curator</option>
                  <option value="Pending">Pending Validation</option>
                  <option value="Inactive">Deactivated</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div>
                  <p className="text-xs font-bold text-stone-800">Verified Archivist</p>
                  <p className="text-[10px] text-stone-400">Verifiable liturgical credentials</p>
                </div>
                <input 
                  id="drawer-verified-toggle"
                  type="checkbox"
                  checked={selectedUser.verified}
                  onChange={handleToggleVerified}
                  className="w-4 h-4 rounded text-amber-600 border-stone-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Permissions list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="font-serif font-bold text-stone-800 text-sm flex items-center gap-1.5">
                  <Lock size={15} className="text-amber-600" />
                  <span>Curator Permissions</span>
                </h5>
                <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded">
                  {selectedUser.permissions.length} active
                </span>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 bg-white">
                {availablePermissions.map((permission) => {
                  const hasPermission = selectedUser.permissions.includes(permission);
                  return (
                    <label 
                      key={permission} 
                      className="flex items-center justify-between p-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors select-none"
                    >
                      <span className="text-stone-700 font-medium">{permission}</span>
                      <input 
                        type="checkbox"
                        checked={hasPermission}
                        onChange={() => handleTogglePermission(permission)}
                        className="w-4 h-4 rounded text-amber-600 border-stone-300 focus:ring-amber-500 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer Footer - Danger Zone */}
          <div className="p-6 border-t border-stone-100 bg-red-50/20 space-y-4">
            <h5 className="text-[10px] font-bold text-red-700 uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle size={12} />
              <span>Danger Zone</span>
            </h5>
            <button
              id="btn-delete-user"
              onClick={() => {
                if (window.confirm(`Are you absolutely sure you want to completely remove ${selectedUser.name} from the portal? This action is permanent and irreversible.`)) {
                  onDeleteUser(selectedUser.id);
                }
              }}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Purge Curator Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
