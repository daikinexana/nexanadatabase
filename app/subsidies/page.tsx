"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, DollarSign, Gift } from "lucide-react";

interface Subsidy {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  category: string;
  area?: string;
  organizer: string;
  organizerType: string;
  amount?: string;
  website?: string;
  contact?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SubsidiesPage() {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [filteredSubsidies, setFilteredSubsidies] = useState<Subsidy[]>([]);
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
    const fetchSubsidies = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/subsidies");
        if (response.ok) {
          const data = await response.json();
          setSubsidies(data);
        } else {
          console.error("Failed to fetch subsidies");
        }
      } catch (error) {
        console.error("Error fetching subsidies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsidies();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = subsidies;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (subsidy) =>
          subsidy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subsidy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subsidy.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subsidy.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((subsidy) => subsidy.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (subsidy) => subsidy.organizerType === filters.organizerType
      );
    }

    // カテゴリでフィルタリング
    if (filters.category) {
      filtered = filtered.filter(
        (subsidy) => subsidy.category === filters.category
      );
    }

    // タグでフィルタリング
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((subsidy) =>
        filters.tags.some((tag) => subsidy.tags.includes(tag))
      );
    }

    setFilteredSubsidies(filtered);
  }, [subsidies, searchTerm, filters]);

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
            <Gift className="h-8 w-8 text-yellow-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">助成金・補助金</h1>
          </div>
          <p className="text-gray-600 text-lg">
            スタートアップ向けの助成金・補助金情報を紹介します
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
                  placeholder="助成金名、主催者、カテゴリで検索..."
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
                type="subsidy"
              />
            </div>
          )}
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredSubsidies.length}件の助成金が見つかりました
            </p>
          </div>
        </div>

        {/* 助成金カード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredSubsidies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubsidies.map((subsidy) => (
              <Card
                key={subsidy.id}
                id={subsidy.id}
                title={subsidy.title}
                description={subsidy.description}
                imageUrl={subsidy.imageUrl}
                deadline={subsidy.deadline ? new Date(subsidy.deadline) : undefined}
                startDate={subsidy.startDate ? new Date(subsidy.startDate) : undefined}
                endDate={subsidy.endDate ? new Date(subsidy.endDate) : undefined}
                area={subsidy.area}
                organizer={subsidy.organizer}
                organizerType={subsidy.organizerType}
                category={subsidy.category}
                tags={subsidy.tags}
                website={subsidy.website}
                amount={subsidy.amount}
                type="subsidy"
                contact={subsidy.contact}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Gift className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する助成金が見つかりませんでした
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
