"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trophy,
  Handshake,
  MapPin,
  Clock,
  CalendarClock,
  ExternalLink,
  X,
  Building2,
  Users,
} from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";

export interface OpportunityItem {
  id: string;
  kind: "contest" | "open-call";
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  benefit?: string;
  targetArea?: string;
  targetAudience?: string;
  createdAt: string;
}

interface OpportunitiesListProps {
  items: OpportunityItem[];
  japanAreas: string[];
  overseasAreas: string[];
}

type KindFilter = "all" | "contest" | "open-call";
type RegionScope = "all" | "japan" | "overseas";
type SortMode = "deadline" | "new";

const ALL = "すべて";
const PAGE_SIZE = 24;

// 主催者タイプの表示順（未知の値は末尾）
const ORGANIZER_TYPE_ORDER = ["企業", "行政", "大学", "CV", "VC", "CVC", "その他"];

function organizerTypeRank(t: string): number {
  const i = ORGANIZER_TYPE_ORDER.indexOf(t);
  return i === -1 ? 999 : i;
}

// 締切までの状態
function deadlineState(deadline?: string): {
  label: string;
  tone: "open" | "soon" | "closed";
} | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: "締切", tone: "closed" };
  if (diffDays === 0) return { label: "本日締切", tone: "soon" };
  if (diffDays <= 7) return { label: `締切まで${diffDays}日`, tone: "soon" };
  return { label: `締切まで${diffDays}日`, tone: "open" };
}

function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatFullDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function OpportunitiesList({
  items,
  japanAreas,
  overseasAreas,
}: OpportunitiesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [organizerType, setOrganizerType] = useState<string>(ALL);
  const [regionScope, setRegionScope] = useState<RegionScope>("all");
  const [selectedArea, setSelectedArea] = useState<string>(ALL);
  const [sortMode, setSortMode] = useState<SortMode>("deadline");
  const [showPast, setShowPast] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<OpportunityItem | null>(null);

  const japanSet = useMemo(() => new Set(japanAreas), [japanAreas]);
  const overseasSet = useMemo(() => new Set(overseasAreas), [overseasAreas]);

  const isJapanArea = (area?: string) => !!area && japanSet.has(area);
  const isOverseasArea = (area?: string) =>
    !!area && (overseasSet.has(area) || (!japanSet.has(area) && area !== ""));

  // カテゴリ（主催者タイプ）タブ：実データから抽出
  const organizerTypes = useMemo(() => {
    const set = new Set(
      items.map((i) => i.organizerType).filter((t): t is string => !!t)
    );
    return [ALL, ...Array.from(set).sort((a, b) => organizerTypeRank(a) - organizerTypeRank(b))];
  }, [items]);

  // エリアサブタブ：選択中スコープに存在するエリアのみ、定義順で
  const areaSubTabs = useMemo(() => {
    if (regionScope === "all") return [] as string[];
    const present = new Set(
      items
        .map((i) => i.area)
        .filter((a): a is string => !!a)
        .filter((a) => (regionScope === "japan" ? japanSet.has(a) : !japanSet.has(a)))
    );
    const ordered = (regionScope === "japan" ? japanAreas : overseasAreas).filter((a) =>
      present.has(a)
    );
    // 海外で定義外のエリアも拾う
    if (regionScope === "overseas") {
      Array.from(present)
        .filter((a) => !overseasSet.has(a))
        .forEach((a) => ordered.push(a));
    }
    return [ALL, ...ordered];
  }, [items, regionScope, japanAreas, overseasAreas, japanSet, overseasSet]);

  const filtered = useMemo(() => {
    const now = new Date();
    const oneYearHalfAgo = new Date();
    oneYearHalfAgo.setMonth(oneYearHalfAgo.getMonth() - 18);
    const q = searchQuery.trim().toLowerCase();

    const result = items.filter((item) => {
      // 種別
      if (kind !== "all" && item.kind !== kind) return false;

      // カテゴリ（主催者タイプ）
      if (organizerType !== ALL && item.organizerType !== organizerType) return false;

      // エリアスコープ
      if (regionScope === "japan" && !isJapanArea(item.area)) return false;
      if (regionScope === "overseas" && (isJapanArea(item.area) || !isOverseasArea(item.area)))
        return false;

      // 個別エリア
      if (selectedArea !== ALL && item.area !== selectedArea) return false;

      // 募集中 / 過去
      if (item.deadline) {
        const d = new Date(item.deadline);
        if (!isNaN(d.getTime())) {
          if (showPast) {
            if (d < oneYearHalfAgo) return false;
          } else {
            if (d < now) return false;
          }
        }
      }

      // フリーワード検索
      if (q) {
        const haystack = [
          item.title,
          item.description,
          item.organizer,
          item.organizerType,
          item.area,
          item.targetAudience,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sortMode === "deadline") {
        const ad = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
        const bd = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
        if (ad !== bd) return ad - bd;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, kind, organizerType, regionScope, selectedArea, showPast, searchQuery, sortMode]);

  const visible = filtered.slice(0, visibleCount);

  const resetPage = () => setVisibleCount(PAGE_SIZE);

  const handleScope = (scope: RegionScope) => {
    setRegionScope(scope);
    setSelectedArea(ALL);
    resetPage();
  };

  const kindTabs: { value: KindFilter; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "contest", label: "コンテスト" },
    { value: "open-call", label: "公募" },
  ];

  const scopeTabs: { value: RegionScope; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "japan", label: "日本" },
    { value: "overseas", label: "海外" },
  ];

  return (
    <>
      {/* 検索バー */}
      <div className="mb-4 sm:mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <input
            type="text"
            placeholder="キーワード・主催者・対象・エリアで検索..."
            className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base min-h-[44px] shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              resetPage();
            }}
          />
        </div>
      </div>

      {/* フィルタパネル */}
      <div className="mb-5 sm:mb-6 space-y-3 sm:space-y-4">
        {/* 種別タブ */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-400 w-14 shrink-0">種別</span>
          {kindTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setKind(t.value);
                resetPage();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all min-h-[38px] touch-manipulation active:scale-95 ${
                kind === t.value
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {t.value === "contest" && <Trophy className="w-3.5 h-3.5" />}
              {t.value === "open-call" && <Handshake className="w-3.5 h-3.5" />}
              {t.label}
            </button>
          ))}
        </div>

        {/* カテゴリ（主催者タイプ）タブ */}
        {organizerTypes.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-400 w-14 shrink-0">カテゴリ</span>
            {organizerTypes.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setOrganizerType(t);
                  resetPage();
                }}
                className={`px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-full border transition-all min-h-[36px] touch-manipulation active:scale-95 ${
                  organizerType === t
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* エリアスコープタブ */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] sm:text-xs font-semibold text-gray-400 w-14 shrink-0">エリア</span>
          {scopeTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => handleScope(t.value)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all min-h-[38px] touch-manipulation active:scale-95 ${
                regionScope === t.value
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* エリアサブタブ */}
        {areaSubTabs.length > 1 && (
          <div className="flex flex-wrap gap-1.5 pl-14 border-l-2 border-indigo-100 ml-0.5">
            {areaSubTabs.map((area) => (
              <button
                key={area}
                onClick={() => {
                  setSelectedArea(area);
                  resetPage();
                }}
                className={`px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-full border transition-all min-h-[34px] touch-manipulation active:scale-95 ${
                  selectedArea === area
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 件数 + 並び替え + 募集中トグル */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm">
        <p className="text-xs sm:text-sm text-gray-600">
          <span className="font-bold text-gray-900 text-base sm:text-lg">{filtered.length}</span>
          件が見つかりました
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg border border-gray-200">
            <button
              onClick={() => {
                setSortMode("deadline");
                resetPage();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all min-h-[38px] touch-manipulation ${
                sortMode === "deadline"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              締切が近い順
            </button>
            <button
              onClick={() => {
                setSortMode("new");
                resetPage();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-all min-h-[38px] touch-manipulation ${
                sortMode === "new"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              新着順
            </button>
          </div>
          <button
            onClick={() => {
              setShowPast((v) => !v);
              resetPage();
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all min-h-[38px] touch-manipulation active:scale-95 ${
              showPast
                ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {showPast ? "過去も表示中" : "募集中のみ"}
          </button>
        </div>
      </div>

      {/* カードグリッド */}
      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {visible.map((item) => (
              <OpportunityCard
                key={`${item.kind}-${item.id}`}
                item={item}
                onSelect={setSelected}
              />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-7 sm:mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-3 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-full shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all min-h-[44px] touch-manipulation active:scale-95"
              >
                もっと見る（残り{filtered.length - visibleCount}件）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-14 sm:py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg text-gray-600 font-light">
            条件に該当する情報がありません
          </p>
        </div>
      )}

      {/* 詳細モーダル */}
      {selected && (
        <OpportunityModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

export function OpportunityCard({
  item,
  onSelect,
}: {
  item: OpportunityItem;
  onSelect?: (item: OpportunityItem) => void;
}) {
  const isContest = item.kind === "contest";
  const state = deadlineState(item.deadline);

  const KindIcon = isContest ? Trophy : Handshake;
  const kindLabel = isContest ? "コンテスト" : "公募";
  const kindClasses = isContest
    ? "bg-amber-500/90 text-white"
    : "bg-purple-500/90 text-white";

  const stateClasses =
    state?.tone === "closed"
      ? "bg-gray-500/90 text-white"
      : state?.tone === "soon"
      ? "bg-rose-500/90 text-white"
      : "bg-emerald-500/90 text-white";

  // onSelect が渡された場合はモーダルを開くボタンに、なければ従来どおり外部リンク
  const Wrapper = onSelect ? "button" : item.website ? "a" : "div";
  const wrapperProps = onSelect
    ? { type: "button" as const, onClick: () => onSelect(item) }
    : item.website
    ? { href: item.website, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative flex flex-col text-left w-full bg-white rounded-xl overflow-hidden border border-gray-200/70 transition-all duration-300 hover:shadow-lg hover:border-indigo-300/60 hover:-translate-y-0.5 active:scale-[0.99] touch-manipulation cursor-pointer"
    >
      {/* 画像 */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {item.imageUrl ? (
          <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 ease-out">
            <SimpleImage
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <KindIcon className="h-8 w-8 text-gray-300" />
          </div>
        )}

        {/* 種別バッジ */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${kindClasses}`}
          >
            <KindIcon className="w-2.5 h-2.5" />
            {kindLabel}
          </span>
        </div>

        {/* 締切バッジ */}
        {state && (
          <div className="absolute top-2 right-2 z-10">
            <span
              className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm ${stateClasses}`}
            >
              {state.label}
            </span>
          </div>
        )}
      </div>

      {/* コンテンツ */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* エリア + 主催者タイプ */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {item.area && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
              <MapPin className="w-3 h-3 text-indigo-500/70" />
              {item.area}
            </span>
          )}
          {item.organizerType && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {item.organizerType}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>

        {/* 主催者 */}
        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 mb-3">
          {item.organizer}
        </p>

        {/* フッター */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">
            {item.deadline ? `締切 ${formatDate(item.deadline)}` : "通年募集"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
            詳細
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </Wrapper>
  );
}

function OpportunityModal({
  item,
  onClose,
}: {
  item: OpportunityItem;
  onClose: () => void;
}) {
  const isContest = item.kind === "contest";
  const state = deadlineState(item.deadline);
  const KindIcon = isContest ? Trophy : Handshake;
  const kindLabel = isContest ? "コンテスト" : "公募";
  const kindClasses = isContest
    ? "bg-amber-500/90 text-white"
    : "bg-purple-500/90 text-white";
  const stateClasses =
    state?.tone === "closed"
      ? "bg-gray-500/90 text-white"
      : state?.tone === "soon"
      ? "bg-rose-500/90 text-white"
      : "bg-emerald-500/90 text-white";

  // Escキーで閉じる & 背景スクロールを固定
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 本体 */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto">
        {/* 閉じるボタン */}
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 画像 */}
        <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
          {item.imageUrl ? (
            <SimpleImage
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <KindIcon className="h-10 w-10 text-gray-300" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm ${kindClasses}`}
            >
              <KindIcon className="w-3 h-3" />
              {kindLabel}
            </span>
            {state && (
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm ${stateClasses}`}
              >
                {state.label}
              </span>
            )}
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {item.area && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-indigo-500/70" />
                {item.area}
              </span>
            )}
            {item.organizerType && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {item.organizerType}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2">
            {item.title}
          </h2>

          <p className="inline-flex items-center gap-1.5 text-sm text-gray-600 mb-4">
            <Building2 className="w-4 h-4 text-gray-400" />
            {item.organizer}
          </p>

          {/* メタ情報 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
              <p className="text-[10px] font-semibold text-gray-400 mb-0.5">締切日</p>
              <p className="text-sm font-medium text-gray-800">
                {item.deadline ? formatFullDate(item.deadline) : "通年募集"}
              </p>
            </div>
            {item.startDate && (
              <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                <p className="text-[10px] font-semibold text-gray-400 mb-0.5">開始日</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatFullDate(item.startDate)}
                </p>
              </div>
            )}
          </div>

          {item.benefit && (
            <div className="mb-4">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                Benefit（賞金・特典・提供リソース）
              </p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.benefit}
              </p>
            </div>
          )}

          {item.targetArea && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-400 mb-1">対象領域</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.targetArea}
              </p>
            </div>
          )}

          {item.targetAudience && (
            <div className="mb-4">
              <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-1">
                <Users className="w-3.5 h-3.5" />
                応募対象
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {item.targetAudience}
              </p>
            </div>
          )}

          {item.description && (
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-gray-400 mb-1">概要</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* CTA */}
          {item.website && (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-indigo-600 hover:to-blue-600 transition-all min-h-[48px]"
            >
              公式サイトで詳細を見る
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
