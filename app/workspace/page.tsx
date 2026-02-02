import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
import WorkspaceOrganizerButton from "@/components/ui/workspace-organizer-button";
import TopWorkspacesSection from "@/components/ui/top-workspaces-section";
import WorkspaceListClient from "@/components/ui/workspace-list-client";
import { prisma } from "@/lib/prisma";
import Script from "next/script";
import { REGION_ORDER, PREFECTURE_TO_REGION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ワークスペース一覧 | Nexana Database | シェアオフィス・コワーキングスペース情報",
  description: "世界各国・都市のワークスペース情報を掲載。シェアオフィス、コワーキングスペース、インキュベーション施設の情報を提供。スタートアップ、起業家、リモートワーカー向けのワークスペース情報をデータベース化。ネクサナ（nexana）が運営するプラットフォーム。",
  keywords: "ワークスペース, ワークスペース情報, シェアオフィス, シェアオフィス情報, シェアオフィス運営, コワーキングスペース, コワーキング, インキュベーション施設, インキュベーター, 都市, ロケーション, 地域情報, 地域, 日本, アメリカ, ヨーロッパ, スタートアップ, 起業家, リモートワーク, リモートワーカー, ネクサナ, nexana, ねくさな, workspace, coworking space, shared office, incubation facility, startup workspace, remote work, location, city, Japan, US, Europe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://db.nexanahq.com/workspace",
    languages: {
      'ja': 'https://db.nexanahq.com/workspace',
      'en': 'https://db.nexanahq.com/workspace',
    },
  },
  openGraph: {
    title: "ワークスペース一覧 | Nexana Database | シェアオフィス・コワーキングスペース情報",
    description: "世界各国・都市のワークスペース情報を掲載。シェアオフィス、コワーキングスペース、インキュベーション施設の情報を提供。",
    type: "website",
    url: "https://db.nexanahq.com/workspace",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "Nexana Database",
    images: [
      {
        url: "https://db.nexanahq.com/facilities.image.png",
        width: 1200,
        height: 630,
        alt: "ワークスペース・シェアオフィス情報",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ワークスペース一覧 | Nexana Database",
    description: "世界各国・都市のワークスペース情報を掲載",
    images: ["https://db.nexanahq.com/facilities.image.png"],
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
  workspaceCount: number;
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

    // _countをworkspaceCountに変換（不要なダミーデータ作成を削除）
    return locations.map(location => ({
      id: location.id,
      slug: location.slug,
      country: location.country,
      city: location.city,
      description: location.description,
      topImageUrl: location.topImageUrl,
      isActive: location.isActive,
      workspaceCount: location._count.workspaces,
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

async function getTopWorkspaces(): Promise<TopWorkspace[]> {
  try {
    // まず、アクティブなワークスペースのIDリストを取得（並列処理のため軽量なクエリ）
    const activeWorkspaceIds = await prisma.workspace.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    const workspaceIdList = activeWorkspaceIds.map(ws => ws.id);

    // アクティブなワークスペースが存在しない場合は空配列を返す
    if (workspaceIdList.length === 0) {
      return [];
    }

    // アクティブなワークスペースのいいね数を集計し、上位10件を取得
    const topWorkspaceLikes = await prisma.workspaceLike.groupBy({
      by: ['workspaceId'],
      where: {
        workspaceId: {
          in: workspaceIdList,
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

    // いいね数が0件の場合は空配列を返す
    if (topWorkspaceLikes.length === 0) {
      return [];
    }

    // 取得したIDのリストを作成
    const workspaceIds = topWorkspaceLikes.map(item => item.workspaceId);
    
    // いいね数のマップを作成（後でソートに使用）
    const likeCountMap = new Map(
      topWorkspaceLikes.map(item => [item.workspaceId, item._count.workspaceId])
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

  // 都道府県から地方区分を取得する関数
  const getRegion = (city: string): string => {
    return PREFECTURE_TO_REGION[city] || 'その他';
  };

  // 地方区分の順序を取得する関数
  const getRegionOrder = (region: string): number => {
    const index = [...REGION_ORDER].indexOf(region as typeof REGION_ORDER[number]);
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


  // 構造化データ（BreadcrumbList）
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ホーム",
        "item": "https://db.nexanahq.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "ワークスペース",
        "item": "https://db.nexanahq.com/workspace"
      }
    ]
  };

  // 構造化データ（CollectionPage）
  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ワークスペース一覧",
    "description": "世界各国・都市のワークスペース情報を掲載。シェアオフィス、コワーキングスペース、インキュベーション施設の情報を提供",
    "url": "https://db.nexanahq.com/workspace",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": locations.length,
      "itemListElement": locations.slice(0, 10).map((location, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${location.city}, ${location.country}`,
        "url": `https://db.nexanahq.com/workspace/${location.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <Script
        id="collection-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageStructuredData),
        }}
      />
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

        {/* ロケーション一覧 */}
        <WorkspaceListClient
          regionOrder={[...REGION_ORDER]}
          locationsByRegion={locationsByRegion}
          locationsByCountry={locationsByCountry}
        />

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

