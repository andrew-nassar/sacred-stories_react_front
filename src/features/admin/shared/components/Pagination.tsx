/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  id?: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  showRowsPerPage?: boolean;
}

export default function Pagination({
  id = 'shared-pagination',
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  showRowsPerPage = true
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    // Double check bounds
    start = Math.max(1, start);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div 
      id={id} 
      className="bg-white border border-stone-200 px-6 py-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 select-none"
    >
      {/* Left side: record counter */}
      <div className="text-xs text-stone-500 font-semibold flex items-center gap-2">
        <span>Showing {startItem}–{endItem} of {totalItems} records</span>
        {isLoading && (
          <span className="inline-block w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin ml-1" />
        )}
      </div>

      {/* Middle: pagination controls */}
      <div className="flex items-center gap-1.5">
        <button
          id={`${id}-btn-first`}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          id={`${id}-btn-prev`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <button
              id={`${id}-btn-page-${p}`}
              key={p}
              onClick={() => onPageChange(p)}
              disabled={isLoading}
              className={`min-w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                currentPage === p
                  ? 'bg-amber-600 text-white font-black shadow-sm'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950 border border-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          id={`${id}-btn-next`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
        <button
          id={`${id}-btn-last`}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0 || isLoading}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {/* Right side: rows per page */}
      {showRowsPerPage && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400 font-semibold">Rows per page:</span>
          <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
            {[10, 20, 50, 100].map((size) => (
              <button
                id={`${id}-btn-size-${size}`}
                key={size}
                onClick={() => onPageSizeChange(size)}
                disabled={isLoading}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  pageSize === size
                    ? 'bg-white text-amber-800 shadow-sm font-extrabold border border-stone-200/50'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
