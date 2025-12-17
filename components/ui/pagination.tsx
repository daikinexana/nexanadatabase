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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 md:p-6">
      {/* ページ情報 - iPhone 16最適化 */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-0">
        <div className="text-xs sm:text-sm md:text-base text-gray-600 font-news text-center sm:text-left">
          <span className="font-news-subheading text-gray-900">
            {startItem.toLocaleString()}
          </span>
          {" - "}
          <span className="font-news-subheading text-gray-900">
            {endItem.toLocaleString()}
          </span>
          {" / "}
          <span className="font-news-subheading text-gray-900">
            {totalCount.toLocaleString()}
          </span>
          {" 件"}
        </div>
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 bg-gray-50/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
          ページ {currentPage} / {totalPages}
        </div>
      </div>

      {/* ページネーション - iPhone 16最適化（タッチターゲット44x44px以上） */}
      <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 flex-wrap gap-2 sm:gap-0">
        {/* 前のページボタン */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 active:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/50 disabled:hover:border-gray-200/50 disabled:hover:text-gray-600 disabled:active:bg-white/50 transition-all duration-200 touch-manipulation"
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
              className={`flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg border transition-all duration-200 font-news-subheading text-xs sm:text-sm md:text-base touch-manipulation ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-500 text-white shadow-lg active:scale-95"
                  : "border-gray-200/50 bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 active:bg-emerald-100 active:scale-95"
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
          className="flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg border border-gray-200/50 bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 active:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/50 disabled:hover:border-gray-200/50 disabled:hover:text-gray-600 disabled:active:bg-white/50 transition-all duration-200 touch-manipulation"
          aria-label="次のページ"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* ページジャンプ（モバイルでは非表示） */}
      <div className="hidden sm:flex items-center justify-center mt-3 sm:mt-4 space-x-2">
        <span className="text-xs sm:text-sm text-gray-500">ページジャンプ:</span>
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
          className="w-16 sm:w-20 px-2 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200/50 rounded bg-white/50 backdrop-blur-sm text-center focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px]"
        />
      </div>
    </div>
  );
}
