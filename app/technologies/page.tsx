"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Cpu, Code } from "lucide-react";

interface Technology {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  area?: string;
  provider: string;
  providerType: string;
  website?: string;
  contact?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState<Technology[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: undefined,
    providerType: undefined,
    category: undefined,
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // データの取得
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/technologies");
        if (response.ok) {
          const data = await response.json();
          setTechnologies(data);
        } else {
          console.error("Failed to fetch technologies");
        }
      } catch (error) {
        console.error("Error fetching technologies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = technologies;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (technology) =>
          technology.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          technology.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          technology.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
          technology.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((technology) => technology.area === filters.area);
    }

    // 提供者タイプでフィルタリング
    if (filters.providerType) {
      filtered = filtered.filter(
        (technology) => technology.providerType === filters.providerType
      );
    }

    // カテゴリでフィルタリング
    if (filters.category) {
      filtered = filtered.filter(
        (technology) => technology.category === filters.category
      );
    }

    // タグでフィルタリング
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((technology) =>
        filters.tags.some((tag) => technology.tags.includes(tag))
      );
    }

    setFilteredTechnologies(filtered);
  }, [technologies, searchTerm, filters]);

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
            <Cpu className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">提供可能な技術情報</h1>
          </div>
          <p className="text-gray-600 text-lg">
            企業や研究機関が提供可能な技術・ノウハウ情報を紹介します
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
                  placeholder="技術名、提供者、カテゴリで検索..."
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
                type="technology"
              />
            </div>
          )}
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredTechnologies.length}件の技術情報が見つかりました
            </p>
          </div>
        </div>

        {/* 技術情報カード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredTechnologies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnologies.map((technology) => (
              <Card
                key={technology.id}
                id={technology.id}
                title={technology.title}
                description={technology.description}
                imageUrl={technology.imageUrl}
                area={technology.area}
                organizer={technology.provider}
                organizerType={technology.providerType}
                category={technology.category}
                tags={technology.tags}
                website={technology.website}
                type="technology"
                contact={technology.contact}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Cpu className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する技術情報が見つかりませんでした
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
