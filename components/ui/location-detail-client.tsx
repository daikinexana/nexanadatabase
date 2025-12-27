"use client";

import { useState, useMemo, useEffect } from "react";
import SimpleImage from "@/components/ui/simple-image";
import WorkspaceModal from "@/components/ui/workspace-modal";
import WorkspaceMap from "@/components/ui/workspace-map";
import Pagination from "@/components/ui/pagination";
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
  workspaces?: Array<{
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
  
  // ページネーション関連の状態
  const [workspaces, setWorkspaces] = useState<typeof location.workspaces>(location.workspaces || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  
  // Google Map用にすべてのワークスペースを保持
  const [allWorkspacesForMap, setAllWorkspacesForMap] = useState<typeof location.workspaces>([]);

  // ワークスペースを取得（フィルター適用）
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoadingWorkspaces(true);
      try {
        // フィルターパラメータを構築
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: "60",
        });

        if (selectedCategories.length > 0) {
          params.append("categories", selectedCategories.join(","));
        }
        if (filterMultipleLocations !== null) {
          params.append("filterMultipleLocations", String(filterMultipleLocations));
        }
        if (filterDropin !== null) {
          params.append("filterDropin", String(filterDropin));
        }

        const response = await fetch(`/api/location/${location.id}/workspaces?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data.workspaces);
          setTotalPages(data.pagination.totalPages);
          setTotalCount(data.pagination.totalCount);
        } else {
          console.error("Failed to fetch workspaces");
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setIsLoadingWorkspaces(false);
      }
    };

    // フィルターが変更された場合、ページを1にリセット
    if (currentPage === 1 || !location.workspaces || location.workspaces.length === 0) {
      fetchWorkspaces();
    }
  }, [location.id, currentPage, selectedCategories, filterMultipleLocations, filterDropin, location.workspaces]);

  // ページ変更時にワークスペースを取得
  useEffect(() => {
    if (currentPage > 1) {
      const fetchWorkspaces = async () => {
        setIsLoadingWorkspaces(true);
        try {
          // フィルターパラメータを構築
          const params = new URLSearchParams({
            page: String(currentPage),
            limit: "60",
          });

          if (selectedCategories.length > 0) {
            params.append("categories", selectedCategories.join(","));
          }
          if (filterMultipleLocations !== null) {
            params.append("filterMultipleLocations", String(filterMultipleLocations));
          }
          if (filterDropin !== null) {
            params.append("filterDropin", String(filterDropin));
          }

          const response = await fetch(`/api/location/${location.id}/workspaces?${params.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setWorkspaces(data.workspaces);
            setTotalPages(data.pagination.totalPages);
            setTotalCount(data.pagination.totalCount);
          } else {
            console.error("Failed to fetch workspaces");
          }
        } catch (error) {
          console.error("Error fetching workspaces:", error);
        } finally {
          setIsLoadingWorkspaces(false);
        }
      };
      fetchWorkspaces();
    }
  }, [currentPage, location.id, selectedCategories, filterMultipleLocations, filterDropin]);

  // Google Map用にすべてのワークスペースを取得（フィルター適用）
  useEffect(() => {
    const fetchAllWorkspacesForMap = async () => {
      try {
        // フィルターパラメータを構築
        const params = new URLSearchParams({
          all: "true",
        });

        if (selectedCategories.length > 0) {
          params.append("categories", selectedCategories.join(","));
        }
        if (filterMultipleLocations !== null) {
          params.append("filterMultipleLocations", String(filterMultipleLocations));
        }
        if (filterDropin !== null) {
          params.append("filterDropin", String(filterDropin));
        }

        // すべてのワークスペースを取得（all=trueパラメータを使用）
        const response = await fetch(`/api/location/${location.id}/workspaces?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setAllWorkspacesForMap(data.workspaces);
        } else {
          console.error("Failed to fetch all workspaces for map");
        }
      } catch (error) {
        console.error("Error fetching all workspaces for map:", error);
      }
    };

    fetchAllWorkspacesForMap();
  }, [location.id, selectedCategories, filterMultipleLocations, filterDropin]);

  // いいねとコメント情報を取得
  useEffect(() => {
    const fetchLikesAndComments = async () => {
      const clientId = getClientIdentifier();
      const likesData: Record<string, { likeCount: number; isLiked: boolean }> = {};
      const commentCounts: Record<string, number> = {};

      await Promise.all(
        (workspaces || []).map(async (ws) => {
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

    if (workspaces && workspaces.length > 0) {
      fetchLikesAndComments();
    }
  }, [workspaces]);

  // ページ変更後のスクロール処理
  useEffect(() => {
    if (shouldScrollToTop && !isLoadingWorkspaces && workspaces && workspaces.length > 0) {
      const element = document.getElementById('workspace-list');
      if (element) {
        const headerOffset = 80; // ヘッダーの高さを考慮
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop, isLoadingWorkspaces, workspaces]);

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

  // Google Map用（サーバーサイドでフィルタリング・ソート済み）
  const filteredAndSortedWorkspacesForMap = useMemo(() => {
    // サーバーサイドで既にいいね順にソートされているため、そのまま返す
    return allWorkspacesForMap || [];
  }, [allWorkspacesForMap]);

  // カード表示用（サーバーサイドでフィルタリング・ソート済み）
  const filteredAndSortedWorkspaces = useMemo(() => {
    // サーバーサイドで既にいいね順にソートされているため、そのまま返す
    return workspaces || [];
  }, [workspaces]);

  // アクティブなカテゴリを取得
  const getActiveCategories = (workspace: NonNullable<typeof workspaces>[0]) => {
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
      {/* トップ画像 - ワイド全幅、ヘッダーとのスペースなし */}
      {location.topImageUrl && (
        <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/4] overflow-hidden group">
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <SimpleImage
              src={location.topImageUrl}
              alt={location.city}
              fill
              className="object-cover sm:group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
            />
          </div>
          
          {/* グラデーションオーバーレイ - おしゃれに */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-900/5 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          
          {/* コンテンツ - 中央配置でおしゃれに */}
          <div className="relative z-20 h-full flex flex-col justify-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 sm:pb-10 md:pb-12 lg:pb-16 w-full">
              {/* バッジと国名 */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="relative">
                  <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full"></div>
                  <div className="absolute inset-0 w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-sm opacity-50"></div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white font-bold">Location</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></div>
                  <p className="text-sm sm:text-base text-white/90 font-medium">{location.country}</p>
                </div>
              </div>
              
              {/* 都市名 */}
              <div className="mb-3 sm:mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight mb-3 sm:mb-4" style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 1px 10px rgba(0,0,0,0.4)'
                }}>
                  {location.city}
                </h1>
                {location.description && (
                  <p className="text-sm sm:text-base md:text-lg text-white/90 font-light leading-relaxed max-w-2xl">
                    {location.description}
                  </p>
                )}
              </div>
              
              {/* 装飾的なライン */}
              <div className="flex items-center gap-3 sm:gap-4 pt-2">
                <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-emerald-300 via-teal-300 to-transparent"></div>
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/40 via-white/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        {/* ヘッダー - 画像なしの場合 */}
        {!location.topImageUrl && (
          <div className="relative mb-8 sm:mb-10 md:mb-12 overflow-hidden">
            {/* 画像なしの場合 */}
            <div className="relative">
              {/* 背景装飾 */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 via-teal-100/20 to-cyan-100/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-emerald-50/40 via-teal-50/30 to-cyan-50/40 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative flex flex-col gap-5 sm:gap-6 md:gap-7">
                {/* バッジと国名 - 洗練されたデザイン */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="w-0.5 sm:w-1 h-8 sm:h-10 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full"></div>
                    <div className="absolute inset-0 w-0.5 sm:w-1 h-8 sm:h-10 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full blur-sm opacity-50"></div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative px-4 sm:px-5 py-2 sm:py-2.5 bg-white/80 backdrop-blur-md rounded-full border border-emerald-200/50 shadow-sm">
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Location</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <p className="text-sm sm:text-base text-gray-700 font-medium">{location.country}</p>
                  </div>
                </div>
                
                {/* 都市名 - 魅力的なタイポグラフィ */}
                <div className="relative">
                  <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full opacity-20"></div>
                  <div className="pl-6 sm:pl-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-900 leading-[1.1] tracking-tight mb-4 sm:mb-5 relative">
                      <span className="relative z-10">{location.city}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 group-hover:w-full transition-all duration-700"></div>
                    </h1>
                    {location.description && (
                      <div className="relative pl-4 sm:pl-6 border-l-2 border-emerald-200/50">
                        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed max-w-2xl">
                          {location.description}
                        </p>
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 装飾的なライン */}
                <div className="flex items-center gap-3 sm:gap-4 pt-2">
                  <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-200 via-teal-200 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フィルタリングUI - ワークスペースタイトルと地図の間に配置（一時的にコメントアウト） */}
        {false && workspaces && (workspaces?.length ?? 0) > 0 && !isLoadingWorkspaces && (
          <div className="mb-8 sm:mb-10 md:mb-12 space-y-6 sm:space-y-7 md:space-y-8 rounded-2xl sm:rounded-3xl md:rounded-[32px] border border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-xl px-4 sm:px-5 md:px-6 lg:px-10 py-5 sm:py-6 md:py-8">
            {/* カテゴリフィルタ */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-[10px] sm:text-xs font-black">C</span>
                </div>
                <span className="text-xs sm:text-sm md:text-base">カテゴリで絞り込む（複数選択可）</span>
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                    selectedCategories.length === 0
                      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-200/50 border-transparent scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 sm:hover:scale-105"
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
                      className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        isSelected
                          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg shadow-gray-400/30 border-transparent scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {selectedCategories.length}個のカテゴリを選択中
                  </p>
                </div>
              )}
            </div>

            {/* その他のフィルタ - iPhone 16最適化 */}
            <div className="flex flex-wrap gap-4 sm:gap-5 md:gap-6 pt-3 sm:pt-4 border-t border-gray-200">
              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 block">複数拠点</label>
                <div className="flex gap-2 sm:gap-2.5">
                  <button
                    onClick={() => {
                      setFilterMultipleLocations(null);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      filterMultipleLocations === null
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 sm:hover:scale-105"
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => {
                      setFilterMultipleLocations(true);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      filterMultipleLocations === true
                        ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                    }`}
                  >
                    あり
                  </button>
                  <button
                    onClick={() => {
                      setFilterMultipleLocations(false);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      filterMultipleLocations === false
                        ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                    }`}
                  >
                    なし
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 block">ドロップイン</label>
                <div className="flex gap-2 sm:gap-2.5">
                  <button
                    onClick={() => {
                      setFilterDropin(null);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      filterDropin === null
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 sm:hover:scale-105"
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => {
                      setFilterDropin(true);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      filterDropin === true
                        ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                    }`}
                  >
                    可
                  </button>
                  <button
                    onClick={() => {
                      setFilterDropin(false);
                      setCurrentPage(1);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      filterDropin === false
                        ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                    }`}
                  >
                    不可
                  </button>
                </div>
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

        {/* 地図（Google Map） - iPhone 16最適化 */}
        <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-32 relative">
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 sm:gap-3">
                  <div className="w-0.5 sm:w-1 h-8 sm:h-10 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full border border-blue-200/50">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-blue-700 font-bold">Interactive Map</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 leading-[0.95] tracking-tight">
                  ワークスペース
                </h2>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-lg lg:text-right font-light leading-relaxed">
                <span className="font-semibold text-gray-900">{location.city}</span>で利用可能なワークスペースやコワーキングスペースの位置情報をGoogle Mapで確認できます。
              </p>
            </div>
          </div>

          {/* フィルタリングUI - ワークスペースタイトルと地図の間に配置（コンパクト版） */}
          {workspaces && workspaces.length > 0 && (
            <div className="mb-6 sm:mb-8 md:mb-10 space-y-4 sm:space-y-5 rounded-xl sm:rounded-2xl border border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-xl px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5">
              {/* カテゴリフィルタ */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2.5 sm:mb-3 flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-[9px] sm:text-[10px] font-black">C</span>
                  </div>
                  <span className="text-xs sm:text-sm">カテゴリで絞り込む（複数選択可）</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategories([])}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      selectedCategories.length === 0
                        ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-200/50 border-transparent scale-105"
                        : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 sm:hover:scale-105"
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
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                          isSelected
                            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg shadow-gray-400/30 border-transparent scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-xs text-gray-600 font-medium">
                      {selectedCategories.length}個のカテゴリを選択中
                    </p>
                  </div>
                )}
              </div>

              {/* その他のフィルタ - コンパクト版 */}
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 border-t border-gray-200">
                <div>
                  <label className="text-xs font-bold text-gray-900 mb-1.5 sm:mb-2 block">複数拠点</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                      setFilterMultipleLocations(null);
                      setCurrentPage(1);
                    }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        filterMultipleLocations === null
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 sm:hover:scale-105"
                      }`}
                    >
                      すべて
                    </button>
                    <button
                      onClick={() => {
                      setFilterMultipleLocations(true);
                      setCurrentPage(1);
                    }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        filterMultipleLocations === true
                          ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                      }`}
                    >
                      あり
                    </button>
                    <button
                      onClick={() => {
                      setFilterMultipleLocations(false);
                      setCurrentPage(1);
                    }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        filterMultipleLocations === false
                          ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-900 mb-1.5 sm:mb-2 block">ドロップイン</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                      setFilterDropin(null);
                      setCurrentPage(1);
                    }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        filterDropin === null
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-md scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-emerald-300 hover:text-emerald-700 sm:hover:scale-105"
                      }`}
                    >
                      すべて
                    </button>
                    <button
                      onClick={() => {
                      setFilterDropin(true);
                      setCurrentPage(1);
                    }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        filterDropin === true
                          ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                      }`}
                    >
                      可
                    </button>
                    <button
                      onClick={() => {
                      setFilterDropin(false);
                      setCurrentPage(1);
                    }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold border-2 transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                        filterDropin === false
                          ? "bg-gray-900 text-white border-transparent shadow-md scale-105"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:text-gray-900 sm:hover:scale-105"
                      }`}
                    >
                      不可
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden border border-gray-200/50 shadow-2xl bg-white">
            <WorkspaceMap 
              workspaces={filteredAndSortedWorkspacesForMap} 
              onMarkerClick={openWorkspaceModal}
            />
          </div>
        </section>

        {/* ワークスペースカード */}
        <section id="workspace-list" className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
          {/* セクションヘッダー - iPhone 16最適化 */}
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 sm:gap-3">
                  <div className="w-0.5 sm:w-1 h-8 sm:h-10 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full border border-emerald-200/50">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Workspaces</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 leading-[0.95] tracking-tight">
                  ワークスペース一覧
                </h2>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-light">
                <span className="font-semibold text-gray-900">{totalCount || filteredAndSortedWorkspaces.length}</span>件のワークスペース
              </div>
            </div>
          </div>

          {/* ローディング状態 */}
          {isLoadingWorkspaces && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          )}

          {/* ワークスペースグリッド */}
          {!isLoadingWorkspaces && filteredAndSortedWorkspaces.length > 0 && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8">
              {filteredAndSortedWorkspaces.map((workspace) => {
                const activeCategories = getActiveCategories(workspace);
                return (
                  <div
                    key={workspace.id}
                    onClick={() => !loadingWorkspace && openWorkspaceModal(workspace.id)}
                    className={`group relative flex flex-col h-full bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 sm:hover:border-gray-200 transition-all duration-300 sm:hover:shadow-2xl cursor-pointer active:scale-[0.98] touch-manipulation ${loadingWorkspace ? 'opacity-50' : ''}`}
                  >
                    {/* nexana Best 3バッジ - iPhone 16最適化 */}
                    {workspace.isNexanaRecommended && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 rounded-full blur-sm opacity-75 animate-pulse"></div>
                          <span className="relative inline-flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg uppercase tracking-wider">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Best 3
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 画像エリア - iPhone 16最適化 */}
                    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden bg-gray-100">
                      {workspace.imageUrl ? (
                        <SimpleImage
                          src={workspace.imageUrl}
                          alt={workspace.name}
                          fill
                          className="object-cover sm:group-hover:scale-110 transition-transform duration-700 ease-out"
                          style={{ objectPosition: 'center top' }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      {/* グラデーションオーバーレイ */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      
                      {/* メインタイトル - iPhone 16最適化 */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
                        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5 sm:mb-2 break-words" style={{ 
                          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                          lineHeight: '1.2',
                          letterSpacing: '-0.02em'
                        }}>
                          {workspace.name}
                        </h3>
                      </div>
                      
                      {/* タグ（画像上） - iPhone 16最適化 */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 sm:gap-1.5 z-10">
                        {workspace.hasNexana && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-black/80 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider border border-white/20">
                            <span className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-white rounded-full"></span>
                            NEXANA
                          </span>
                        )}
                        {workspace.hasDropin && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider border border-white/50">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Drop-in
                          </span>
                        )}
                        {workspace.hasMultipleLocations && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Multi
                          </span>
                        )}
                        {workspace.hasEnglishSupport && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-indigo-600/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider">
                            <span className="text-[7px] sm:text-[8px]">🌐</span>
                            English
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* コンテンツエリア - iPhone 16最適化 */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col min-h-[160px] sm:min-h-[180px]">
                      {/* 施設特徴一言 */}
                      {workspace.facilityFeatureOneLine && (
                        <div className="mb-3 sm:mb-4">
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light italic" style={{
                            letterSpacing: '0.01em',
                            lineHeight: '1.6'
                          }}>
                            &ldquo;{workspace.facilityFeatureOneLine}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* カテゴリバッジ */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 min-h-[40px] sm:min-h-[48px]">
                        {activeCategories.length > 0 ? (
                          activeCategories.map((category) => (
                            <span
                              key={category.key}
                              className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-gray-200 transition-colors duration-200"
                            >
                              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gray-400 rounded-full"></span>
                              {category.label.split(' ')[0]}
                            </span>
                          ))
                        ) : (
                          <span className="invisible text-[10px] sm:text-[11px]">Placeholder</span>
                        )}
                      </div>

                      {/* いいねとコメント - iPhone 16最適化 */}
                      <div className="mt-auto pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <button
                            onClick={(e) => handleLike(e, workspace.id)}
                            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-200 min-h-[44px] touch-manipulation active:scale-95 ${
                              workspaceLikes[workspace.id]?.isLiked
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                            }`}
                          >
                            <Heart 
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${workspaceLikes[workspace.id]?.isLiked ? 'fill-red-600 text-red-600' : ''}`} 
                            />
                            <span>{workspaceLikes[workspace.id]?.likeCount || 0}</span>
                          </button>
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500">
                            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{workspaceCommentCounts[workspace.id] || 0}</span>
                          </div>
                        </div>
                        {/* 場所情報 */}
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium truncate max-w-[60px] sm:max-w-none">{workspace.city}</span>
                          <span className="text-gray-300 hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{workspace.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ページネーション */}
            {!isLoadingWorkspaces && totalPages > 1 && (
              <div className="mt-8 sm:mt-10 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    setShouldScrollToTop(true);
                  }}
                  totalCount={totalCount}
                  limit={60}
                />
              </div>
            )}
            </>
          )}
        </section>

        {/* ワークスペースが存在しない場合 */}
        {!isLoadingWorkspaces && (!workspaces || workspaces.length === 0) && (
          <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
            <div className="text-center py-12 sm:py-16 md:py-20">
              <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light">
                ワークスペース情報がありません
              </p>
            </div>
          </section>
        )}

        {/* 企業リストカード（体験ブログセクションを置き換え） - iPhone 16最適化 */}
        <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden w-screen left-1/2 -translate-x-1/2">
          {/* 統一された背景 - フルブリード */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-emerald-50/30"></div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.03)_0%,transparent_30%,rgba(6,182,212,0.03)_100%)]"></div>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-3xl translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
            {/* ヘッダーセクション - iPhone 16最適化 */}
            <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 overflow-visible">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                <div className="space-y-4 sm:space-y-5 md:space-y-6 overflow-visible">
                  <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-default">
                    <div className="relative">
                      <div className="w-1 sm:w-1.5 md:w-2 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full"></div>
                      <div className="absolute inset-0 w-1 sm:w-1.5 md:w-2 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-md opacity-50 sm:group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full border border-emerald-200/50 backdrop-blur-sm">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-emerald-700 font-bold">Featured Companies</span>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 leading-[1.15] sm:leading-[1.1] md:leading-[1.05] lg:leading-[0.95] tracking-tight pb-2 sm:pb-1 md:pb-0 overflow-visible">
                    企業リスト
                  </h2>
                </div>
                <div className="lg:max-w-lg">
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed lg:text-right font-light">
                    地域を代表する企業や注目のスタートアップなど、<br className="hidden lg:block" />
                    <span className="font-semibold text-gray-900">{location.city || ''}</span>で活動する企業の情報を掲載しています。
                  </p>
                </div>
              </div>
            </div>

            {/* カードグリッド - iPhone 16最適化 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
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
                  <article
                    key={index}
                    className="group relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden cursor-pointer border border-gray-100/50 active:scale-[0.98] touch-manipulation"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
                      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 640) {
                        e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 32px 64px rgba(16,185,129,0.15), 0 16px 32px rgba(6,182,212,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.innerWidth >= 640) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                      }
                    }}
                  >
                    {/* グラデーションアクセント（左上） */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-br-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
                    
                    {/* 画像セクション - iPhone 16最適化 */}
                    {card.image && (
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="absolute inset-0 sm:group-hover:scale-125 transition-transform duration-[1000ms] ease-out">
                          <SimpleImage
                            src={card.image}
                            alt={card.name || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* 動的なグラデーションオーバーレイ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent sm:group-hover:from-black/20 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 sm:group-hover:from-emerald-500/30 sm:group-hover:to-teal-500/30 transition-all duration-700"></div>
                        
                        {/* カテゴリバッジ（画像上） - iPhone 16最適化 */}
                        {card.descTop && (
                          <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 z-10">
                            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold rounded-full border border-white/20">
                              <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                              {card.descTop}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* コンテンツセクション - iPhone 16最適化 */}
                    <div className="p-4 sm:p-5 md:p-6 lg:p-8 relative">
                      {card.name && (
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 mb-3 sm:mb-4 leading-[1.1] tracking-tight sm:group-hover:from-emerald-600 sm:group-hover:via-teal-600 sm:group-hover:to-cyan-600 transition-all duration-500">
                          {card.name}
                        </h3>
                      )}

                      {card.descBottom && (
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light sm:group-hover:text-gray-700 transition-colors">
                          {card.descBottom}
                        </p>
                      )}
                    </div>

                    {/* ホバー時のグラデーションライン */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-500 via-teal-500 via-cyan-500 to-blue-500 transform scale-x-0 sm:group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    
                    {/* グロー効果 */}
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[32px] bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-cyan-500/0 sm:group-hover:from-emerald-500/5 sm:group-hover:via-teal-500/5 sm:group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>
                  </article>
                ))}
            </div>
          </div>
        </section>

        {/* 観光地カード - iPhone 16最適化 */}
        <section className="relative pt-0 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-hidden w-screen left-1/2 -translate-x-1/2">
          {/* 統一された背景 - フルブリード（企業リストと同じ） */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-emerald-50/30 to-white"></div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.03)_0%,transparent_30%,rgba(6,182,212,0.03)_100%)]"></div>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-3xl -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-100/20 rounded-full blur-3xl translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
            {/* ヘッダーセクション - iPhone 16最適化 */}
            <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 overflow-visible">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                <div className="space-y-4 sm:space-y-5 md:space-y-6 overflow-visible">
                  <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 group cursor-default">
                    <div className="relative">
                      <div className="w-1 sm:w-1.5 md:w-2 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-teal-500 via-cyan-500 to-blue-500 rounded-full"></div>
                      <div className="absolute inset-0 w-1 sm:w-1.5 md:w-2 h-8 sm:h-10 md:h-12 bg-gradient-to-b from-teal-500 via-cyan-500 to-blue-500 rounded-full blur-md opacity-50 sm:group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 rounded-full border border-teal-200/50 backdrop-blur-sm">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-teal-700 font-bold">Discover Places</span>
                    </div>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-teal-700 to-gray-900 leading-[1.15] sm:leading-[1.1] md:leading-[1.05] lg:leading-[0.95] tracking-tight pb-2 sm:pb-1 md:pb-0 overflow-visible">
                    観光地
                  </h2>
                </div>
                <div className="lg:max-w-lg">
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed lg:text-right font-light">
                    <span className="font-semibold text-gray-900">{location.city}</span>周辺の観光スポットや名所、<br className="hidden lg:block" />
                    地域の魅力を発見できる場所をご紹介します。
                  </p>
                </div>
              </div>
            </div>

            {/* カードグリッド - iPhone 16最適化 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
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
                  <article
                    key={index}
                    className="group relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[32px] overflow-hidden cursor-pointer border border-gray-100/50 active:scale-[0.98] touch-manipulation"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
                      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 640) {
                        e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 32px 64px rgba(6,182,212,0.15), 0 16px 32px rgba(16,185,129,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.innerWidth >= 640) {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                      }
                    }}
                  >
                    {/* グラデーションアクセント（左上） */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-br-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
                    
                    {/* 画像セクション - iPhone 16最適化 */}
                    {card.image && (
                      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="absolute inset-0 sm:group-hover:scale-125 transition-transform duration-[1000ms] ease-out">
                          <SimpleImage
                            src={card.image}
                            alt={card.title || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {/* 動的なグラデーションオーバーレイ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:group-hover:from-black/60 transition-all duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-cyan-500/0 sm:group-hover:from-teal-500/30 sm:group-hover:to-cyan-500/30 transition-all duration-700"></div>
                        
                        {/* タイトル（画像上） - iPhone 16最適化 */}
                        {card.title && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight mb-3 sm:mb-4" style={{
                              textShadow: '0 4px 40px rgba(0,0,0,0.5), 0 2px 20px rgba(0,0,0,0.4)'
                            }}>
                              {card.title}
                            </h3>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="h-[1.5px] sm:h-[2px] w-16 sm:w-20 bg-gradient-to-r from-white via-white/80 to-transparent transform origin-left scale-x-0 sm:group-hover:scale-x-100 transition-transform duration-700"></div>
                              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* 画像がない場合のタイトル表示 - iPhone 16最適化 */}
                    {!card.image && card.title && (
                      <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-teal-700 to-gray-900 leading-[1.05] tracking-tight sm:group-hover:from-teal-600 sm:group-hover:via-cyan-600 sm:group-hover:to-blue-600 transition-all duration-500">
                          {card.title}
                        </h3>
                      </div>
                    )}

                    {/* ホバー時のグラデーションライン */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-teal-500 via-cyan-500 via-blue-500 to-indigo-500 transform scale-x-0 sm:group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    
                    {/* グロー効果 */}
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[32px] bg-gradient-to-r from-teal-500/0 via-cyan-500/0 to-blue-500/0 sm:group-hover:from-teal-500/5 sm:group-hover:via-cyan-500/5 sm:group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>
                  </article>
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

