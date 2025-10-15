"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SimpleImage from "./simple-image";
import { Calendar, MapPin, Building, ExternalLink, Clock, Copy, Loader2, Star } from "lucide-react";
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
  const [copySuccess, setCopySuccess] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 画像のプリロード
  useEffect(() => {
    if (imageUrl && isModalOpen) {
      setIsImageLoading(true);
      setImageLoaded(false);
      
      const img = new window.Image();
      img.onload = () => {
        setIsImageLoading(false);
        setImageLoaded(true);
      };
      img.onerror = () => {
        setIsImageLoading(false);
        setImageLoaded(false);
      };
      img.src = imageUrl;
    }
  }, [imageUrl, isModalOpen]);

  // ホバー時に画像をプリロード
  const handleCardHover = () => {
    if (imageUrl && !imageLoaded) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      document.head.appendChild(link);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // モーダルを開く前に画像をプリロード
      if (imageUrl) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageUrl;
        document.head.appendChild(link);
      }
      setIsModalOpen(true);
    }
  };

  // 共有機能
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + `/open-calls?search=${encodeURIComponent(title)}`;
    }
    return '';
  };


  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
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
      {/* カード - 統一されたサイズのデザイン */}
        <div
          className={`${
            type === "facility" && isNexanaAvailable
              ? "bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group h-[500px] flex flex-col relative border border-gray-200"
              : type === "contest" && isPopular
              ? "bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group h-[500px] flex flex-col relative border border-red-100"
              : "bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group h-[500px] flex flex-col relative border border-gray-200"
          }`}
          onClick={handleCardClick}
          onMouseEnter={handleCardHover}
        >
          {/* 施設のバッジ - カードの右上角に表示 */}
          {type === "facility" && (isNexanaAvailable || isDropinAvailable) && (
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
              {/* nexana設置施設のバッジ */}
              {isNexanaAvailable && (
                <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-lg border border-blue-500">
                  NEXANA
                </div>
              )}
              {/* ドロップイン可能施設のバッジ */}
              {isDropinAvailable && (
                <div className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold rounded-full shadow-lg border border-green-500">
                  ドロップイン
                </div>
              )}
            </div>
          )}


        
        {/* コンテンツエリア - 厳密に統一されたレイアウト */}
        <div className="p-6 flex flex-col h-[252px]">
          {/* ヘッダー部分 - カテゴリと日付（厳密に固定高さ） */}
          <div className="flex items-center justify-between mb-4 h-8">
            {/* カテゴリアイコン - 左上 */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {organizerType === "企業" ? "企" : 
                   organizerType === "行政" ? "行" : 
                   organizerType === "大学" ? "大" : 
                   organizerType === "CV" ? "VC" : "他"}
                </span>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {type === "facility" ? "施設" : 
                 type === "open-call" ? "公募" : "コンテスト"}
              </span>
            </div>

            {/* 締切日 - 右上に大きく表示（月.日の順） */}
            {deadline && (
              <div className="text-right relative">
                <div className="text-3xl font-bold text-gray-900 leading-none">
                  {format(deadline, "MM.dd", { locale: ja })}
                </div>
              </div>
            )}
            
          </div>

          {/* タイトル - 見切れないように高さを調整 */}
          <div className="mb-4 h-9 flex items-center overflow-hidden">
            <div className="flex items-center space-x-2 w-full">
              {/* 人気コンテストの星アイコン */}
              {type === "contest" && isPopular && (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
              )}
              <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 group-hover:text-gray-700 transition-colors flex-1">
                {title}
              </h3>
            </div>
          </div>

          {/* 主催者とエリア情報 - 厳密に固定高さで統一 */}
          <div className="mb-4 h-12 flex flex-col justify-center space-y-1">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">{organizer}</span>
            </div>
            {area && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 font-medium">{area}</span>
              </div>
            )}
          </div>

          {/* 説明文 - 1行表示に制限 */}
          <div className="mb-4 h-6 flex items-center overflow-hidden">
            {description && (
              <p className="text-gray-600 text-sm leading-tight line-clamp-1 w-full">
                {description}
              </p>
            )}
          </div>

          {/* ステータスバッジ - 洗練されたデザイン */}
          <div className="mt-auto h-8 flex items-center">
            {type !== "facility" && deadline && (
              <div className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-200 ${
                (() => {
                  const days = getDaysRemaining(deadline);
                  if (days < 0) return "bg-gray-100 text-gray-600 border-gray-200";
                  if (days === 0) return "bg-black text-white border-black";
                  if (days === 1) return "bg-gray-800 text-white border-gray-800";
                  if (days <= 7) return "bg-gray-200 text-gray-800 border-gray-300";
                  return "bg-white text-gray-800 border-gray-300";
                })()
              }`}>
                <Clock className="h-4 w-4 mr-2" />
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
            )}
          </div>
        </div>

        {/* 画像 - 横長画像に対応した表示 */}
        {imageUrl ? (
          <div className="relative w-[calc(100%-48px)] mx-auto mb-4 overflow-hidden border border-gray-200 rounded-lg">
            <div className="relative w-full h-[200px] sm:h-[240px]">
              <SimpleImage
                src={imageUrl}
                alt={title}
                fill
                priority={false}
                className="object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        ) : (
          <div className="relative h-[200px] w-[calc(100%-48px)] mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200 rounded-lg">
            <Building className="h-16 w-16 text-gray-400" />
          </div>
        )}




      </div>

      {/* モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <div className="h-full flex flex-col">
          {/* コンテンツセクション - iPhone 16最適化 */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-6 sm:space-y-8">
              {/* ヒーロー画像セクション - iPhone 16対応 */}
              {imageUrl ? (
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  {/* ローディング状態 */}
                  {isImageLoading && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-10">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                        <p className="text-sm text-gray-500">画像を読み込み中...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 画像 */}
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    priority={true}
                    className={`object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    sizes="100vw"
                    onLoad={() => {
                      setIsImageLoading(false);
                      setImageLoaded(true);
                    }}
                    onError={() => {
                      setIsImageLoading(false);
                      setImageLoaded(false);
                    }}
                  />
                  
                  {/* グラデーションオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* タイトルとエリア情報 */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">{title}</h2>
                    {area && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-lg sm:text-xl font-medium">{area}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-64 sm:h-80 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center px-4">
                    <Building className="h-20 w-20 sm:h-24 sm:w-24 text-white/80 mx-auto mb-4 sm:mb-6" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">{title}</h2>
                    {area && (
                      <div className="flex items-center justify-center space-x-2 text-white/90">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="text-lg sm:text-xl font-medium">{area}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {/* 基本情報カード - iPhone 16最適化 */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                  基本情報
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

              {/* 説明文カード - iPhone 16最適化 */}
              {description && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
                    概要
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{description}</p>
                </div>
              )}

              {/* イベント固有の詳細情報 - iPhone 16最適化 */}
              {type === "event" && (targetArea || targetAudience || operatingCompany || venue) && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
                    詳細情報
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-6">
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

              {/* アクションボタン - ウェブサイトと共有 */}
              <div className="text-center space-y-4">
                {/* ウェブサイトリンク */}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {/* 背景の白いエリア */}
                    <div className="absolute inset-1 bg-white rounded-xl"></div>
                    
                    {/* コンテンツ */}
                    <div className="relative flex items-center justify-center space-x-3 px-6 py-2">
                      <ExternalLink className="h-5 w-5 text-gray-800 group-hover:text-gray-900 transition-colors duration-300" />
                      <span className="text-gray-800 group-hover:text-gray-900 font-semibold text-base transition-colors duration-300">ウェブサイトを見る</span>
                    </div>
                  </a>
                )}

                {/* URLをコピーして共有ボタン */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCopyUrl}
                    className="group inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Copy className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors duration-200 mr-2" />
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium text-sm transition-colors duration-200">
                      {copySuccess ? 'コピーしました！' : 'URLをコピー'}
                    </span>
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
