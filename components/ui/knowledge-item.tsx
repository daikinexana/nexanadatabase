"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import Modal from "./modal";

interface KnowledgeItemProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  publishedAt?: string;
  categoryTag?: string;
  website?: string;
  area?: string;
  createdAt: string;
}

export default function KnowledgeItem({
  id,
  title,
  description,
  imageUrl,
  publishedAt,
  categoryTag,
  website,
  area,
  createdAt,
}: KnowledgeItemProps) {
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
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* 画像 */}
          {imageUrl ? (
            <div className="md:w-80 flex-shrink-0">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-48 md:h-40 object-cover rounded-xl shadow-sm"
              />
            </div>
          ) : (
            <div className="md:w-80 flex-shrink-0">
              <div className="w-full h-48 md:h-40 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center rounded-xl shadow-sm border border-slate-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">ナレッジ</p>
                </div>
              </div>
            </div>
          )}
          
          {/* コンテンツ */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {categoryTag && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200">
                  📚 {categoryTag}
                </span>
              )}
              {area && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200">
                  {area}
                </span>
              )}
            </div>
            
            <h2 className="text-xl font-news-heading text-gray-900 mb-2 line-clamp-2">
              {title}
            </h2>
            
            {description && (
              <p className="text-gray-600 font-news mb-3 line-clamp-2">
                {description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-slate-500">
                📅 {publishedAt 
                  ? new Date(publishedAt).toLocaleDateString('ja-JP')
                  : new Date(createdAt).toLocaleDateString('ja-JP')
                }
              </span>
            </div>
            
            {website && (
              <div className="mt-3">
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
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
          {/* コンテンツセクション */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="space-y-8">
              {/* ヒーロー画像セクション */}
              {imageUrl ? (
                <div className="relative h-80 w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    {area && (
                      <div className="flex items-center space-x-2 text-white/90">
                        <span className="text-xl font-medium">{area}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-80 w-full bg-gradient-to-br from-slate-600 via-indigo-600 to-purple-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
                      <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
                    {area && (
                      <div className="flex items-center justify-center space-x-2 text-white/90">
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
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
                    基本情報
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {categoryTag && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">カテゴリ</label>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200">
                              📚 {categoryTag}
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

                {/* ウェブサイトリンク */}
                {website && (
                  <div className="bg-gradient-to-r from-slate-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-center">
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>詳細を見る</span>
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
