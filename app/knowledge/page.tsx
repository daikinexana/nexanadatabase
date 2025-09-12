"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, BookOpen, Calendar, User, ArrowRight, ExternalLink, Sparkles, Brain, Lightbulb, Target, TrendingUp } from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  website?: string;
  categoryTag?: string;
  publishedAt?: string;
}

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [filteredKnowledge, setFilteredKnowledge] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categoryTag: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  // APIからデータを取得
  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/knowledge');
        if (!response.ok) {
          throw new Error('Failed to fetch knowledge');
        }
        const data = await response.json();
        setKnowledge(data);
        setFilteredKnowledge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = knowledge;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.categoryTag?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // カテゴリータグでフィルタリング
    if (filters.categoryTag) {
      filtered = filtered.filter(
        (item) => item.categoryTag === filters.categoryTag
      );
    }

    setFilteredKnowledge(filtered);
  }, [knowledge, searchTerm, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // カテゴリータグ別の記事数を計算
  const categoryCounts = knowledge.reduce((acc, item) => {
    if (item.categoryTag) {
      acc[item.categoryTag] = (acc[item.categoryTag] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Header />
      
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* 装飾的な要素 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-pulse">
              <Brain className="h-4 w-4 mr-2" />
              最新の技術ナレッジ
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              ナレッジ
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                ベース
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              AI、ディープテック、イノベーションの最新技術情報とトレンドを
              <br className="hidden md:block" />
              専門家の視点から詳しく解説
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl">
                最新記事を読む
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30">
                カテゴリで絞り込み
                <FilterIcon className="inline-block ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* カテゴリ統計 */}
      <div className="relative -mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(categoryCounts).map(([categoryTag, count], index) => (
              <div key={categoryTag} className="group relative">
                <div className={`absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${
                  index % 4 === 0 ? 'bg-gradient-to-r from-indigo-400 to-blue-500' :
                  index % 4 === 1 ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                  index % 4 === 2 ? 'bg-gradient-to-r from-pink-400 to-rose-500' :
                  'bg-gradient-to-r from-blue-400 to-indigo-500'
                }`}></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-xl ${
                      index % 4 === 0 ? 'bg-gradient-to-r from-indigo-500 to-blue-600' :
                      index % 4 === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                      index % 4 === 2 ? 'bg-gradient-to-r from-pink-500 to-rose-600' :
                      'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}>
                      {index % 4 === 0 ? <Brain className="h-6 w-6 text-white" /> :
                       index % 4 === 1 ? <Lightbulb className="h-6 w-6 text-white" /> :
                       index % 4 === 2 ? <Target className="h-6 w-6 text-white" /> :
                       <BookOpen className="h-6 w-6 text-white" />}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {count}
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {categoryTag}
                    </p>
                    <div className="mt-2 text-xs text-indigo-600 font-semibold">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      記事数
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（フィルター） */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              {/* 検索バー */}
              <div className="mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="記事を検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-300 hover:shadow-xl"
                    />
                  </div>
                </div>
              </div>

              {/* フィルターボタン（モバイル） */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FilterIcon className="h-5 w-5" />
                  <span className="font-semibold">フィルター</span>
                </button>
              </div>

              {/* フィルター（デスクトップまたはモバイルで開いている場合） */}
              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                  <Filter
                    type="knowledge"
                    filters={filters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:w-3/4">
            {/* ローディング状態 */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 mx-auto"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto absolute top-0 left-0"></div>
                  </div>
                  <p className="text-gray-600 mt-4 text-lg">記事を読み込み中...</p>
                </div>
              </div>
            )}

            {/* エラー状態 */}
            {error && (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl">
                    <div className="text-red-400 mb-6">
                      <BookOpen className="h-16 w-16 mx-auto animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      エラーが発生しました
                    </h3>
                    <p className="text-gray-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 結果表示 */}
            {!loading && !error && (
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {filteredKnowledge.length}件の記事
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
            )}

            {/* 記事一覧 */}
            {!loading && !error && filteredKnowledge.length > 0 ? (
              <div className="grid gap-8">
                {filteredKnowledge.map((item, index) => (
                  <article 
                    key={item.id} 
                    className="group relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* 背景グラデーション */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    
                    {/* メインカード */}
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 overflow-hidden">
                      <div className="flex flex-col lg:flex-row">
                        {/* 画像セクション */}
                        {item.imageUrl && (
                          <div className="lg:w-2/5 relative overflow-hidden">
                            <div className="aspect-video lg:aspect-square relative">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                              {/* カテゴリーバッジ */}
                              {item.categoryTag && (
                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                                    {item.categoryTag}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* コンテンツセクション */}
                        <div className="flex-1 p-8">
                          <div className="flex flex-col h-full">
                            {/* ヘッダー */}
                            <div className="mb-6">
                              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                                {item.title}
                              </h2>
                              <p className="text-gray-600 leading-relaxed line-clamp-3">
                                {item.description}
                              </p>
                            </div>

                            {/* メタ情報 */}
                            <div className="space-y-4 mb-6">
                              {/* 公開日 */}
                              {item.publishedAt && (
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(item.publishedAt).toLocaleDateString("ja-JP", { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}</span>
                                </div>
                              )}

                              {/* カテゴリータグ */}
                              {item.categoryTag && (
                                <div className="flex items-center space-x-2">
                                  <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200">
                                    <span className="text-sm font-medium text-indigo-700">
                                      {item.categoryTag}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* アクションボタン */}
                            <div className="mt-auto">
                              {item.website && (
                                <a
                                  href={item.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                  <span>記事を読む</span>
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : !loading && !error ? (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-xl">
                    <div className="text-gray-400 mb-6">
                      <Search className="h-16 w-16 mx-auto animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      該当する記事が見つかりませんでした
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      検索条件を変更して再度お試しください。新しいカテゴリを試してみることもできます。
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({
                          categoryTag: undefined,
                        });
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      フィルターをリセット
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
