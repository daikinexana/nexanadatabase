"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OpenCallsHybridDisplay from "./open-calls-hybrid-display";
// import OpenCallOrganizerButton from "./open-call-organizer-button";
import { Search } from "lucide-react";

interface OpenCall {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  availableResources?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OpenCallsWithFilterProps {
  initialOpenCalls: OpenCall[];
  japanAreas: string[];
  overseasAreas: string[];
}

export default function OpenCallsWithFilter({
  initialOpenCalls,
  japanAreas,
  overseasAreas,
}: OpenCallsWithFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [openCalls, setOpenCalls] = useState<OpenCall[]>(initialOpenCalls);
  const [isLoading, setIsLoading] = useState(false);
  const [showPastOpenCalls, setShowPastOpenCalls] = useState(false);

  // 検索処理（デバウンス付き）
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        try {
          const params = new URLSearchParams();
          params.set("search", searchQuery);
          
          const response = await fetch(`/api/open-calls?${params.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setOpenCalls(data);
          }
        } catch (error) {
          console.error("Error searching open calls:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setOpenCalls(initialOpenCalls);
      }
    }, 300); // 300msのデバウンス

    return () => clearTimeout(timeoutId);
  }, [searchQuery, initialOpenCalls]);

  // URL更新
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/open-calls${newUrl}`, { scroll: false });
  }, [searchQuery, router, searchParams]);

  // フィルタリング処理
  const filteredOpenCalls = useMemo(() => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    oneYearAgo.setMonth(now.getMonth() - 6); // 1年半前

    return openCalls.filter(openCall => {
      if (openCall.deadline) {
        const deadline = new Date(openCall.deadline);
        if (showPastOpenCalls) {
          // 過去1年半分のオープンコールを表示
          return deadline >= oneYearAgo;
        } else {
          // 現在募集中のオープンコールのみ表示
          return deadline >= now;
        }
      }
      return true;
    });
  }, [openCalls, showPastOpenCalls]);

  // 全エリアの順序（日本国内 + 海外）
  const allAreaOrder = useMemo(() => [...japanAreas, ...overseasAreas], [japanAreas, overseasAreas]);

  // エリアの順序を取得する関数
  const getAreaOrder = useCallback((area: string | undefined) => {
    if (!area) return 999; // エリアが未設定の場合は最後に配置
    const index = allAreaOrder.indexOf(area);
    return index === -1 ? 999 : index;
  }, [allAreaOrder]);

  // ソート処理
  const sortedOpenCalls = useMemo(() => {
    return filteredOpenCalls.sort((a, b) => {
      const aOrder = getAreaOrder(a.area);
      const bOrder = getAreaOrder(b.area);

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      // 同じエリア内では締切日でソート（締切日が近い順、締切日未設定は最後）
      const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;

      if (aDeadline !== bDeadline) {
        return aDeadline - bDeadline;
      }

      // 締切日が同じ場合は作成日時の降順（新しい順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredOpenCalls, getAreaOrder]);

  return (
    <>
      {/* 公募主催者向けボタン（非表示） */}
      {/* <OpenCallOrganizerButton /> */}

      {/* 検索バー - iPhone 16最適化 */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="企業、行政、大学、VC、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 md:py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
            💡 検索例: 「企業」「行政」「大学」「VC」「東京都」「大阪府」など
            {isLoading && <span className="ml-2 text-green-600">検索中...</span>}
          </div>
        </div>
      </div>

      {/* 結果表示とフィルター - iPhone 16最適化 */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 gap-3 sm:gap-0">
          <p className="text-xs sm:text-sm md:text-base text-gray-600 font-news">
            <span className="font-news-subheading text-gray-900 text-base sm:text-lg md:text-xl">{filteredOpenCalls.length}</span>件の公募が見つかりました
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
              {showPastOpenCalls ? "過去1年半分の公募を表示" : "現在募集中の公募のみ表示"}
            </div>
            <button
              onClick={() => setShowPastOpenCalls(!showPastOpenCalls)}
              className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] touch-manipulation active:scale-95 ${
                showPastOpenCalls
                  ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 active:bg-green-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 active:bg-gray-300"
              }`}
            >
              {showPastOpenCalls ? "募集中のみ表示" : "過去1年半分も表示"}
            </button>
          </div>
        </div>
      </div>

      {/* オープンコールカード一覧 - ハイブリッド表示 */}
      {sortedOpenCalls.length > 0 ? (
        <OpenCallsHybridDisplay
          japanAreas={japanAreas}
          overseasAreas={overseasAreas}
          filteredOpenCalls={sortedOpenCalls}
        />
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-news-heading text-gray-900 mb-2">
              該当する公募が見つかりませんでした
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-news">
              検索条件を変更して再度お試しください
            </p>
          </div>
        </div>
      )}
    </>
  );
}
