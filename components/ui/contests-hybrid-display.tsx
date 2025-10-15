"use client";

import Card from "./card";

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
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {area}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* 海外のエリア */}
      {Object.entries(overseasGrouped).map(([area, areaContests]) => (
        <div key={area}>
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {area}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

    </div>
  );
}
