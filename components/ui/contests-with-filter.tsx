"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ContestsHybridDisplay from "./contests-hybrid-display";
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

  // フィルタリング処理（過去のコンテストを除外）
  const filteredContests = useMemo(() => {
    const now = new Date();
    return contests.filter(contest => {
      if (contest.deadline) {
        return new Date(contest.deadline) >= now;
      }
      return true;
    });
  }, [contests]);

  return (
    <>
      {/* 検索バー */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="企業、行政、大学、VC、人気、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
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
            💡 検索例: 「企業」「行政」「大学」「VC」「人気」「東京都」「大阪府」など
            {isLoading && <span className="ml-2 text-amber-600">検索中...</span>}
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <p className="text-gray-600 font-news">
            <span className="font-news-subheading text-gray-900">{filteredContests.length}</span>件のコンテストが見つかりました
          </p>
          <div className="text-sm text-gray-500">
            現在募集中のコンテストのみ表示
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
