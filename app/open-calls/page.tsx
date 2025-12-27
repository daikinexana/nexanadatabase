import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import OpenCallsWithFilter from "@/components/ui/open-calls-with-filter";
import { Handshake } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "公募一覧 | Nexana Database | オープンイノベーション公募・募集情報",
  description: "企業や行政が募集する課題解決パートナー、協業相手の公募・募集情報を掲載。スタートアップ・大企業・大学向けのオープンイノベーション情報をデータベース化。共創プロジェクト、アクセラレーションプログラムの公募情報も掲載。ネクサナ（nexana）が運営するイノベーションプラットフォーム。",
  keywords: "公募, 公募情報, 募集, 募集情報, パートナーシップ, 協業, 協業パートナー, 課題解決, 課題解決パートナー, 企業, 大企業, 自治体, 行政, 行政担当者, 市区町村, 広域行政, スタートアップ, オープンイノベーション, オープンイノベーション情報, オープンイノベーションプラットフォーム, 共創, 共創プロジェクト, イノベーション, イノベーション情報, プラットフォーム, データベース, ネクサナ, nexana, ねくさな, 大学, 大学担当者, ディープテック, ディープテックスタートアップ, open call, open innovation, partnership, collaboration, corporate innovation, startup partnership, innovation platform",
  alternates: {
    canonical: "https://db.nexanahq.com/open-calls",
    languages: {
      'ja': 'https://db.nexanahq.com/open-calls',
      'en': 'https://db.nexanahq.com/open-calls',
    },
  },
  openGraph: {
    title: "公募一覧 | Nexana Database | オープンイノベーション公募・募集情報",
    description: "企業や行政が募集する課題解決パートナー、協業相手の公募情報を掲載。スタートアップ・大企業・大学向けのオープンイノベーション情報。",
    type: "website",
    url: "https://db.nexanahq.com/open-calls",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "Nexana Database",
    images: [
      {
        url: "https://db.nexanahq.com/open-calls.image.png",
        width: 1200,
        height: 630,
        alt: "オープンイノベーション公募・募集情報",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "公募一覧 | Nexana Database",
    description: "企業や行政が募集する課題解決パートナー、協業相手の公募情報を掲載",
    images: ["https://db.nexanahq.com/open-calls.image.png"],
  },
};

interface OpenCall {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  availableResources?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// サーバーサイドでデータを取得
async function getOpenCalls(search?: string): Promise<OpenCall[]> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/open-calls`);
    if (search) {
      url.searchParams.set('search', search);
    }
    
    // 開発環境ではキャッシュを無効化、本番環境では5分間キャッシュ
    const isDevelopment = process.env.NODE_ENV === 'development';
    const fetchOptions: RequestInit = isDevelopment
      ? {
          cache: 'no-store', // 開発環境：キャッシュ無効
        }
      : {
          next: { revalidate: 300 }, // 本番環境：5分間キャッシュ
          headers: {
            'Cache-Control': 'max-age=300',
          },
        };
    
    const response = await fetch(url.toString(), fetchOptions);
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch open calls:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching open calls:", error);
    return [];
  }
}

// 本番環境では静的生成、開発環境では動的レンダリング
// 開発環境でのキャッシュ無効化は getOpenCalls 関数内で処理
export const dynamic = 'auto';
export const runtime = 'nodejs';
export const revalidate = 3600; // 本番環境：1時間キャッシュ
export const fetchCache = 'force-cache';
export const preferredRegion = 'auto';

export default async function OpenCallsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const resolvedSearchParams = await searchParams;
  const openCalls = await getOpenCalls(resolvedSearchParams.search);

  // 日本国内のエリア定義
  const japanAreas = [
    '全国',
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県'
  ];

  // 海外のエリア定義
  const overseasAreas = [
    'アメリカ',
    'カナダ',
    'イギリス',
    'エストニア',
    'オランダ',
    'スペイン',
    'ドイツ',
    'フランス',
    'ポルトガル',
    '中国',
    '台湾',
    '韓国',
    'インドネシア',
    'シンガポール',
    'タイ',
    'ベトナム',
    'インド',
    'UAE（ドバイ/アブダビ）',
    'オーストラリア',
    'その他'
  ];

  // 全エリアの順序（日本国内 + 海外）
  const allAreaOrder = [...japanAreas, ...overseasAreas];

  // エリアの順序を取得する関数
  const getAreaOrder = (area: string | undefined) => {
    if (!area) return 999; // エリアが未設定の場合は最後に配置
    const index = allAreaOrder.indexOf(area);
    return index === -1 ? 999 : index;
  };

  // ソート処理（フィルタリングはクライアントサイドで実行）
  const sortedOpenCalls = openCalls.sort((a, b) => {
    const aOrder = getAreaOrder(a.area);
    const bOrder = getAreaOrder(b.area);
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    // 同じエリア内では締切日でソート（締切日が近い順、締切日未設定は最後）
    const aDeadline = a.deadline ? new Date(a.deadline).getTime() : Number.MAX_SAFE_INTEGER;
    const bDeadline = b.deadline ? new Date(b.deadline).getTime() : Number.MAX_SAFE_INTEGER;
    
    if (aDeadline !== bDeadline) {
      return aDeadline - bDeadline;
    }
    
    // 締切日が同じ場合は作成日時の降順（新しい順）
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
        "name": "公募",
        "item": "https://db.nexanahq.com/open-calls"
      }
    ]
  };

  // 構造化データ（CollectionPage）
  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "公募一覧",
    "description": "企業や行政が募集する課題解決パートナー、協業相手の公募・募集情報を掲載",
    "url": "https://db.nexanahq.com/open-calls",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": openCalls.length,
      "itemListElement": openCalls.slice(0, 10).map((openCall, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": openCall.title,
        "url": openCall.website || `https://db.nexanahq.com/open-calls`
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
        {/* シンプルなページヘッダー */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-400 via-violet-400 to-indigo-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-xs sm:text-sm uppercase tracking-wider text-purple-600 font-bold">Open Calls</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            公募一覧
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            企業や行政、大学が募集する協業、アクセラの公募情報を掲載
          </p>
        </div>

        {/* フィルター機能付き表示 */}
        <OpenCallsWithFilter
          initialOpenCalls={sortedOpenCalls}
          japanAreas={japanAreas}
          overseasAreas={overseasAreas}
        />
      </div>

      <Footer />
    </div>
  );
}