import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import OpportunitiesList, {
  type OpportunityItem,
} from "@/components/ui/opportunities-list";
import { Rocket } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";

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

interface Opportunity {
  id: string;
  kind: "contest" | "open-call";
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  benefit?: string;
  targetArea?: string;
  targetAudience?: string;
  createdAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://db.nexanahq.com";

// 開発環境では実際にアクセスしているホスト（localhost:3001 など）から取得する。
// 本番では NEXT_PUBLIC_BASE_URL を使う（キャッシュ最適化のため静的のまま）。
async function getBaseUrl(): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    const host = (await headers()).get("host");
    if (host) return `http://${host}`;
  }
  return BASE_URL;
}

async function fetchJson<T>(path: string): Promise<T[]> {
  try {
    const isDev = process.env.NODE_ENV === "development";
    const base = await getBaseUrl();
    const options: RequestInit = isDev
      ? { cache: "no-store" }
      : { next: { revalidate: 300 }, headers: { "Cache-Control": "max-age=300" } };
    const response = await fetch(`${base}${path}`, options);
    if (response.ok) return await response.json();
    console.error(`Failed to fetch ${path}:`, response.status);
    return [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

export const dynamic = "auto";
export const runtime = "nodejs";
export const revalidate = 3600;
export const fetchCache = "force-cache";
export const preferredRegion = "auto";

export default async function OpportunitiesPage() {
  const opportunities = await fetchJson<Opportunity>("/api/opportunities");

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

  // OpportunityItem 形式に正規化
  const items: OpportunityItem[] = opportunities.map(
    (o): OpportunityItem => ({
      id: o.id,
      kind: o.kind,
      title: o.title,
      description: o.description,
      imageUrl: o.imageUrl,
      deadline: o.deadline,
      startDate: o.startDate,
      area: o.area,
      organizer: o.organizer,
      organizerType: o.organizerType,
      website: o.website,
      benefit: o.benefit,
      targetArea: o.targetArea,
      targetAudience: o.targetAudience,
      createdAt: o.createdAt,
    })
  );

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
