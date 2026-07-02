"use client";

import { useState, memo, useEffect } from "react";
import Image from "next/image";
import {
  Newspaper,
  X,
  MapPin,
  Building2,
  Users,
  ExternalLink,
} from "lucide-react";

// ニュース種別のラベル（DB値の大文字・旧小文字表記の両方に対応）
function newsTypeLabel(type: string): string {
  switch (type) {
    case "FUNDING":
    case "funding":
      return "💰 資金調達";
    case "M_AND_A":
    case "m&a":
      return "🤝 M&A";
    case "IPO":
    case "ipo":
      return "📈 IPO";
    case "PARTNERSHIP":
    case "partnership":
      return "🤝 パートナーシップ";
    case "OTHER":
    case "other":
      return "📰 その他";
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
        className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 md:p-6 hover:shadow-xl sm:hover:scale-[1.02] transition-all duration-300 cursor-pointer group active:scale-[0.98]"
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
          {/* 画像 - iPhone 16最適化 */}
                 {imageUrl ? (
                   <div className="sm:w-80 flex-shrink-0">
                     <Image
                       src={imageUrl}
                       alt={title}
                       width={320}
                       height={192}
                       className="w-full h-40 sm:h-44 md:h-48 object-cover rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                       sizes="(max-width: 640px) 100vw, 320px"
                       priority={priority}
                       loading={priority ? "eager" : "lazy"}
                       placeholder="blur"
                       blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                     />
                   </div>
          ) : (
            <div className="sm:w-80 flex-shrink-0">
              <div className="w-full h-40 sm:h-44 md:h-48 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center rounded-lg sm:rounded-xl shadow-md border border-emerald-200/50 group-hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 mx-auto shadow-lg">
                    <Newspaper className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-600">ニュース</p>
                </div>
              </div>
            </div>
          )}
          
          {/* コンテンツ - iPhone 16最適化 */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
              <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200 shadow-sm">
                {newsTypeLabel(type)}
              </span>
              {sector && (
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm">
                  {sector}
                </span>
              )}
              {area && (
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 shadow-sm">
                  {area}
                </span>
              )}
            </div>
            
            <h2 className="text-base sm:text-lg md:text-xl font-news-heading text-gray-900 mb-2 sm:mb-3 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              {title}
            </h2>
            
            {description && (
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-news mb-2 sm:mb-3 md:mb-4 leading-relaxed overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[11px] sm:text-xs md:text-sm">
              <span className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base">{company}</span>
              {amount && (
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {amount}
                </span>
              )}
              {investors && investors.length > 0 && (
                <span className="text-slate-600 text-[11px] sm:text-xs md:text-sm leading-tight">
                  <span className="font-medium">投資家:</span> <span className="break-words">{Array.isArray(investors) ? investors.slice(0, 2).join(', ') + (investors.length > 2 ? '...' : '') : investors}</span>
                </span>
              )}
              <span className="text-slate-500 text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
                📅 {publishedAt 
                  ? new Date(publishedAt).toLocaleDateString('ja-JP')
                  : new Date(createdAt).toLocaleDateString('ja-JP')
                }
              </span>
            </div>
            
            {sourceUrl && (
              <div className="mt-2 sm:mt-3">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 active:text-blue-900 font-medium min-h-[44px] py-2"
                  onClick={handleLinkClick}
                >
                  詳細を見る
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
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
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Newspaper className="h-10 w-10 text-gray-300" />
                </div>
              )}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm bg-emerald-500/90 text-white">
                  {newsTypeLabel(type)}
                </span>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {area && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500/70" />
                    {area}
                  </span>
                )}
                {sector && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
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
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-emerald-600 hover:to-teal-600 transition-all min-h-[48px]"
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
