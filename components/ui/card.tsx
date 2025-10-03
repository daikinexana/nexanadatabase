"use client";

import { useState } from "react";
import Image from "next/image";
import SimpleImage from "./simple-image";
import { Calendar, MapPin, Building, ExternalLink, Clock } from "lucide-react";
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
  organizerType?: string;
  category?: string;
  tags?: string[];
  website?: string;
  amount?: string;
  type?: "contest" | "event" | "open-call" | "subsidy" | "news" | "knowledge" | "facility" | "asset-provision" | "technology";
  address?: string;
  venue?: string;
  contact?: string;
  // Facility specific fields
  targetArea?: string;
  facilityInfo?: string;
  targetAudience?: string;
  program?: string;
  // Contest specific fields
  incentive?: string;
  operatingCompany?: string;
  isPopular?: boolean;
  // Open-call specific fields
  availableResources?: string;
  isDropinAvailable?: boolean;
  isNexanaAvailable?: boolean;
  onClick?: () => void;
}

export default function Card({
  // id,
  title,
  description,
  imageUrl,
  deadline,
  startDate,
  endDate,
  area,
  organizer,
  organizerType,
  // category,
  tags,
  website,
  // amount,
  type = "contest",
  // address,
  venue,
  // contact,
  targetArea,
  facilityInfo,
  targetAudience,
  program,
  incentive,
  operatingCompany,
  isPopular,
  availableResources,
  isDropinAvailable,
  isNexanaAvailable,
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
      // 新しい5つのカテゴリ
      "企業": "企業",
      "行政": "行政", 
      "大学": "大学",
      "CV": "CV",
      "その他": "その他",
      // 既存の値との互換性のため
      GOVERNMENT: "行政",
      VC: "CV",
      CVC: "CV", 
      BANK: "企業",
      REAL_ESTATE: "企業",
      CORPORATION: "企業",
      RESEARCH_INSTITUTION: "大学",
      OTHER: "その他",
    };
    return typeMap[type] || type;
  };

  const getOrganizerTypeStyle = (type: string) => {
    const styleMap: Record<string, { className: string; style: React.CSSProperties }> = {
      // 新しい5つのカテゴリ
      "企業": { 
        className: "bg-red-600", 
        style: { backgroundColor: '#dc2626' } 
      }, // 企業 - 赤
      "行政": { 
        className: "bg-blue-600", 
        style: { backgroundColor: '#2563eb' } 
      }, // 行政 - 青
      "大学": { 
        className: "bg-green-600", 
        style: { backgroundColor: '#16a34a' } 
      }, // 大学 - 緑
      "CV": { 
        className: "bg-purple-600", 
        style: { backgroundColor: '#9333ea' } 
      }, // CV - 紫
      "その他": { 
        className: "bg-gray-600", 
        style: { backgroundColor: '#4b5563' } 
      }, // その他 - グレー
      // 既存の値との互換性のため
      GOVERNMENT: { 
        className: "bg-blue-600", 
        style: { backgroundColor: '#2563eb' } 
      }, // 行政 - 青
      VC: { 
        className: "bg-purple-600", 
        style: { backgroundColor: '#9333ea' } 
      }, // CV - 紫
      CVC: { 
        className: "bg-purple-600", 
        style: { backgroundColor: '#9333ea' } 
      }, // CV - 紫
      BANK: { 
        className: "bg-red-600", 
        style: { backgroundColor: '#dc2626' } 
      }, // 企業 - 赤
      REAL_ESTATE: { 
        className: "bg-red-600", 
        style: { backgroundColor: '#dc2626' } 
      }, // 企業 - 赤
      CORPORATION: { 
        className: "bg-red-600", 
        style: { backgroundColor: '#dc2626' } 
      }, // 企業 - 赤
      RESEARCH_INSTITUTION: { 
        className: "bg-green-600", 
        style: { backgroundColor: '#16a34a' } 
      }, // 大学 - 緑
      OTHER: { 
        className: "bg-gray-600", 
        style: { backgroundColor: '#4b5563' } 
      }, // その他 - グレー
    };
    const result = styleMap[type] || { className: "bg-gray-600", style: { backgroundColor: '#4b5563' } };
    return result;
  };

  // const getCategoryLabel = (category: string) => {
  //   const categoryMap: Record<string, string> = {
  //     STARTUP_CONTEST: "スタートアップコンテスト",
  //     INNOVATION_CHALLENGE: "イノベーションチャレンジ",
  //     HACKATHON: "ハッカソン",
  //     PITCH_CONTEST: "ピッチコンテスト",
  //     BUSINESS_PLAN: "ビジネスプラン",
  //     SUBSIDY: "補助金",
  //     GRANT: "助成金",
  //     PARTNERSHIP: "パートナーシップ",
  //     COLLABORATION: "協業",
  //     ASSET_PROVISION: "アセット提供",
  //     TECHNOLOGY_PROVISION: "技術提供",
  //     FUNDING: "投資",
  //     M_AND_A: "M&A",
  //     IPO: "IPO",
  //     AI: "AI",
  //     DEEPTECH: "ディープテック",
  //     BIOTECH: "バイオテック",
  //     CLEANTECH: "クリーンテック",
  //     FINTECH: "フィンテック",
  //     HEALTHTECH: "ヘルステック",
  //     EDUTECH: "エドテック",
  //     OTHER: "その他",
  //   };
  //   return categoryMap[category] || category;
  // };

  return (
    <>
      {/* カード */}
        <div
          className={`${
            type === "facility" && isNexanaAvailable
              ? "bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/50 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden group h-full flex flex-col relative backdrop-blur-sm"
              : type === "contest" && isPopular
              ? "bg-gradient-to-br from-white to-red-50/30 border border-red-200/50 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden group h-full flex flex-col relative backdrop-blur-sm"
              : "bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group h-full flex flex-col"
          }`}
          onClick={handleCardClick}
        >
        {/* nexana設置施設の特別な装飾 */}
        {type === "facility" && isNexanaAvailable && (
          <>
            {/* モダンなグラデーションアクセントライン */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>
            {/* スタートアップらしい光る効果 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
            {/* 右下のモダンなアクセント */}
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg"></div>
            {/* 左上の微細なアクセント */}
            <div className="absolute top-4 left-4 w-1 h-1 bg-emerald-300 rounded-full opacity-80"></div>
          </>
        )}

        {/* 人気コンテストの特別な装飾 */}
        {type === "contest" && isPopular && (
          <>
            {/* モダンなグラデーションアクセントライン */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400"></div>
            {/* スタートアップらしい光る効果 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-transparent rounded-full blur-2xl"></div>
            {/* 右下のモダンなアクセント */}
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full shadow-lg"></div>
            {/* 左上の微細なアクセント */}
            <div className="absolute top-4 left-4 w-1 h-1 bg-red-300 rounded-full opacity-80"></div>
          </>
        )}

        
        {/* 画像 */}
        {imageUrl ? (
          <div className="relative h-48 w-full overflow-hidden">
            <SimpleImage
              src={imageUrl}
              alt={title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* nexana設置施設バッジ - モダンなデザイン */}
            {type === "facility" && isNexanaAvailable && (
              <div className="absolute top-4 right-4">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-all duration-500"></div>
                  <span className="relative px-4 py-2 bg-white/95 text-emerald-700 text-xs font-black rounded-2xl shadow-2xl border border-emerald-200/50 flex items-center backdrop-blur-md">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2.5 animate-pulse shadow-sm"></div>
                    <span className="tracking-wider font-extrabold">NEXANA</span>
                  </span>
                </div>
              </div>
            )}
            {/* 人気コンテストバッジ - モダンなデザイン */}
            {type === "contest" && isPopular && (
              <div className="absolute top-4 right-4">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-all duration-500"></div>
                  <span className="relative px-4 py-2 bg-white/95 text-red-700 text-xs font-black rounded-2xl shadow-2xl border border-red-200/50 flex items-center backdrop-blur-md">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-2.5 animate-pulse shadow-sm"></div>
                    <span className="tracking-wider font-extrabold">人気</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-48 w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <Building className="h-16 w-16 text-blue-400" />
            {/* nexana設置施設バッジ（画像なしの場合） - モダンなデザイン */}
            {type === "facility" && isNexanaAvailable && (
              <div className="absolute top-4 right-4">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-all duration-500"></div>
                  <span className="relative px-4 py-2 bg-white/95 text-emerald-700 text-xs font-black rounded-2xl shadow-2xl border border-emerald-200/50 flex items-center backdrop-blur-md">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-2.5 animate-pulse shadow-sm"></div>
                    <span className="tracking-wider font-extrabold">NEXANA</span>
                  </span>
                </div>
              </div>
            )}
            {/* 人気コンテストバッジ（画像なしの場合） - モダンなデザイン */}
            {type === "contest" && isPopular && (
              <div className="absolute top-4 right-4">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 rounded-2xl blur-md opacity-60 group-hover:opacity-90 transition-all duration-500"></div>
                  <span className="relative px-4 py-2 bg-white/95 text-red-700 text-xs font-black rounded-2xl shadow-2xl border border-red-200/50 flex items-center backdrop-blur-md">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-2.5 animate-pulse shadow-sm"></div>
                    <span className="tracking-wider font-extrabold">人気</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* nexana設置施設の下部インジケーター - モダンなグラデーション */}
        {type === "facility" && isNexanaAvailable && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-lg"></div>
        )}

        {/* 人気コンテストの下部インジケーター - モダンなグラデーション */}
        {type === "contest" && isPopular && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 shadow-lg"></div>
        )}


        <div className="p-6 flex flex-col flex-1">
          {/* タイトル */}
          <div className="h-14 mb-3 flex items-start">
            <h3 className={`text-lg font-bold line-clamp-2 transition-colors ${
              type === "facility" && isNexanaAvailable
                ? "text-emerald-900 group-hover:text-emerald-800 bg-gradient-to-r from-emerald-900 to-teal-800 bg-clip-text text-transparent"
                : type === "contest" && isPopular
                ? "text-red-900 group-hover:text-red-800 bg-gradient-to-r from-red-900 to-pink-800 bg-clip-text text-transparent"
                : "text-gray-900 group-hover:text-blue-600"
            }`}>
              {title}
            </h3>
          </div>

          {/* 主催者 */}
          <div className="flex items-center space-x-2 mb-3">
            <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600 truncate">{organizer}</span>
          </div>

          {/* 主催者タイプとドロップイン */}
          <div className="mb-3 flex flex-wrap gap-2">
            {organizerType && (
              <span 
                className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${getOrganizerTypeStyle(organizerType).className}`}
                style={getOrganizerTypeStyle(organizerType).style}
              >
                {getOrganizerTypeLabel(organizerType)}
              </span>
            )}
            {type === "contest" && isPopular && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                人気
              </span>
            )}
            {type === "facility" && isDropinAvailable && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                ドロップイン
              </span>
            )}
          </div>



          {/* 説明（最初の50文字のみ） */}
          {description ? (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3">
              {description.length > 50 ? `${description.substring(0, 50)}...` : description}
            </p>
          ) : (
            <div className="mb-3">
              <div className="h-4 bg-gray-100 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
            </div>
          )}

          {/* 締切日（facility以外、締切日がある場合のみ） */}
          {type !== "facility" && deadline && (
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 font-medium">
                締切: {format(deadline, "yyyy年MM月dd日", { locale: ja })}
              </span>
            </div>
          )}

          {/* 開始日・終了日（イベント用） */}
          {type === "event" && startDate && (
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 font-medium">
                {format(startDate, "yyyy年MM月dd日", { locale: ja })}
                {endDate && ` 〜 ${format(endDate, "MM月dd日", { locale: ja })}`}
              </span>
            </div>
          )}

          {/* 会場（イベント用） */}
          {type === "event" && venue && (
            <div className="flex items-center space-x-2 mb-3">
              <Building className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 font-medium truncate">{venue}</span>
            </div>
          )}

          {/* エリア */}
          {area ? (
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 font-medium">{area}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="h-4 w-4 text-gray-300 flex-shrink-0" />
              <span className="text-sm text-gray-400 italic">エリア未定</span>
            </div>
          )}

          {/* カウントダウンバッジ（エリアの下、facility以外） */}
          {type !== "facility" && deadline && (
            <div className="mb-4 flex justify-center">
              <div className={`relative px-4 py-2 text-sm font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 ${getStatusColor(deadline)}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                <div className="relative flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {(() => {
                      const days = getDaysRemaining(deadline);
                      if (days < 0) return "締切済み";
                      if (days === 0) return "今日締切！";
                      if (days === 1) return "明日締切！";
                      if (days <= 7) return `残り${days}日`;
                      return `残り${days}日`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* イベント開始日までのカウントダウンバッジ（イベント用） */}
          {type === "event" && startDate && (
            <div className="mb-4 flex justify-center">
              <div className={`relative px-4 py-2 text-sm font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 ${getStatusColor(startDate)}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                <div className="relative flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {(() => {
                      const days = getDaysRemaining(startDate);
                      if (days < 0) return "開催済み";
                      if (days === 0) return "今日開催！";
                      if (days === 1) return "明日開催！";
                      if (days <= 7) return `開催まで${days}日`;
                      return `開催まで${days}日`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 追加情報のプレースホルダー */}
          <div className="mt-3 space-y-2">
            {type === "open-call" && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                  <span className="text-xs text-gray-400">詳細情報あり</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                  <span className="text-xs text-gray-400">応募条件・要件</span>
                </div>
              </>
            )}
          </div>

          {/* ホバー時の詳細表示インジケーター */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>詳細を見る</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <div className="h-full flex flex-col">
          {/* コンテンツセクション */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="space-y-8">
              {/* ヒーロー画像セクション */}
              {imageUrl ? (
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    {area && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <MapPin className="h-6 w-6" />
                        <span className="text-xl font-medium">{area}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-80 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center">
                    <Building className="h-24 w-24 text-white/80 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
                    {area && (
                      <div className="flex items-center justify-center space-x-2 text-white/90">
                        <MapPin className="h-6 w-6" />
                        <span className="text-xl font-medium">{area}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-8 space-y-8">
              {/* 基本情報カード */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                  基本情報
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">主催者</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Building className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 font-medium">{organizer}</span>
                      </div>
                    </div>

                    {organizerType && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">主催者タイプ</label>
                        <div className="mt-2">
                          <span 
                            className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${getOrganizerTypeStyle(organizerType).className}`}
                            style={getOrganizerTypeStyle(organizerType).style}
                          >
                            {getOrganizerTypeLabel(organizerType)}
                          </span>
                        </div>
                      </div>
                    )}



                    {type === "event" && venue && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">会場</label>
                        <div className="flex items-center space-x-3 mt-2">
                          <Building className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-900 font-medium">{venue}</span>
                        </div>
                      </div>
                    )}

                    {area && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">エリア</label>
                        <div className="flex items-center space-x-3 mt-2">
                          <MapPin className="h-5 w-5 text-blue-500" />
                          <span className="text-gray-900 font-medium">{area}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {type !== "facility" && deadline && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">締切日</label>
                        <div className="flex items-center space-x-3 mt-2">
                          <Clock className="h-5 w-5 text-red-500" />
                          <span className="text-gray-900 font-medium">
                            {format(deadline, "yyyy年MM月dd日 HH:mm", { locale: ja })}
                          </span>
                        </div>
                      </div>
                    )}

                    {startDate && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          {type === "event" ? "開催日" : "開始日"}
                        </label>
                        <div className="flex items-center space-x-3 mt-2">
                          <Calendar className="h-5 w-5 text-green-500" />
                          <span className="text-gray-900 font-medium">
                            {format(startDate, "yyyy年MM月dd日 HH:mm", { locale: ja })}
                            {type === "event" && endDate && (
                              <span className="ml-2 text-gray-600">
                                〜 {format(endDate, "yyyy年MM月dd日 HH:mm", { locale: ja })}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {type === "event" && endDate && !startDate && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">終了日</label>
                        <div className="flex items-center space-x-3 mt-2">
                          <Calendar className="h-5 w-5 text-red-500" />
                          <span className="text-gray-900 font-medium">
                            {format(endDate, "yyyy年MM月dd日 HH:mm", { locale: ja })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 説明文カード */}
              {description && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
                    概要
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">{description}</p>
                </div>
              )}

              {/* イベント固有の詳細情報 */}
              {type === "event" && (targetArea || targetAudience || operatingCompany || venue) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
                    詳細情報
                  </h3>
                  
                  <div className="space-y-6">
                    {venue && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">会場</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{venue}</p>
                      </div>
                    )}
                    
                    {targetArea && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">提供プログラム情報</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{targetArea}</p>
                      </div>
                    )}
                    
                    {targetAudience && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">対象者</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{targetAudience}</p>
                      </div>
                    )}

                    {operatingCompany && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">運営企業</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{operatingCompany}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Open-call固有の詳細情報 */}
              {type === "open-call" && (targetArea || targetAudience || area || organizer || operatingCompany || organizerType || availableResources) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
                    詳細情報
                  </h3>
                  
                  <div className="space-y-6">
                    {targetArea && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">提供プログラム情報</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{targetArea}</p>
                      </div>
                    )}
                    
                    {targetAudience && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">対象者</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{targetAudience}</p>
                      </div>
                    )}


                    {area && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">エリア</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{area}</p>
                      </div>
                    )}

                    {organizer && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">主催者</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{organizer}</p>
                      </div>
                    )}

                    {operatingCompany && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">運営企業</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{operatingCompany}</p>
                      </div>
                    )}



                    {availableResources && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">提供可能なリソース/技術</label>
                        <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-900 leading-relaxed whitespace-pre-line">
                              {availableResources.split('\n').map((line, index) => {
                                // 箇条書きや番号付きリストを検出
                                if (line.trim().match(/^[\d\-\*\•]\s/)) {
                                  return (
                                    <div key={index} className="flex items-start space-x-2 mb-2">
                                      <span className="text-blue-500 font-bold mt-1">•</span>
                                      <span className="flex-1">{line.replace(/^[\d\-\*\•]\s/, '')}</span>
                                    </div>
                                  );
                                }
                                // 見出しを検出（## や ### で始まる行）
                                if (line.trim().match(/^#{1,3}\s/)) {
                                  const level = line.match(/^#{1,3}/)?.[0].length || 1;
                                  const text = line.replace(/^#{1,3}\s/, '');
                                  return (
                                    <div key={index} className={`font-bold text-gray-900 mb-3 mt-4 ${
                                      level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'
                                    }`}>
                                      {text}
                                    </div>
                                  );
                                }
                                // 空行
                                if (line.trim() === '') {
                                  return <div key={index} className="h-2"></div>;
                                }
                                // 通常のテキスト
                                return (
                                  <div key={index} className="mb-2">
                                    {line}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* コンテスト固有の詳細情報 */}
              {type === "contest" && (targetArea || targetAudience || incentive || operatingCompany) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
                    詳細情報
                  </h3>
                  
                  <div className="space-y-6">
                    {targetArea && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">提供プログラム情報</label>
                        <div className="mt-2">
                          {targetArea.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-blue-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {targetAudience && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">対象者</label>
                        <div className="mt-2">
                          {targetAudience.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-green-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {incentive && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">インセンティブ</label>
                        <div className="mt-2">
                          {incentive.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-blue-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {operatingCompany && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">運営企業</label>
                        <p className="text-gray-900 mt-2 leading-relaxed">{operatingCompany}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 施設固有の詳細情報 */}
              {type === "facility" && (targetArea || facilityInfo || targetAudience || program || isDropinAvailable || isNexanaAvailable) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
                    詳細情報
                  </h3>
                  
                  <div className="space-y-6">
                    {targetArea && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">提供プログラム情報</label>
                        <div className="mt-2">
                          {targetArea.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-blue-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {facilityInfo && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">施設情報</label>
                        <div className="mt-2">
                          {facilityInfo.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-green-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 利用可能性（施設情報内に表示） */}
                    {(isDropinAvailable || isNexanaAvailable) && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">施設情報その他</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {isDropinAvailable && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-blue-200">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
                              ドロップイン可能施設
                            </span>
                          )}
                          {isNexanaAvailable && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-green-200">
                              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-2"></div>
                              nexana設置施設
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {targetAudience && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">対象者</label>
                        <div className="mt-2">
                          {targetAudience.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-purple-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {program && (
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">プログラム</label>
                        <div className="mt-2">
                          {program.split(';').map((item, index) => (
                            <div key={index} className="flex items-start space-x-2 mb-1">
                              <span className="text-orange-500 font-bold mt-1">•</span>
                              <span className="text-gray-900">{item.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* タグ */}
              {tags && tags.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-3"></div>
                    タグ
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ウェブサイトリンク */}
              {website && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-center">
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="h-6 w-6" />
                    <span>ウェブサイトを見る</span>
                  </a>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
