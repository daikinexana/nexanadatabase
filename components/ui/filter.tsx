"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { AREAS, ORGANIZER_TYPES, CONTEST_CATEGORIES, GRANT_CATEGORIES, NEWS_TYPES, KNOWLEDGE_CATEGORIES } from "@/lib/constants";

interface FilterProps {
  type: "contest" | "event" | "grant" | "news" | "knowledge" | "facility";
  filters: {
    area?: string;
    organizerType?: string;
    category?: string;
    tags?: string[];
  };
  onFilterChange: (filters: any) => void;
}

export default function Filter({ type, filters, onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryOptions = () => {
    switch (type) {
      case "contest":
        return CONTEST_CATEGORIES;
      case "grant":
        return GRANT_CATEGORIES;
      case "news":
        return NEWS_TYPES;
      case "knowledge":
        return KNOWLEDGE_CATEGORIES;
      default:
        return [];
    }
  };

  const clearFilters = () => {
    onFilterChange({
      area: undefined,
      organizerType: undefined,
      category: undefined,
      tags: [],
    });
  };

  const hasActiveFilters = filters.area || filters.organizerType || filters.category || (filters.tags && filters.tags.length > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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

      {/* 横並びフィルター */}
      <div className="flex flex-wrap gap-3">
        {/* エリアフィルター */}
        <div className="flex-shrink-0">
          <select
            value={filters.area || ""}
            onChange={(e) => onFilterChange({ ...filters, area: e.target.value || undefined })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors"
          >
            <option value="">エリア</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* 主催者タイプフィルター */}
        <div className="flex-shrink-0">
          <select
            value={filters.organizerType || ""}
            onChange={(e) => onFilterChange({ ...filters, organizerType: e.target.value || undefined })}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors"
          >
            <option value="">主催者</option>
            {ORGANIZER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* カテゴリフィルター */}
        {getCategoryOptions().length > 0 && (
          <div className="flex-shrink-0">
            <select
              value={filters.category || ""}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors"
            >
              <option value="">カテゴリ</option>
              {getCategoryOptions().map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* アクティブフィルター表示 */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.area && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                {filters.area}
                <button
                  onClick={() => onFilterChange({ ...filters, area: undefined })}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.organizerType && (
              <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                {ORGANIZER_TYPES.find(t => t.value === filters.organizerType)?.label}
                <button
                  onClick={() => onFilterChange({ ...filters, organizerType: undefined })}
                  className="ml-1 text-green-500 hover:text-green-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                {getCategoryOptions().find(c => c.value === filters.category)?.label}
                <button
                  onClick={() => onFilterChange({ ...filters, category: undefined })}
                  className="ml-1 text-purple-500 hover:text-purple-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200"
              >
                #{tag}
                <button
                  onClick={() => {
                    const newTags = filters.tags?.filter((_, i) => i !== index);
                    onFilterChange({ ...filters, tags: newTags });
                  }}
                  className="ml-1 text-orange-500 hover:text-orange-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
