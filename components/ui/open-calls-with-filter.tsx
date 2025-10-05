"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OpenCallsHybridDisplay from "./open-calls-hybrid-display";
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

  // フィルタリング処理（過去のオープンコールを除外）
  const filteredOpenCalls = useMemo(() => {
    const now = new Date();
    return openCalls.filter(openCall => {
      if (openCall.deadline) {
        return new Date(openCall.deadline) >= now;
      }
      return true;
    });
  }, [openCalls]);

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
      {/* 検索バー */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="企業、行政、大学、VC、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            💡 検索例: 「企業」「行政」「大学」「VC」「東京都」「大阪府」など
            {isLoading && <span className="ml-2 text-green-600">検索中...</span>}
          </div>
        </div>
      </div>

      {/* 結果表示 */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
          <p className="text-gray-600 font-news">
            <span className="font-news-subheading text-gray-900">{filteredOpenCalls.length}</span>件の公募が見つかりました
          </p>
          <div className="text-sm text-gray-500">
            現在募集中の公募のみ表示
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
        <div className="text-center py-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-news-heading text-gray-900 mb-2">
              該当する公募が見つかりませんでした
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
