/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useUsers } from '../hooks/useUsers';
import UserDirectory from '../components/UserDirectory';

export default function UserDirectoryPage() {
  const {
    users,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    handleSortChange,
    selectedUser,
    setSelectedUserId,
    handleUpdateUser,
    handleDeleteUser,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    onPageChange,
    onPageSizeChange
  } = useUsers();

  if (loading && users.length === 0) {
    return (
      <div id="users-loading" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-stone-600">Accessing Scribes Registry...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="users-error" className="flex-1 flex flex-col items-center justify-center p-8 bg-[#FAF9F5]/30">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-600 font-bold">✙ Directory Connection Error</p>
          <p className="text-stone-500 text-xs leading-normal">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <UserDirectory
      users={users}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={handleSortChange}
      selectedUser={selectedUser}
      onSelectUser={setSelectedUserId}
      onUpdateUser={handleUpdateUser}
      onDeleteUser={handleDeleteUser}
      currentPage={currentPage}
      pageSize={pageSize}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      isTableLoading={loading}
    />
  );
}
