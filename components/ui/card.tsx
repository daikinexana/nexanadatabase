"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SimpleImage from "./simple-image";
import { Calendar, MapPin, Building, ExternalLink, Clock, Copy, Loader2, Star, Trophy, Zap, Target, Handshake, Briefcase } from "lucide-react";
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
      {/* カード - コンテストタイプは魅力的なデザインに */}
        <div
          className={`${
            type === "facility" && isNexanaAvailable
              ? "bg-white rounded-lg shadow-sm sm:hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group h-auto sm:h-[500px] flex flex-col relative border border-gray-200 active:scale-[0.98]"
              : type === "contest" && isPopular
              ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl shadow-lg sm:hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-visible group h-auto flex flex-col relative border-2 border-amber-300/50 sm:hover:border-amber-400 active:scale-[0.98]"
              : type === "contest"
              ? "bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 rounded-xl sm:rounded-2xl shadow-md sm:hover:shadow-xl transition-all duration-300 cursor-pointer overflow-visible group h-auto flex flex-col relative border border-amber-200/50 sm:hover:border-amber-300 active:scale-[0.98]"
              : type === "open-call"
              ? "bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 rounded-xl sm:rounded-2xl shadow-md sm:hover:shadow-xl transition-all duration-300 cursor-pointer overflow-visible group h-auto flex flex-col relative border border-blue-200/50 sm:hover:border-blue-300 active:scale-[0.98]"
              : "bg-white rounded-lg shadow-sm sm:hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group h-auto sm:h-[500px] flex flex-col relative border border-gray-200 active:scale-[0.98]"
          }`}
          onClick={handleCardClick}
          onMouseEnter={handleCardHover}
        >
          {/* コンテスト専用のグラデーションアクセント */}
          {type === "contest" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          
          {/* Open-call専用のグラデーションアクセント */}
          {type === "open-call" && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
          
          {/* 人気コンテストの特別バッジ */}
          {type === "contest" && isPopular && (
            <div className="absolute top-3 right-3 z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 rounded-full blur-md opacity-60 animate-pulse"></div>
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg border-2 border-white/50">
                  <Star className="w-3.5 h-3.5 fill-white" />
                  <span>人気</span>
                </div>
              </div>
            </div>
          )}
          {/* 施設のバッジ - iPhone 16最適化 */}
          {type === "facility" && (isNexanaAvailable || isDropinAvailable) && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex flex-col gap-1.5 sm:gap-2">
              {/* nexana設置施設のバッジ */}
              {isNexanaAvailable && (
                <div className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg border border-blue-500">
                  NEXANA
                </div>
              )}
              {/* ドロップイン可能施設のバッジ */}
              {isDropinAvailable && (
                <div className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg border border-green-500">
                  ドロップイン
                </div>
              )}
            </div>
          )}

          {/* コンテストタイプは画像を上に配置 */}
          {type === "contest" && (
            <>
              {imageUrl ? (
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 z-10 pointer-events-none"></div>
                  <SimpleImage
                    src={imageUrl}
                    alt={title}
                    fill
                    priority={false}
                    className="object-cover sm:group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* グラデーションオーバーレイ */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 via-white/50 to-transparent z-10"></div>
                </div>
              ) : (
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center flex-shrink-0">
                  <div className="text-center z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg">
                      <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-amber-700">コンテスト</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Open-callタイプは画像を上に配置 */}
          {type === "open-call" && (
            <>
              {imageUrl ? (
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-emerald-500/5 z-10 pointer-events-none"></div>
                  <SimpleImage
                    src={imageUrl}
                    alt={title}
                    fill
                    priority={false}
                    className="object-cover sm:group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* グラデーションオーバーレイ */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 via-white/50 to-transparent z-10"></div>
                </div>
              ) : (
                <div className="relative w-full h-[160px] sm:h-[180px] md:h-[200px] bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                  <div className="text-center z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-2 mx-auto shadow-lg">
                      <Handshake className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-blue-700">公募</p>
                  </div>
                </div>
              )}
            </>
          )}
        
        {/* コンテンツエリア - コンテスト/Open-callタイプは魅力的なデザインに */}
        <div className={`p-4 sm:p-5 md:p-6 flex flex-col flex-1 ${type === "contest" || type === "open-call" ? "min-h-[280px] relative" : "sm:h-[252px] min-h-[200px] sm:min-h-[252px]"}`}>
          {/* コンテスト専用の背景装飾 */}
          {type === "contest" && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 via-orange-200/20 to-yellow-200/20 rounded-bl-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500"></div>
          )}
          
          {/* Open-call専用の背景装飾 */}
          {type === "open-call" && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 via-cyan-200/20 to-emerald-200/20 rounded-bl-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500"></div>
          )}
          
          {/* ヘッダー部分 - コンテスト/Open-callタイプは魅力的に */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 h-7 sm:h-8 relative z-10">
            {/* カテゴリアイコン - コンテスト/Open-callタイプは専用アイコン */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              {type === "contest" ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center ${
                    isPopular 
                      ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg" 
                      : "bg-gradient-to-br from-amber-400 to-orange-400"
                  }`}>
                    <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold ${
                    isPopular ? "text-amber-700" : "text-amber-600"
                  }`}>
                    コンテスト
                  </span>
                </div>
              ) : type === "open-call" ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-500 shadow-md">
                    <Handshake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-blue-600">
                    公募
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] sm:text-xs font-bold">
                      {organizerType === "企業" ? "企" : 
                       organizerType === "行政" ? "行" : 
                       organizerType === "大学" ? "大" : 
                       organizerType === "CV" ? "VC" : "他"}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
                    {type === "facility" ? "施設" : 
                     type === "event" ? "イベント" :
                     type === "news" ? "ニュース" :
                     type === "knowledge" ? "ナレッジ" :
                     type === "subsidy" ? "補助金" :
                     type === "asset-provision" ? "資産提供" :
                     type === "technology" ? "技術" : "その他"}
                  </span>
                </>
              )}
            </div>

            {/* 締切日 - コンテスト/Open-callタイプはより目立つデザインに */}
            {deadline && (
              <div className="text-right relative">
                {type === "contest" ? (
                  <div className="flex flex-col items-end">
                    <div className={`text-2xl sm:text-3xl font-black leading-none ${
                      (() => {
                        const days = getDaysRemaining(deadline);
                        if (days < 0) return "text-gray-400";
                        if (days === 0) return "text-red-600";
                        if (days <= 7) return "text-orange-600";
                        return "text-amber-600";
                      })()
                    }`}>
                      {format(deadline, "MM.dd", { locale: ja })}
                    </div>
                    {(() => {
                      const days = getDaysRemaining(deadline);
                      if (days >= 0 && days <= 7) {
                        return (
                          <div className="text-[8px] sm:text-[9px] font-bold text-orange-600 mt-0.5">
                            {days === 0 ? "TODAY!" : days === 1 ? "TOMORROW!" : `残り${days}日`}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ) : type === "open-call" ? (
                  <div className="flex flex-col items-end">
                    <div className={`text-2xl sm:text-3xl font-black leading-none ${
                      (() => {
                        const days = getDaysRemaining(deadline);
                        if (days < 0) return "text-gray-400";
                        if (days === 0) return "text-red-600";
                        if (days <= 7) return "text-cyan-600";
                        return "text-blue-600";
                      })()
                    }`}>
                      {format(deadline, "MM.dd", { locale: ja })}
                    </div>
                    {(() => {
                      const days = getDaysRemaining(deadline);
                      if (days >= 0 && days <= 7) {
                        return (
                          <div className="text-[8px] sm:text-[9px] font-bold text-cyan-600 mt-0.5">
                            {days === 0 ? "TODAY!" : days === 1 ? "TOMORROW!" : `残り${days}日`}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ) : (
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">
                    {format(deadline, "MM.dd", { locale: ja })}
                  </div>
                )}
              </div>
            )}
            
          </div>

          {/* タイトル - コンテスト/Open-callタイプは魅力的に */}
          <div className={`mb-2 sm:mb-3 ${type === "contest" || type === "open-call" ? "min-h-[3.5rem] sm:min-h-[4rem]" : "h-auto sm:h-9"} flex items-start overflow-hidden relative z-10`}>
            <div className="flex items-start space-x-1.5 sm:space-x-2 w-full">
              <h3 className={`${type === "contest" || type === "open-call" ? "text-base sm:text-lg md:text-xl" : "text-base sm:text-lg"} font-bold leading-tight flex-1 overflow-hidden transition-colors ${
                type === "contest" 
                  ? isPopular 
                    ? "text-gray-900 sm:group-hover:text-amber-700" 
                    : "text-gray-900 sm:group-hover:text-orange-600"
                  : type === "open-call"
                  ? "text-gray-900 sm:group-hover:text-blue-600"
                  : "text-gray-900 sm:group-hover:text-gray-700"
              }`} style={{display: '-webkit-box', WebkitLineClamp: type === "contest" || type === "open-call" ? 3 : 2, WebkitBoxOrient: 'vertical'}}>
                {title}
              </h3>
            </div>
          </div>
          
          {/* インセンティブ情報 - コンテストタイプで目立たせる */}
          {type === "contest" && incentive && (
            <div className="mb-2 sm:mb-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border border-amber-300/50 rounded-lg sm:rounded-xl max-w-full">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-amber-800 leading-tight break-words">
                  {incentive.length > 40 ? `${incentive.substring(0, 40)}...` : incentive}
                </span>
              </div>
            </div>
          )}

          {/* 利用可能リソース情報 - Open-callタイプで目立たせる */}
          {type === "open-call" && availableResources && (
            <div className="mb-2 sm:mb-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 via-cyan-100 to-emerald-100 border border-blue-300/50 rounded-lg sm:rounded-xl max-w-full">
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-blue-800 leading-tight break-words">
                  {availableResources.length > 40 ? `${availableResources.substring(0, 40)}...` : availableResources}
                </span>
              </div>
            </div>
          )}

          {/* 主催者とエリア情報 - コンテスト/Open-callタイプは魅力的に */}
          <div className={`mb-2 sm:mb-3 h-auto flex flex-col justify-center space-y-1 relative z-10 ${type === "contest" || type === "open-call" ? "opacity-90" : ""}`}>
            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
              <Building className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${
                type === "contest" ? "text-amber-500" : 
                type === "open-call" ? "text-blue-500" : 
                "text-gray-400"
              }`} />
              <span className={`text-xs sm:text-sm truncate ${
                type === "contest" || type === "open-call" ? "text-gray-700 font-semibold" : "text-gray-600"
              }`}>{organizer}</span>
            </div>
            {area && (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <MapPin className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${
                  type === "contest" ? "text-orange-500" : 
                  type === "open-call" ? "text-cyan-500" : 
                  "text-gray-400"
                }`} />
                <span className={`text-xs sm:text-sm font-medium ${
                  type === "contest" || type === "open-call" ? "text-gray-700" : "text-gray-600"
                }`}>{area}</span>
              </div>
            )}
          </div>

          {/* 説明文 - コンテスト/Open-callタイプは魅力的に */}
          <div className={`mb-2 sm:mb-3 h-auto flex items-center overflow-hidden relative z-10`}>
            {description && (
              <p className={`text-xs sm:text-sm leading-tight w-full overflow-hidden ${
                type === "contest" || type === "open-call" ? "text-gray-700" : "text-gray-600"
              }`} style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                {description}
              </p>
            )}
          </div>

          {/* ステータスバッジ - コンテスト/Open-callタイプは魅力的に、見切れないように配置 */}
          <div className={`mt-auto ${type === "contest" || type === "open-call" ? "min-h-[3.5rem] sm:min-h-[4rem]" : "min-h-[2.5rem] sm:min-h-[2rem]"} flex flex-wrap items-center gap-2 relative z-10 pt-2 pb-1`}>
            {type !== "facility" && deadline && (
              <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full border-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                type === "contest" 
                  ? (() => {
                      const days = getDaysRemaining(deadline);
                      if (days < 0) return "bg-gray-100 text-gray-600 border-gray-200";
                      if (days === 0) return "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-lg animate-pulse";
                      if (days === 1) return "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-lg";
                      if (days <= 7) return "bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-300 shadow-md";
                      return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300";
                    })()
                  : type === "open-call"
                  ? (() => {
                      const days = getDaysRemaining(deadline);
                      if (days < 0) return "bg-gray-100 text-gray-600 border-gray-200";
                      if (days === 0) return "bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-lg animate-pulse";
                      if (days === 1) return "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-400 shadow-lg";
                      if (days <= 7) return "bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-blue-300 shadow-md";
                      return "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300";
                    })()
                  : (() => {
                      const days = getDaysRemaining(deadline);
                      if (days < 0) return "bg-gray-100 text-gray-600 border-gray-200";
                      if (days === 0) return "bg-black text-white border-black";
                      if (days === 1) return "bg-gray-800 text-white border-gray-800";
                      if (days <= 7) return "bg-gray-200 text-gray-800 border-gray-300";
                      return "bg-white text-gray-800 border-gray-300";
                    })()
              }`}>
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">
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
            
            {/* コンテスト専用のアクションバッジ */}
            {type === "contest" && (
              <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full whitespace-nowrap flex-shrink-0">
                <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-amber-700">チャレンジ</span>
              </div>
            )}

            {/* Open-call専用のアクションバッジ */}
            {type === "open-call" && (
              <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full whitespace-nowrap flex-shrink-0">
                <Handshake className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold text-blue-700">応募</span>
              </div>
            )}
          </div>
        </div>

        {/* 画像 - コンテスト/Open-callタイプ以外は下に配置 */}
        {type !== "contest" && type !== "open-call" && (
          <>
            {imageUrl ? (
              <div className="relative w-[calc(100%-32px)] sm:w-[calc(100%-48px)] mx-auto mb-3 sm:mb-4 overflow-hidden border border-gray-200 rounded-lg">
                <div className="relative w-full h-[160px] sm:h-[200px] md:h-[240px]">
                  <SimpleImage
                    src={imageUrl}
                    alt={title}
                    fill
                    priority={false}
                    className="object-contain sm:group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ) : (
              <div className="relative h-[160px] sm:h-[200px] md:h-[240px] w-[calc(100%-32px)] sm:w-[calc(100%-48px)] mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200 rounded-lg">
                <Building className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400" />
              </div>
            )}
          </>
        )}




      </div>

      {/* モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <div className="h-full flex flex-col">
          {/* コンテンツセクション - PC版: 左半分固定、右半分スクロール / スマホ版: 縦積み */}
          <div className="flex-1 flex flex-col lg:flex-row bg-white overflow-hidden">
            {/* 左半分: 固定 (PC版のみ) */}
            <div className="hidden lg:block w-80 flex-shrink-0 p-6 border-r border-gray-200">
              {/* 左側コンテンツ */}
              <div className="flex flex-col h-full">
                {/* 画像セクション - 上部に配置 */}
                {imageUrl ? (
                  <div className="relative h-60 w-full overflow-hidden rounded-lg border border-gray-200 flex-shrink-0 mb-4">
                    {/* ローディング状態 */}
                    {isImageLoading && (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
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
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onLoad={() => {
                        setIsImageLoading(false);
                        setImageLoaded(true);
                      }}
                      onError={() => {
                        setIsImageLoading(false);
                        setImageLoaded(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative h-60 w-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 flex-shrink-0 mb-4">
                    <div className="text-center">
                      <Building className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">画像なし</p>
                    </div>
                  </div>
                )}

                {/* 期限情報（あれば） - 画像の下に配置 */}
                {deadline && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex-shrink-0">
                    <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
                      <Clock className="h-4 w-4 text-red-500 mr-2" />
                      期限
                    </h3>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {format(deadline, "MM月dd日", { locale: ja })}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {format(deadline, "yyyy年", { locale: ja })}
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        (() => {
                          const days = getDaysRemaining(deadline);
                          if (days < 0) return "bg-gray-100 text-gray-600";
                          if (days === 0) return "bg-red-100 text-red-800";
                          if (days === 1) return "bg-orange-100 text-orange-800";
                          if (days <= 7) return "bg-yellow-100 text-yellow-800";
                          return "bg-green-100 text-green-800";
                        })()
                      }`}>
                        {(() => {
                          const days = getDaysRemaining(deadline);
                          if (days < 0) return "締切済み";
                          if (days === 0) return "今日締切！";
                          if (days === 1) return "明日締切！";
                          if (days <= 7) return `残り${days}日`;
                          return `残り${days}日`;
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* アクションボタン - 期限の真下に配置 */}
                <div className="space-y-2 flex-shrink-0">
                  {/* ウェブサイトリンク */}
                  {website && (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full group inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      ウェブサイトを見る
                    </a>
                  )}

                  {/* URLをコピーして共有ボタン */}
                  <button
                    onClick={handleCopyUrl}
                    className="w-full group inline-flex items-center justify-center px-4 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-all duration-200 text-sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copySuccess ? 'コピーしました！' : 'URLをコピー'}
                  </button>
                </div>
              </div>
            </div>

            {/* 右半分: スクロール可能 (PC版) / 全体: スクロール可能 (スマホ版) */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                {/* スマホ版: 画像を上部に表示 - iPhone 16最適化 */}
                <div className="lg:hidden">
                  {imageUrl ? (
                    <div className="relative h-40 sm:h-48 w-full overflow-hidden rounded-lg border border-gray-200 mb-3 sm:mb-4">
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        priority={true}
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                  ) : (
                    <div className="relative h-40 sm:h-48 w-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 mb-3 sm:mb-4">
                      <div className="text-center">
                        <Building className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-xs sm:text-sm">画像なし</p>
                      </div>
                    </div>
                  )}
                  
                  {/* スマホ版: アクションボタンを画像の下に配置 - iPhone 16最適化 */}
                  <div className="flex flex-col space-y-2 mb-4 sm:mb-6">
                    {/* ウェブサイトリンク */}
                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-4 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base min-h-[44px] touch-manipulation"
                      >
                        <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        ウェブサイトを見る
                      </a>
                    )}

                    {/* URLをコピーして共有ボタン */}
                    <button
                      onClick={handleCopyUrl}
                      className="w-full inline-flex items-center justify-center px-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 active:border-gray-400 text-gray-700 hover:text-gray-900 active:text-gray-950 font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base min-h-[44px] touch-manipulation active:scale-95"
                    >
                      <Copy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {copySuccess ? 'コピーしました！' : 'URLをコピー'}
                    </button>
                  </div>
                </div>
                {/* 基本情報カード - iPhone 16最適化 */}
                <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center mr-2 sm:mr-3">
                      <span className="text-white text-xs sm:text-sm font-bold">i</span>
                    </div>
                    基本情報
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">主催者</label>
                        <div className="flex items-center space-x-2 sm:space-x-2 lg:space-x-3 mt-1.5 sm:mt-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-gray-600" />
                          </div>
                          <span className="text-gray-900 font-semibold text-sm sm:text-base lg:text-lg break-words">{organizer}</span>
                        </div>
                      </div>

                      {organizerType && (
                        <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                          <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">主催者タイプ</label>
                          <div className="mt-1.5 sm:mt-2">
                            <span 
                              className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-white text-xs sm:text-sm font-bold rounded-full ${getOrganizerTypeStyle(organizerType).className}`}
                              style={getOrganizerTypeStyle(organizerType).style}
                            >
                              {getOrganizerTypeLabel(organizerType)}
                            </span>
                          </div>
                        </div>
                      )}

                      {area && (
                        <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                          <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">エリア</label>
                          <div className="flex items-center space-x-2 sm:space-x-2 lg:space-x-3 mt-1.5 sm:mt-2">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <MapPin className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-semibold text-sm sm:text-base lg:text-lg">{area}</span>
                          </div>
                        </div>
                      )}

                      {type === "event" && venue && (
                        <div className="border-l-4 border-gray-300 pl-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">会場</label>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <Building className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-semibold text-lg">{venue}</span>
                          </div>
                        </div>
                      )}

                      {startDate && (
                        <div className="border-l-4 border-gray-300 pl-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {type === "event" ? "開催日" : "開始日"}
                          </label>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-semibold text-lg">
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
                        <div className="border-l-4 border-gray-300 pl-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">終了日</label>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-semibold text-lg">
                              {format(endDate, "yyyy年MM月dd日 HH:mm", { locale: ja })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 概要カード - iPhone 16最適化 */}
                  {description && (
                    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-white text-xs sm:text-sm font-bold">D</span>
                        </div>
                        概要
                      </h3>
                      <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                        <p className="text-gray-800 leading-relaxed text-xs sm:text-sm lg:text-base font-medium break-words">{description}</p>
                      </div>
                    </div>
                  )}

                  {/* イベント固有の詳細情報 - モダンで洗練されたモノクロ調 */}
                  {type === "event" && (targetArea || targetAudience || operatingCompany || venue) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">E</span>
                        </div>
                        詳細情報
                      </h3>
                      
                      <div className="space-y-6">
                        {venue && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">会場</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{venue}</p>
                          </div>
                        )}
                        
                        {targetArea && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">提供プログラム情報</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{targetArea}</p>
                          </div>
                        )}
                        
                        {targetAudience && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">対象者</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{targetAudience}</p>
                          </div>
                        )}

                        {operatingCompany && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">運営企業</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{operatingCompany}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Open-call固有の詳細情報 - iPhone 16最適化 */}
                  {type === "open-call" && (targetArea || targetAudience || area || organizer || operatingCompany || organizerType || availableResources) && (
                    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center mr-2 sm:mr-3">
                          <span className="text-white text-xs sm:text-sm font-bold">O</span>
                        </div>
                        詳細情報
                      </h3>
                      
                      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        {targetArea && (
                          <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">提供プログラム情報</label>
                            <p className="text-gray-900 mt-1.5 sm:mt-2 leading-relaxed text-xs sm:text-sm lg:text-base font-medium break-words">{targetArea}</p>
                          </div>
                        )}
                        
                        {targetAudience && (
                          <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">対象者</label>
                            <p className="text-gray-900 mt-1.5 sm:mt-2 leading-relaxed text-xs sm:text-sm lg:text-base font-medium break-words">{targetAudience}</p>
                          </div>
                        )}

                        {area && (
                          <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">エリア</label>
                            <p className="text-gray-900 mt-1.5 sm:mt-2 leading-relaxed text-xs sm:text-sm lg:text-base font-medium">{area}</p>
                          </div>
                        )}

                        {organizer && (
                          <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">主催者</label>
                            <p className="text-gray-900 mt-1.5 sm:mt-2 leading-relaxed text-xs sm:text-sm lg:text-base font-medium break-words">{organizer}</p>
                          </div>
                        )}

                        {operatingCompany && (
                          <div className="border-l-4 border-gray-300 pl-2.5 sm:pl-3 lg:pl-4">
                            <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">運営企業</label>
                            <p className="text-gray-900 mt-1.5 sm:mt-2 leading-relaxed text-xs sm:text-sm lg:text-base font-medium break-words">{operatingCompany}</p>
                          </div>
                        )}

                        {availableResources && (
                          <div>
                            <label className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">提供可能なリソース/技術</label>
                            <div className="mt-2 sm:mt-3 bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                              <div className="text-gray-900 leading-relaxed whitespace-pre-line text-xs sm:text-sm lg:text-base">
                                {availableResources.split('\n').map((line, index) => {
                                  // 箇条書きや番号付きリストを検出
                                  if (line.trim().match(/^[\d\-\*\•]\s/)) {
                                    return (
                                      <div key={index} className="flex items-start space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                                        <span className="text-blue-500 font-bold mt-0.5 sm:mt-1">•</span>
                                        <span className="flex-1 break-words">{line.replace(/^[\d\-\*\•]\s/, '')}</span>
                                      </div>
                                    );
                                  }
                                  // 見出しを検出（## や ### で始まる行）
                                  if (line.trim().match(/^#{1,3}\s/)) {
                                    const level = line.match(/^#{1,3}/)?.[0].length || 1;
                                    const text = line.replace(/^#{1,3}\s/, '');
                                    return (
                                      <div key={index} className={`font-bold text-gray-900 mb-2 sm:mb-3 mt-3 sm:mt-4 ${
                                        level === 1 ? 'text-base sm:text-lg' : level === 2 ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                                      }`}>
                                        {text}
                                      </div>
                                    );
                                  }
                                  // 空行
                                  if (line.trim() === '') {
                                    return <div key={index} className="h-1.5 sm:h-2"></div>;
                                  }
                                  // 通常のテキスト
                                  return (
                                    <div key={index} className="mb-1.5 sm:mb-2 break-words">
                                      {line}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* コンテスト固有の詳細情報 - モダンで洗練されたモノクロ調 */}
                  {type === "contest" && (targetArea || targetAudience || incentive || operatingCompany) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">C</span>
                        </div>
                        詳細情報
                      </h3>
                      
                      <div className="space-y-6">
                        {targetArea && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">提供プログラム情報</label>
                            <div className="mt-2">
                              {targetArea.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {targetAudience && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">対象者</label>
                            <div className="mt-2">
                              {targetAudience.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {incentive && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">インセンティブ</label>
                            <div className="mt-2">
                              {incentive.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {operatingCompany && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">運営企業</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{operatingCompany}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 施設固有の詳細情報 - モダンで洗練されたモノクロ調 */}
                  {type === "facility" && (targetArea || facilityInfo || targetAudience || program || isDropinAvailable || isNexanaAvailable) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">F</span>
                        </div>
                        詳細情報
                      </h3>
                      
                      <div className="space-y-6">
                        {targetArea && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">提供プログラム情報</label>
                            <div className="mt-2">
                              {targetArea.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {facilityInfo && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">施設情報</label>
                            <div className="mt-2">
                              {facilityInfo.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* 利用可能性（施設情報内に表示） */}
                        {(isDropinAvailable || isNexanaAvailable) && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">施設情報その他</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {isDropinAvailable && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                                  ドロップイン可能施設
                                </span>
                              )}
                              {isNexanaAvailable && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full flex items-center shadow-sm border border-gray-200">
                                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                                  nexana設置施設
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {targetAudience && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">対象者</label>
                            <div className="mt-2">
                              {targetAudience.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {program && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">プログラム</label>
                            <div className="mt-2">
                              {program.split(';').map((item, index) => (
                                <div key={index} className="flex items-start space-x-2 mb-2">
                                  <span className="text-gray-600 font-bold mt-1">•</span>
                                  <span className="text-gray-900 text-base font-medium">{item.trim()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* タグ - モダンで洗練されたモノクロ調 */}
                  {tags && tags.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">T</span>
                        </div>
                        タグ
                      </h3>
                      <div className="border-l-4 border-gray-300 pl-4">
                        <div className="flex flex-wrap gap-3">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors border border-gray-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
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
