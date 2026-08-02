import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Helper to generate page numbers with ellipsis
 */
function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  loading = false,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Hide pagination if no items exist or only 1 page with totalItems = 0
  if (totalItems <= 0) {
    return null;
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePrev = () => {
    if (!isFirstPage && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div
      className={`glass-panel border border-white/10 rounded-xl px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none ${className}`}
    >
      {/* Item range & Page Size selector (Desktop/Tablet) */}
      <div className="flex items-center gap-4 text-xs font-mono text-white/60 order-2 sm:order-1">
        <span>
          Showing <strong className="text-white font-medium">{startItem}–{endItem}</strong> of{" "}
          <strong className="text-gold-accent font-medium">{totalItems}</strong> items
        </span>

        {onPageSizeChange && pageSizeOptions.length > 0 && (
          <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-4">
            <span className="text-white/40">Per page:</span>
            <select
              value={pageSize}
              disabled={loading}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-gold-accent/50 cursor-pointer disabled:opacity-50"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option} className="bg-canvas text-white">
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading && (
          <span className="inline-flex items-center gap-1.5 text-gold-accent">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden lg:inline text-[10px] uppercase tracking-wider">Loading...</span>
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={isFirstPage || loading}
          className="flex items-center justify-center gap-1 min-h-[40px] min-w-[40px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-gold-accent hover:bg-white/10 hover:border-gold-accent/30 disabled:opacity-30 disabled:hover:text-white/80 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all duration-200 text-xs font-mono tracking-wider"
          aria-label="Previous Page"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (typeof page === "string") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-white/30 text-xs font-mono">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => !isActive && !loading && onPageChange(page)}
                disabled={loading}
                className={`min-h-[36px] min-w-[36px] px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                  isActive
                    ? "bg-gold-accent/20 border border-gold-accent/50 text-gold-accent font-semibold shadow-sm"
                    : "bg-white/5 border border-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20"
                } disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Mobile Page Indicator */}
        <div className="flex sm:hidden items-center justify-center font-mono text-xs text-white/80 px-2">
          <span>
            Page <strong className="text-gold-accent">{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isLastPage || loading}
          className="flex items-center justify-center gap-1 min-h-[40px] min-w-[40px] px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-gold-accent hover:bg-white/10 hover:border-gold-accent/30 disabled:opacity-30 disabled:hover:text-white/80 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all duration-200 text-xs font-mono tracking-wider"
          aria-label="Next Page"
          title="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
