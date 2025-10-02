"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Handshake } from "lucide-react";

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
  availableResources?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OpenCallsPage() {
  const [openCalls, setOpenCalls] = useState<OpenCall[]>([]);
  const [filteredOpenCalls, setFilteredOpenCalls] = useState<OpenCall[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    area?: string;
    organizerType?: string;
  }>({
    area: undefined,
    organizerType: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showPastOpenCalls, setShowPastOpenCalls] = useState(false);
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
    const fetchOpenCalls = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.area) params.append('area', filters.area);
        if (filters.organizerType) params.append('organizerType', filters.organizerType);
        
        const response = await fetch(`/api/open-calls?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched open calls data:", data);
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
  }, [filters]);

  // フィルタリング処理
  useEffect(() => {
    let filtered = openCalls;

    // 検索語でフィルタリング（データベースの値のみ）
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (openCall) =>
          // データベースの値での検索のみ
          openCall.organizerType.toLowerCase().includes(searchLower) ||
          openCall.area?.toLowerCase().includes(searchLower) ||
          openCall.targetArea?.toLowerCase().includes(searchLower) ||
          openCall.targetAudience?.toLowerCase().includes(searchLower)
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


    // 過去の公募のフィルタリング
    if (!showPastOpenCalls) {
      const now = new Date();
      filtered = filtered.filter((openCall) => {
        if (!openCall.deadline) return true; // 締切日が未設定の場合は表示
        return new Date(openCall.deadline) >= now;
      });
    }

    // エリアの順序でソート
    filtered.sort((a, b) => {
      const aOrder = getAreaOrder(a.area);
      const bOrder = getAreaOrder(b.area);
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // 同じエリア内では締切日でソート（締切日が近い順、締切日未設定は最後）
      const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
      
      if (aDeadline !== bDeadline) {
        return aDeadline - bDeadline;
      }
      
      // 締切日が同じ場合は作成日時の降順（新しい順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredOpenCalls(filtered);
  }, [openCalls, searchTerm, filters, showPastOpenCalls, getAreaOrder]);

  const handleFilterChange = (newFilters: {
    area?: string;
    organizerType?: string;
  }) => {
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
            <div className="inline-flex items-center px-3 py-1 bg-purple-50 rounded-full mb-4">
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">OPEN CALLS</span>
            </div>
            
            {/* メインタイトル */}
            <h1 className="text-3xl md:text-4xl font-news-heading text-gray-900 mb-4">
              Open Calls
              <span className="block text-lg font-news-subheading text-gray-500 mt-1">公募・共創事業者募集</span>
            </h1>
            
            {/* 説明文 */}
            <p className="text-lg text-gray-600 font-news leading-relaxed">
              企業や行政、大学が募集する共創相手の公募情報を紹介します
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
                    placeholder="企業、行政、大学、CV、全国、東京都、大阪府などで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-news-subheading text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                {showFilters ? "フィルターを隠す" : "フィルターを表示"}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Filter
                  onFilterChange={handleFilterChange}
                  filters={filters}
                  type="open-call"
                />
              </div>
            )}
          </div>
        </div>


        {/* 結果表示 - NewsPicks風 */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-gray-600 font-news">
              <span className="font-news-subheading text-gray-900">{filteredOpenCalls.length}</span>件の公募が見つかりました
            </p>
            <button
              onClick={() => setShowPastOpenCalls(!showPastOpenCalls)}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-news-subheading transition-all duration-200 ${
                showPastOpenCalls
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {showPastOpenCalls ? "過去の公募を非表示" : "過去の公募も表示"}
            </button>
          </div>
        </div>

        {/* 公募カード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-news">読み込み中...</p>
          </div>
        ) : filteredOpenCalls.length > 0 ? (
          <div className="space-y-12">
            {areaOrder.map((area) => {
              const areaOpenCalls = filteredOpenCalls.filter(openCall => openCall.area === area);
              if (areaOpenCalls.length === 0) return null;

              return (
                <div key={area}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">{area}</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {areaOpenCalls.map((openCall) => (
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
                        organizerType={openCall.organizerType || "その他"}
                        website={openCall.website}
                        targetArea={openCall.targetArea}
                        targetAudience={openCall.targetAudience}
                        availableResources={openCall.availableResources}
                        operatingCompany={openCall.operatingCompany}
                        type="open-call"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* エリア未設定の公募 */}
            {(() => {
              const unassignedOpenCalls = filteredOpenCalls.filter(openCall => !areaOrder.includes(openCall.area || ''));
              if (unassignedOpenCalls.length === 0) return null;

              return (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">その他</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {unassignedOpenCalls.map((openCall) => (
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
                        organizerType={openCall.organizerType || "その他"}
                        website={openCall.website}
                        targetArea={openCall.targetArea}
                        targetAudience={openCall.targetAudience}
                        availableResources={openCall.availableResources}
                        operatingCompany={openCall.operatingCompany}
                        type="open-call"
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
                <Handshake className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当する公募が見つかりませんでした
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
