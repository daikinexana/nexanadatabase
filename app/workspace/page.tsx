import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
// import WorkspaceOrganizerButton from "@/components/ui/workspace-organizer-button";
import WorkspaceAllList, { type WorkspaceListItem } from "@/components/ui/workspace-all-list";
import { prisma } from "@/lib/prisma";
import Script from "next/script";

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

async function getWorkspaces(): Promise<WorkspaceListItem[]> {
  try {
    // アクティブなワークスペースを一括取得
    const workspaces = await prisma.workspace.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        country: true,
        city: true,
        createdAt: true,
      },
    });

    if (workspaces.length === 0) {
      return [];
    }

    // 各ワークスペースのいいね数を集計
    const likeGroups = await prisma.workspaceLike.groupBy({
      by: ["workspaceId"],
      where: {
        workspaceId: {
          in: workspaces.map((w) => w.id),
        },
      },
      _count: {
        workspaceId: true,
      },
    });

    const likeCountMap = new Map(
      likeGroups.map((g) => [g.workspaceId, g._count.workspaceId])
    );

    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      imageUrl: w.imageUrl,
      country: w.country,
      city: w.city,
      likeCount: likeCountMap.get(w.id) || 0,
      createdAt: w.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ
export const preferredRegion = 'auto';

export default async function WorkspacePage() {
  const workspaces = await getWorkspaces();

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
      "numberOfItems": workspaces.length,
      "itemListElement": workspaces.slice(0, 10).map((workspace, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${workspace.name}（${workspace.city}, ${workspace.country}）`,
        "url": `https://db.nexanahq.com/workspace`
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

        {/* ワークスペース運営者向けボタン（非表示） */}
        {/* <WorkspaceOrganizerButton /> */}

        {/* 全ワークスペース一覧（国・都道府県タブ + 新着/人気順） */}
        {workspaces.length > 0 ? (
          <WorkspaceAllList workspaces={workspaces} />
        ) : (
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

