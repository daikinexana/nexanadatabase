"use client";

import { useState, useMemo, useEffect } from "react";
import SimpleImage from "@/components/ui/simple-image";
import WorkspaceModal from "@/components/ui/workspace-modal";
import WorkspaceMap from "@/components/ui/workspace-map";
import { getClientIdentifier } from "@/lib/user-identifier";
import { Heart, MessageCircle } from "lucide-react";

interface Location {
  id: string;
  slug: string;
  country: string;
  city: string;
  description?: string | null;
  topImageUrl?: string | null;
  mapImageUrl?: string | null;
  companyCard1Image?: string | null;
  companyCard1Name?: string | null;
  companyCard1DescTop?: string | null;
  companyCard1DescBottom?: string | null;
  companyCard2Image?: string | null;
  companyCard2Name?: string | null;
  companyCard2DescTop?: string | null;
  companyCard2DescBottom?: string | null;
  companyCard3Image?: string | null;
  companyCard3Name?: string | null;
  companyCard3DescTop?: string | null;
  companyCard3DescBottom?: string | null;
  experienceCard1Image?: string | null;
  experienceCard1Title?: string | null;
  experienceCard1Url?: string | null;
  experienceCard2Image?: string | null;
  experienceCard2Title?: string | null;
  experienceCard2Url?: string | null;
  experienceCard3Image?: string | null;
  experienceCard3Title?: string | null;
  experienceCard3Url?: string | null;
  sightseeingCard1Image?: string | null;
  sightseeingCard1Title?: string | null;
  sightseeingCard2Image?: string | null;
  sightseeingCard2Title?: string | null;
  sightseeingCard3Image?: string | null;
  sightseeingCard3Title?: string | null;
  workspaces: Array<{
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
    hasMultipleLocations: boolean;
    requiresAdvanceNotice: boolean;
    canDoWebMeeting: boolean;
    hasEnglishSupport: boolean;
    meetsNexanaStandard: boolean;
    isNexanaRecommended: boolean;
  }>;
}

interface LocationDetailClientProps {
  location: Location;
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
  hasMultipleLocations: boolean;
  requiresAdvanceNotice: boolean;
  canDoWebMeeting: boolean;
  hasEnglishSupport: boolean;
  meetsNexanaStandard: boolean;
  isNexanaRecommended: boolean;
};

type CategoryFilter = 
  | "work" 
  | "connect" 
  | "prototype" 
  | "pilot" 
  | "test" 
  | "support" 
  | "showcase" 
  | "learn" 
  | "stay";

export default function LocationDetailClient({ location }: LocationDetailClientProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryFilter[]>([]);
  const [filterMultipleLocations, setFilterMultipleLocations] = useState<boolean | null>(null);
  const [filterDropin, setFilterDropin] = useState<boolean | null>(null);
  const [workspaceLikes, setWorkspaceLikes] = useState<Record<string, { likeCount: number; isLiked: boolean }>>({});
  const [workspaceCommentCounts, setWorkspaceCommentCounts] = useState<Record<string, number>>({});

  // いいねとコメント情報を取得
  useEffect(() => {
    const fetchLikesAndComments = async () => {
      const clientId = getClientIdentifier();
      const likesData: Record<string, { likeCount: number; isLiked: boolean }> = {};
      const commentCounts: Record<string, number> = {};

      await Promise.all(
        (location.workspaces || []).map(async (ws) => {
          try {
            // いいね情報を取得
            const likesResponse = await fetch(`/api/workspace/${ws.id}/like`, {
              headers: {
                'X-Client-Id': clientId,
              },
            });
            if (likesResponse.ok) {
              const likesData_item = await likesResponse.json();
              likesData[ws.id] = likesData_item;
            }

            // コメント数を取得
            const commentsResponse = await fetch(`/api/workspace/${ws.id}/comments`, {
              headers: {
                'X-Client-Id': clientId,
              },
            });
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              commentCounts[ws.id] = commentsData.comments?.length || 0;
            }
          } catch (error) {
            console.error(`Error fetching data for workspace ${ws.id}:`, error);
          }
        })
      );

      setWorkspaceLikes(likesData);
      setWorkspaceCommentCounts(commentCounts);
    };

    if (location.workspaces && location.workspaces.length > 0) {
      fetchLikesAndComments();
    }
  }, [location.workspaces]);

  const handleLike = async (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation(); // カードのクリックイベントを防ぐ
    const clientId = getClientIdentifier();
    
    try {
      const response = await fetch(`/api/workspace/${workspaceId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': clientId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkspaceLikes((prev) => ({
          ...prev,
          [workspaceId]: {
            likeCount: data.likeCount,
            isLiked: data.isLiked,
          },
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openWorkspaceModal = async (workspaceId: string) => {
    setLoadingWorkspace(true);
    try {
      const response = await fetch(`/api/workspace/${workspaceId}`);
      if (response.ok) {
        const workspaceData = await response.json();
        setSelectedWorkspace(workspaceData);
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch workspace:", response.status);
      }
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      setLoadingWorkspace(false);
    }
  };

  // カテゴリのマッピング
  const categoryMap = useMemo(() => ({
    work: { key: "categoryWork" as const, label: "執務 (Work)" },
    connect: { key: "categoryConnect" as const, label: "交流 (Connect)" },
    prototype: { key: "categoryPrototype" as const, label: "試作 (Prototype)" },
    pilot: { key: "categoryPilot" as const, label: "実証 (Pilot)" },
    test: { key: "categoryTest" as const, label: "試験 (Test)" },
    support: { key: "categorySupport" as const, label: "支援 (Support)" },
    showcase: { key: "categoryShowcase" as const, label: "発表 (Showcase)" },
    learn: { key: "categoryLearn" as const, label: "学ぶ (Learn)" },
    stay: { key: "categoryStay" as const, label: "滞在 (Stay)" },
  }), []);

  // カテゴリのトグル関数
  const toggleCategory = (category: CategoryFilter) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        // 選択解除
        return prev.filter(c => c !== category);
      } else {
        // 選択追加
        return [...prev, category];
      }
    });
  };

  // フィルタリングとソート
  const filteredAndSortedWorkspaces = useMemo(() => {
    let filtered = [...(location.workspaces || [])];

    // カテゴリフィルタ（複数選択対応・AND条件）
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ws) => {
        // 選択されたすべてのカテゴリを含むワークスペースのみ表示
        return selectedCategories.every(category => {
          const categoryKey = categoryMap[category].key;
          return ws[categoryKey];
        });
      });
    }

    // 複数拠点フィルタ
    if (filterMultipleLocations !== null) {
      filtered = filtered.filter((ws) => ws.hasMultipleLocations === filterMultipleLocations);
    }

    // ドロップインフィルタ
    if (filterDropin !== null) {
      filtered = filtered.filter((ws) => ws.hasDropin === filterDropin);
    }

    // ソート: nexana Best 3を最上位に、その次にいいね数の多い順
    filtered.sort((a, b) => {
      // 1. nexana Best 3を最上位に
      if (a.isNexanaRecommended && !b.isNexanaRecommended) return -1;
      if (!a.isNexanaRecommended && b.isNexanaRecommended) return 1;
      
      // 2. 両方ともnexana Best 3、または両方ともそうでない場合、いいね数でソート
      const aLikeCount = workspaceLikes[a.id]?.likeCount || 0;
      const bLikeCount = workspaceLikes[b.id]?.likeCount || 0;
      
      // いいね数の多い順（降順）
      return bLikeCount - aLikeCount;
    });

    return filtered;
  }, [location.workspaces, selectedCategories, filterMultipleLocations, filterDropin, workspaceLikes, categoryMap]);

  // アクティブなカテゴリを取得
  const getActiveCategories = (workspace: typeof location.workspaces[0]) => {
    const categories: Array<{ key: CategoryFilter; label: string }> = [];
    if (workspace.categoryWork) categories.push({ key: "work", label: categoryMap.work.label });
    if (workspace.categoryConnect) categories.push({ key: "connect", label: categoryMap.connect.label });
    if (workspace.categoryPrototype) categories.push({ key: "prototype", label: categoryMap.prototype.label });
    if (workspace.categoryPilot) categories.push({ key: "pilot", label: categoryMap.pilot.label });
    if (workspace.categoryTest) categories.push({ key: "test", label: categoryMap.test.label });
    if (workspace.categorySupport) categories.push({ key: "support", label: categoryMap.support.label });
    if (workspace.categoryShowcase) categories.push({ key: "showcase", label: categoryMap.showcase.label });
    if (workspace.categoryLearn) categories.push({ key: "learn", label: categoryMap.learn.label });
    if (workspace.categoryStay) categories.push({ key: "stay", label: categoryMap.stay.label });
    return categories;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top画像 */}
        {location.topImageUrl && (
          <div className="relative w-full h-[60vh] mb-12 rounded-2xl overflow-hidden">
            <SimpleImage
              src={location.topImageUrl}
              alt={location.city}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{location.city}</h1>
                <p className="text-xl text-gray-200">{location.country}</p>
              </div>
            </div>
          </div>
        )}

        {/* 企業リストカード（上部表示はオフ。体験ブログ位置に移設） */}
        {false && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <div className="text-sm uppercase tracking-wider text-gray-600 mb-2">ABOUT</div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">企業リスト</h2>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                地域を代表する企業や注目のスタートアップなど、{location.city || ''}で活動する企業の情報を掲載しています。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  image: location.companyCard1Image,
                  name: location.companyCard1Name,
                  descTop: location.companyCard1DescTop,
                  descBottom: location.companyCard1DescBottom,
                },
                {
                  image: location.companyCard2Image,
                  name: location.companyCard2Name,
                  descTop: location.companyCard2DescTop,
                  descBottom: location.companyCard2DescBottom,
                },
                {
                  image: location.companyCard3Image,
                  name: location.companyCard3Name,
                  descTop: location.companyCard3DescTop,
                  descBottom: location.companyCard3DescBottom,
                },
              ]
              .filter((card) => card.image || card.name)
              .map((card, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    {card.descTop && (
                      <div className="mb-4">
                        <span className="inline-block bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-md">
                          {card.descTop}
                        </span>
                      </div>
                    )}
                    
                    {card.name && (
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight min-h-[4rem] md:min-h-[5rem] flex items-start">
                        {card.name}
                      </h3>
                    )}
                    
                    <div className="space-y-4">
                      {card.image && (
                        <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden bg-gray-200">
                          <SimpleImage
                            src={card.image}
                            alt={card.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {card.descBottom && (
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {card.descBottom}
                        </div>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </section>
        )}

        {/* 地図（Google Map） */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="text-sm uppercase tracking-wider text-gray-600 mb-2">MAP</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">ワークスペース</h2>
            <p className="text-base text-gray-700 max-w-3xl mx-auto">
              {location.city}で利用可能なワークスペースやコワーキングスペースの位置情報をGoogle Mapで確認できます。
            </p>
          </div>
          <WorkspaceMap 
            workspaces={filteredAndSortedWorkspaces} 
            onMarkerClick={openWorkspaceModal}
          />
        </section>

        {/* ワークスペースカード */}
        {location.workspaces && location.workspaces.length > 0 && (
          <section className="mb-16">
            {/* フィルタリングUI */}
            <div className="mb-8 space-y-6 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur shadow-sm px-4 md:px-6 py-5">
              {/* カテゴリフィルタ */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">C</span>
                  カテゴリで絞り込む（複数選択可）
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setSelectedCategories([])}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                      selectedCategories.length === 0
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200/50 border-transparent scale-[1.02]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
                    }`}
                  >
                    すべて
                  </button>
                  {Object.entries(categoryMap).map(([key, { label }]) => {
                    const isSelected = selectedCategories.includes(key as CategoryFilter);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleCategory(key as CategoryFilter)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg shadow-gray-400/30 border-transparent scale-[1.02]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedCategories.length}個のカテゴリを選択中
                  </p>
                )}
              </div>

              {/* その他のフィルタ */}
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">複数拠点</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterMultipleLocations(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        filterMultipleLocations === null
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
                      }`}
                    >
                      すべて
                    </button>
                    <button
                      onClick={() => setFilterMultipleLocations(true)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        filterMultipleLocations === true
                          ? "bg-gray-900 text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      あり
                    </button>
                    <button
                      onClick={() => setFilterMultipleLocations(false)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        filterMultipleLocations === false
                          ? "bg-gray-900 text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">ドロップイン</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterDropin(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        filterDropin === null
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-emerald-200 hover:text-emerald-700"
                      }`}
                    >
                      すべて
                    </button>
                    <button
                      onClick={() => setFilterDropin(true)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        filterDropin === true
                          ? "bg-gray-900 text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      可
                    </button>
                    <button
                      onClick={() => setFilterDropin(false)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        filterDropin === false
                          ? "bg-gray-900 text-white border-transparent shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      不可
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredAndSortedWorkspaces.map((workspace) => {
                const activeCategories = getActiveCategories(workspace);
                return (
                  <div
                    key={workspace.id}
                    onClick={() => !loadingWorkspace && openWorkspaceModal(workspace.id)}
                    className={`group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-2xl cursor-pointer ${loadingWorkspace ? 'opacity-50' : ''}`}
                  >
                    {/* nexana Best 3バッジ */}
                    {workspace.isNexanaRecommended && (
                      <div className="absolute top-3 right-3 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 rounded-full blur-sm opacity-75 animate-pulse"></div>
                          <span className="relative inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wider">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Best 3
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 画像エリア */}
                    <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gray-100">
                      {workspace.imageUrl ? (
                        <SimpleImage
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          style={{ objectPosition: 'center top' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      {/* グラデーションオーバーレイ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      
                      {/* メインタイトル */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 break-words" style={{ 
                          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                          lineHeight: '1.2',
                          letterSpacing: '-0.02em'
                        }}>
                          {workspace.name}
                        </h3>
                      </div>
                      
                      {/* タグ（画像上） */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        {workspace.hasNexana && (
                          <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider border border-white/20">
                            <span className="w-1 h-1 bg-white rounded-full"></span>
                            NEXANA
                          </span>
                        )}
                        {workspace.hasDropin && (
                          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider border border-white/50">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Drop-in
                          </span>
                        )}
                        {workspace.hasMultipleLocations && (
                          <span className="inline-flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Multi
                          </span>
                        )}
                        {workspace.hasEnglishSupport && (
                          <span className="inline-flex items-center gap-1 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider">
                            <span className="text-[8px]">🌐</span>
                            English
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* コンテンツエリア */}
                    <div className="p-5 flex-1 flex flex-col min-h-[180px]">
                      {/* 施設特徴一言 */}
                      {workspace.facilityFeatureOneLine && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 leading-relaxed font-light italic" style={{
                            letterSpacing: '0.01em',
                            lineHeight: '1.6'
                          }}>
                            &ldquo;{workspace.facilityFeatureOneLine}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* カテゴリバッジ */}
                      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[48px]">
                        {activeCategories.length > 0 ? (
                          activeCategories.map((category) => (
                            <span
                              key={category.key}
                              className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-gray-200 transition-colors duration-200"
                            >
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                              {category.label.split(' ')[0]}
                            </span>
                          ))
                        ) : (
                          <span className="invisible text-[11px]">Placeholder</span>
                        )}
                      </div>

                      {/* いいねとコメント */}
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => handleLike(e, workspace.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                              workspaceLikes[workspace.id]?.isLiked
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <Heart 
                              className={`w-4 h-4 ${workspaceLikes[workspace.id]?.isLiked ? 'fill-red-600 text-red-600' : ''}`} 
                            />
                            <span>{workspaceLikes[workspace.id]?.likeCount || 0}</span>
                          </button>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            <span>{workspaceCommentCounts[workspace.id] || 0}</span>
                          </div>
                        </div>
                        {/* 場所情報 */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{workspace.city}</span>
                          <span className="text-gray-300">•</span>
                          <span>{workspace.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 企業リストカード（体験ブログセクションを置き換え） */}
        <section className="mb-16 bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm uppercase tracking-wider text-gray-600 mb-2">ABOUT</div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">企業リスト</h2>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                地域を代表する企業や注目のスタートアップなど、{location.city || ''}で活動する企業の情報を掲載しています。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  image: location.companyCard1Image,
                  name: location.companyCard1Name,
                  descTop: location.companyCard1DescTop,
                  descBottom: location.companyCard1DescBottom,
                },
                {
                  image: location.companyCard2Image,
                  name: location.companyCard2Name,
                  descTop: location.companyCard2DescTop,
                  descBottom: location.companyCard2DescBottom,
                },
                {
                  image: location.companyCard3Image,
                  name: location.companyCard3Name,
                  descTop: location.companyCard3DescTop,
                  descBottom: location.companyCard3DescBottom,
                },
              ]
                .filter((card) => card.image || card.name)
                .map((card, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                  >
                    {card.descTop && (
                      <div className="mb-4">
                        <span className="inline-block bg-gray-700 text-white text-xs font-medium px-3 py-1 rounded-md">
                          {card.descTop}
                        </span>
                      </div>
                    )}

                    {card.name && (
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight min-h-[4rem] md:min-h-[5rem] flex items-start">
                        {card.name}
                      </h3>
                    )}

                    <div className="space-y-4">
                      {card.image && (
                        <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden bg-gray-200">
                          <SimpleImage
                            src={card.image}
                            alt={card.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      {card.descBottom && (
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {card.descBottom}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* 観光地カード */}
        <section className="mb-16 bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">観光地</h2>
              <p className="text-base text-gray-700 max-w-3xl mx-auto">
                {location.city}周辺の観光スポットや名所、地域の魅力を発見できる場所をご紹介します。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  image: location.sightseeingCard1Image,
                  title: location.sightseeingCard1Title,
                },
                {
                  image: location.sightseeingCard2Image,
                  title: location.sightseeingCard2Title,
                },
                {
                  image: location.sightseeingCard3Image,
                  title: location.sightseeingCard3Title,
                },
              ].map((card, index) => {
                if (!card.image && !card.title) return null;
                
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {card.image && (
                      <div className="relative w-full h-64 md:h-80 overflow-hidden">
                        <SimpleImage
                          src={card.image}
                          alt={card.title || ""}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    {card.title && (
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {card.title}
                        </h3>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

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

