"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trophy,
  Handshake,
  Rocket,
  MapPin,
  Clock,
  CalendarClock,
  ExternalLink,
  ArrowUpRight,
  SlidersHorizontal,
  ChevronDown,
  X,
  Building2,
  Users,
  type LucideIcon,
} from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";

export type OpportunityKind = "contest" | "open-call" | "program";

// 種別ごとの表示メタ（ラベル / アイコン / モノクロ・バッジ）。画像の上にも重ねるため半透明。
export const KIND_META: Record<OpportunityKind, { label: string; Icon: LucideIcon; badge: string }> = {
  contest: { label: "コンテスト", Icon: Trophy, badge: "bg-neutral-900/90 text-white" },
  "open-call": { label: "公募", Icon: Handshake, badge: "bg-white/90 text-neutral-900 ring-1 ring-neutral-900/10" },
  program: { label: "プログラム", Icon: Rocket, badge: "bg-neutral-600/90 text-white" },
};

function kindMeta(kind: string) {
  return KIND_META[(kind as OpportunityKind)] ?? KIND_META.contest;
}

export interface OpportunityItem {
  id: string;
  kind: OpportunityKind;
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

type KindFilter = "all" | "contest" | "open-call" | "program";
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
  const [filtersOpen, setFiltersOpen] = useState(false);
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
  }, [items, kind, organizerType, regionScope, selectedArea, showPast, sortMode]);

  const visible = filtered.slice(0, visibleCount);

  // 「絞り込み」に格納した詳細条件（カテゴリ/エリア/募集状態）のうち、既定から変更されている数
  const advancedActiveCount =
    (organizerType !== ALL ? 1 : 0) +
    (regionScope !== "all" || selectedArea !== ALL ? 1 : 0) +
    (showPast ? 1 : 0);

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
    { value: "program", label: "プログラム" },
  ];

  const scopeTabs: { value: RegionScope; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "japan", label: "日本" },
    { value: "overseas", label: "海外" },
  ];

  return (
    <>
      {/* 種別（主フィルタ・常時表示）: 横スクロール可 */}
      <div className="-mx-5 mb-3 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
        <div className="flex gap-2">
          {kindTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setKind(t.value);
                resetPage();
              }}
              className={`chip min-h-[40px] shrink-0 px-4 py-2 text-[13px] touch-manipulation ${
                kind === t.value ? "chip-on" : "chip-off"
              }`}
            >
              {t.value === "contest" && <Trophy className="h-3.5 w-3.5" />}
              {t.value === "open-call" && <Handshake className="h-3.5 w-3.5" />}
              {t.value === "program" && <Rocket className="h-3.5 w-3.5" />}
              {t.label}
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
        {/* カテゴリ（主催者タイプ） */}
        {organizerTypes.length > 1 && (
          <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="shrink-0 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">カテゴリ</span>
            <div className="flex flex-1 flex-wrap gap-2">
              {organizerTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setOrganizerType(t);
                    resetPage();
                  }}
                  className={`chip min-h-[34px] px-3.5 py-1.5 text-[13px] touch-manipulation ${
                    organizerType === t ? "chip-on" : "chip-off font-medium"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* エリア（スコープ＋都道府県/都市） */}
        <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-4">
          <span className="shrink-0 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">エリア</span>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              {scopeTabs.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleScope(t.value)}
                  className={`chip min-h-[34px] px-3.5 py-1.5 text-[13px] touch-manipulation ${
                    regionScope === t.value ? "chip-on" : "chip-off"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {areaSubTabs.length > 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-neutral-200/70 pt-2">
                {areaSubTabs.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setSelectedArea(area);
                      resetPage();
                    }}
                    className={`chip min-h-[30px] px-3 py-1 text-[12px] touch-manipulation ${
                      selectedArea === area
                        ? "chip-on"
                        : "chip-off font-medium"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* 並び替え */}
        <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">並び替え</span>
          <div className="inline-flex items-center self-start rounded-full bg-neutral-100 p-0.5">
            <button
              onClick={() => {
                setSortMode("deadline");
                resetPage();
              }}
              className={`flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all touch-manipulation ${
                sortMode === "deadline"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <CalendarClock className="h-3.5 w-3.5" />
              締切が近い順
            </button>
            <button
              onClick={() => {
                setSortMode("new");
                resetPage();
              }}
              className={`flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all touch-manipulation ${
                sortMode === "new"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              新着順
            </button>
          </div>
        </div>

        {/* 募集状態 */}
        <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 sm:w-16">募集</span>
          <button
            onClick={() => {
              setShowPast((v) => !v);
              resetPage();
            }}
            className={`chip min-h-[34px] self-start px-3.5 py-1.5 text-[13px] font-medium touch-manipulation ${
              showPast ? "chip-on" : "chip-off"
            }`}
          >
            {showPast ? "過去も表示中" : "募集中のみ"}
          </button>
        </div>
      </div>
      )}

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
                className="pill-ghost px-7 py-3 text-sm min-h-[44px] touch-manipulation"
              >
                もっと見る（残り{filtered.length - visibleCount}件）
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-14 sm:py-20">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-neutral-200 mb-4">
            <Search className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-base sm:text-lg text-neutral-500">
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
  const meta = kindMeta(item.kind);
  const state = deadlineState(item.deadline);

  const KindIcon = meta.Icon;
  const kindLabel = meta.label;
  const kindClasses = meta.badge;

  const stateClasses =
    state?.tone === "closed"
      ? "bg-neutral-500/85 text-white"
      : state?.tone === "soon"
      ? "bg-neutral-900/90 text-white"
      : "bg-white/90 text-neutral-900 ring-1 ring-neutral-900/10";

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
      className="group relative flex flex-col text-left w-full bg-white rounded-2xl overflow-hidden border border-neutral-200 transition-all duration-300 hover:border-neutral-900 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.16)] active:scale-[0.99] touch-manipulation cursor-pointer"
    >
      {/* 画像 */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-100">
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
            <KindIcon className="h-8 w-8 text-neutral-300" />
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
      <div className="flex flex-col flex-1 p-4">
        {/* エリア + 主催者タイプ */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {item.area && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500">
              <MapPin className="w-3 h-3 text-neutral-400" />
              {item.area}
            </span>
          )}
          {item.organizerType && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
              {item.organizerType}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug mb-2 line-clamp-2 tracking-tight">
          {item.title}
        </h3>

        {/* 主催者 */}
        <p className="text-[11px] sm:text-xs text-neutral-500 line-clamp-1 mb-3">
          {item.organizer}
        </p>

        {/* フッター */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-neutral-100">
          <span className="tnum text-[11px] text-neutral-400">
            {item.deadline ? `締切 ${formatDate(item.deadline)}` : "通年募集"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-900">
            詳細
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
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
  const meta = kindMeta(item.kind);
  const state = deadlineState(item.deadline);
  const KindIcon = meta.Icon;
  const kindLabel = meta.label;
  const kindClasses = meta.badge;
  const stateClasses =
    state?.tone === "closed"
      ? "bg-neutral-500/85 text-white"
      : state?.tone === "soon"
      ? "bg-neutral-900/90 text-white"
      : "bg-white/90 text-neutral-900 ring-1 ring-neutral-900/10";

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
        <div className="relative w-full aspect-[16/9] bg-neutral-100">
          {item.imageUrl ? (
            <SimpleImage
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <KindIcon className="h-10 w-10 text-neutral-300" />
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
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {item.area}
              </span>
            )}
            {item.organizerType && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                {item.organizerType}
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 leading-snug mb-2 tracking-tight">
            {item.title}
          </h2>

          <p className="inline-flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
            <Building2 className="w-4 h-4 text-neutral-400" />
            {item.organizer}
          </p>

          {/* メタ情報 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-0.5">締切日</p>
              <p className="tnum text-sm font-medium text-neutral-900">
                {item.deadline ? formatFullDate(item.deadline) : "通年募集"}
              </p>
            </div>
            {item.startDate && (
              <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-0.5">開始日</p>
                <p className="tnum text-sm font-medium text-neutral-900">
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
              className="pill-ink w-full px-5 py-3.5 text-sm min-h-[48px]"
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
