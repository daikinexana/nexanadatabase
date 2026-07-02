"use client";

import { useMemo, useState } from "react";
import { MapPin, Heart, Clock, Sparkles } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import WorkspaceModal, { type WorkspaceData } from "@/components/ui/workspace-modal";
import { REGION_ORDER, PREFECTURE_TO_REGION } from "@/lib/constants";

export interface WorkspaceListItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  country: string;
  city: string;
  likeCount: number;
  createdAt: string;
}

interface WorkspaceAllListProps {
  workspaces: WorkspaceListItem[];
}

type SortMode = "new" | "popular";

const ALL = "すべて";
const PAGE_SIZE = 24;

// 都道府県を地方区分→五十音順に並べる比較関数
function comparePrefecture(a: string, b: string): number {
  const ra = REGION_ORDER.indexOf(
    (PREFECTURE_TO_REGION[a] || "") as (typeof REGION_ORDER)[number]
  );
  const rb = REGION_ORDER.indexOf(
    (PREFECTURE_TO_REGION[b] || "") as (typeof REGION_ORDER)[number]
  );
  const oa = ra === -1 ? 999 : ra;
  const ob = rb === -1 ? 999 : rb;
  if (oa !== ob) return oa - ob;
  return a.localeCompare(b, "ja");
}

export default function WorkspaceAllList({ workspaces }: WorkspaceAllListProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(ALL);
  const [selectedRegion, setSelectedRegion] = useState<string>(ALL); // 国 = 日本のとき都道府県、それ以外は都市
  const [sortMode, setSortMode] = useState<SortMode>("new");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // モーダル
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 国タブ：日本を先頭、その後は五十音順
  const countries = useMemo(() => {
    const set = new Set(workspaces.map((w) => w.country).filter(Boolean));
    const list = Array.from(set);
    list.sort((a, b) => {
      if (a === "日本") return -1;
      if (b === "日本") return 1;
      return a.localeCompare(b, "ja");
    });
    return [ALL, ...list];
  }, [workspaces]);

  // 2段目タブ：選択中の国に属する都道府県／都市
  const subTabs = useMemo(() => {
    if (selectedCountry === ALL) return [] as string[];
    const set = new Set(
      workspaces
        .filter((w) => w.country === selectedCountry)
        .map((w) => w.city)
        .filter(Boolean)
    );
    const list = Array.from(set);
    if (selectedCountry === "日本") {
      list.sort(comparePrefecture);
    } else {
      list.sort((a, b) => a.localeCompare(b, "ja"));
    }
    return [ALL, ...list];
  }, [workspaces, selectedCountry]);

  // フィルタ + ソート
  const filtered = useMemo(() => {
    const result = workspaces.filter((w) => {
      if (selectedCountry !== ALL && w.country !== selectedCountry) return false;
      if (selectedRegion !== ALL && w.city !== selectedRegion) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortMode === "popular") {
        if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // new
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [workspaces, selectedCountry, selectedRegion, sortMode]);

  const visible = filtered.slice(0, visibleCount);

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setSelectedRegion(ALL);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSort = (mode: SortMode) => {
    setSortMode(mode);
    setVisibleCount(PAGE_SIZE);
  };

  const handleWorkspaceClick = async (id: string) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/workspace/${id}`);
      if (response.ok) {
        const data = (await response.json()) as WorkspaceData;
        setSelectedWorkspace(data);
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch workspace details");
      }
    } catch (error) {
      console.error("Error fetching workspace details:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      {/* セクションヘッダー + 並び替え */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-0.5 sm:w-1 h-5 sm:h-6 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            ワークスペースを探す
          </h2>
          <span className="text-xs text-gray-500 font-medium bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 px-2.5 py-1 rounded-full">
            {filtered.length}件
          </span>
        </div>

        {/* 並び替えトグル */}
        <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => handleSort("new")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all min-h-[40px] touch-manipulation ${
              sortMode === "new"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            新着順
          </button>
          <button
            onClick={() => handleSort("popular")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all min-h-[40px] touch-manipulation ${
              sortMode === "popular"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            人気順
          </button>
        </div>
      </div>

      {/* 1段目タブ：国 */}
      <div className="mb-2.5 flex flex-wrap gap-2">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => handleSelectCountry(country)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all min-h-[40px] touch-manipulation active:scale-95 ${
              selectedCountry === country
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      {/* 2段目タブ：都道府県／都市（国選択時のみ） */}
      {subTabs.length > 1 && (
        <div className="mb-5 sm:mb-6 flex flex-wrap gap-1.5 pl-0.5 border-l-2 border-emerald-100 ml-0.5">
          {subTabs.map((region) => (
            <button
              key={region}
              onClick={() => handleSelectRegion(region)}
              className={`px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-full border transition-all min-h-[36px] touch-manipulation active:scale-95 ${
                selectedRegion === region
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      )}

      {/* ワークスペースグリッド */}
      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
            {visible.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => handleWorkspaceClick(workspace.id)}
                className="group relative bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200/70 cursor-pointer block active:scale-[0.97] touch-manipulation transition-all duration-300 hover:shadow-lg hover:border-emerald-300/60 hover:-translate-y-0.5"
              >
                {/* 画像エリア */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {workspace.imageUrl ? (
                    <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500 ease-out">
                      <SimpleImage
                        src={workspace.imageUrl}
                        alt={workspace.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent group-hover:from-black/45 transition-all duration-300"></div>

                  {/* いいね数バッジ */}
                  <div className="absolute bottom-2 right-2 z-20">
                    <div className="flex items-center gap-1 px-1.5 py-1 bg-black/70 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                      <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                      <span className="text-[9px] font-bold text-white">{workspace.likeCount}</span>
                    </div>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-2 sm:p-2.5 bg-white">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {workspace.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500">
                    <MapPin className="w-2.5 h-2.5 text-emerald-500/60" />
                    <span className="truncate">
                      {workspace.city}
                      {workspace.country && workspace.country !== "日本" ? `・${workspace.country}` : ""}
                    </span>
                  </div>
                </div>

                {/* アクセントライン */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                {/* ローディング */}
                {loadingId === workspace.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* もっと見る */}
          {visibleCount < filtered.length && (
            <div className="mt-6 sm:mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-3 text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-full shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all min-h-[44px] touch-manipulation active:scale-95"
              >
                もっと見る（残り{filtered.length - visibleCount}件）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            該当するワークスペースがありません
          </p>
        </div>
      )}

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorkspace(null);
        }}
        workspace={selectedWorkspace}
      />
    </>
  );
}
