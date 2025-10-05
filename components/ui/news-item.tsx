"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import Modal from "./modal";

interface NewsItemProps {
  title: string;
  description?: string;
  imageUrl?: string;
  company: string;
  sector?: string;
  amount?: string;
  investors?: string | string[];
  publishedAt?: string;
  sourceUrl?: string;
  type: string;
  area?: string;
  createdAt: string;
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
            
            <h2 className="text-lg sm:text-xl font-news-heading text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-tight">
              {title}
            </h2>
            
            {description && (
              <p className="text-sm sm:text-base text-gray-600 font-news mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="font-semibold text-slate-800 text-sm sm:text-base">{company}</span>
              {amount && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
                  💰 {amount}
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
          {/* コンテンツセクション - iPhone 16最適化 */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
            <div className="space-y-6 sm:space-y-8">
              {/* ヒーロー画像セクション - iPhone 16対応 */}
              {imageUrl ? (
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">{title}</h2>
                    {area && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <span className="text-lg sm:text-xl font-medium">{area}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-64 sm:h-80 w-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 mx-auto backdrop-blur-sm">
                      <Newspaper className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 leading-tight">{title}</h2>
                    {area && (
                      <div className="flex items-center justify-center space-x-2 text-white/90">
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
                    <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-3"></div>
                    基本情報
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">企業名</label>
                        <p className="text-gray-900 font-medium mt-2">{company}</p>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">ニュースタイプ</label>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200">
                            {type === 'funding' ? '💰 資金調達' : 
                             type === 'm&a' ? '🤝 M&A' : 
                             type === 'ipo' ? '📈 IPO' : 
                             type}
                          </span>
                        </div>
                      </div>

                      {sector && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">セクター</label>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                              {sector}
                            </span>
                          </div>
                        </div>
                      )}

                      {area && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">エリア</label>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200">
                              {area}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {amount && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">金額</label>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-4 py-2 rounded-xl text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                              💰 {amount}
                            </span>
                          </div>
                        </div>
                      )}

                      {investors && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">投資家</label>
                          <p className="text-gray-900 mt-2 leading-relaxed">
                            {Array.isArray(investors) ? investors.join(', ') : investors}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">公開日</label>
                        <p className="text-gray-900 mt-2">
                          {publishedAt 
                            ? new Date(publishedAt).toLocaleDateString('ja-JP')
                            : new Date(createdAt).toLocaleDateString('ja-JP')
                          }
                        </p>
                      </div>
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

                {/* ソースリンク - シンプルで洗練されたモダンデザイン */}
                {sourceUrl && (
                  <div className="text-center">
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                    >
                      {/* 背景の白いエリア */}
                      <div className="absolute inset-1 bg-white rounded-xl"></div>
                      
                      {/* コンテンツ */}
                      <div className="relative flex items-center justify-center space-x-3 px-6 py-2">
                        <svg className="w-5 h-5 text-gray-800 group-hover:text-gray-900 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-gray-800 group-hover:text-gray-900 font-semibold text-base transition-colors duration-300">詳細を見る</span>
                      </div>
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
