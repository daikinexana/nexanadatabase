"use client";

import { useState, memo, useEffect } from "react";
import SimpleImage from "@/components/ui/simple-image";
import {
  Newspaper,
  X,
  MapPin,
  Building2,
  Users,
  ExternalLink,
  Calendar,
} from "lucide-react";

// ニュース種別のラベル（DB値の大文字・旧小文字表記の両方に対応）
function newsTypeLabel(type: string): string {
  switch (type) {
    case "FUNDING":
    case "funding":
      return "資金調達";
    case "M_AND_A":
    case "m&a":
      return "M&A";
    case "IPO":
    case "ipo":
      return "IPO";
    case "PARTNERSHIP":
    case "partnership":
      return "パートナーシップ";
    case "OTHER":
    case "other":
      return "その他";
    default:
      return type;
  }
}

function formatFullDate(value?: Date | string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

interface NewsItemProps {
  title: string;
  description: string | null;
  imageUrl: string | null;
  company: string;
  sector: string | null;
  amount: string | null;
  investors: string[];
  publishedAt: Date | null;
  sourceUrl: string | null;
  type: string;
  area: string | null;
  createdAt: Date;
  priority?: boolean; // 画像の優先読み込みフラグ
}

function NewsItem({
  title,
  description,
  imageUrl,
  company,
  sector,
  amount,
  investors,
  publishedAt,
  sourceUrl,
  type,
  area,
  createdAt,
  priority = false,
}: NewsItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // モーダル表示中はEscで閉じ、背景スクロールを固定（/opportunities と同じ挙動）
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isModalOpen]);

  return (
    <>
      <article
        className="group cursor-pointer py-6 sm:py-8 transition-colors duration-200 active:opacity-80"
        onClick={handleCardClick}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 md:gap-8">
          {/* 画像 */}
          {imageUrl ? (
            <div className="sm:w-64 md:w-72 flex-shrink-0 overflow-hidden rounded-xl">
              <SimpleImage
                src={imageUrl}
                alt={title}
                width={320}
                height={192}
                className="w-full h-44 sm:h-40 md:h-44 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
              />
            </div>
          ) : (
            <div className="sm:w-64 md:w-72 flex-shrink-0">
              <div className="w-full h-44 sm:h-40 md:h-44 flex items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
                <Newspaper className="h-8 w-8 text-neutral-300" />
              </div>
            </div>
          )}

          {/* コンテンツ */}
          <div className="flex-1 min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {newsTypeLabel(type)}
              </span>
              {sector && (
                <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-neutral-600">
                  {sector}
                </span>
              )}
              {area && (
                <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-neutral-600">
                  {area}
                </span>
              )}
            </div>

            <h2 className="mb-2 overflow-hidden text-lg font-bold leading-snug tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600 sm:text-xl md:text-2xl" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              {title}
            </h2>

            {description && (
              <p className="mb-3 overflow-hidden text-sm leading-relaxed text-neutral-500 md:text-base" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm">
              <span className="font-semibold text-neutral-900">{company}</span>
              {amount && (
                <span className="tnum inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                  {amount}
                </span>
              )}
              {investors && investors.length > 0 && (
                <span className="text-neutral-500">
                  <span className="text-neutral-400">投資家</span> {Array.isArray(investors) ? investors.slice(0, 2).join(', ') + (investors.length > 2 ? '…' : '') : investors}
                </span>
              )}
              <span className="tnum inline-flex items-center gap-1 whitespace-nowrap text-neutral-400">
                <Calendar className="h-3.5 w-3.5" />
                {publishedAt
                  ? new Date(publishedAt).toLocaleDateString('ja-JP')
                  : new Date(createdAt).toLocaleDateString('ja-JP')
                }
              </span>
            </div>

            {sourceUrl && (
              <div className="mt-3">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 hover:underline"
                  onClick={handleLinkClick}
                >
                  詳細を見る
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* 詳細モーダル（/opportunities と同じデザイン） */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* 背景 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* 本体 */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto">
            {/* 閉じるボタン */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="閉じる"
              className="absolute top-3 right-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 画像 */}
            <div className="relative w-full aspect-[16/9] bg-neutral-100">
              {imageUrl ? (
                <SimpleImage
                  src={imageUrl}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Newspaper className="h-10 w-10 text-neutral-300" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm bg-neutral-900/90 text-white">
                  {newsTypeLabel(type)}
                </span>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {area && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {area}
                  </span>
                )}
                {sector && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {sector}
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2">
                {title}
              </h2>

              <p className="inline-flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                <Building2 className="w-4 h-4 text-gray-400" />
                {company}
              </p>

              {/* メタ情報 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                  <p className="text-[10px] font-semibold text-gray-400 mb-0.5">公開日</p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatFullDate(publishedAt ?? createdAt)}
                  </p>
                </div>
                {amount && (
                  <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] font-semibold text-gray-400 mb-0.5">調達金額</p>
                    <p className="text-sm font-medium text-gray-800 break-words">
                      {amount}
                    </p>
                  </div>
                )}
              </div>

              {investors && investors.length > 0 && (
                <div className="mb-4">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    投資家
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed break-words">
                    {Array.isArray(investors) ? investors.join(", ") : investors}
                  </p>
                </div>
              )}

              {description && (
                <div className="mb-5">
                  <p className="text-[11px] font-semibold text-gray-400 mb-1">概要</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {description}
                  </p>
                </div>
              )}

              {/* CTA */}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-ink w-full px-5 py-3.5 text-sm min-h-[48px]"
                >
                  元記事を見る
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// メモ化して不要な再レンダリングを防ぐ
export default memo(NewsItem);
