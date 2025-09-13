"use client";

import { useState, useEffect, useCallback } from "react";
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

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      // フィルターパラメータを含めてAPIを呼び出す
      const params = new URLSearchParams();
      if (filters.area) params.append('area', filters.area);
      if (filters.category) params.append('type', filters.category);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/news?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched news data:", data);
        setNews(data);
        setFilteredNews(data);
      } else {
        console.error("API Error:", response.status, response.statusText);
        setNews([]);
        setFilteredNews([]);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setNews([]);
      setFilteredNews([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  // データベースからニュースを取得
  useEffect(() => {
    fetchNews();
  }, [filters, searchTerm, fetchNews]);

  // APIから取得したデータをそのまま表示（フィルタリングはAPI側で実行）
  useEffect(() => {
    setFilteredNews(news);
  }, [news]);

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
      
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-indigo-600/80"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* 装飾的な要素 */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              スタートアップ
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-2">
                ニュース
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              日本を代表するスタートアップの調達情報、M&A情報、IPO情報を
              <br className="hidden sm:block" />
              リアルタイムで配信し、エコシステムの動向を追跡
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
                        placeholder="ニュースを検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                {filteredNews.map((item, index) => (
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
                        {item.imageUrl && (
                          <div className="w-1/3 relative overflow-hidden">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                {item.type === "FUNDING" ? "資金調達" : item.type === "M_AND_A" ? "M&A" : item.type}
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
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {selectedNews.type === "FUNDING" ? "資金調達" : selectedNews.type === "M_AND_A" ? "M&A" : selectedNews.type}
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
                  {selectedNews.imageUrl && (
                    <div className="relative mb-4 rounded-xl overflow-hidden">
                      <Image
                        src={selectedNews.imageUrl}
                        alt={selectedNews.title}
                        width={800}
                        height={256}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
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
                          <p className="text-lg font-semibold text-gray-900">{selectedNews.area}</p>
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
