"use client";

import { useState } from "react";
import Card from "./card";
import { Handshake } from "lucide-react";

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

interface OpenCallsHybridDisplayProps {
  japanAreas: string[];
  overseasAreas: string[];
  filteredOpenCalls: OpenCall[];
}

export default function OpenCallsHybridDisplay({
  japanAreas,
  overseasAreas,
  filteredOpenCalls,
}: OpenCallsHybridDisplayProps) {
  const [showOverseas, setShowOverseas] = useState(false);

  // 日本国内の公募を取得
  const japanOpenCalls = filteredOpenCalls.filter(openCall => 
    japanAreas.includes(openCall.area || '')
  );

  // 海外の公募を取得
  const overseasOpenCalls = filteredOpenCalls.filter(openCall => 
    overseasAreas.includes(openCall.area || '')
  );

  // エリア別に公募をグループ化
  const groupOpenCallsByArea = (openCalls: OpenCall[], areas: string[]) => {
    return areas.map(area => {
      const areaOpenCalls = openCalls.filter(openCall => openCall.area === area);
      return { area, openCalls: areaOpenCalls };
    }).filter(group => group.openCalls.length > 0);
  };

  // 日本国内の公募をエリア別にグループ化
  const japanGroups = groupOpenCallsByArea(japanOpenCalls, japanAreas);

  // 海外の公募をエリア別にグループ化
  const overseasGroups = groupOpenCallsByArea(overseasOpenCalls, overseasAreas);

  return (
    <div className="space-y-12">
      {/* 日本国内の公募 */}
      {japanGroups.map(({ area, openCalls }) => (
        <div key={area}>
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">O</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {area}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {openCalls.map((openCall) => (
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
                incentive={openCall.availableResources}
                operatingCompany={openCall.operatingCompany}
                type="open-call"
              />
            ))}
          </div>
        </div>
      ))}

      {/* 海外の公募表示ボタン */}
      {overseasGroups.length > 0 && !showOverseas && (
        <div className="text-center py-6 sm:py-8">
          <button
            onClick={() => setShowOverseas(true)}
            className="inline-flex items-center px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-news-subheading rounded-lg hover:from-green-600 hover:to-blue-700 active:from-green-700 active:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base min-h-[44px] touch-manipulation"
          >
            <Handshake className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            海外の公募を見る ({overseasOpenCalls.length}件)
          </button>
        </div>
      )}

      {/* 海外の公募 */}
      {showOverseas && overseasGroups.map(({ area, openCalls }) => (
        <div key={area}>
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">O</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {area}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {openCalls.map((openCall) => (
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
                incentive={openCall.availableResources}
                operatingCompany={openCall.operatingCompany}
                type="open-call"
              />
            ))}
          </div>
        </div>
      ))}

      {/* エリア未設定の公募 */}
      {(() => {
        const unassignedOpenCalls = filteredOpenCalls.filter(openCall => 
          !japanAreas.includes(openCall.area || '') && 
          !overseasAreas.includes(openCall.area || '')
        );
        if (unassignedOpenCalls.length === 0) return null;

        return (
          <div>
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">O</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  その他
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
                  incentive={openCall.availableResources}
                  operatingCompany={openCall.operatingCompany}
                  type="open-call"
                />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
