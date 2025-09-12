"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { AREAS, ORGANIZER_TYPES, CONTEST_CATEGORIES, GRANT_CATEGORIES, NEWS_TYPES, KNOWLEDGE_CATEGORIES } from "@/lib/constants";
import CustomSelect from "./custom-select";

interface FilterProps {
  type: "contest" | "event" | "grant" | "news" | "knowledge" | "facility" | "open-call";
  filters: {
    area?: string;
    organizerType?: string;
    category?: string;
    openCallType?: string;
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
      case "open-call":
        return [];
      default:
        return [];
    }
  };

  const clearFilters = () => {
    onFilterChange({
      area: undefined,
      organizerType: undefined,
      category: undefined,
      openCallType: undefined,
      tags: [],
    });
  };

  const hasActiveFilters = filters.area || filters.organizerType || filters.category || filters.openCallType || (filters.tags && filters.tags.length > 0);

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
        <div className="flex-shrink-0 w-48">
          <CustomSelect
            options={[
              { value: "", label: "エリア" },
              ...AREAS.map(area => ({ value: area, label: area }))
            ]}
            value={filters.area || ""}
            onChange={(value) => onFilterChange({ ...filters, area: value || undefined })}
            placeholder="エリア"
          />
        </div>

        {/* 主催者タイプフィルター */}
        <div className="flex-shrink-0 w-48">
          <CustomSelect
            options={[
              { value: "", label: "主催者" },
              ...ORGANIZER_TYPES.map(type => ({ value: type.value, label: type.label }))
            ]}
            value={filters.organizerType || ""}
            onChange={(value) => onFilterChange({ ...filters, organizerType: value || undefined })}
            placeholder="主催者"
          />
        </div>

        {/* カテゴリフィルター */}
        {getCategoryOptions().length > 0 && (
          <div className="flex-shrink-0 w-48">
            <CustomSelect
              options={[
                { value: "", label: type === "open-call" ? "公募タイプ" : "カテゴリ" },
                ...getCategoryOptions().map(category => ({ value: category.value, label: category.label }))
              ]}
              value={type === "open-call" ? (filters.openCallType || "") : (filters.category || "")}
              onChange={(value) => onFilterChange({ 
                ...filters, 
                [type === "open-call" ? "openCallType" : "category"]: value || undefined 
              })}
              placeholder={type === "open-call" ? "公募タイプ" : "カテゴリ"}
            />
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
            {(filters.category || filters.openCallType) && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                {getCategoryOptions().find(c => c.value === (filters.category || filters.openCallType))?.label}
                <button
                  onClick={() => onFilterChange({ 
                    ...filters, 
                    [type === "open-call" ? "openCallType" : "category"]: undefined 
                  })}
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
