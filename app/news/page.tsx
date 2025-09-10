"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, TrendingUp, DollarSign, Building } from "lucide-react";

// サンプルデータ（実際の実装ではAPIから取得）
const sampleNews = [
  {
    id: "1",
    title: "終活プラットフォーム「SouSou」、プレシリーズA追加調達で累計3億円超",
    description: "日本通信とウェルネットから資本参加を受け、累計調達額が3億円を超えた",
    imageUrl: "/images/sousou-news.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "そうそう",
    organizerType: "CORPORATION",
    category: "FUNDING",
    tags: ["終活", "プラットフォーム", "プレシリーズA", "日本通信", "ウェルネット"],
    website: "https://example.com",
    amount: "3億円",
    type: "news" as const,
    company: "そうそう",
    sector: "ヘルステック",
    round: "プレシリーズA",
    investors: ["日本通信", "ウェルネット"],
    publishedAt: new Date("2025-09-02"),
    source: "BRIDGE",
    sourceUrl: "https://example.com",
  },
  {
    id: "2",
    title: "ドクターズプライム、シリーズA完結で4行から4億2,000万円デット調達",
    description: "医療機関向けサービスを展開するドクターズプライムがデット調達を実施",
    imageUrl: "/images/doctors-prime-news.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "ドクターズプライム",
    organizerType: "CORPORATION",
    category: "FUNDING",
    tags: ["医療", "シリーズA", "デット調達", "4億2,000万円"],
    website: "https://example.com",
    amount: "4億2,000万円",
    type: "news" as const,
    company: "ドクターズプライム",
    sector: "ヘルステック",
    round: "シリーズA",
    investors: ["4行"],
    publishedAt: new Date("2025-09-02"),
    source: "BRIDGE",
    sourceUrl: "https://example.com",
  },
  {
    id: "3",
    title: "AI ナレッジデータプラットフォーム「Helpfeel」26億円調達",
    description: "シリーズEファーストクローズで26億円を調達、年内に独自AIエージェントを含む3サービスを投入予定",
    imageUrl: "/images/helpfeel-news.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "Helpfeel",
    organizerType: "CORPORATION",
    category: "FUNDING",
    tags: ["AI", "ナレッジ", "プラットフォーム", "シリーズE", "26億円"],
    website: "https://example.com",
    amount: "26億円",
    type: "news" as const,
    company: "Helpfeel",
    sector: "AI・機械学習",
    round: "シリーズE",
    investors: ["グローバル・ブレイン"],
    publishedAt: new Date("2025-08-28"),
    source: "BRIDGE",
    sourceUrl: "https://example.com",
  },
  {
    id: "4",
    title: "シェアダイン、シリーズBで総額21億円調達し料理人SNS「CHEFLINK」海外展開を加速",
    description: "料理人向けキャリアプラットフォームを手掛けるシェアダインがシリーズBラウンドで総額21億円を調達",
    imageUrl: "/images/sharedine-news.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "シェアダイン",
    organizerType: "CORPORATION",
    category: "FUNDING",
    tags: ["料理人", "SNS", "CHEFLINK", "シリーズB", "海外展開"],
    website: "https://example.com",
    amount: "21億円",
    type: "news" as const,
    company: "シェアダイン",
    sector: "フードテック",
    round: "シリーズB",
    investors: ["みずほキャピタル", "三井住友信託銀行"],
    publishedAt: new Date("2025-08-28"),
    source: "BRIDGE",
    sourceUrl: "https://example.com",
  },
];

export default function NewsPage() {
  const [news, setNews] = useState(sampleNews);
  const [filteredNews, setFilteredNews] = useState(sampleNews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: undefined,
    organizerType: undefined,
    category: undefined,
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // フィルタリング処理
  useEffect(() => {
    let filtered = news;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((item) => item.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (item) => item.organizerType === filters.organizerType
      );
    }

    // カテゴリでフィルタリング
    if (filters.category) {
      filtered = filtered.filter(
        (item) => item.category === filters.category
      );
    }

    // タグでフィルタリング
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((item) =>
        filters.tags.some((tag) => item.tags.includes(tag))
      );
    }

    setFilteredNews(filtered);
  }, [news, searchTerm, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // 統計情報の計算
  const totalFunding = news
    .filter((item) => item.category === "FUNDING")
    .reduce((sum, item) => {
      const amount = item.amount?.replace(/[^\d]/g, "") || "0";
      return sum + parseInt(amount);
    }, 0);

  const fundingCount = news.filter((item) => item.category === "FUNDING").length;
  const mAndACount = news.filter((item) => item.category === "M_AND_A").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              スタートアップニュース
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信
            </p>
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(totalFunding / 100000000)}億円
                </span>
              </div>
              <p className="text-sm text-gray-600">総調達額</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{fundingCount}</span>
              </div>
              <p className="text-sm text-gray-600">調達件数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Building className="h-6 w-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{mAndACount}</span>
              </div>
              <p className="text-sm text-gray-600">M&A件数</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（フィルター） */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              {/* 検索バー */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="ニュースを検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* フィルターボタン（モバイル） */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FilterIcon className="h-5 w-5" />
                  <span>フィルター</span>
                </button>
              </div>

              {/* フィルター（デスクトップまたはモバイルで開いている場合） */}
              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <Filter
                  type="news"
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:w-3/4">
            {/* 結果表示 */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredNews.length}件のニュースが見つかりました
              </p>
            </div>

            {/* ニュースカード一覧 */}
            {filteredNews.length > 0 ? (
              <div className="space-y-6">
                {filteredNews.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* 画像 */}
                      {item.imageUrl && (
                        <div className="md:w-1/3">
                          <div className="relative h-48 w-full">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="object-cover rounded-lg h-full w-full"
                            />
                          </div>
                        </div>
                      )}

                      {/* コンテンツ */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* メタ情報 */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {item.company}
                            </span>
                            {item.sector && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span>{item.sector}</span>
                              </>
                            )}
                            {item.round && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span>{item.round}</span>
                              </>
                            )}
                          </div>

                          {item.amount && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-lg font-semibold text-green-600">
                                {item.amount}
                              </span>
                            </div>
                          )}

                          {item.publishedAt && (
                            <div className="text-sm text-gray-500">
                              {item.publishedAt.toLocaleDateString("ja-JP")}
                            </div>
                          )}
                        </div>

                        {/* タグ */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.slice(0, 5).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                            {item.tags.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                +{item.tags.length - 5}
                              </span>
                            )}
                          </div>
                        )}

                        {/* 外部リンク */}
                        {item.website && (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            詳細を読む →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  該当するニュースが見つかりませんでした
                </h3>
                <p className="text-gray-600">
                  検索条件を変更して再度お試しください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
