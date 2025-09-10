"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Package, DollarSign } from "lucide-react";

interface AssetProvision {
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

export default function AssetProvisionsPage() {
  const [assetProvisions, setAssetProvisions] = useState<AssetProvision[]>([]);
  const [filteredAssetProvisions, setFilteredAssetProvisions] = useState<AssetProvision[]>([]);
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
    const fetchAssetProvisions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/asset-provisions");
        if (response.ok) {
          const data = await response.json();
          setAssetProvisions(data);
        } else {
          console.error("Failed to fetch asset provisions");
        }
      } catch (error) {
        console.error("Error fetching asset provisions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetProvisions();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = assetProvisions;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (assetProvision) =>
          assetProvision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assetProvision.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assetProvision.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assetProvision.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((assetProvision) => assetProvision.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (assetProvision) => assetProvision.organizerType === filters.organizerType
      );
    }

    // カテゴリでフィルタリング
    if (filters.category) {
      filtered = filtered.filter(
        (assetProvision) => assetProvision.category === filters.category
      );
    }

    // タグでフィルタリング
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((assetProvision) =>
        filters.tags.some((tag) => assetProvision.tags.includes(tag))
      );
    }

    setFilteredAssetProvisions(filtered);
  }, [assetProvisions, searchTerm, filters]);

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
            <Package className="h-8 w-8 text-orange-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">アセット提供公募</h1>
          </div>
          <p className="text-gray-600 text-lg">
            資金、設備、施設、技術、知識、ネットワークの提供公募情報を紹介します
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
                  placeholder="公募名、主催者、カテゴリで検索..."
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
                type="asset-provision"
              />
            </div>
          )}
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredAssetProvisions.length}件のアセット提供公募が見つかりました
            </p>
          </div>
        </div>

        {/* アセット提供公募カード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredAssetProvisions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssetProvisions.map((assetProvision) => (
              <Card
                key={assetProvision.id}
                id={assetProvision.id}
                title={assetProvision.title}
                description={assetProvision.description}
                imageUrl={assetProvision.imageUrl}
                deadline={assetProvision.deadline ? new Date(assetProvision.deadline) : undefined}
                startDate={assetProvision.startDate ? new Date(assetProvision.startDate) : undefined}
                endDate={assetProvision.endDate ? new Date(assetProvision.endDate) : undefined}
                area={assetProvision.area}
                organizer={assetProvision.organizer}
                organizerType={assetProvision.organizerType}
                category={assetProvision.category}
                tags={assetProvision.tags}
                website={assetProvision.website}
                amount={assetProvision.amount}
                type="asset-provision"
                contact={assetProvision.contact}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当するアセット提供公募が見つかりませんでした
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
