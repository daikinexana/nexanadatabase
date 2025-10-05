"use client";

import { useState } from "react";
import Card from "./card";
import { Trophy } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  incentive?: string;
  operatingCompany?: string;
  isPopular?: boolean;
  createdAt: string;
}

interface ContestsHybridDisplayProps {
  japanAreas: string[];
  overseasAreas: string[];
  filteredContests: Contest[];
}

export default function ContestsHybridDisplay({
  japanAreas,
  overseasAreas,
  filteredContests,
}: ContestsHybridDisplayProps) {
  const [showOverseas, setShowOverseas] = useState(false);

  // 日本国内のコンテストを取得
  const japanContests = filteredContests.filter(contest => 
    japanAreas.includes(contest.area || '')
  );

  // 海外のコンテストを取得（その他エリアも含む）
  const overseasContests = filteredContests.filter(contest => 
    overseasAreas.includes(contest.area || '') ||
    (!japanAreas.includes(contest.area || '') && !overseasAreas.includes(contest.area || ''))
  );

  // エリア別にコンテストをグループ化
  const groupContestsByArea = (contests: Contest[], areas: string[]) => {
    const grouped: Record<string, Contest[]> = {};
    
    areas.forEach(area => {
      const areaContests = contests.filter(contest => contest.area === area);
      if (areaContests.length > 0) {
        grouped[area] = areaContests;
      }
    });
    
    return grouped;
  };

  const japanGrouped = groupContestsByArea(japanContests, japanAreas);
  
  // 海外コンテストのグループ化（その他エリアも含む）
  const overseasGrouped = groupContestsByArea(overseasContests, overseasAreas);
  
  // その他エリアのコンテストを追加
  const unassignedContests = filteredContests.filter(contest => 
    !japanAreas.includes(contest.area || '') && 
    !overseasAreas.includes(contest.area || '')
  );
  
  if (unassignedContests.length > 0) {
    overseasGrouped['その他'] = unassignedContests;
  }

  // エリアの英語名マッピング
  const getAreaEnglishName = (area: string) => {
    const mapping: Record<string, string> = {
      '全国': 'Nationwide',
      '東京都': 'Tokyo',
      '大阪府': 'Osaka',
      '兵庫県': 'Hyogo',
      '大分県': 'Oita',
      '中国': 'China',
      'その他': 'Others',
    };
    return mapping[area] || area;
  };

  return (
    <div className="space-y-12">
      {/* 日本国内のエリア */}
      {Object.entries(japanGrouped).map(([area, areaContests]) => (
        <div key={area}>
          <div className="mb-6">
            <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
              {area}
              <span className="block text-sm font-news-subheading text-gray-500 mt-1">
                {getAreaEnglishName(area)}
              </span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            {areaContests.map((contest) => (
              <Card
                key={contest.id}
                id={contest.id}
                title={contest.title}
                description={contest.description}
                imageUrl={contest.imageUrl}
                deadline={contest.deadline ? new Date(contest.deadline) : undefined}
                startDate={contest.startDate ? new Date(contest.startDate) : undefined}
                area={contest.area}
                organizer={contest.organizer}
                organizerType={contest.organizerType || "その他"}
                website={contest.website}
                targetArea={contest.targetArea}
                targetAudience={contest.targetAudience}
                incentive={contest.incentive}
                operatingCompany={contest.operatingCompany}
                isPopular={contest.isPopular}
                type="contest"
              />
            ))}
          </div>
        </div>
      ))}

      {/* 海外エリアの表示切り替え */}
      {Object.keys(overseasGrouped).length > 0 && (
        <>
          {!showOverseas ? (
            <div className="text-center py-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <Trophy className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                  海外・その他のコンテスト
                </h3>
                <p className="text-gray-600 font-news text-sm mb-4">
                  {Object.keys(overseasGrouped).length}の国・地域・その他で
                  {overseasContests.length}件のコンテストがあります
                </p>
                <button
                  onClick={() => setShowOverseas(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 font-medium"
                >
                  海外・その他のコンテストを見る
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 海外のエリア */}
              {Object.entries(overseasGrouped).map(([area, areaContests]) => (
                <div key={area}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
                      {area}
                      <span className="block text-sm font-news-subheading text-gray-500 mt-1">
                        {getAreaEnglishName(area)}
                      </span>
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {areaContests.map((contest) => (
                      <Card
                        key={contest.id}
                        id={contest.id}
                        title={contest.title}
                        description={contest.description}
                        imageUrl={contest.imageUrl}
                        deadline={contest.deadline ? new Date(contest.deadline) : undefined}
                        startDate={contest.startDate ? new Date(contest.startDate) : undefined}
                        area={contest.area}
                        organizer={contest.organizer}
                        organizerType={contest.organizerType || "その他"}
                        website={contest.website}
                        targetArea={contest.targetArea}
                        targetAudience={contest.targetAudience}
                        incentive={contest.incentive}
                        operatingCompany={contest.operatingCompany}
                        isPopular={contest.isPopular}
                        type="contest"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}

    </div>
  );
}
