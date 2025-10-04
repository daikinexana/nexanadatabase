"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "スタートアップ調達ニュース・M&A情報 | Nexana Database",
  description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信。投資ニュース、資金調達、企業買収の最新情報。",
  keywords: "スタートアップ調達, M&A情報, IPO情報, 投資ニュース, 資金調達, 企業買収, ベンチャー投資, エンジェル投資, シリーズA, シリーズB",
  openGraph: {
    title: "スタートアップ調達ニュース・M&A情報 | Nexana Database",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信。",
    type: "website",
    url: "https://db.nexanahq.com/news",
  },
};
// import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
// import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, TrendingUp, DollarSign, Building, Calendar, ExternalLink, X } from "lucide-react";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  company: string;
  sector: string;
  area: string;
  amount: string;
  investors: string[];
  publishedAt: Date | string;
  sourceUrl: string;
}

// 国を判定する関数
const getCountryFromArea = (area: string): string => {
  if (!area) return 'その他';
  
  const areaLower = area.toLowerCase();
  
  if (areaLower.includes('日本') || areaLower.includes('japan') || areaLower.includes('東京') || areaLower.includes('大阪') || areaLower.includes('京都') || areaLower.includes('福岡') || areaLower.includes('名古屋')) {
    return '日本';
  } else if (areaLower.includes('アメリカ') || areaLower.includes('usa') || areaLower.includes('us') || areaLower.includes('united states') || areaLower.includes('san francisco') || areaLower.includes('new york') || areaLower.includes('los angeles') || areaLower.includes('boston') || areaLower.includes('seattle')) {
    return 'アメリカ';
  } else if (areaLower.includes('イギリス') || areaLower.includes('uk') || areaLower.includes('united kingdom') || areaLower.includes('london') || areaLower.includes('england')) {
    return 'イギリス';
  } else if (areaLower.includes('韓国') || areaLower.includes('korea') || areaLower.includes('south korea') || areaLower.includes('seoul')) {
    return '韓国';
  } else if (areaLower.includes('中国') || areaLower.includes('china') || areaLower.includes('beijing') || areaLower.includes('shanghai') || areaLower.includes('shenzhen')) {
    return '中国';
  } else {
    return 'その他';
  }
};

// 国別のバッジ色設定
const getCountryBadgeColor = (country: string): string => {
  switch (country) {
    case '日本':
      return 'bg-red-500 text-white'; // 日本の国旗の赤
    case 'アメリカ':
      return 'bg-blue-500 text-white'; // アメリカの国旗の青
    case 'イギリス':
      return 'bg-purple-500 text-white'; // イギリスの国旗の紫
    case '韓国':
      return 'bg-yellow-500 text-black'; // 韓国の国旗の黄色
    case '中国':
      return 'bg-red-600 text-white'; // 中国の国旗の赤
    default:
      return 'bg-gray-500 text-white'; // その他はグレー
  }
};


export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    area?: string;
    category?: string;
    openCallType?: string;
    categoryTag?: string;
    tags?: string[];
  }>({
    area: undefined,
    category: undefined,
    openCallType: undefined,
    categoryTag: undefined,
    tags: [],
  });
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // 段階的読み込み用の状態
  const [visibleCount, setVisibleCount] = useState(25); // 初期表示件数
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒でタイムアウト
      
      const response = await fetch("/api/news", {
        headers: {
          'Cache-Control': 'max-age=300', // 5分間キャッシュ
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      } else {
        console.error("Failed to fetch news:", response.status);
        setNews([]);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error("Request timeout");
      } else {
        console.error("Error fetching news:", error);
      }
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // データベースからニュースを取得
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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
  const filteredNewsMemo = useMemo(() => {
    let filtered = news;

    // 検索語でフィルタリング（データベースの値のみ）
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        // データベースの値での検索のみ
        item.type.toLowerCase().includes(searchLower) ||
        item.area.toLowerCase().includes(searchLower) ||
        item.sector.toLowerCase().includes(searchLower) ||
        // 投資家名での検索
        item.investors.some(investor => 
          investor.toLowerCase().includes(searchLower)
        )
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((item) => item.area === filters.area);
    }

    // カテゴリでフィルタリング
    if (filters.category) {
      filtered = filtered.filter((item) => item.type === filters.category);
    }

    // 公開日でソート（新しい順）
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    return filtered;
  }, [news, searchTerm, filters]);

  // フィルタリング結果を更新
  useEffect(() => {
    setFilteredNews(filteredNewsMemo);
    setVisibleCount(25); // フィルター変更時は表示件数をリセット
  }, [filteredNewsMemo]);

  // 表示件数を増やす関数
  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 25);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  // 表示するニュースを制限
  const visibleNews = useMemo(() => {
    return filteredNews.slice(0, visibleCount);
  }, [filteredNews, visibleCount]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleFilterChange = (newFilters: {
    area?: string;
    category?: string;
    openCallType?: string;
    categoryTag?: string;
    tags?: string[];
  }) => {
    setFilters(newFilters);
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  // 統計情報の計算
  // const totalFunding = news
  //   .filter((item) => item.type === "FUNDING")
  //   .reduce((sum, item) => {
  //     const amount = item.amount?.replace(/[^\d]/g, "") || "0";
  //     return sum + parseInt(amount);
  //   }, 0);

  // const fundingCount = news.filter((item) => item.type === "FUNDING").length;
  // const mAndACount = news.filter((item) => item.type === "M_AND_A").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* ヒーローセクション - シンプルモダン */}
      <div className="relative bg-gradient-to-r from-slate-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-news-heading text-white mb-3">
              Startup News
              <span className="block text-gray-300 mt-1 text-lg font-news-subheading">スタートアップニュース</span>
            </h1>
            <p className="text-base text-gray-300 max-w-2xl mx-auto font-news">
              Real-time funding, M&A, and IPO information for Japanese startups
              <span className="block text-sm text-gray-400 mt-2">世界のスタートアップの調達・M&A・IPO情報をリアルタイム配信</span>
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
              <p className="text-gray-600 mt-4 text-lg">ニュースを読み込み中...</p>
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
                        placeholder="資金調達、M&A、日本、アメリカ、バイオテクノロジー、デジタルマーケティングなどで検索..."
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
                    type="news"
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
                    {filteredNews.length}件のニュース
                    {visibleCount < filteredNews.length && (
                      <span className="text-lg font-normal text-gray-600 ml-2">
                        （{visibleCount}件表示中）
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600">
                    最新のスタートアップ情報をお届けします
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>更新: {new Date().toLocaleDateString("ja-JP")}</span>
                </div>
              </div>
            </div>

            {/* ニュースカード一覧 */}
            {filteredNews.length > 0 ? (
              <div className="grid gap-4">
                {visibleNews.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handleNewsClick(item)}
                  >
                    {/* メインカード */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative z-0">
                      <div className="flex h-64">
                        {/* 画像セクション */}
                        <div className="w-1/3 relative overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              loading={index < 4 ? "eager" : "lazy"}
                              unoptimized={true}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <div className="text-center text-white">
                                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-80" />
                                <p className="text-sm font-medium opacity-90">ニュース</p>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${
                              item.type === "資金調達" ? "bg-green-500" : 
                              item.type === "M&A" ? "bg-purple-500" : 
                              "bg-blue-500"
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        </div>

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
                            {/* 企業名と金額 */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 truncate">{item.company}</span>
                              </div>
                              {item.amount && (
                                <div className="px-3 py-1 bg-gray-100 rounded-full flex-shrink-0 ml-2">
                                  <span className="text-sm font-semibold text-gray-700">{item.amount}</span>
                                </div>
                              )}
                            </div>

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
                            
                            {/* 業界・領域とエリア */}
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              {item.sector && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  {item.sector}
                                </span>
                              )}
                              {item.area && (
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getCountryBadgeColor(getCountryFromArea(item.area))}`}>
                                  {getCountryFromArea(item.area)}
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
                      <Search className="h-16 w-16 mx-auto animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      該当するニュースが見つかりませんでした
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      検索条件を変更して再度お試しください。新しいフィルターを試してみることもできます。
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({
                          area: undefined,
                          category: undefined,
                          openCallType: undefined,
                          categoryTag: undefined,
                          tags: [],
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
            {filteredNews.length > 0 && visibleCount < filteredNews.length && (
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
                    `もっと見る (残り${filteredNews.length - visibleCount}件)`
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
      {isModalOpen && selectedNews && (
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
                <span className={`px-3 py-1 text-white text-sm font-semibold rounded-full ${
                  selectedNews.type === "資金調達" ? "bg-green-500" : 
                  selectedNews.type === "M&A" ? "bg-purple-500" : 
                  "bg-blue-500"
                }`}>
                  {selectedNews.type}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedNews.publishedAt && new Date(selectedNews.publishedAt).toLocaleDateString("ja-JP", { 
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
                  <div className="relative mb-4 rounded-xl overflow-hidden">
                    {selectedNews.imageUrl ? (
                      <Image
                        src={selectedNews.imageUrl}
                        alt={selectedNews.title}
                        width={800}
                        height={256}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-80" />
                          <p className="text-lg font-medium opacity-90">ニュース</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {selectedNews.title}
                  </h1>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedNews.description}
                  </p>
                </div>

                {/* 詳細情報 */}
                <div className="space-y-4">
                  {/* 調達情報 */}
                  {selectedNews.amount && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                        調達情報
                      </h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {selectedNews.amount}
                        </div>
                        <p className="text-sm text-gray-600">調達額</p>
                      </div>
                    </div>
                  )}

                  {/* 企業情報 */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-gray-600" />
                      企業情報
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">企業名</span>
                        <p className="text-lg font-semibold text-gray-900">{selectedNews.company}</p>
                      </div>
                      {selectedNews.sector && (
                        <div>
                          <span className="text-sm text-gray-500">業界・領域</span>
                          <p className="text-lg font-semibold text-gray-900">{selectedNews.sector}</p>
                        </div>
                      )}
                      {selectedNews.area && (
                        <div>
                          <span className="text-sm text-gray-500">エリア</span>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-lg font-semibold text-gray-900">{selectedNews.area}</p>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getCountryBadgeColor(getCountryFromArea(selectedNews.area))}`}>
                              {getCountryFromArea(selectedNews.area)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 投資家情報 */}
                  {selectedNews.investors && selectedNews.investors.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                        投資家
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedNews.investors.map((investor, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                            {investor}
                          </span>
                        ))}
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
                      {selectedNews.publishedAt && (
                        <div>
                          <span className="text-sm text-gray-500">公開日</span>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(selectedNews.publishedAt).toLocaleDateString("ja-JP", { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              weekday: 'long'
                            })}
                          </p>
                        </div>
                      )}
                      {selectedNews.sourceUrl && (
                        <div className="pt-2">
                          <a
                            href={selectedNews.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <span>元記事を読む</span>
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
