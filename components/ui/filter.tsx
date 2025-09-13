"use client";

import React from "react";
import { X } from "lucide-react";
import { AREAS, PREFECTURE_AREAS, NEWS_TYPES } from "@/lib/constants";
import CustomSelect from "./custom-select";

interface FilterProps {
  type: "contest" | "event" | "grant" | "news" | "knowledge" | "facility" | "open-call";
  filters: {
    area?: string;
    organizerType?: string;
    category?: string;
    openCallType?: string;
    categoryTag?: string;
    tags?: string[];
  };
  onFilterChange: (filters: {
    area?: string;
    organizerType?: string;
    category?: string;
    openCallType?: string;
    categoryTag?: string;
    tags?: string[];
  }) => void;
}

export default function Filter({ type, filters, onFilterChange }: FilterProps) {

  const getAreaOptions = () => {
    // コンテスト、施設紹介、展示会、公募は都道府県版を使用
    if (type === "contest" || type === "facility" || type === "event" || type === "open-call") {
      return PREFECTURE_AREAS;
    }
    // ニュース、ナレッジは従来のエリア版を使用
    return AREAS;
  };

  // const getCategoryOptions = () => {
  //   switch (type) {
  //     case "contest":
  //       return CONTEST_CATEGORIES;
  //     case "grant":
  //       return GRANT_CATEGORIES;
  //     case "news":
  //       return NEWS_TYPES;
  //     case "knowledge":
  //       return KNOWLEDGE_CATEGORIES;
  //     case "open-call":
  //       return [];
  //     default:
  //       return [];
  //   }
  // };

  const clearFilters = () => {
    onFilterChange({
      area: undefined,
      category: undefined,
      openCallType: undefined,
      categoryTag: undefined,
      tags: [],
    });
  };

  const hasActiveFilters = filters.area || filters.category || filters.openCallType || filters.categoryTag || (filters.tags && filters.tags.length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">フィルター</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="h-3 w-3" />
            <span>クリア</span>
          </button>
        )}
      </div>

      {/* フィルター */}
      <div className="space-y-4">
        {/* エリアフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">エリア</label>
          <CustomSelect
            options={[
              { value: "", label: "エリアを選択" },
              ...getAreaOptions().map(area => ({ value: area, label: area }))
            ]}
            value={filters.area || ""}
            onChange={(value) => onFilterChange({ ...filters, area: value || undefined })}
            placeholder="エリアを選択"
          />
        </div>

        {/* タイプフィルター（ニュースのみ） */}
        {type === "news" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タイプ</label>
            <CustomSelect
              options={[
                { value: "", label: "タイプを選択" },
                ...NEWS_TYPES.map(newsType => ({ value: newsType.value, label: newsType.label }))
              ]}
              value={filters.category || ""}
              onChange={(value) => onFilterChange({ ...filters, category: value || undefined })}
              placeholder="タイプを選択"
            />
          </div>
        )}

        {/* アクティブフィルター表示 */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">選択中のフィルター</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.area && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                  {filters.area}
                  <button
                    onClick={() => onFilterChange({ ...filters, area: undefined })}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.category && type === "news" && (
                <span className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
                  {NEWS_TYPES.find(c => c.value === filters.category)?.label}
                  <button
                    onClick={() => onFilterChange({ ...filters, category: undefined })}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
