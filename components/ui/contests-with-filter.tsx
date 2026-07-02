"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContestsHybridDisplay from "./contests-hybrid-display";
// import ContestOrganizerButton from "./contest-organizer-button";
import { Search } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  incentive?: string;
  operatingCompany?: string;
  isPopular?: boolean;
  createdAt: string;
}

interface ContestsWithFilterProps {
  japanAreas: string[];
  overseasAreas: string[];
  initialContests: Contest[];
}

export default function ContestsWithFilter({
  japanAreas,
  overseasAreas,
  initialContests,
}: ContestsWithFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [contests, setContests] = useState<Contest[]>(initialContests);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeoutId, setSearchTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [showPastContests, setShowPastContests] = useState(false);

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
          
          const response = await fetch(`/api/contests?${params.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setContests(data);
          } else {
            console.error("Search failed:", response.status);
            // エラー時は初期データに戻す
            setContests(initialContests);
          }
        } catch (error) {
          console.error("Error searching contests:", error);
          // エラー時は初期データに戻す
          setContests(initialContests);
        } finally {
          setIsLoading(false);
        }
      } else {
        setContests(initialContests);
      }
    }, 500); // 500msのデバウンス

    setSearchTimeoutId(timeoutId);

    return () => {
      clearTimeout(timeoutId);
      setSearchTimeoutId(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, initialContests]);

  // URL更新
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/contests${newUrl}`, { scroll: false });
  }, [searchQuery, router, searchParams]);

  // フィルタリング処理
  const filteredContests = useMemo(() => {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    oneYearAgo.setMonth(now.getMonth() - 6); // 1年半前

    return contests.filter(contest => {
      if (contest.deadline) {
        const deadline = new Date(contest.deadline);
        if (showPastContests) {
          // 過去1年半分のコンテストを表示
          return deadline >= oneYearAgo;
        } else {
          // 現在募集中のコンテストのみ表示
          return deadline >= now;
        }
      }
      return true;
    });
  }, [contests, showPastContests]);

  return (
    <>
      {/* コンテスト主催者向けボタン（非表示） */}
      {/* <ContestOrganizerButton /> */}

      {/* 検索バー - iPhone 16最適化 */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="企業、行政、大学、VC、人気、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 md:py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500 text-sm sm:text-base min-h-[44px]"
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
          <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
            💡 検索例: 「企業」「行政」「大学」「VC」「人気」「東京都」「大阪府」など
            {isLoading && <span className="ml-2 text-amber-600">検索中...</span>}
          </div>
        </div>
      </div>

      {/* 結果表示とフィルター - iPhone 16最適化 */}
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 gap-3 sm:gap-0">
          <p className="text-xs sm:text-sm md:text-base text-gray-600 font-news">
            <span className="font-news-subheading text-gray-900 text-base sm:text-lg md:text-xl">{filteredContests.length}</span>件のコンテストが見つかりました
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
              {showPastContests ? "過去1年半分のコンテストを表示" : "現在募集中のコンテストのみ表示"}
            </div>
            <button
              onClick={() => setShowPastContests(!showPastContests)}
              className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] touch-manipulation active:scale-95 ${
                showPastContests
                  ? "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 active:bg-amber-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 active:bg-gray-300"
              }`}
            >
              {showPastContests ? "募集中のみ表示" : "過去1年半分も表示"}
            </button>
          </div>
        </div>
      </div>

      {/* ハイブリッド表示 */}
      <ContestsHybridDisplay
        japanAreas={japanAreas}
        overseasAreas={overseasAreas}
        filteredContests={filteredContests}
      />
    </>
  );
}
