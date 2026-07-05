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
  title: "コンテスト・公募一覧 | KYOSO BASE | スタートアップの挑戦機会をまとめて検索",
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
    title: "コンテスト・公募一覧 | KYOSO BASE",
    description:
      "コンテストと公募を横断検索。種別・カテゴリ・エリアで絞り込めるスタートアップ向けデータベース。",
    type: "website",
    url: "https://db.nexanahq.com/opportunities",
    locale: "ja_JP",
    siteName: "KYOSO BASE",
  },
  twitter: {
    card: "summary_large_image",
    title: "コンテスト・公募一覧 | KYOSO BASE",
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
      kind: o.kind as OpportunityItem["kind"],
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

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ページヘッダー */}
        <div className="mb-10 border-b border-neutral-200 pb-8 sm:mb-12">
          <p className="eyebrow">
            <Rocket className="h-3.5 w-3.5" />
            Programs
          </p>
          <h1 className="display-2 mt-4 text-4xl text-neutral-900 sm:text-6xl">
            コンテスト・公募・
            <br className="sm:hidden" />
            プログラム
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            コンテスト、ピッチ、ハッカソン、アクセラレーション、公募まで。挑戦の機会を種別・カテゴリ・エリアで横断的に絞り込めます。
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
