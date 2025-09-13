"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Calendar, MapPin } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: undefined,
    organizerType: undefined,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);

  // データの取得
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = events;

    // 検索語でフィルタリング
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.targetArea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.targetAudience?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.operatingCompany?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((event) => event.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (event) => event.organizerType === filters.organizerType
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters]);

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
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">展示会・イベント</h1>
          </div>
          <p className="text-gray-600 text-lg">
            スタートアップ関連の展示会やイベント情報を紹介します
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
                  placeholder="イベント名、主催者、会場、対象領域、対象者、運営企業で検索..."
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
                type="event"
              />
            </div>
          )}
        </div>

        {/* 主催者タイプの色説明 */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">主催者タイプの色分け</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">行政</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">行政</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">VC</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">VC</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">CVC</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">CVC</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">銀行</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">銀行</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">不動産</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">不動産</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">企業</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">企業</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">研究機関</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">研究機関</span>
              </div>
              <div className="flex items-center space-x-2 min-w-0">
                <span className="px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">その他</span>
                <span className="text-sm text-gray-600 whitespace-nowrap">その他</span>
              </div>
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredEvents.length}件のイベントが見つかりました
            </p>
          </div>
        </div>

        {/* イベントカード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                imageUrl={event.imageUrl}
                startDate={event.startDate ? new Date(event.startDate) : undefined}
                endDate={event.endDate ? new Date(event.endDate) : undefined}
                area={event.area}
                organizer={event.organizer}
                organizerType={event.organizerType}
                website={event.website}
                type="event"
                venue={event.venue}
                targetArea={event.targetArea}
                targetAudience={event.targetAudience}
                operatingCompany={event.operatingCompany}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              該当するイベントが見つかりませんでした
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
