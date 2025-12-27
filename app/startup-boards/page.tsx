import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import { Rocket } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";
import StartupBoardsWithFilter from "@/components/ui/startup-boards-with-filter";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "スタ募 STABO | スタートアップ無料募集掲示板 | Nexana Database",
  description: "スタートアップの無料募集掲示板（調達・採用・提案・公募）。スタートアップ企業の情報を掲載。調達募集中、採用募集中、提案募集中、共創募集中のスタートアップを検索できます。",
  keywords: "スタートアップ, スタートアップ募集, スタートアップ採用, スタートアップ調達, スタートアップ提案, スタートアップ共創, スタ募, STABO, Startup Board, 起業, 起業家, スタートアップ情報, スタートアップデータベース, ネクサナ, nexana, startup, startup board, startup recruitment, startup hiring, startup funding, startup collaboration",
  alternates: {
    canonical: "https://db.nexanahq.com/startup-boards",
    languages: {
      'ja': 'https://db.nexanahq.com/startup-boards',
      'en': 'https://db.nexanahq.com/startup-boards',
    },
  },
  openGraph: {
    title: "スタ募 STABO | スタートアップ無料募集掲示板 | Nexana Database",
    description: "スタートアップの無料募集掲示板（調達・採用・提案・公募）。スタートアップ企業の情報を掲載。",
    type: "website",
    url: "https://db.nexanahq.com/startup-boards",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "Nexana Database",
    images: [
      {
        url: "https://db.nexanahq.com/180logo.png",
        width: 1200,
        height: 630,
        alt: "スタ募 STABO - スタートアップ無料募集掲示板",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "スタ募 STABO | スタートアップ無料募集掲示板",
    description: "スタートアップの無料募集掲示板（調達・採用・提案・公募）",
    images: ["https://db.nexanahq.com/180logo.png"],
  },
};

interface StartupBoard {
  id: string;
  companyLogoUrl?: string;
  companyProductImageUrl?: string;
  companyName: string;
  companyDescriptionOneLine?: string;
  companyAndProduct?: string;
  companyOverview?: string;
  corporateNumber?: string;
  establishedDate?: string;
  employeeCount?: string;
  companyUrl?: string;
  country: string;
  city: string;
  address?: string;
  listingStatus?: string;
  fundingStatus?: string;
  fundingOverview?: string;
  hiringStatus?: string;
  hiringOverview?: string;
  proposalStatus?: string;
  proposalOverview?: string;
  collaborationStatus?: string;
  collaborationOverview?: string;
  createdAt: string;
  updatedAt: string;
}

// サーバーサイドでデータを取得
async function getStartupBoards(search?: string): Promise<StartupBoard[]> {
  try {
    const where: Record<string, unknown> = {
      isActive: true, // 公開中のスタートアップのみ
    };

    if (search) {
      // 複数フィールドで部分一致検索
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { companyDescriptionOneLine: { contains: search, mode: "insensitive" } },
        { companyAndProduct: { contains: search, mode: "insensitive" } },
        { companyOverview: { contains: search, mode: "insensitive" } },
        { series: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { fundingOverview: { contains: search, mode: "insensitive" } },
        { hiringOverview: { contains: search, mode: "insensitive" } },
        { proposalOverview: { contains: search, mode: "insensitive" } },
        { collaborationOverview: { contains: search, mode: "insensitive" } },
      ];
    }

    const startupBoards = await prisma.startupBoard.findMany({
      where,
      orderBy: [
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        companyLogoUrl: true,
        companyProductImageUrl: true,
        companyName: true,
        companyDescriptionOneLine: true,
        companyAndProduct: true,
        companyOverview: true,
        corporateNumber: true,
        establishedDate: true,
        employeeCount: true,
        companyUrl: true,
        country: true,
        city: true,
        address: true,
        listingStatus: true,
        fundingStatus: true,
        fundingOverview: true,
        hiringStatus: true,
        hiringOverview: true,
        proposalStatus: true,
        proposalOverview: true,
        collaborationStatus: true,
        collaborationOverview: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return startupBoards.map(board => ({
      id: board.id,
      companyLogoUrl: board.companyLogoUrl ?? undefined,
      companyProductImageUrl: board.companyProductImageUrl ?? undefined,
      companyName: board.companyName,
      companyDescriptionOneLine: board.companyDescriptionOneLine ?? undefined,
      companyAndProduct: board.companyAndProduct ?? undefined,
      companyOverview: board.companyOverview ?? undefined,
      corporateNumber: board.corporateNumber ?? undefined,
      establishedDate: board.establishedDate?.toISOString(),
      employeeCount: board.employeeCount ?? undefined,
      companyUrl: board.companyUrl ?? undefined,
      country: board.country,
      city: board.city,
      address: board.address ?? undefined,
      listingStatus: board.listingStatus ?? undefined,
      fundingStatus: board.fundingStatus ?? undefined,
      fundingOverview: board.fundingOverview ?? undefined,
      hiringStatus: board.hiringStatus ?? undefined,
      hiringOverview: board.hiringOverview ?? undefined,
      proposalStatus: board.proposalStatus ?? undefined,
      proposalOverview: board.proposalOverview ?? undefined,
      collaborationStatus: board.collaborationStatus ?? undefined,
      collaborationOverview: board.collaborationOverview ?? undefined,
      createdAt: board.createdAt.toISOString(),
      updatedAt: board.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching startup boards:", error);
    return [];
  }
}

// 静的生成を強制
export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ
export const fetchCache = 'force-cache';
export const preferredRegion = 'auto';

export default async function StartupBoardsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const resolvedSearchParams = await searchParams;
  const startupBoards = await getStartupBoards(resolvedSearchParams.search);

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
        "name": "スタ募 STABO",
        "item": "https://db.nexanahq.com/startup-boards"
      }
    ]
  };

  // 構造化データ（CollectionPage）
  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "スタ募 STABO - スタートアップ無料募集掲示板",
    "description": "スタートアップの無料募集掲示板（調達・採用・提案・公募）。スタートアップ企業の情報を掲載。",
    "url": "https://db.nexanahq.com/startup-boards",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": startupBoards.length,
      "itemListElement": startupBoards.slice(0, 10).map((board, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": board.companyName,
        "url": `https://db.nexanahq.com/startup-boards/${board.id}`
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10">
        {/* ページヘッダー */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm uppercase tracking-wider text-blue-600 font-bold">STABO</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            スタ募 STABO
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-2">
            スタートアップの無料募集掲示板（調達・採用・提案・公募）
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            {startupBoards.length}件のスタートアップが登録されています
          </p>
        </div>
        
        {/* フィルター機能付き表示 */}
        <StartupBoardsWithFilter
          initialStartupBoards={startupBoards}
        />
      </div>

      <Footer />
    </div>
  );
}


