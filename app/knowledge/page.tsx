"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
// import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, BookOpen, Calendar, ExternalLink, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Image from "next/image";

interface KnowledgeItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  website?: string;
  categoryTag?: string;
  area?: string;
  publishedAt?: string;
}

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [filteredKnowledge, setFilteredKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ categoryTag?: string; area?: string; }>({
    categoryTag: undefined,
    area: undefined,
  });
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // 段階的読み込み用の状態
  const [visibleCount, setVisibleCount] = useState(25); // 初期表示件数
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // APIからデータを取得
  const fetchKnowledge = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒でタイムアウト
      
      const response = await fetch("/api/knowledge", {
        headers: {
          'Cache-Control': 'max-age=300', // 5分間キャッシュ
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setKnowledge(data);
      } else {
        console.error("Failed to fetch knowledge:", response.status);
        setKnowledge([]);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error("Request timeout");
      } else {
        console.error("Error fetching knowledge:", error);
      }
      setKnowledge([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  // デバウンス付き検索処理
  const debouncedSearch = useCallback((term: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(term);
    }, 300); // 300msのデバウンス
  }, []);

  // フィルタリング処理（メモ化）
  const filteredKnowledgeMemo = useMemo(() => {
    let filtered = knowledge;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.categoryTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.area?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // カテゴリでフィルタリング
    if (filters.categoryTag) {
      filtered = filtered.filter((item) => item.categoryTag === filters.categoryTag);
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((item) => item.area === filters.area);
    }

    // 公開日でソート（新しい順）
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt || '').getTime();
      const dateB = new Date(b.publishedAt || '').getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [knowledge, searchTerm, filters]);

  // フィルタリング結果を更新
  useEffect(() => {
    setFilteredKnowledge(filteredKnowledgeMemo);
    setVisibleCount(25); // フィルター変更時は表示件数をリセット
  }, [filteredKnowledgeMemo]);

  // 表示件数を増やす関数
  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 25);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  // 表示するナレッジを制限
  const visibleKnowledge = useMemo(() => {
    return filteredKnowledge.slice(0, visibleCount);
  }, [filteredKnowledge, visibleCount]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleFilterChange = (newFilters: { categoryTag?: string; area?: string; }) => {
    setFilters(newFilters);
  };

  const handleKnowledgeClick = (knowledgeItem: KnowledgeItem) => {
    setSelectedKnowledge(knowledgeItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKnowledge(null);
  };

  // カテゴリータグ別の記事数を計算
  // const categoryCounts = knowledge.reduce((acc, item) => {
  //   if (item.categoryTag) {
  //     acc[item.categoryTag] = (acc[item.categoryTag] || 0) + 1;
  //   }
  //   return acc;
  // }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* ヒーローセクション - シンプルモダン */}
      <div className="relative" style={{ background: 'linear-gradient(to right, #1a1a1a, #2d2d2d)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-news-heading text-white mb-3">
              Knowledge Base
              <span className="block text-white mt-1 text-lg font-news-subheading">ナレッジベース</span>
            </h1>
            <p className="text-base text-white max-w-2xl mx-auto font-news">
              Introducing the trends you should know now in open innovation.
              <span className="block text-sm text-white mt-2">オープンイノベーションで今知っておきたいトレンドをご紹介</span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-600 mt-4 text-lg">記事を読み込み中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 検索・フィルター */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl relative z-20">
              {/* 検索バーとフィルターボタン */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="記事を検索..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-300 hover:shadow-xl"
                      />
                    </div>
                  </div>
                </div>
                
                {/* フィルターボタン */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FilterIcon className="h-5 w-5" />
                  <span className="font-semibold">フィルター</span>
                </button>
              </div>

              {/* フィルター（条件付き表示） */}
              {showFilters && (
                <div className="border-t border-gray-200 pt-6">
                  <Filter
                    type="knowledge"
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>

            {/* メインコンテンツ */}
            <div>
            {/* 結果表示 */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {filteredKnowledge.length}件の記事
                    {visibleCount < filteredKnowledge.length && (
                      <span className="text-lg font-normal text-gray-600 ml-2">
                        （{visibleCount}件表示中）
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600">
                    最新の技術ナレッジをお届けします
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>更新: {new Date().toLocaleDateString("ja-JP")}</span>
                </div>
              </div>
            </div>

            {/* 記事カード一覧 */}
            {filteredKnowledge.length > 0 ? (
              <div className="grid gap-4">
                {visibleKnowledge.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleKnowledgeClick(item)}
                  >
                    {/* メインカード */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative z-0">
                      <div className="flex h-64">
                        {/* 画像セクション */}
                        {item.imageUrl && (
                          <div className="w-1/3 relative overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              loading={index < 4 ? "eager" : "lazy"}
                              unoptimized={true}
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                {item.categoryTag || "ナレッジ"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* コンテンツセクション */}
                        <div className="flex-1 p-6 flex flex-col">
                          {/* ヘッダー */}
                          <div className="mb-4 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          {/* メタ情報 - フレックスで下部に配置 */}
                          <div className="mt-auto space-y-3">
                            {/* 公開日 */}
                            {item.publishedAt && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm text-gray-600">
                                  {new Date(item.publishedAt).toLocaleDateString("ja-JP", { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </div>
                            )}
                            
                            {/* カテゴリータグとエリア */}
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              {item.categoryTag && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  {item.categoryTag}
                                </span>
                              )}
                              {item.area && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                  {item.area}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl">
                    <div className="text-gray-400 mb-6">
                      <BookOpen className="h-16 w-16 mx-auto animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      該当する記事が見つかりませんでした
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      検索条件を変更して再度お試しください。新しいフィルターを試してみることもできます。
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({
                          categoryTag: undefined,
                          area: undefined,
                        });
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      フィルターをリセット
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* もっと見るボタン */}
            {filteredKnowledge.length > 0 && visibleCount < filteredKnowledge.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>読み込み中...</span>
                    </div>
                  ) : (
                    `もっと見る (残り${filteredKnowledge.length - visibleCount}件)`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      <Footer />

      {/* モーダル */}
      {isModalOpen && selectedKnowledge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* オーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          ></div>
          
          {/* モーダルコンテンツ */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {selectedKnowledge.categoryTag || "ナレッジ"}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedKnowledge.publishedAt && new Date(selectedKnowledge.publishedAt).toLocaleDateString("ja-JP", { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                {/* 画像とタイトル */}
                <div className="mb-6">
                  {selectedKnowledge.imageUrl && (
                    <div className="relative mb-4 rounded-xl overflow-hidden">
                      <Image
                        src={selectedKnowledge.imageUrl}
                        alt={selectedKnowledge.title}
                        width={800}
                        height={256}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {selectedKnowledge.title}
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedKnowledge.description}
                  </p>
                </div>

                {/* 詳細情報 */}
                <div className="space-y-4">
                  {/* カテゴリ情報 */}
                  {selectedKnowledge.categoryTag && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                        カテゴリ
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {selectedKnowledge.categoryTag}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 公開日・ソース */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                      詳細情報
                    </h3>
                    <div className="space-y-2">
                      {selectedKnowledge.publishedAt && (
                        <div>
                          <span className="text-sm text-gray-500">公開日</span>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(selectedKnowledge.publishedAt).toLocaleDateString("ja-JP", { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              weekday: 'long'
                            })}
                          </p>
                        </div>
                      )}
                      {selectedKnowledge.website && (
                        <div className="pt-2">
                          <a
                            href={selectedKnowledge.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <span>記事を読む</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
