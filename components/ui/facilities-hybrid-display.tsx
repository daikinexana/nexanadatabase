"use client";

import { useState } from "react";
import Card from "./card";
import { Building2 } from "lucide-react";

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
  facilityInfo?: string;
  program?: string;
  targetArea?: string;
  targetAudience?: string;
  isDropinAvailable: boolean;
  isNexanaAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FacilitiesHybridDisplayProps {
  japanAreas: string[];
  overseasAreas: string[];
  filteredFacilities: Facility[];
}

export default function FacilitiesHybridDisplay({
  japanAreas,
  overseasAreas,
  filteredFacilities,
}: FacilitiesHybridDisplayProps) {
  const [showOverseas, setShowOverseas] = useState(false);

  // 日本国内の施設を取得
  const japanFacilities = filteredFacilities.filter(facility => 
    japanAreas.includes(facility.area || '')
  );

  // 海外の施設を取得
  const overseasFacilities = filteredFacilities.filter(facility => 
    overseasAreas.includes(facility.area || '')
  );

  // エリア別に施設をグループ化
  const groupFacilitiesByArea = (facilities: Facility[], areas: string[]) => {
    return areas.map(area => {
      const areaFacilities = facilities.filter(facility => facility.area === area);
      return { area, facilities: areaFacilities };
    }).filter(group => group.facilities.length > 0);
  };

  // 日本国内の施設をエリア別にグループ化
  const japanGroups = groupFacilitiesByArea(japanFacilities, japanAreas);

  // 海外の施設をエリア別にグループ化
  const overseasGroups = groupFacilitiesByArea(overseasFacilities, overseasAreas);

  return (
    <div className="space-y-12">
      {/* 日本国内の施設 */}
      {japanGroups.map(({ area, facilities }) => (
        <div key={area}>
          <div className="mb-6">
            <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
              {area}
              <span className="block text-sm font-news-subheading text-gray-500 mt-1">
                {area === '全国' ? 'Nationwide' : 
                 area === '東京都' ? 'Tokyo' :
                 area === '大阪府' ? 'Osaka' :
                 area === '兵庫県' ? 'Hyogo' :
                 area === '大分県' ? 'Oita' :
                 area === '中国' ? 'China' :
                 area === 'その他' ? 'Others' : area}
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                id={facility.id}
                title={facility.title}
                description={facility.description}
                imageUrl={facility.imageUrl}
                area={facility.area}
                organizer={facility.organizer}
                organizerType={facility.organizerType || "その他"}
                website={facility.website}
                targetArea={facility.targetArea}
                targetAudience={facility.targetAudience}
                incentive={facility.facilityInfo}
                operatingCompany={facility.address}
                isDropinAvailable={facility.isDropinAvailable}
                isNexanaAvailable={facility.isNexanaAvailable}
                type="facility"
              />
            ))}
          </div>
        </div>
      ))}

      {/* 海外の施設表示ボタン */}
      {overseasGroups.length > 0 && !showOverseas && (
        <div className="text-center py-8">
          <button
            onClick={() => setShowOverseas(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-news-subheading rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Building2 className="w-5 h-5 mr-2" />
            海外の施設を見る ({overseasFacilities.length}件)
          </button>
        </div>
      )}

      {/* 海外の施設 */}
      {showOverseas && overseasGroups.map(({ area, facilities }) => (
        <div key={area}>
          <div className="mb-6">
            <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
              {area}
              <span className="block text-sm font-news-subheading text-gray-500 mt-1">
                {area === '全国' ? 'Nationwide' : 
                 area === '東京都' ? 'Tokyo' :
                 area === '大阪府' ? 'Osaka' :
                 area === '兵庫県' ? 'Hyogo' :
                 area === '大分県' ? 'Oita' :
                 area === '中国' ? 'China' :
                 area === 'その他' ? 'Others' : area}
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                id={facility.id}
                title={facility.title}
                description={facility.description}
                imageUrl={facility.imageUrl}
                area={facility.area}
                organizer={facility.organizer}
                organizerType={facility.organizerType || "その他"}
                website={facility.website}
                targetArea={facility.targetArea}
                targetAudience={facility.targetAudience}
                incentive={facility.facilityInfo}
                operatingCompany={facility.address}
                isDropinAvailable={facility.isDropinAvailable}
                isNexanaAvailable={facility.isNexanaAvailable}
                type="facility"
              />
            ))}
          </div>
        </div>
      ))}

      {/* エリア未設定の施設 */}
      {(() => {
        const unassignedFacilities = filteredFacilities.filter(facility => 
          !japanAreas.includes(facility.area || '') && 
          !overseasAreas.includes(facility.area || '')
        );
        if (unassignedFacilities.length === 0) return null;

        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
                その他
                <span className="block text-sm font-news-subheading text-gray-500 mt-1">Others</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
              {unassignedFacilities.map((facility) => (
                <Card
                  key={facility.id}
                  id={facility.id}
                  title={facility.title}
                  description={facility.description}
                  imageUrl={facility.imageUrl}
                  area={facility.area}
                  organizer={facility.organizer}
                  organizerType={facility.organizerType || "その他"}
                  website={facility.website}
                  targetArea={facility.targetArea}
                  targetAudience={facility.targetAudience}
                  incentive={facility.facilityInfo}
                  operatingCompany={facility.address}
                  isDropinAvailable={facility.isDropinAvailable}
                  isNexanaAvailable={facility.isNexanaAvailable}
                  type="facility"
                />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
