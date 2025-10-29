import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import ContestsWithFilter from "@/components/ui/contests-with-filter";
import { Trophy } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "コンテスト一覧 | Nexana Database | スタートアップ・ビジネスコンテスト情報",
  description: "スタートアップ・ビジネスコンテスト、ピッチコンテスト、ハッカソン、アクセラレーションプログラムの情報を掲載。公募・募集・開催情報をデータベース化。ネクサナ（nexana）が運営するイノベーションプラットフォーム。",
  keywords: "スタートアップ, コンテスト, ビジネスコンテスト, ピッチ, ハッカソン, アクセラ, アクセラレーション, プログラム, 公募, 募集, 開催, 起業, イノベーション, プラットフォーム, データベース, ネクサナ, nexana",
  alternates: {
    canonical: "https://db.nexanahq.com/contests",
  },
  openGraph: {
    title: "コンテスト一覧 | Nexana Database",
    description: "スタートアップコンテスト、ピッチコンテスト、ハッカソンなどの情報を掲載",
    type: "website",
    url: "https://db.nexanahq.com/contests",
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

  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション - 背景画像を使用 */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center">
            {/* 背景画像 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/contests.image.png')"
              }}
            ></div>
            
            {/* オーバーレイ - 左側に黄金色のグラデーション */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-800/60 to-transparent"></div>
            
            {/* コンテンツ */}
            <div className="relative px-8 py-16 text-left max-w-4xl">
              {/* バッジ */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6 shadow-lg">
                <Trophy className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">CONTESTS</span>
              </div>
              
              {/* メインタイトル */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  Contests
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-amber-300 to-transparent flex-1 max-w-32"></div>
                  <span className="text-lg font-medium text-amber-100 px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    コンテスト一覧
                  </span>
                </div>
              </div>
              
              {/* 説明文 */}
              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-4">
                  スタートアップコンテスト、ピッチコンテスト情報を掲載
                </p>
                <p className="text-base text-amber-100 font-medium">
                  Information about startup contests, pitch competitions, and hackathons
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex items-center space-x-2 mt-8">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
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
