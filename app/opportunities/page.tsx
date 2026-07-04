import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import OpportunitiesList, {
  type OpportunityItem,
} from "@/components/ui/opportunities-list";
import { Rocket } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "コンテスト・公募一覧 | Nexana Database | スタートアップの挑戦機会をまとめて検索",
  description:
    "スタートアップコンテスト、ピッチコンテスト、ハッカソン、アクセラレーション、企業・行政・大学のオープンイノベーション公募をまとめて掲載。種別・カテゴリ・エリアで横断的に絞り込み検索できるデータベース。ネクサナ（nexana）が運営。",
  keywords:
    "コンテスト, 公募, スタートアップコンテスト, ピッチコンテスト, ハッカソン, アクセラレーション, オープンイノベーション, 協業, 募集, 公募情報, 補助金, 助成金, 企業, 行政, 大学, VC, CVC, データベース, ネクサナ, nexana, startup contest, open call, open innovation, accelerator",
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
    canonical: "https://db.nexanahq.com/opportunities",
  },
  openGraph: {
    title: "コンテスト・公募一覧 | Nexana Database",
    description:
      "コンテストと公募を横断検索。種別・カテゴリ・エリアで絞り込めるスタートアップ向けデータベース。",
    type: "website",
    url: "https://db.nexanahq.com/opportunities",
    locale: "ja_JP",
    siteName: "Nexana Database",
  },
  twitter: {
    card: "summary_large_image",
    title: "コンテスト・公募一覧 | Nexana Database",
    description: "コンテストと公募を種別・カテゴリ・エリアで横断検索",
  },
};

// APIを経由せずPrismaを直接呼ぶ（余分なHTTPホップとコールドスタートを排除）。
// 必要なフィールドのみselectしてegress/レイテンシを削減。
async function getOpportunities(): Promise<OpportunityItem[]> {
  try {
    const opportunities = await prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        kind: true,
        title: true,
        description: true,
        imageUrl: true,
        deadline: true,
        startDate: true,
        area: true,
        organizer: true,
        organizerType: true,
        website: true,
        benefit: true,
        targetArea: true,
        targetAudience: true,
        createdAt: true,
      },
    });

    return opportunities.map((o): OpportunityItem => ({
      id: o.id,
      kind: o.kind as "contest" | "open-call",
      title: o.title,
      description: o.description ?? undefined,
      imageUrl: o.imageUrl ?? undefined,
      deadline: o.deadline ? o.deadline.toISOString() : undefined,
      startDate: o.startDate ? o.startDate.toISOString() : undefined,
      area: o.area ?? undefined,
      organizer: o.organizer,
      organizerType: o.organizerType ?? undefined,
      website: o.website ?? undefined,
      benefit: o.benefit ?? undefined,
      targetArea: o.targetArea ?? undefined,
      targetAudience: o.targetAudience ?? undefined,
      createdAt: o.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return [];
  }
}

export const runtime = "nodejs";
export const revalidate = 3600; // ISRでキャッシュ。作成/更新時はrevalidatePathで即時反映
export const preferredRegion = "sin1"; // DB(ap-southeast-1)と同一リージョンでレイテンシ削減

export default async function OpportunitiesPage() {
  const items = await getOpportunities();

  // 日本国内のエリア定義
  const japanAreas = [
    "全国",
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  // 海外のエリア定義
  const overseasAreas = [
    "アメリカ",
    "カナダ",
    "イギリス",
    "エストニア",
    "オランダ",
    "スペイン",
    "ドイツ",
    "フランス",
    "ポルトガル",
    "中国",
    "台湾",
    "韓国",
    "インドネシア",
    "シンガポール",
    "タイ",
    "ベトナム",
    "インド",
    "UAE（ドバイ/アブダビ）",
    "オーストラリア",
    "海外",
    "その他",
  ];

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://db.nexanahq.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "コンテスト・公募",
        item: "https://db.nexanahq.com/opportunities",
      },
    ],
  };

  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "コンテスト・公募一覧",
    description:
      "スタートアップコンテストと企業・行政・大学の公募を横断的に掲載。種別・カテゴリ・エリアで絞り込み検索できる。",
    url: "https://db.nexanahq.com/opportunities",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <Script
        id="collection-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageStructuredData) }}
      />
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10">
        {/* ページヘッダー */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-indigo-400 via-blue-400 to-cyan-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              <span className="text-xs sm:text-sm uppercase tracking-wider text-indigo-600 font-bold">
                Opportunities
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            コンテスト・公募一覧
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            コンテストと公募をまとめて掲載。種別・カテゴリ・エリアで横断的に絞り込めます。
          </p>
        </div>

        {/* 統合フィルタ表示 */}
        <OpportunitiesList
          items={items}
          japanAreas={japanAreas}
          overseasAreas={overseasAreas}
        />
      </div>

      <Footer />
    </div>
  );
}
