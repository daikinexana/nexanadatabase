"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Trophy } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  incentive?: string;
  operatingCompany?: string;
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: undefined,
  });
  const [showFilters, setShowFilters] = useState(true);
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
          contest.targetArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.targetAudience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.incentive?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.operatingCompany?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((contest) => contest.area === filters.area);
    }

    setFilteredContests(filtered);
  }, [contests, searchTerm, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Trophy className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">コンテスト一覧</h1>
          </div>
          <p className="text-gray-600 text-lg">
            スタートアップコンテスト、ハッカソン、ピッチコンテストなどの情報を掲載しています
          </p>
        </div>
        {/* 検索・フィルター */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="コンテスト名、主催者、エリア、対象領域、対象者、インセンティブ、運営企業で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              フィルター
            </button>
          </div>

          {showFilters && (
            <div className="mt-4">
              <Filter
                onFilterChange={handleFilterChange}
                filters={filters}
                type="contest"
              />
            </div>
          )}
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredContests.length}件のコンテストが見つかりました
            </p>
          </div>
        </div>

        {/* コンテストカード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredContests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
            {filteredContests.map((contest) => (
              <Card
                key={contest.id}
                id={contest.id}
                title={contest.title}
                description={contest.description}
                imageUrl={contest.imageUrl}
                deadline={contest.deadline ? new Date(contest.deadline) : undefined}
                startDate={contest.startDate ? new Date(contest.startDate) : undefined}
                area={contest.area}
                organizer={contest.organizer}
                organizerType={contest.organizerType || "その他"}
                website={contest.website}
                targetArea={contest.targetArea}
                targetAudience={contest.targetAudience}
                incentive={contest.incentive}
                operatingCompany={contest.operatingCompany}
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
