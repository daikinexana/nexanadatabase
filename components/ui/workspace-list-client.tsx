"use client";

import LocationCardCompact from "@/components/ui/location-card-compact";

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

interface WorkspaceListClientProps {
  regionOrder: string[];
  locationsByRegion: Record<string, Location[]>;
  locationsByCountry: Record<string, Location[]>;
}

export default function WorkspaceListClient({
  regionOrder,
  locationsByRegion,
  locationsByCountry,
}: WorkspaceListClientProps) {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      {/* セクションタイトル */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-0.5 sm:w-1 h-5 sm:h-6 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Locationで選択する
          </h2>
        </div>
      </div>

      {/* 日本国内 - 8地方区分 */}
      {regionOrder.map((region) => {
        const regionLocations = locationsByRegion[region] || [];
        if (regionLocations.length === 0) return null;

        return (
          <div key={region} className="scroll-mt-4">
            {/* 地方区分セクションヘッダー */}
            <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-0.5 sm:w-1 h-6 sm:h-7 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
                <div className="absolute inset-0 w-0.5 sm:w-1 h-6 sm:h-7 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-sm opacity-50"></div>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {region}
              </h2>
              <span className="text-xs text-gray-500 font-medium bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 px-2.5 py-1 rounded-full">
                {regionLocations.length}件
              </span>
            </div>

            {/* コンパクトグリッド */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5 sm:gap-3 md:gap-4">
              {regionLocations.map((location) => (
                <LocationCardCompact key={location.id} location={location} />
              ))}
            </div>
          </div>
        );
      })}

      {/* 海外 - 国別 */}
      {Object.entries(locationsByCountry).map(([country, countryLocations]) => (
        <div key={country} className="scroll-mt-4">
          {/* 国別セクションヘッダー */}
          <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-0.5 sm:w-1 h-6 sm:h-7 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
              <div className="absolute inset-0 w-0.5 sm:w-1 h-6 sm:h-7 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-sm opacity-50"></div>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {country}
            </h2>
            <span className="text-xs text-gray-500 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 px-2.5 py-1 rounded-full">
              {countryLocations.length}件
            </span>
          </div>

          {/* コンパクトグリッド */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2.5 sm:gap-3 md:gap-4">
            {countryLocations.map((location) => (
              <LocationCardCompact key={location.id} location={location} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

