"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, MapPin, Building, ExternalLink, Clock, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Modal from "./modal";

interface CardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: Date;
  startDate?: Date;
  endDate?: Date;
  area?: string;
  organizer: string;
  organizerType: string;
  category?: string;
  tags: string[];
  website?: string;
  amount?: string;
  type?: "contest" | "event" | "open-call" | "subsidy" | "news" | "knowledge" | "facility" | "asset-provision" | "technology";
  address?: string;
  venue?: string;
  contact?: string;
  onClick?: () => void;
}

export default function Card({
  id,
  title,
  description,
  imageUrl,
  deadline,
  startDate,
  endDate,
  area,
  organizer,
  organizerType,
  category,
  tags,
  website,
  amount,
  type = "contest",
  address,
  venue,
  contact,
  onClick,
}: CardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  const getDaysRemaining = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (date: Date) => {
    const days = getDaysRemaining(date);
    if (days < 0) return "bg-red-100 text-red-800";
    if (days <= 7) return "bg-orange-100 text-orange-800";
    if (days <= 30) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getOrganizerTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      GOVERNMENT: "行政",
      VC: "VC",
      CVC: "CVC",
      BANK: "銀行",
      REAL_ESTATE: "不動産",
      CORPORATION: "企業",
      RESEARCH_INSTITUTION: "研究機関",
      OTHER: "その他",
    };
    return typeMap[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      STARTUP_CONTEST: "スタートアップコンテスト",
      INNOVATION_CHALLENGE: "イノベーションチャレンジ",
      HACKATHON: "ハッカソン",
      PITCH_CONTEST: "ピッチコンテスト",
      BUSINESS_PLAN: "ビジネスプラン",
      SUBSIDY: "補助金",
      GRANT: "助成金",
      PARTNERSHIP: "パートナーシップ",
      COLLABORATION: "協業",
      ASSET_PROVISION: "アセット提供",
      TECHNOLOGY_PROVISION: "技術提供",
      FUNDING: "投資",
      M_AND_A: "M&A",
      IPO: "IPO",
      AI: "AI",
      DEEPTECH: "ディープテック",
      BIOTECH: "バイオテック",
      CLEANTECH: "クリーンテック",
      FINTECH: "フィンテック",
      HEALTHTECH: "ヘルステック",
      EDUTECH: "エドテック",
      OTHER: "その他",
    };
    return categoryMap[category] || category;
  };

  return (
    <>
      {/* カード */}
      <div
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-96 flex flex-col"
        onClick={handleCardClick}
      >
        {/* 画像 */}
        {imageUrl ? (
          <div className="relative h-40 w-full flex-shrink-0">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative h-40 w-full flex-shrink-0 bg-gray-100 flex items-center justify-center">
            <Building className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col min-h-0">
          {/* ヘッダー情報 */}
          <div className="mb-3 flex-shrink-0">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
              {title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
              <Building className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{organizer}</span>
              <span className="text-gray-400 flex-shrink-0">•</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs whitespace-nowrap flex-shrink-0">
                {getOrganizerTypeLabel(organizerType)}
              </span>
            </div>
          </div>

          {/* 説明文 */}
          <div className="mb-3 flex-1 min-h-[2.5rem]">
            {description ? (
              <p className="text-gray-600 text-xs line-clamp-2">
                {description}
              </p>
            ) : (
              <div className="h-[2.5rem]"></div>
            )}
          </div>

          {/* 日付情報 */}
          <div className="space-y-1 mb-3 flex-shrink-0">
            {deadline && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600">締切:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deadline)}`}>
                  {getDaysRemaining(deadline) > 0
                    ? `残り${getDaysRemaining(deadline)}日`
                    : "締切済み"
                  }
                </span>
              </div>
            )}
            
            {startDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600">開催:</span>
                <span className="text-xs text-gray-500">
                  {format(startDate, "MM/dd", { locale: ja })}
                  {endDate && `-${format(endDate, "MM/dd", { locale: ja })}`}
                </span>
              </div>
            )}
          </div>

          {/* エリア情報 */}
          {area && (
            <div className="flex items-center space-x-1 mb-3 flex-shrink-0">
              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">{area}</span>
            </div>
          )}

          {/* 金額情報 */}
          {amount && (
            <div className="mb-3 flex-shrink-0">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {amount}
              </span>
            </div>
          )}

          {/* カテゴリ */}
          {category && (
            <div className="mb-3 flex-shrink-0">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {getCategoryLabel(category)}
              </span>
            </div>
          )}

          {/* タグ */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 flex-shrink-0">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <div className="p-6 h-full flex flex-col">
          {/* 画像 */}
          {imageUrl ? (
            <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative h-48 w-full mb-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Building className="h-16 w-16 text-gray-400" />
            </div>
          )}

          {/* 詳細情報 */}
          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">主催者</h4>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{organizer}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {getOrganizerTypeLabel(organizerType)}
                  </span>
                </div>
              </div>

              {area && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">エリア</h4>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{area}</span>
                  </div>
                </div>
              )}

              {category && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">カテゴリ</h4>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {getCategoryLabel(category)}
                  </span>
                </div>
              )}

              {amount && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">金額</h4>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {amount}
                  </span>
                </div>
              )}
            </div>

            {/* 日付情報 */}
            {(deadline || startDate) && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">日程</h4>
                <div className="space-y-2">
                  {deadline && (
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">締切日:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deadline)}`}>
                        {getDaysRemaining(deadline) > 0
                          ? `残り${getDaysRemaining(deadline)}日`
                          : "締切済み"
                        }
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(deadline, "yyyy年MM月dd日", { locale: ja })}
                      </span>
                    </div>
                  )}
                  
                  {startDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">開催期間:</span>
                      <span className="text-sm text-gray-700">
                        {format(startDate, "yyyy年MM月dd日", { locale: ja })}
                        {endDate && ` - ${format(endDate, "yyyy年MM月dd日", { locale: ja })}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 説明文 */}
            {description && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">概要</h4>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}

            {/* タグ */}
            {tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">タグ</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 外部リンク */}
            {website && (
              <div className="pt-4 border-t border-gray-100">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>詳細ページを見る</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
