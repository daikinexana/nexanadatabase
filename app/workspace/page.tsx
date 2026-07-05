import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { MapPin } from "lucide-react";
import { Metadata } from "next";
// import WorkspaceOrganizerButton from "@/components/ui/workspace-organizer-button";
import WorkspaceAllList, { type WorkspaceListItem } from "@/components/ui/workspace-all-list";
import { prisma } from "@/lib/prisma";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ワークスペース一覧 | KYOSO BASE | シェアオフィス・コワーキングスペース情報",
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
    title: "ワークスペース一覧 | KYOSO BASE | シェアオフィス・コワーキングスペース情報",
    description: "世界各国・都市のワークスペース情報を掲載。シェアオフィス、コワーキングスペース、インキュベーション施設の情報を提供。",
    type: "website",
    url: "https://db.nexanahq.com/workspace",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "KYOSO BASE",
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
    title: "ワークスペース一覧 | KYOSO BASE",
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
        hasDropin: true,
        categoryWork: true,
        categoryConnect: true,
        categoryPrototype: true,
        categoryPilot: true,
        categoryTest: true,
        categorySupport: true,
        categoryShowcase: true,
        categoryLearn: true,
        categoryStay: true,
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
      hasDropin: w.hasDropin,
      categoryWork: w.categoryWork,
      categoryConnect: w.categoryConnect,
      categoryPrototype: w.categoryPrototype,
      categoryPilot: w.categoryPilot,
      categoryTest: w.categoryTest,
      categorySupport: w.categorySupport,
      categoryShowcase: w.categoryShowcase,
      categoryLearn: w.categoryLearn,
      categoryStay: w.categoryStay,
      likeCount: likeCountMap.get(w.id) || 0,
      createdAt: w.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
}

// force-dynamicを外してISRキャッシュを有効化（毎回DBアクセスしていたのが原因で遅かった）。
// 作成/更新/削除時はrevalidatePathで即時反映されるため、キャッシュしても新規投稿はすぐ見える。
export const runtime = 'nodejs';
export const revalidate = 300; // 5分ISR（いいね数はこの間隔で更新）
export const preferredRegion = 'sin1'; // DB(ap-southeast-1)と同一リージョンでレイテンシ削減

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
    <div className="min-h-screen bg-white">
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

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ページヘッダー */}
        <div className="mb-8 border-b border-neutral-200 pb-8 sm:mb-10">
          <p className="eyebrow">
            <MapPin className="h-3.5 w-3.5" />
            Workspaces
          </p>
          <h1 className="display-2 mt-4 text-4xl text-neutral-900 sm:text-6xl">
            ワークスペース
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            世界各国・都市のシェアオフィス、コワーキング、インキュベーション施設を掲載。
          </p>
        </div>

        {/* 全ワークスペース一覧（国・都道府県タブ + 新着/人気順） */}
        {workspaces.length > 0 ? (
          <WorkspaceAllList workspaces={workspaces} />
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-neutral-200 mb-4">
              <MapPin className="w-6 h-6 text-neutral-400" />
            </div>
            <p className="text-base sm:text-lg text-neutral-500">ワークスペース情報がありません</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

