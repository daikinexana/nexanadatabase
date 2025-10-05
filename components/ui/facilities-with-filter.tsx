"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FacilitiesHybridDisplay from "./facilities-hybrid-display";
import { Search } from "lucide-react";

interface Facility {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  facilityInfo?: string;
  program?: string;
  targetArea?: string;
  targetAudience?: string;
  isDropinAvailable: boolean;
  isNexanaAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FacilitiesWithFilterProps {
  initialFacilities: Facility[];
  japanAreas: string[];
  overseasAreas: string[];
}

export default function FacilitiesWithFilter({
  initialFacilities,
  japanAreas,
  overseasAreas,
}: FacilitiesWithFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // 検索処理（デバウンス付き）
  useEffect(() => {
    // 前のタイムアウトをクリア
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }

    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        try {
          const params = new URLSearchParams();
          params.set("search", searchQuery);
          
          const response = await fetch(`/api/facilities?${params.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setFacilities(data);
          } else {
            console.error("Search failed:", response.status);
            // エラー時は初期データに戻す
            setFacilities(initialFacilities);
          }
        } catch (error) {
          console.error("Error searching facilities:", error);
          // エラー時は初期データに戻す
          setFacilities(initialFacilities);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFacilities(initialFacilities);
      }
    }, 500); // 500msのデバウンス

    setSearchTimeoutId(timeoutId);

    return () => {
      clearTimeout(timeoutId);
      setSearchTimeoutId(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, initialFacilities]);

  // URL更新
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/facilities${newUrl}`, { scroll: false });
  }, [searchQuery, router, searchParams]);

  // 全エリアの順序（日本国内 + 海外）
  const allAreaOrder = useMemo(() => [...japanAreas, ...overseasAreas], [japanAreas, overseasAreas]);

  // エリアの順序を取得する関数
  const getAreaOrder = useCallback((area: string | undefined) => {
    if (!area) return 999; // エリアが未設定の場合は最後に配置
    const index = allAreaOrder.indexOf(area);
    return index === -1 ? 999 : index;
  }, [allAreaOrder]);

  // ソート処理
  const sortedFacilities = useMemo(() => {
    return facilities.sort((a, b) => {
      const aOrder = getAreaOrder(a.area);
      const bOrder = getAreaOrder(b.area);

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      // 同じエリア内では作成日時の降順（新しい順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [facilities, getAreaOrder]);

  return (
    <>
      {/* 検索バー */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="企業、行政、大学、VC、ドロップイン、Nexana、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                // 入力中はローディング状態を解除
                if (isLoading) {
                  setIsLoading(false);
                }
              }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            💡 検索例: 「企業」「行政」「大学」「VC」「ドロップイン」「Nexana」「東京都」「大阪府」など
            {isLoading && <span className="ml-2 text-blue-600">検索中...</span>}
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <p className="text-gray-600 font-news">
            <span className="font-news-subheading text-gray-900">{sortedFacilities.length}</span>件の施設が見つかりました
          </p>
          <div className="text-sm text-gray-500">
            現在利用可能な施設のみ表示
          </div>
        </div>
      </div>

      {/* 施設カード一覧 - ハイブリッド表示 */}
      {sortedFacilities.length > 0 ? (
        <FacilitiesHybridDisplay
          japanAreas={japanAreas}
          overseasAreas={overseasAreas}
          filteredFacilities={sortedFacilities}
        />
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-news-heading text-gray-900 mb-2">
              該当する施設が見つかりませんでした
            </h3>
            <p className="text-gray-600 font-news">
              検索条件を変更して再度お試しください
            </p>
          </div>
        </div>
      )}
    </>
  );
}
