"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Handshake, DollarSign } from "lucide-react";

interface OpenCall {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  openCallType?: string;
  availableResources?: string;
  resourceType?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OpenCallsPage() {
  const [openCalls, setOpenCalls] = useState<OpenCall[]>([]);
  const [filteredOpenCalls, setFilteredOpenCalls] = useState<OpenCall[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: undefined,
    organizerType: undefined,
    openCallType: undefined,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);

  // データの取得
  useEffect(() => {
    const fetchOpenCalls = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/open-calls");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched open calls data:", data);
          if (data.length > 0) {
            console.log("First open call data:", data[0]);
            console.log("Operating company:", data[0].operatingCompany);
          }
          setOpenCalls(data);
        } else {
          console.error("Failed to fetch open calls");
        }
      } catch (error) {
        console.error("Error fetching open calls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenCalls();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = openCalls;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (openCall) =>
          openCall.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.targetArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.targetAudience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.openCallType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.availableResources?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.resourceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          openCall.operatingCompany?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((openCall) => openCall.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (openCall) => openCall.organizerType === filters.organizerType
      );
    }

    // 公募タイプでフィルタリング
    if (filters.openCallType) {
      filtered = filtered.filter(
        (openCall) => openCall.openCallType === filters.openCallType
      );
    }

    setFilteredOpenCalls(filtered);
  }, [openCalls, searchTerm, filters]);

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
            <Handshake className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">公募・課題解決パートナー募集</h1>
          </div>
          <p className="text-gray-600 text-lg">
            企業や自治体が募集する課題解決パートナーや協業相手の公募情報を紹介します
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
                  placeholder="公募名、主催者、対象領域、公募タイプで検索..."
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
              {showFilters ? "フィルターを隠す" : "フィルターを表示"}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4">
              <Filter
                onFilterChange={handleFilterChange}
                filters={filters}
                type="open-call"
              />
            </div>
          )}
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredOpenCalls.length}件の公募が見つかりました
            </p>
          </div>
        </div>

        {/* 公募カード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredOpenCalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpenCalls.map((openCall) => (
              <Card
                key={openCall.id}
                id={openCall.id}
                title={openCall.title}
                description={openCall.description}
                imageUrl={openCall.imageUrl}
                deadline={openCall.deadline ? new Date(openCall.deadline) : undefined}
                startDate={openCall.startDate ? new Date(openCall.startDate) : undefined}
                area={openCall.area}
                organizer={openCall.organizer}
                organizerType={openCall.organizerType}
                website={openCall.website}
                targetArea={openCall.targetArea}
                targetAudience={openCall.targetAudience}
                openCallType={openCall.openCallType}
                availableResources={openCall.availableResources}
                resourceType={openCall.resourceType}
                operatingCompany={openCall.operatingCompany}
                type="open-call"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Handshake className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当する公募が見つかりませんでした
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
