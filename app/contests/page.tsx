"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  category: string;
  tags: string[];
  website?: string;
  amount?: string;
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: undefined,
    organizerType: undefined,
    category: undefined,
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // データの取得
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/contests");
        if (response.ok) {
          const data = await response.json();
          setContests(data);
        } else {
          console.error("Failed to fetch contests");
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = contests;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (contest) =>
          contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((contest) => contest.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (contest) => contest.organizerType === filters.organizerType
      );
    }

    // カテゴリでフィルタリング
    if (filters.category) {
      filtered = filtered.filter(
        (contest) => contest.category === filters.category
      );
    }

    // タグでフィルタリング
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((contest) =>
        filters.tags.some((tag) => contest.tags.includes(tag))
      );
    }

    setFilteredContests(filtered);
  }, [contests, searchTerm, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* ページヘッダー */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              コンテスト一覧
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              スタートアップコンテスト、ハッカソン、ピッチコンテストなどの情報を掲載しています
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 検索バーとフィルター（上部） */}
        <div className="mb-8">
          {/* 検索バー */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="コンテストを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* フィルターボタン（モバイル） */}
          <div className="lg:hidden mb-4 text-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <FilterIcon className="h-5 w-5" />
              <span>フィルター</span>
            </button>
          </div>

          {/* フィルター（デスクトップまたはモバイルで開いている場合） */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="bg-white rounded-lg border p-6">
              <Filter
                type="contest"
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredContests.length}件のコンテストが見つかりました
          </p>
        </div>

        {/* コンテストカード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredContests.map((contest) => (
              <Card
                key={contest.id}
                id={contest.id}
                title={contest.title}
                description={contest.description}
                imageUrl={contest.imageUrl}
                deadline={contest.deadline ? new Date(contest.deadline) : undefined}
                startDate={contest.startDate ? new Date(contest.startDate) : undefined}
                endDate={contest.endDate ? new Date(contest.endDate) : undefined}
                area={contest.area}
                organizer={contest.organizer}
                organizerType={contest.organizerType}
                category={contest.category}
                tags={contest.tags}
                website={contest.website}
                amount={contest.amount}
                type="contest"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当するコンテストが見つかりませんでした
            </h3>
            <p className="text-gray-600">
              検索条件を変更して再度お試しください
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
