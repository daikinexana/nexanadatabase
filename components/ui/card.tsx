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
              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors flex-1 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'}}>
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
              <p className="text-gray-600 text-sm leading-tight w-full overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'}}>
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
          {/* コンテンツセクション - 左半分固定、右半分スクロール */}
          <div className="flex-1 flex bg-white overflow-hidden">
            {/* 左半分: 固定 */}
            <div className="w-80 flex-shrink-0 p-6 border-r border-gray-200">
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

            {/* 右半分: スクロール可能 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* 基本情報カード - モダンで洗練されたモノクロ調 */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">i</span>
                    </div>
                    基本情報
                  </h3>
                  
                  <div className="space-y-6">
                      <div className="border-l-4 border-gray-300 pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">主催者</label>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-gray-900 font-semibold text-lg">{organizer}</span>
                        </div>
                      </div>

                      {organizerType && (
                        <div className="border-l-4 border-gray-300 pl-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">主催者タイプ</label>
                          <div className="mt-2">
                            <span 
                              className={`px-4 py-2 text-white text-sm font-bold rounded-full ${getOrganizerTypeStyle(organizerType).className}`}
                              style={getOrganizerTypeStyle(organizerType).style}
                            >
                              {getOrganizerTypeLabel(organizerType)}
                            </span>
                          </div>
                        </div>
                      )}

                      {area && (
                        <div className="border-l-4 border-gray-300 pl-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">エリア</label>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <MapPin className="h-3 w-3 text-gray-600" />
                            </div>
                            <span className="text-gray-900 font-semibold text-lg">{area}</span>
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

                  {/* 概要カード - モダンで洗練されたモノクロ調 */}
                  {description && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">D</span>
                        </div>
                        概要
                      </h3>
                      <div className="border-l-4 border-gray-300 pl-4">
                        <p className="text-gray-800 leading-relaxed text-base font-medium">{description}</p>
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

                  {/* Open-call固有の詳細情報 - モダンで洗練されたモノクロ調 */}
                  {type === "open-call" && (targetArea || targetAudience || area || organizer || operatingCompany || organizerType || availableResources) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">O</span>
                        </div>
                        詳細情報
                      </h3>
                      
                      <div className="space-y-6">
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

                        {area && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">エリア</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{area}</p>
                          </div>
                        )}

                        {organizer && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">主催者</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{organizer}</p>
                          </div>
                        )}

                        {operatingCompany && (
                          <div className="border-l-4 border-gray-300 pl-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">運営企業</label>
                            <p className="text-gray-900 mt-2 leading-relaxed text-base font-medium">{operatingCompany}</p>
                          </div>
                        )}

                        {availableResources && (
                          <div>
                            <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">提供可能なリソース/技術</label>
                            <div className="mt-3 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
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
