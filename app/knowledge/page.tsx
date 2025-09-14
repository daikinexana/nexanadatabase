"use client";

import { useState, useEffect } from "react";
// import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
// import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, BookOpen, Calendar, ExternalLink, X } from "lucide-react";
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

  // APIからデータを取得
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.categoryTag) params.append('categoryTag', filters.categoryTag);
        if (filters.area) params.append('area', filters.area);
        
        const response = await fetch(`/api/knowledge?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch knowledge');
        }
        const data = await response.json();
        setKnowledge(data);
        setFilteredKnowledge(data);
      } catch (err) {
        console.error('Error fetching knowledge:', err);
        // setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, [filters.categoryTag, filters.area]);

  // フィルタリング処理
  useEffect(() => {
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

    setFilteredKnowledge(filtered);
  }, [knowledge, searchTerm]);

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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* ヒーローセクション */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 背景パターン */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent_50%)]"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mr-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-none text-display">
                ナレッジベース
              </h1>
            </div>
            
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed text-subtitle">
              AI、ディープテック、イノベーションの最新技術情報とトレンドを専門家の視点から詳しく解説
            </p>
            
            <p className="text-sm text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed text-body">
              スタートアップに必要な知識とインサイトを提供します
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">記事を読み込み中...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* 検索・フィルター */}
            <section className="py-12 bg-gray-50 rounded-3xl">
              <div className="max-w-4xl mx-auto px-8">
                {/* 検索バーとフィルターボタン */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="記事を検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent text-lg transition-smooth"
                      />
                    </div>
                  </div>
                  
                  {/* フィルターボタン */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-6 py-4 border-2 border-black rounded-2xl text-lg font-medium text-black bg-white hover:bg-black hover:text-white transition-smooth"
                  >
                    <FilterIcon className="h-5 w-5 mr-2" />
                    フィルター
                  </button>
                </div>

                {/* フィルター（条件付き表示） */}
                {showFilters && (
                  <div className="border-t border-gray-200 pt-8">
                    <Filter
                      type="knowledge"
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* メインコンテンツ */}
            <section>
              {/* 結果表示 */}
              <div className="mb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 text-display">
                      {filteredKnowledge.length}件の記事
                    </h2>
                    <p className="text-lg text-gray-600 text-subtitle">
                      最新の技術ナレッジをお届けします
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-3 text-lg text-gray-500">
                    <Calendar className="h-5 w-5" />
                    <span>更新: {new Date().toLocaleDateString("ja-JP")}</span>
                  </div>
                </div>
              </div>

              {/* 記事一覧 */}
              {filteredKnowledge.length > 0 ? (
                <div className="grid gap-8">
                  {filteredKnowledge.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group cursor-pointer hover-lift transition-smooth"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => handleKnowledgeClick(item)}
                    >
                      {/* メインカード */}
                      <div className="bg-white rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-smooth overflow-hidden">
                        <div className="flex h-80">
                          {/* 画像セクション */}
                          {item.imageUrl && (
                            <div className="w-1/3 relative overflow-hidden">
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-full">
                                  {item.categoryTag || "ナレッジ"}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* コンテンツセクション */}
                          <div className="flex-1 p-8 flex flex-col">
                            {/* ヘッダー */}
                            <div className="mb-6 flex-shrink-0">
                              <h3 className="text-xl font-bold text-black mb-4 leading-tight line-clamp-2 text-heading">
                                {item.title}
                              </h3>
                              <p className="text-gray-600 text-base leading-relaxed line-clamp-2 text-body">
                                {item.description}
                              </p>
                            </div>

                            {/* メタ情報 - フレックスで下部に配置 */}
                            <div className="mt-auto space-y-4">
                              {/* 公開日 */}
                              {item.publishedAt && (
                                <div className="flex items-center space-x-3">
                                  <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                  <span className="text-lg text-gray-600">
                                    {new Date(item.publishedAt).toLocaleDateString("ja-JP", { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              )}
                              
                              {/* カテゴリータグとエリア */}
                              <div className="flex items-center space-x-3 flex-wrap gap-2">
                                {item.categoryTag && (
                                  <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                    {item.categoryTag}
                                  </span>
                                )}
                                {item.area && (
                                  <span className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
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
                  <div className="text-gray-400 mb-8">
                    <BookOpen className="h-20 w-20 mx-auto" />
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4">
                    該当する記事が見つかりませんでした
                  </h3>
                  <p className="text-xl text-gray-600">
                    検索条件を変更して再度お試しください
                  </p>
                </div>
              )}
            </section>
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
                        height={400}
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
