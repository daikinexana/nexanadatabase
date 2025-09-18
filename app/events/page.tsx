"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
// import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Calendar } from "lucide-react";

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
  const [filters, setFilters] = useState<{ area?: string; organizerType?: string; }>({
    area: undefined,
    organizerType: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [loading, setLoading] = useState(true);

  // エリアの順序定義（全国/47都道府県/国外）
  const areaOrder = useMemo(() => [
    '全国',
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県',
    'アメリカ',
    'カナダ',
    'イギリス',
    'エストニア',
    'オランダ',
    'スペイン',
    'ドイツ',
    'フランス',
    'ポルトガル',
    '中国',
    '台湾',
    '韓国',
    'インドネシア',
    'シンガポール',
    'タイ',
    'ベトナム',
    'インド',
    'UAE（ドバイ/アブダビ）',
    'オーストラリア',
    'その他'
  ], []);

  // エリアの順序を取得する関数
  const getAreaOrder = useCallback((area: string | undefined) => {
    if (!area) return 999; // エリアが未設定の場合は最後に配置
    const index = areaOrder.indexOf(area);
    return index === -1 ? 999 : index;
  }, [areaOrder]);

  // データの取得
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.area) params.append('area', filters.area);
        if (filters.organizerType) params.append('organizerType', filters.organizerType);
        
        const response = await fetch(`/api/events?${params.toString()}`);
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
  }, [filters]);

  // フィルタリング処理
  useEffect(() => {
    let filtered = events;

    // 検索語でフィルタリング（データベースの値のみ）
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) => {
          // データベースの値での検索のみ（完全一致を優先）
          const organizerTypeMatch = event.organizerType.toLowerCase() === searchLower;
          const areaMatch = event.area?.toLowerCase() === searchLower || false;
          
          // 部分一致は、完全一致でない場合のみ
          const organizerTypePartialMatch = !organizerTypeMatch && 
                                          event.organizerType.toLowerCase().includes(searchLower);
          const areaPartialMatch = !areaMatch && 
                                 event.area?.toLowerCase().includes(searchLower) || false;
          
          return organizerTypeMatch || areaMatch || organizerTypePartialMatch || areaPartialMatch;
        }
      );
    }

    // 過去のイベントのフィルタリング
    if (!showPastEvents) {
      const now = new Date();
      filtered = filtered.filter((event) => {
        if (!event.startDate) return true; // 開始日が未設定の場合は表示
        return new Date(event.startDate) >= now;
      });
    }

    // エリアの順序でソート
    filtered.sort((a, b) => {
      const aOrder = getAreaOrder(a.area);
      const bOrder = getAreaOrder(b.area);
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // 同じエリア内では開始日でソート（開始日が近い順、開始日未設定は最後）
      const aStartDate = a.startDate ? new Date(a.startDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bStartDate = b.startDate ? new Date(b.startDate).getTime() : Number.MAX_SAFE_INTEGER;
      
      if (aStartDate !== bStartDate) {
        return aStartDate - bStartDate;
      }
      
      // 開始日が同じ場合は作成日時の降順（新しい順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters, showPastEvents, getAreaOrder]);

  const handleFilterChange = (newFilters: { area?: string; organizerType?: string; }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - NewsPicks風 */}
        <div className="mb-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* バッジ */}
            <div className="inline-flex items-center px-3 py-1 bg-emerald-50 rounded-full mb-4">
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">EVENTS</span>
            </div>
            
            {/* メインタイトル */}
            <h1 className="text-3xl md:text-4xl font-news-heading text-gray-900 mb-4">
              Events
              <span className="block text-lg font-news-subheading text-gray-500 mt-1">展示会・イベント</span>
            </h1>
            
            {/* 説明文 */}
            <p className="text-lg text-gray-600 font-news leading-relaxed">
              スタートアップ関連の展示会やイベント情報を紹介します
            </p>
          </div>
        </div>

        {/* 検索・フィルター - NewsPicks風 */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="企業、行政、VC、東京都、大阪府、アメリカ、シンガポールなどで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-news-subheading text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                フィルター
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Filter
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  type="event"
                />
              </div>
            )}
          </div>
        </div>


        {/* 結果表示 - NewsPicks風 */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-gray-600 font-news">
              <span className="font-news-subheading text-gray-900">{filteredEvents.length}</span>件のイベントが見つかりました
            </p>
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-news-subheading transition-all duration-200 ${
                showPastEvents
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showPastEvents ? "過去のイベントを非表示" : "過去のイベントも表示"}
            </button>
          </div>
        </div>

        {/* イベントカード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-news">読み込み中...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-12">
            {areaOrder.map((area) => {
              const areaEvents = filteredEvents.filter(event => event.area === area);
              if (areaEvents.length === 0) return null;

              return (
                <div key={area}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">{area}</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {areaEvents.map((event) => (
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
                        organizerType={event.organizerType || "その他"}
                        website={event.website}
                        type="event"
                        venue={event.venue}
                        targetArea={event.targetArea}
                        targetAudience={event.targetAudience}
                        operatingCompany={event.operatingCompany}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* エリア未設定のイベント */}
            {(() => {
              const unassignedEvents = filteredEvents.filter(event => !areaOrder.includes(event.area || ''));
              if (unassignedEvents.length === 0) return null;

              return (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">その他</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {unassignedEvents.map((event) => (
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
                        organizerType={event.organizerType || "その他"}
                        website={event.website}
                        type="event"
                        venue={event.venue}
                        targetArea={event.targetArea}
                        targetAudience={event.targetAudience}
                        operatingCompany={event.operatingCompany}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当するイベントが見つかりませんでした
              </h3>
              <p className="text-gray-600 font-news">
                検索条件を変更して再度お試しください
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
