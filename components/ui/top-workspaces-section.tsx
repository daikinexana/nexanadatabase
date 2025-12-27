"use client";

import { useState } from "react";
import { MapPin, Heart, TrendingUp, Sparkles } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import WorkspaceModal from "@/components/ui/workspace-modal";

interface TopWorkspace {
  id: string;
  name: string;
  imageUrl?: string | null;
  city: string;
  country: string;
  likeCount: number;
  locationId?: string | null;
  location?: {
    slug: string;
  } | null;
}

interface TopWorkspacesSectionProps {
  topWorkspaces: TopWorkspace[];
}

type WorkspaceData = {
  id: string;
  name: string;
  imageUrl?: string | null;
  country: string;
  city: string;
  address?: string | null;
  officialLink?: string | null;
  businessHours?: string | null;
  hasDropin: boolean;
  hasNexana: boolean;
  hasMeetingRoom: boolean;
  hasPhoneBooth: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  priceTable?: string | null;
  rental?: string | null;
  notes?: string | null;
  operator?: string | null;
  management?: string | null;
  tenantCard1Title?: string | null;
  tenantCard1Desc?: string | null;
  tenantCard1Image?: string | null;
  tenantCard2Title?: string | null;
  tenantCard2Desc?: string | null;
  tenantCard2Image?: string | null;
  tenantCard3Title?: string | null;
  tenantCard3Desc?: string | null;
  tenantCard3Image?: string | null;
  communityManagerImage?: string | null;
  communityManagerTitle?: string | null;
  communityManagerDesc?: string | null;
  communityManagerContact?: string | null;
  facilityCard1Title?: string | null;
  facilityCard1Desc?: string | null;
  facilityCard1Image?: string | null;
  facilityCard2Title?: string | null;
  facilityCard2Desc?: string | null;
  facilityCard2Image?: string | null;
  facilityCard3Title?: string | null;
  facilityCard3Desc?: string | null;
  facilityCard3Image?: string | null;
  facilityCard4Title?: string | null;
  facilityCard4Desc?: string | null;
  facilityCard4Image?: string | null;
  facilityCard5Title?: string | null;
  facilityCard5Desc?: string | null;
  facilityCard5Image?: string | null;
  facilityCard6Title?: string | null;
  facilityCard6Desc?: string | null;
  facilityCard6Image?: string | null;
  facilityCard7Title?: string | null;
  facilityCard7Desc?: string | null;
  facilityCard7Image?: string | null;
  facilityCard8Title?: string | null;
  facilityCard8Desc?: string | null;
  facilityCard8Image?: string | null;
  facilityCard9Title?: string | null;
  facilityCard9Desc?: string | null;
  facilityCard9Image?: string | null;
  nearbyHotelTitle?: string | null;
  nearbyHotelDesc?: string | null;
  nearbyHotelUrl?: string | null;
  nearbyHotelImage1?: string | null;
  nearbyHotelImage2?: string | null;
  nearbyHotelImage3?: string | null;
  nearbyHotelImage4?: string | null;
  nearbyHotelImage5?: string | null;
  nearbyHotelImage6?: string | null;
  nearbyHotelImage7?: string | null;
  nearbyHotelImage8?: string | null;
  nearbyHotelImage9?: string | null;
  nearbyFood1Title?: string | null;
  nearbyFood1Desc?: string | null;
  nearbyFood1Image?: string | null;
  nearbyFood2Title?: string | null;
  nearbyFood2Desc?: string | null;
  nearbyFood2Image?: string | null;
  nearbyFood3Title?: string | null;
  nearbyFood3Desc?: string | null;
  nearbyFood3Image?: string | null;
  nearbySpot1Title?: string | null;
  nearbySpot1Desc?: string | null;
  nearbySpot1Image?: string | null;
  nearbySpot2Title?: string | null;
  nearbySpot2Desc?: string | null;
  nearbySpot2Image?: string | null;
  nearbySpot3Title?: string | null;
  nearbySpot3Desc?: string | null;
  nearbySpot3Image?: string | null;
  facilityFeatureOneLine?: string | null;
  categoryWork: boolean;
  categoryConnect: boolean;
  categoryPrototype: boolean;
  categoryPilot: boolean;
  categoryTest: boolean;
  categorySupport: boolean;
  categoryShowcase: boolean;
  categoryLearn: boolean;
  categoryStay: boolean;
};

export default function TopWorkspacesSection({ topWorkspaces }: TopWorkspacesSectionProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkspaceClick = async (e: React.MouseEvent, workspaceId: string) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/workspace/${workspaceId}`);
      if (response.ok) {
        const workspaceData = await response.json();
        setSelectedWorkspace(workspaceData as WorkspaceData);
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch workspace details");
      }
    } catch (error) {
      console.error("Error fetching workspace details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (topWorkspaces.length === 0) {
    return null;
  }

  return (
    <>
      <section className="mb-8 sm:mb-10 md:mb-12 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-rose-100/50 shadow-lg">
        {/* 背景装飾 - より洗練された */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/40 via-pink-50/30 to-purple-50/40 -z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,63,94,0.05)_0%,transparent_30%,rgba(168,85,247,0.05)_100%)] -z-10"></div>
        
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {/* セクションヘッダー - コンパクト */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-5 sm:h-6 bg-gradient-to-b from-rose-500 via-pink-500 to-purple-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    人気のワークスペース
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-rose-200/50">
                  <TrendingUp className="w-3 h-3 text-rose-600" />
                  <span className="text-xs font-semibold text-gray-700">いいね順</span>
                </div>
              </div>
            </div>
          </div>

          {/* ワークスペースグリッド - 2段表示 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4">
            {topWorkspaces.map((workspace, index) => {
              return (
                <div
                  key={workspace.id}
                  onClick={(e) => handleWorkspaceClick(e, workspace.id)}
                  className="group relative bg-white/90 backdrop-blur-xl rounded-lg sm:rounded-xl overflow-hidden border border-gray-200/50 cursor-pointer block active:scale-[0.97] touch-manipulation transition-all duration-300 hover:shadow-lg hover:border-rose-300/50 hover:-translate-y-0.5"
                >
                  {/* ランキングバッジ - コンパクト */}
                  <div className="absolute top-2 left-2 z-20">
                    <div className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-black text-white text-[10px] sm:text-xs shadow-lg border border-white/30 ${
                      index === 0 ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800' :
                      'bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600'
                    }`}>
                      {index === 0 && <span className="absolute -top-0.5 -right-0.5 text-[8px]">👑</span>}
                      <span className="relative z-10">{index + 1}</span>
                    </div>
                  </div>

                  {/* 画像エリア - コンパクト */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {workspace.imageUrl ? (
                      <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500 ease-out">
                        <SimpleImage
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                    )}
                    
                    {/* グラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/50 transition-all duration-300"></div>
                    
                    {/* いいね数バッジ - コンパクト */}
                    <div className="absolute bottom-2 right-2 z-20">
                      <div className="flex items-center gap-1 px-1.5 py-1 bg-black/75 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                        <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                        <span className="text-[9px] font-bold text-white">{workspace.likeCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* コンテンツエリア - コンパクト */}
                  <div className="p-2 sm:p-2.5 bg-white">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-rose-600 transition-colors">
                      {workspace.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500">
                      <MapPin className="w-2.5 h-2.5 text-rose-500/60" />
                      <span className="truncate">{workspace.city}</span>
                    </div>
                  </div>

                  {/* ホバー時のアクセントライン */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  {/* ローディングオーバーレイ */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ワークスペースモーダル */}
      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWorkspace(null);
        }}
        workspace={selectedWorkspace}
      />
    </>
  );
}

