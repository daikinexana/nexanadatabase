import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import ContestsWithFilter from "@/components/ui/contests-with-filter";
import { Trophy } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "コンテスト一覧 | Nexana Database | スタートアップ・ビジネスコンテスト情報",
  description: "スタートアップ・ビジネスコンテスト、ピッチコンテスト、ハッカソン、アクセラレーションプログラムの情報を掲載。公募・募集・開催情報をデータベース化。起業したい人、スタートアップCEO、新規事業担当者向けのコンテスト情報を網羅。ネクサナ（nexana）が運営するイノベーションプラットフォーム。",
  keywords: "スタートアップ, スタートアップコンテスト, スタートアップ情報, コンテスト, コンテスト情報, ビジネスコンテスト, ビジネスコンテスト情報, ピッチコンテスト, ピッチ, ピッチイベント, ハッカソン, ハッカソン情報, アクセラ, アクセラレーション, アクセラレータ, アクセラレータープログラム, プログラム, 公募, 公募情報, 募集, 募集情報, 開催, 開催情報, 起業, 起業したい, 起業家, 起業支援, CEO, 新規事業, 新規事業担当, イノベーション, イノベーション情報, プラットフォーム, データベース, ネクサナ, nexana, ねくさな, startup contest, pitch contest, business competition, hackathon, accelerator, acceleration program, entrepreneurship, entrepreneur, innovation, startup information",
  alternates: {
    canonical: "https://db.nexanahq.com/contests",
    languages: {
      'ja': 'https://db.nexanahq.com/contests',
      'en': 'https://db.nexanahq.com/contests',
    },
  },
  openGraph: {
    title: "コンテスト一覧 | Nexana Database | スタートアップ・ビジネスコンテスト情報",
    description: "スタートアップコンテスト、ピッチコンテスト、ハッカソン、アクセラレーションプログラムなどの情報を掲載。起業したい人、スタートアップCEO、新規事業担当者向け。",
    type: "website",
    url: "https://db.nexanahq.com/contests",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "Nexana Database",
    images: [
      {
        url: "https://db.nexanahq.com/contests.image.png",
        width: 1200,
        height: 630,
        alt: "スタートアップ・ビジネスコンテスト情報",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "コンテスト一覧 | Nexana Database",
    description: "スタートアップコンテスト、ピッチコンテスト、ハッカソンなどの情報を掲載",
    images: ["https://db.nexanahq.com/contests.image.png"],
  },
};

interface Contest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  incentive?: string;
  operatingCompany?: string;
  isPopular?: boolean;
  createdAt: string;
}

// サーバーサイドでデータを取得
async function getContests(search?: string): Promise<Contest[]> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/contests`);
    if (search) {
      url.searchParams.set('search', search);
    }
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // 5分間キャッシュ
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch contests:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching contests:", error);
    return [];
  }
}

// 静的生成を強制してGoogleクローラーの問題を解決
export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ
export const fetchCache = 'force-cache';
export const preferredRegion = 'auto';

export default async function ContestsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const resolvedSearchParams = await searchParams;
  const contests = await getContests(resolvedSearchParams.search);

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
  const sortedContests = contests.sort((a, b) => {
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
        "name": "コンテスト",
        "item": "https://db.nexanahq.com/contests"
      }
    ]
  };

  // 構造化データ（CollectionPage）
  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "コンテスト一覧",
    "description": "スタートアップ・ビジネスコンテスト、ピッチコンテスト、ハッカソン、アクセラレーションプログラムの情報を掲載",
    "url": "https://db.nexanahq.com/contests",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": contests.length,
      "itemListElement": contests.slice(0, 10).map((contest, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": contest.title,
        "url": contest.website || `https://db.nexanahq.com/contests`
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
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-amber-400 via-orange-400 to-yellow-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span className="text-xs sm:text-sm uppercase tracking-wider text-amber-600 font-bold">Contests</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            コンテスト一覧
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            スタートアップコンテスト、ピッチコンテスト情報を掲載
          </p>
        </div>
        
        {/* フィルター機能付きハイブリッド表示 */}
        <ContestsWithFilter
          japanAreas={japanAreas}
          overseasAreas={overseasAreas}
          initialContests={sortedContests}
        />
      </div>

      <Footer />
    </div>
  );
}
