import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import LocationCardCompact from "@/components/ui/location-card-compact";
import WorkspaceOrganizerButton from "@/components/ui/workspace-organizer-button";
import TopWorkspacesSection from "@/components/ui/top-workspaces-section";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "ワークスペース一覧 | Nexana Database",
  description: "世界各国・都市のワークスペース情報を掲載。ワークスペース情報や地域情報を提供します。",
  keywords: "ワークスペース, 都市, ロケーション, 地域情報, ネクサナ, nexana",
  alternates: {
    canonical: "https://db.nexanahq.com/workspace",
  },
  openGraph: {
    title: "ワークスペース一覧 | Nexana Database",
    description: "世界各国・都市のワークスペース情報を掲載",
    type: "website",
    url: "https://db.nexanahq.com/workspace",
  },
};

interface Location {
  id: string;
  slug: string;
  country: string;
  city: string;
  description?: string | null;
  topImageUrl?: string | null;
  isActive: boolean;
  _count?: {
    workspaces: number;
  };
  workspaces: Array<{
    id: string;
    name: string;
    imageUrl?: string | null;
  }>;
}

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

async function getLocations(): Promise<Location[]> {
  try {
    const locations = await prisma.location.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        country: true,
        city: true,
        description: true,
        topImageUrl: true,
        isActive: true,
        _count: {
          select: {
            workspaces: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: [
        { country: "asc" },
        { city: "asc" },
        { createdAt: "desc" },
      ],
    });

    // _countをworkspaces配列に変換（後方互換性のため）
    // LocationCardCompactコンポーネントはworkspaces.lengthのみ使用
    return locations.map(location => ({
      ...location,
      workspaces: Array(location._count.workspaces).fill(null).map((_, i) => ({
        id: `${location.id}-ws-${i}`,
        name: '',
        imageUrl: null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

async function getTopWorkspaces(): Promise<TopWorkspace[]> {
  try {
    // まず、アクティブなワークスペースのIDリストを取得
    const activeWorkspaces = await prisma.workspace.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    const activeWorkspaceIds = activeWorkspaces.map(ws => ws.id);

    // アクティブなワークスペースが存在しない場合は空配列を返す
    if (activeWorkspaceIds.length === 0) {
      return [];
    }

    // アクティブなワークスペースのいいね数のみを集計
    const topWorkspaceIds = await prisma.workspaceLike.groupBy({
      by: ['workspaceId'],
      where: {
        workspaceId: {
          in: activeWorkspaceIds,
        },
      },
      _count: {
        workspaceId: true,
      },
      orderBy: {
        _count: {
          workspaceId: 'desc',
        },
      },
      take: 10,
    });

    // 取得したIDのリストを作成
    const workspaceIds = topWorkspaceIds.map(item => item.workspaceId);
    
    // いいね数が0件の場合は空配列を返す
    if (workspaceIds.length === 0) {
      return [];
    }
    
    // いいね数のマップを作成（後でソートに使用）
    const likeCountMap = new Map(
      topWorkspaceIds.map(item => [item.workspaceId, item._count.workspaceId])
    );

    // ワークスペース情報を一括取得
    const workspaces = await prisma.workspace.findMany({
      where: {
        isActive: true,
        id: {
          in: workspaceIds,
        },
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        city: true,
        country: true,
        locationId: true,
        location: {
          select: {
            slug: true,
          },
        },
      },
    });

    // いいね数でソート（IDの順序を保持）
    const workspacesWithLikes = workspaces
      .map(workspace => ({
        ...workspace,
        likeCount: likeCountMap.get(workspace.id) || 0,
      }))
      .sort((a, b) => {
        // まずいいね数でソート
        if (b.likeCount !== a.likeCount) {
          return b.likeCount - a.likeCount;
        }
        // いいね数が同じ場合は元の順序を保持
        const aIndex = workspaceIds.indexOf(a.id);
        const bIndex = workspaceIds.indexOf(b.id);
        return aIndex - bIndex;
      })
      .slice(0, 10);

    return workspacesWithLikes;
  } catch (error) {
    console.error("Error fetching top workspaces:", error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ
export const preferredRegion = 'auto';

export default async function WorkspacePage() {
  // 並列処理でデータ取得を最適化
  const [locations, topWorkspaces] = await Promise.all([
    getLocations(),
    getTopWorkspaces(),
  ]);

  // 8地方区分の定義
  const regionOrder = [
    '北海道',
    '東北',
    '関東',
    '中部',
    '近畿',
    '中国',
    '四国',
    '九州・沖縄'
  ];

  // 都道府県から地方区分へのマッピング
  const prefectureToRegion: Record<string, string> = {
    '北海道': '北海道',
    '青森県': '東北',
    '岩手県': '東北',
    '宮城県': '東北',
    '秋田県': '東北',
    '山形県': '東北',
    '福島県': '東北',
    '茨城県': '関東',
    '栃木県': '関東',
    '群馬県': '関東',
    '埼玉県': '関東',
    '千葉県': '関東',
    '東京都': '関東',
    '神奈川県': '関東',
    '新潟県': '中部',
    '富山県': '中部',
    '石川県': '中部',
    '福井県': '中部',
    '山梨県': '中部',
    '長野県': '中部',
    '岐阜県': '中部',
    '静岡県': '中部',
    '愛知県': '中部',
    '三重県': '近畿',
    '滋賀県': '近畿',
    '京都府': '近畿',
    '大阪府': '近畿',
    '兵庫県': '近畿',
    '奈良県': '近畿',
    '和歌山県': '近畿',
    '鳥取県': '中国',
    '島根県': '中国',
    '岡山県': '中国',
    '広島県': '中国',
    '山口県': '中国',
    '徳島県': '四国',
    '香川県': '四国',
    '愛媛県': '四国',
    '高知県': '四国',
    '福岡県': '九州・沖縄',
    '佐賀県': '九州・沖縄',
    '長崎県': '九州・沖縄',
    '熊本県': '九州・沖縄',
    '大分県': '九州・沖縄',
    '宮崎県': '九州・沖縄',
    '鹿児島県': '九州・沖縄',
    '沖縄県': '九州・沖縄'
  };

  // 都道府県から地方区分を取得する関数
  const getRegion = (city: string): string => {
    return prefectureToRegion[city] || 'その他';
  };

  // 地方区分の順序を取得する関数
  const getRegionOrder = (region: string): number => {
    const index = regionOrder.indexOf(region);
    return index === -1 ? 999 : index;
  };

  // ソート処理：日本国内は地方区分順、海外は国名順
  const sortedLocations = [...locations].sort((a, b) => {
    // 日本国内のロケーションを優先
    if (a.country === "日本" && b.country !== "日本") {
      return -1;
    }
    if (a.country !== "日本" && b.country === "日本") {
      return 1;
    }

    // 日本国内同士の場合は地方区分順
    if (a.country === "日本" && b.country === "日本") {
      const aRegion = getRegion(a.city);
      const bRegion = getRegion(b.city);
      const aRegionOrder = getRegionOrder(aRegion);
      const bRegionOrder = getRegionOrder(bRegion);
      
      if (aRegionOrder !== bRegionOrder) {
        return aRegionOrder - bRegionOrder;
      }
      // 同じ地方区分内では都市名順
      return a.city.localeCompare(b.city, 'ja');
    }

    // 海外同士の場合は国名順、同じ国では都市名順
    if (a.country !== b.country) {
      return a.country.localeCompare(b.country, 'ja');
    }
    return a.city.localeCompare(b.city, 'ja');
  });

  // 地方区分別にグループ化（日本国内）
  const locationsByRegion: Record<string, Location[]> = {};
  const overseasLocations: Location[] = [];

  sortedLocations.forEach((location) => {
    if (location.country === "日本") {
      const region = getRegion(location.city);
      if (!locationsByRegion[region]) {
        locationsByRegion[region] = [];
      }
      locationsByRegion[region].push(location);
    } else {
      overseasLocations.push(location);
    }
  });

  // 海外を国別にグループ化
  const locationsByCountry = overseasLocations.reduce((acc, location) => {
    if (!acc[location.country]) {
      acc[location.country] = [];
    }
    acc[location.country].push(location);
    return acc;
  }, {} as Record<string, Location[]>);


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10">
        {/* シンプルなページヘッダー */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span className="text-xs sm:text-sm uppercase tracking-wider text-emerald-600 font-bold">Workspaces</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            ワークスペース一覧
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            世界各国・都市のワークスペース情報を掲載
          </p>
        </div>

        {/* ワークスペース運営者向けボタン */}
        <WorkspaceOrganizerButton />

        {/* Top 10 Workspaces セクション - コンパクトでワイド */}
        <TopWorkspacesSection topWorkspaces={topWorkspaces} />

        {/* ロケーション一覧 - 8地方区分 + 海外 */}
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
                {/* 地方区分セクションヘッダー - モダンでスタイリッシュ */}
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
              {/* 国別セクションヘッダー - よりコンパクト */}
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

        {locations.length === 0 && (
          <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6 shadow-inner">
              <MapPin className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light">ワークスペース情報がありません</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

