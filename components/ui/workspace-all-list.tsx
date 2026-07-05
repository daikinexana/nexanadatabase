"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Heart,
  Clock,
  Sparkles,
  DoorOpen,
  SlidersHorizontal,
  ChevronDown,
  Briefcase,
  Users,
  Wrench,
  FlaskConical,
  ClipboardCheck,
  HeartHandshake,
  Presentation,
  GraduationCap,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import WorkspaceModal, { type WorkspaceData } from "@/components/ui/workspace-modal";
import { REGION_ORDER, PREFECTURE_TO_REGION } from "@/lib/constants";

export interface WorkspaceListItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  country: string;
  city: string;
  hasDropin: boolean;
  categoryWork: boolean;
  categoryConnect: boolean;
  categoryPrototype: boolean;
  categoryPilot: boolean;
  categoryTest: boolean;
  categorySupport: boolean;
  categoryShowcase: boolean;
  categoryLearn: boolean;
  categoryStay: boolean;
  likeCount: number;
  createdAt: string;
}

// 利用用途カテゴリ（Workspace のboolean項目に対応）
type CategoryKey =
  | "categoryWork"
  | "categoryConnect"
  | "categoryPrototype"
  | "categoryPilot"
  | "categoryTest"
  | "categorySupport"
  | "categoryShowcase"
  | "categoryLearn"
  | "categoryStay";

const CATEGORIES: { key: CategoryKey; label: string; Icon: LucideIcon }[] = [
  { key: "categoryWork", label: "執務", Icon: Briefcase },
  { key: "categoryConnect", label: "交流", Icon: Users },
  { key: "categoryPrototype", label: "試作", Icon: Wrench },
  { key: "categoryPilot", label: "実証", Icon: FlaskConical },
  { key: "categoryTest", label: "試験", Icon: ClipboardCheck },
  { key: "categorySupport", label: "支援", Icon: HeartHandshake },
  { key: "categoryShowcase", label: "発表", Icon: Presentation },
  { key: "categoryLearn", label: "学ぶ", Icon: GraduationCap },
  { key: "categoryStay", label: "滞在", Icon: BedDouble },
];

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
  const [dropinOnly, setDropinOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
  const [filtersOpen, setFiltersOpen] = useState(false);
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
      if (dropinOnly && !w.hasDropin) return false;
      if (selectedCategory !== ALL && !w[selectedCategory as CategoryKey]) return false;
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
  }, [workspaces, selectedCountry, selectedRegion, sortMode, dropinOnly, selectedCategory]);

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

  const handleSelectCategory = (key: string) => {
    setSelectedCategory(key);
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

  const advancedActiveCount =
    (selectedCountry !== ALL || selectedRegion !== ALL ? 1 : 0) +
    (dropinOnly ? 1 : 0) +
    (sortMode !== "new" ? 1 : 0);

  return (
    <>
      {/* カテゴリ（利用用途）: 主フィルタ・常時表示 / 横スクロール可 */}
      <div className="-mx-5 mb-3 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
        <div className="flex gap-2">
          <button
            onClick={() => handleSelectCategory(ALL)}
            className={`chip min-h-[40px] shrink-0 px-4 py-2 text-[13px] touch-manipulation ${
              selectedCategory === ALL ? "chip-on" : "chip-off"
            }`}
          >
            すべて
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => handleSelectCategory(c.key)}
              className={`chip min-h-[40px] shrink-0 px-4 py-2 text-[13px] touch-manipulation ${
                selectedCategory === c.key ? "chip-on" : "chip-off"
              }`}
            >
              <c.Icon className="h-3.5 w-3.5" />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ツールバー：件数 + 絞り込みトグル */}
      <div className="mb-4 flex items-center justify-between gap-3 border-y border-neutral-200 py-3">
        <p className="text-sm text-neutral-500">
          <span className="tnum text-lg font-bold text-neutral-900">{filtered.length}</span>
          <span className="ml-1">件</span>
        </p>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className={`chip min-h-[40px] px-4 py-2 text-[13px] touch-manipulation ${
            filtersOpen || advancedActiveCount > 0 ? "chip-on" : "chip-off"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          絞り込み
          {advancedActiveCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-neutral-900">
              {advancedActiveCount}
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* 詳細フィルタ（折りたたみ・既定は非表示） */}
      {filtersOpen && (
        <div className="mb-5 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-neutral-50/50 px-4 sm:px-5">
          {/* エリア（国＋都道府県/都市） */}
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="shrink-0 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">エリア</span>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => handleSelectCountry(country)}
                    className={`chip min-h-[34px] px-3.5 py-1.5 text-[13px] touch-manipulation ${
                      selectedCountry === country ? "chip-on" : "chip-off"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              {subTabs.length > 1 && (
                <div className="flex flex-wrap gap-1.5 border-t border-neutral-200/70 pt-2">
                  {subTabs.map((region) => (
                    <button
                      key={region}
                      onClick={() => handleSelectRegion(region)}
                      className={`chip min-h-[30px] px-3 py-1 text-[12px] touch-manipulation ${
                        selectedRegion === region ? "chip-on" : "chip-off font-medium"
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 設備 */}
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">設備</span>
            <button
              onClick={() => {
                setDropinOnly((v) => !v);
                setVisibleCount(PAGE_SIZE);
              }}
              aria-pressed={dropinOnly}
              className={`chip min-h-[34px] self-start px-3.5 py-1.5 text-[13px] font-medium touch-manipulation ${
                dropinOnly ? "chip-on" : "chip-off"
              }`}
            >
              <DoorOpen className="h-3.5 w-3.5" />
              ドロップインあり
            </button>
          </div>

          {/* 並び替え */}
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">並び替え</span>
            <div className="inline-flex items-center self-start rounded-full bg-neutral-100 p-0.5">
              <button
                onClick={() => handleSort("new")}
                className={`flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all touch-manipulation ${
                  sortMode === "new" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                新着順
              </button>
              <button
                onClick={() => handleSort("popular")}
                className={`flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all touch-manipulation ${
                  sortMode === "popular" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                人気順
              </button>
            </div>
          </div>
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
                className="group relative bg-white rounded-2xl overflow-hidden border border-neutral-200 cursor-pointer block active:scale-[0.98] touch-manipulation transition-all duration-300 hover:border-neutral-900 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.16)]"
              >
                {/* 画像エリア */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
                  {workspace.imageUrl ? (
                    <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 ease-out">
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
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-300" />
                    </div>
                  )}

                  {/* いいね数バッジ */}
                  <div className="absolute bottom-2 right-2 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-neutral-900/80 backdrop-blur-sm rounded-full">
                      <Heart className="w-2.5 h-2.5 fill-white text-white" />
                      <span className="tnum text-[9px] font-bold text-white">{workspace.likeCount}</span>
                    </div>
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-2.5 sm:p-3 bg-white">
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight text-neutral-900 mb-1 line-clamp-1">
                    {workspace.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-neutral-500">
                    <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                    <span className="truncate">
                      {workspace.city}
                      {workspace.country && workspace.country !== "日本" && workspace.country !== workspace.city ? `・${workspace.country}` : ""}
                    </span>
                  </div>
                </div>

                {/* ローディング */}
                {loadingId === workspace.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-neutral-900"></div>
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
                className="pill-ghost px-7 py-3 text-sm min-h-[44px] touch-manipulation"
              >
                もっと見る（残り{filtered.length - visibleCount}件）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 sm:py-24">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-neutral-200 mb-4">
            <MapPin className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-base sm:text-lg text-neutral-500">
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
