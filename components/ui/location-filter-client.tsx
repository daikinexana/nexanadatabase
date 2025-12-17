"use client";

import { useState, useMemo, useCallback } from "react";
import { MapPin, X } from "lucide-react";
import LocationCard from "@/components/ui/location-card";

interface Location {
  id: string;
  slug: string;
  country: string;
  city: string;
  description?: string | null;
  topImageUrl?: string | null;
  isActive: boolean;
  workspaces: Array<{
    id: string;
    name: string;
    imageUrl?: string | null;
  }>;
}

interface LocationFilterClientProps {
  locations: Location[];
  prefectureOrder: string[];
}

export default function LocationFilterClient({ locations, prefectureOrder }: LocationFilterClientProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // 都道府県の順序を取得する関数
  const getPrefectureOrder = useCallback((city: string) => {
    const index = prefectureOrder.indexOf(city);
    return index === -1 ? 999 : index;
  }, [prefectureOrder]);

  // ソート処理：日本国内は都道府県順、海外は国名順
  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      // 日本国内のロケーションを優先
      if (a.country === "日本" && b.country !== "日本") {
        return -1;
      }
      if (a.country !== "日本" && b.country === "日本") {
        return 1;
      }

      // 日本国内同士の場合は都道府県順
      if (a.country === "日本" && b.country === "日本") {
        const aOrder = getPrefectureOrder(a.city);
        const bOrder = getPrefectureOrder(b.city);
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        // 同じ都道府県内では都市名順
        return a.city.localeCompare(b.city, 'ja');
      }

      // 海外同士の場合は国名順、同じ国では都市名順
      if (a.country !== b.country) {
        return a.country.localeCompare(b.country, 'ja');
      }
      return a.city.localeCompare(b.city, 'ja');
    });
  }, [locations, getPrefectureOrder]);

  // 日本国内の都道府県リストを取得
  const japanPrefectures = useMemo(() => {
    const japanLocations = sortedLocations.filter(loc => loc.country === "日本");
    const prefectures = Array.from(new Set(japanLocations.map(loc => loc.city)));
    return prefectures.sort((a, b) => {
      const aOrder = getPrefectureOrder(a);
      const bOrder = getPrefectureOrder(b);
      return aOrder - bOrder;
    });
  }, [sortedLocations, getPrefectureOrder]);

  // 海外の国リストを取得
  const overseasCountries = useMemo(() => {
    const overseasLocations = sortedLocations.filter(loc => loc.country !== "日本");
    return Array.from(new Set(overseasLocations.map(loc => loc.country))).sort();
  }, [sortedLocations]);

  // フィルタリングされたロケーション
  const filteredLocations = useMemo(() => {
    if (selectedPrefecture) {
      return sortedLocations.filter(loc => loc.country === "日本" && loc.city === selectedPrefecture);
    }
    if (selectedCountry) {
      return sortedLocations.filter(loc => loc.country === selectedCountry);
    }
    return sortedLocations;
  }, [sortedLocations, selectedPrefecture, selectedCountry]);

  // 国別にグループ化
  const locationsByCountry = useMemo(() => {
    return filteredLocations.reduce((acc, location) => {
      if (!acc[location.country]) {
        acc[location.country] = [];
      }
      acc[location.country].push(location);
      return acc;
    }, {} as Record<string, Location[]>);
  }, [filteredLocations]);

  const clearFilters = () => {
    setSelectedPrefecture(null);
    setSelectedCountry(null);
  };

  const hasActiveFilter = selectedPrefecture !== null || selectedCountry !== null;

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16">
      {/* フィルターセクション - モダンでスタイリッシュ */}
      <div className="sticky top-4 z-30 bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/50 shadow-2xl p-4 sm:p-6 mb-8 sm:mb-10">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">エリアで絞り込む</h3>
          </div>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>クリア</span>
            </button>
          )}
        </div>

        {/* 日本国内の都道府県タブ */}
        {japanPrefectures.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="relative">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full blur-sm opacity-50"></div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider">日本国内</span>
            </div>
            <div className="overflow-x-auto scrollbar-thin -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
                <button
                  onClick={() => {
                    setSelectedPrefecture(null);
                    setSelectedCountry(null);
                  }}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation ${
                    !hasActiveFilter
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-200/50 border-transparent scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 hover:scale-105"
                  }`}
                >
                  すべて
                </button>
                {japanPrefectures.map((prefecture) => (
                  <button
                    key={prefecture}
                    onClick={() => {
                      setSelectedPrefecture(prefecture);
                      setSelectedCountry(null);
                    }}
                    className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation ${
                      selectedPrefecture === prefecture
                        ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg shadow-gray-400/30 border-transparent scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 hover:scale-105"
                    }`}
                  >
                    {prefecture}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 海外の国タブ */}
        {overseasCountries.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="relative">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <div className="absolute inset-0 w-1.5 h-1.5 bg-blue-500 rounded-full blur-sm opacity-50"></div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider">海外</span>
            </div>
            <div className="overflow-x-auto scrollbar-thin -mx-4 sm:-mx-6 px-4 sm:px-6">
              <div className="flex gap-2 sm:gap-3 min-w-max pb-2">
                {overseasCountries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setSelectedPrefecture(null);
                    }}
                    className={`flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation ${
                      selectedCountry === country
                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-400/30 border-transparent scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-700 hover:scale-105"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フィルター結果表示 */}
      {hasActiveFilter && (
        <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/80 rounded-xl border border-emerald-200/50 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {selectedPrefecture && <span className="font-bold text-emerald-700">「{selectedPrefecture}」</span>}
              {selectedCountry && <span className="font-bold text-blue-700">「{selectedCountry}」</span>}
              のロケーション: <span className="font-bold text-emerald-700 ml-1">{filteredLocations.length}件</span>
            </span>
          </div>
        </div>
      )}

      {/* ロケーション一覧 */}
      <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
        {Object.entries(locationsByCountry).map(([country, countryLocations]) => (
          <div key={country}>
            {/* 国別セクションヘッダー - より洗練された */}
            <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="relative">
                  <div className="w-0.5 sm:w-1 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
                  <div className="absolute inset-0 w-0.5 sm:w-1 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-sm opacity-50"></div>
                </div>
                <div className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full border border-emerald-200/50 backdrop-blur-sm shadow-sm">
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Country</span>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-700 to-teal-700 leading-[0.95] tracking-tight mt-3 sm:mt-4">
                {country}
              </h2>
              <div className="pt-3 sm:pt-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">{countryLocations.length} locations</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {countryLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6 shadow-inner">
            <MapPin className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400" />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light">
            {hasActiveFilter ? "該当するロケーションが見つかりませんでした" : "ロケーション情報がありません"}
          </p>
        </div>
      )}
    </div>
  );
}
