"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, BookOpen, Calendar, User } from "lucide-react";

// サンプルデータ（実際の実装ではAPIから取得）
const sampleKnowledge = [
  {
    id: "1",
    title: "バイブコーディングは本格開発に使えるの？——PolyscapeのAI駆動開発",
    description: "開発期間の大幅短縮を実現するAI駆動開発手法について解説",
    imageUrl: "/images/ai-coding-article.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "Polyscape",
    organizerType: "CORPORATION",
    category: "AI",
    tags: ["AI", "コーディング", "開発効率化", "バイブコーディング", "Polyscape"],
    website: "https://example.com",
    amount: undefined,
    type: "knowledge" as const,
    author: "kigoyama",
    publishedAt: new Date("2025-08-26"),
  },
  {
    id: "2",
    title: "あるようでなかった「賃貸初期費用の分割払い」で急成長——20億円調達、40万人が利用するスムーズとは？",
    description: "賃貸契約時の初期費用を分割払いにできるサービス「smooth」の成功事例を分析",
    imageUrl: "/images/smooth-article.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "スムーズ",
    organizerType: "CORPORATION",
    category: "FINTECH",
    tags: ["賃貸", "分割払い", "フィンテック", "20億円調達", "スムーズ"],
    website: "https://example.com",
    amount: undefined,
    type: "knowledge" as const,
    author: "kigoyama",
    publishedAt: new Date("2025-08-26"),
  },
  {
    id: "3",
    title: "量子コンピューティングの最新動向とスタートアップへの影響",
    description: "量子コンピューティング技術の進歩とスタートアップが取り組むべき領域について",
    imageUrl: "/images/quantum-article.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "Nexana HQ",
    organizerType: "RESEARCH_INSTITUTION",
    category: "DEEPTECH",
    tags: ["量子コンピューティング", "ディープテック", "スタートアップ", "技術トレンド"],
    website: "https://example.com",
    amount: undefined,
    type: "knowledge" as const,
    author: "Nexana Research Team",
    publishedAt: new Date("2025-08-25"),
  },
  {
    id: "4",
    title: "Web3とメタバース：次世代インターネットの可能性",
    description: "Web3とメタバース技術がもたらす新たなビジネス機会と課題について",
    imageUrl: "/images/web3-article.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "Nexana HQ",
    organizerType: "RESEARCH_INSTITUTION",
    category: "DEEPTECH",
    tags: ["Web3", "メタバース", "ブロックチェーン", "次世代インターネット"],
    website: "https://example.com",
    amount: undefined,
    type: "knowledge" as const,
    author: "Nexana Research Team",
    publishedAt: new Date("2025-08-24"),
  },
  {
    id: "5",
    title: "バイオテックスタートアップの資金調達戦略",
    description: "バイオテクノロジー分野でのスタートアップが成功するための資金調達のポイント",
    imageUrl: "/images/biotech-article.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "Nexana HQ",
    organizerType: "RESEARCH_INSTITUTION",
    category: "BIOTECH",
    tags: ["バイオテック", "資金調達", "スタートアップ", "投資戦略"],
    website: "https://example.com",
    amount: undefined,
    type: "knowledge" as const,
    author: "Nexana Research Team",
    publishedAt: new Date("2025-08-23"),
  },
  {
    id: "6",
    title: "クリーンテックの市場機会とスタートアップの取り組み方",
    description: "環境問題解決に向けたクリーンテック分野でのビジネス機会について",
    imageUrl: "/images/cleantech-article.jpg",
    deadline: undefined,
    startDate: undefined,
    endDate: undefined,
    area: "全国",
    organizer: "Nexana HQ",
    organizerType: "RESEARCH_INSTITUTION",
    category: "CLEANTECH",
    tags: ["クリーンテック", "環境問題", "SDGs", "サステナビリティ"],
    website: "https://example.com",
    amount: undefined,
    type: "knowledge" as const,
    author: "Nexana Research Team",
    publishedAt: new Date("2025-08-22"),
  },
];

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState(sampleKnowledge);
  const [filteredKnowledge, setFilteredKnowledge] = useState(sampleKnowledge);
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
    let filtered = knowledge;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    setFilteredKnowledge(filtered);
  }, [knowledge, searchTerm, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // カテゴリ別の記事数を計算
  const categoryCounts = knowledge.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ナレッジベース
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI、ディープテックなどの最新技術情報とトレンドを提供
            </p>
          </div>
        </div>
      </div>

      {/* カテゴリ統計 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {count}
                </div>
                <p className="text-sm text-gray-600">
                  {category === "AI" ? "AI" :
                   category === "DEEPTECH" ? "ディープテック" :
                   category === "BIOTECH" ? "バイオテック" :
                   category === "CLEANTECH" ? "クリーンテック" :
                   category === "FINTECH" ? "フィンテック" :
                   category === "HEALTHTECH" ? "ヘルステック" :
                   category === "EDUTECH" ? "エドテック" : category}
                </p>
              </div>
            ))}
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
                    placeholder="記事を検索..."
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
                  type="knowledge"
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
                {filteredKnowledge.length}件の記事が見つかりました
              </p>
            </div>

            {/* 記事一覧 */}
            {filteredKnowledge.length > 0 ? (
              <div className="space-y-6">
                {filteredKnowledge.map((item) => (
                  <article key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="md:flex">
                      {/* 画像 */}
                      {item.imageUrl && (
                        <div className="md:w-1/3">
                          <div className="relative h-48 md:h-full">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="object-cover h-full w-full"
                            />
                          </div>
                        </div>
                      )}

                      {/* コンテンツ */}
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h2>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* メタ情報 */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            {item.author && (
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {item.author}
                              </span>
                            )}
                            {item.publishedAt && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {item.publishedAt.toLocaleDateString("ja-JP")}
                                </span>
                              </>
                            )}
                          </div>

                          {/* カテゴリ */}
                          <div className="flex items-center space-x-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {item.category === "AI" ? "AI" :
                               item.category === "DEEPTECH" ? "ディープテック" :
                               item.category === "BIOTECH" ? "バイオテック" :
                               item.category === "CLEANTECH" ? "クリーンテック" :
                               item.category === "FINTECH" ? "フィンテック" :
                               item.category === "HEALTHTECH" ? "ヘルステック" :
                               item.category === "EDUTECH" ? "エドテック" : item.category}
                            </span>
                          </div>
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
                            <BookOpen className="h-4 w-4 mr-1" />
                            記事を読む →
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  該当する記事が見つかりませんでした
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
