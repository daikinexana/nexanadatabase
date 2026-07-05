"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  limit: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  limit,
}: PaginationProps) {
  // 表示するページ番号を計算
  const getVisiblePages = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="border-t border-neutral-200 pt-6">
      {/* ページ情報 */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
        <div className="tnum text-xs sm:text-sm text-neutral-500 text-center sm:text-left">
          <span className="font-semibold text-neutral-900">
            {startItem.toLocaleString()}
          </span>
          {" – "}
          <span className="font-semibold text-neutral-900">
            {endItem.toLocaleString()}
          </span>
          {" / "}
          <span className="font-semibold text-neutral-900">
            {totalCount.toLocaleString()}
          </span>
          {" 件"}
        </div>
        <div className="tnum text-[11px] sm:text-xs text-neutral-500">
          ページ {currentPage} / {totalPages}
        </div>
      </div>

      {/* ページネーション - iPhone 16最適化（タッチターゲット44x44px以上） */}
      <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 flex-wrap gap-2 sm:gap-0">
        {/* 前のページボタン */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-neutral-200 disabled:hover:text-neutral-600 transition-all duration-200 touch-manipulation"
          aria-label="前のページ"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* ページ番号 */}
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <div
                key={`dots-${index}`}
                className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`tnum flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border transition-all duration-200 font-semibold text-xs sm:text-sm md:text-base touch-manipulation ${
                isActive
                  ? "bg-neutral-900 border-neutral-900 text-white active:scale-95"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 active:scale-95"
              }`}
              aria-label={`ページ ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* 次のページボタン */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-neutral-200 disabled:hover:text-neutral-600 transition-all duration-200 touch-manipulation"
          aria-label="次のページ"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* ページジャンプ（モバイルでは非表示） */}
      <div className="hidden sm:flex items-center justify-center mt-3 sm:mt-4 space-x-2">
        <span className="text-xs sm:text-sm text-neutral-500">ページジャンプ:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="tnum w-16 sm:w-20 px-2 py-1.5 sm:py-2 text-xs sm:text-sm border border-neutral-300 rounded-full bg-white text-center focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 min-h-[44px]"
        />
      </div>
    </div>
  );
}
