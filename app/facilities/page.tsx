"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "スタートアップ支援施設・インキュベーション施設一覧 | Nexana Database",
  description: "スタートアップ支援施設、インキュベーション施設、イノベーション拠点の情報。コワーキングスペース、アクセラレーター、インキュベーターを検索。",
  keywords: "スタートアップ支援施設, インキュベーション施設, イノベーション拠点, コワーキングスペース, アクセラレーター, インキュベーター, 起業支援, オフィス, シェアオフィス",
  openGraph: {
    title: "スタートアップ支援施設・インキュベーション施設一覧 | Nexana Database",
    description: "スタートアップ支援施設、インキュベーション施設、イノベーション拠点の情報。",
    type: "website",
    url: "https://db.nexanahq.com/facilities",
  },
};
// import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import Filter from "@/components/ui/filter";
import { Search, Filter as FilterIcon, Building } from "lucide-react";

interface Facility {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  facilityInfo?: string;
  targetAudience?: string;
  program?: string;
  isDropinAvailable?: boolean;
  isNexanaAvailable?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ area?: string; organizerType?: string; }>({
    area: undefined,
    organizerType: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(50); // 初期表示件数
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒でタイムアウト
        
        const response = await fetch("/api/facilities", {
          headers: {
            'Cache-Control': 'max-age=300', // 5分間キャッシュ
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          setFacilities(data);
        } else {
          console.error("Failed to fetch facilities:", response.status);
          // エラー時は空配列を設定
          setFacilities([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error("Request timeout");
        } else {
          console.error("Error fetching facilities:", error);
        }
        // エラー時は空配列を設定
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // デバウンス付き検索処理
  const debouncedSearch = useCallback((term: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(term);
    }, 300); // 300msのデバウンス
  }, []);

  // フィルタリング処理（メモ化）
  const filteredFacilitiesMemo = useMemo(() => {
    let filtered = facilities;

    // 検索語でフィルタリング（データベースの値のみ）
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (facility) => {
          // データベースの値での検索のみ（完全一致を優先）
          const organizerTypeMatch = facility.organizerType.toLowerCase() === searchLower;
          const areaMatch = facility.area?.toLowerCase() === searchLower || false;
          
          // nexana関連の検索（部分一致対応）
          const nexanaMatch = facility.isNexanaAvailable && (
            searchLower === 'nexana' || 
            searchLower === 'nexa' || 
            searchLower.includes('nexa')
          );
          const dropinMatch = facility.isDropinAvailable && (
            searchLower === 'ドロップイン' || 
            searchLower === 'ドロップ' || 
            searchLower.includes('ドロップ')
          );
          
          // 部分一致は、完全一致でない場合のみ
          const organizerTypePartialMatch = !organizerTypeMatch && 
                                          facility.organizerType.toLowerCase().includes(searchLower);
          const areaPartialMatch = !areaMatch && 
                                 facility.area?.toLowerCase().includes(searchLower) || false;
          
          return organizerTypeMatch || areaMatch || nexanaMatch || dropinMatch || organizerTypePartialMatch || areaPartialMatch;
        }
      );
    }

    // エリアでフィルタリング
    if (filters.area) {
      filtered = filtered.filter((facility) => facility.area === filters.area);
    }

    // 主催者タイプでフィルタリング
    if (filters.organizerType) {
      filtered = filtered.filter(
        (facility) => facility.organizerType === filters.organizerType
      );
    }

    // エリアの順序でソート
    filtered.sort((a, b) => {
      const aOrder = getAreaOrder(a.area);
      const bOrder = getAreaOrder(b.area);
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // 同じエリア内では作成日時の降順（新しい順）
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [facilities, searchTerm, filters, getAreaOrder]);

  // フィルタリング結果を更新
  useEffect(() => {
    setFilteredFacilities(filteredFacilitiesMemo);
    setVisibleCount(50); // フィルター変更時は表示件数をリセット
  }, [filteredFacilitiesMemo]);

  const handleFilterChange = (newFilters: { area?: string; organizerType?: string; }) => {
    setFilters(newFilters);
  };

  // 表示件数を増やす関数
  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 50);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  // 表示する施設を制限
  const visibleFacilities = useMemo(() => {
    return filteredFacilities.slice(0, visibleCount);
  }, [filteredFacilities, visibleCount]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - NewsPicks風 */}
        <div className="mb-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* バッジ */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full mb-4">
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">FACILITIES</span>
            </div>
            
            {/* メインタイトル */}
            <h1 className="text-3xl md:text-4xl font-news-heading text-gray-900 mb-4">
              Facilities
              <span className="block text-lg font-news-subheading text-gray-500 mt-1">施設紹介</span>
            </h1>
            
            {/* 説明文 */}
            <p className="text-lg text-gray-600 font-news leading-relaxed">
              スタートアップ支援施設やイノベーション拠点を紹介します
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
                    placeholder="企業、行政、VC、その他、東京都、大阪府、nexana、nexa、ドロップイン、ドロップなどで検索..."
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
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
                  type="facility"
                />
              </div>
            )}
          </div>
        </div>


        {/* 結果表示 - NewsPicks風 */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-gray-600 font-news">
              <span className="font-news-subheading text-gray-900">{filteredFacilities.length}</span>件の施設が見つかりました
            </p>
          </div>
        </div>

        {/* 施設カード一覧 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-news">読み込み中...</p>
          </div>
        ) : visibleFacilities.length > 0 ? (
          <div className="space-y-12">
            {areaOrder.map((area) => {
              const areaFacilities = visibleFacilities.filter(facility => facility.area === area);
              if (areaFacilities.length === 0) return null;

              return (
                <div key={area}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">{area}</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                    {areaFacilities.map((facility) => (
                      <Card
                        key={facility.id}
                        id={facility.id}
                        title={facility.title}
                        description={facility.description}
                        imageUrl={facility.imageUrl}
                        area={facility.area}
                        organizer={facility.organizer}
                        organizerType={facility.organizerType}
                        website={facility.website}
                        type="facility"
                        address={facility.address}
                        targetArea={facility.targetArea}
                        facilityInfo={facility.facilityInfo}
                        targetAudience={facility.targetAudience}
                        program={facility.program}
                        isDropinAvailable={facility.isDropinAvailable}
                        isNexanaAvailable={facility.isNexanaAvailable}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* エリア未設定の施設 */}
            {(() => {
              const unassignedFacilities = visibleFacilities.filter(facility => !areaOrder.includes(facility.area || ''));
              if (unassignedFacilities.length === 0) return null;

              return (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">その他</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                    {unassignedFacilities.map((facility) => (
                      <Card
                        key={facility.id}
                        id={facility.id}
                        title={facility.title}
                        description={facility.description}
                        imageUrl={facility.imageUrl}
                        area={facility.area}
                        organizer={facility.organizer}
                        organizerType={facility.organizerType}
                        website={facility.website}
                        type="facility"
                        address={facility.address}
                        targetArea={facility.targetArea}
                        facilityInfo={facility.facilityInfo}
                        targetAudience={facility.targetAudience}
                        program={facility.program}
                        isDropinAvailable={facility.isDropinAvailable}
                        isNexanaAvailable={facility.isNexanaAvailable}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
            
            {/* もっと見るボタン */}
            {visibleCount < filteredFacilities.length && (
              <div className="text-center py-8">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      読み込み中...
                    </>
                  ) : (
                    <>
                      もっと見る ({filteredFacilities.length - visibleCount}件)
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Building className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当する施設が見つかりませんでした
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
