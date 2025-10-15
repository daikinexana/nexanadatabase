"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import Modal from "./modal";

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
}

export default function NewsItem({
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
}: NewsItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <article
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* 画像 - iPhone 16最適化 */}
                 {imageUrl ? (
                   <div className="sm:w-80 flex-shrink-0">
                     <Image
                       src={imageUrl}
                       alt={title}
                       width={320}
                       height={192}
                       className="w-full h-48 sm:h-40 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                       sizes="(max-width: 640px) 100vw, 320px"
                     />
                   </div>
          ) : (
            <div className="sm:w-80 flex-shrink-0">
              <div className="w-full h-48 sm:h-40 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center rounded-xl shadow-md border border-emerald-200/50 group-hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <Newspaper className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-emerald-600">ニュース</p>
                </div>
              </div>
            </div>
          )}
          
          {/* コンテンツ - iPhone 16最適化 */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200 shadow-sm">
                {type === 'funding' ? '💰 資金調達' : 
                 type === 'm&a' ? '🤝 M&A' : 
                 type === 'ipo' ? '📈 IPO' : 
                 type}
              </span>
              {sector && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 shadow-sm">
                  {sector}
                </span>
              )}
              {area && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 shadow-sm">
                  {area}
                </span>
              )}
            </div>
            
            <h2 className="text-lg sm:text-xl font-news-heading text-gray-900 mb-2 sm:mb-3 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
              {title}
            </h2>
            
            {description && (
              <p className="text-sm sm:text-base text-gray-600 font-news mb-3 sm:mb-4 leading-relaxed overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="font-semibold text-slate-800 text-sm sm:text-base">{company}</span>
              {amount && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {amount}
                </span>
              )}
              {investors && (
                <span className="text-slate-600 text-xs sm:text-sm">
                  <span className="font-medium">投資家:</span> {Array.isArray(investors) ? investors.join(', ') : investors}
                </span>
              )}
              <span className="text-slate-500 text-xs sm:text-sm">
                📅 {publishedAt 
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
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  onClick={handleLinkClick}
                >
                  詳細を見る
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

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
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      priority={true}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="relative h-60 w-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 flex-shrink-0 mb-4">
                    <div className="text-center">
                      <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">画像なし</p>
                    </div>
                  </div>
                )}

                {/* アクションボタン - 画像の下に配置 */}
                <div className="space-y-2 flex-shrink-0">
                  {/* ソースリンク */}
                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full group inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm border border-gray-200"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      詳細を見る
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 右半分: スクロール可能 (PC版) / 全体: スクロール可能 (スマホ版) */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="space-y-4 lg:space-y-6">
                {/* スマホ版: 画像を上部に表示 */}
                <div className="lg:hidden">
                  {imageUrl ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200 mb-4">
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
                    <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200 mb-4">
                      <div className="text-center">
                        <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">画像なし</p>
                      </div>
                    </div>
                  )}
                  
                  {/* スマホ版: アクションボタンを画像の下に配置 */}
                  <div className="flex flex-col space-y-2 mb-6">
                    {/* ソースリンク */}
                    {sourceUrl && (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-base border border-gray-200"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        詳細を見る
                      </a>
                    )}
                  </div>
                </div>
                {/* 基本情報カード - モダンで洗練されたモノクロ調 */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">N</span>
                    </div>
                    基本情報
                  </h3>
                  
                  <div className="space-y-4 lg:space-y-6">
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">企業名</label>
                      <p className="text-gray-900 font-semibold text-base lg:text-lg mt-2">{company}</p>
                    </div>

                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ニュースタイプ</label>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-800 border border-gray-200">
                          {type === 'funding' ? '💰 資金調達' : 
                           type === 'm&a' ? '🤝 M&A' : 
                           type === 'ipo' ? '📈 IPO' : 
                           type}
                        </span>
                      </div>
                    </div>

                    {sector && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">セクター</label>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-800 border border-gray-200">
                            {sector}
                          </span>
                        </div>
                      </div>
                    )}

                    {area && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">エリア</label>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-800 border border-gray-200">
                            {area}
                          </span>
                        </div>
                      </div>
                    )}

                    {amount && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">金額</label>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            {amount}
                          </span>
                        </div>
                      </div>
                    )}

                    {investors && (
                      <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">投資家</label>
                        <p className="text-gray-900 mt-2 leading-relaxed text-sm lg:text-base font-medium">
                          {Array.isArray(investors) ? investors.join(', ') : investors}
                        </p>
                      </div>
                    )}

                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">公開日</label>
                      <p className="text-gray-900 mt-2 text-sm lg:text-base font-medium">
                        {publishedAt 
                          ? new Date(publishedAt).toLocaleDateString('ja-JP')
                          : new Date(createdAt).toLocaleDateString('ja-JP')
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* 説明文カード - モダンで洗練されたモノクロ調 */}
                {description && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">D</span>
                      </div>
                      概要
                    </h3>
                    <div className="border-l-4 border-gray-300 pl-3 lg:pl-4">
                      <p className="text-gray-800 leading-relaxed text-sm lg:text-base font-medium">{description}</p>
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
