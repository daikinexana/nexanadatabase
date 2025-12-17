import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import OpenCallsWithFilter from "@/components/ui/open-calls-with-filter";
import { Handshake } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "公募一覧 | Nexana Database | オープンイノベーション公募・募集情報",
  description: "企業や行政が募集する課題解決パートナー、協業相手の公募・募集情報を掲載。スタートアップ・大企業向けのオープンイノベーション情報をデータベース化。ネクサナ（nexana）が運営するイノベーションプラットフォーム。",
  keywords: "公募, 募集, パートナーシップ, 協業, 課題解決, 企業, 自治体, スタートアップ, オープンイノベーション, イノベーション, プラットフォーム, データベース, ネクサナ, nexana",
  alternates: {
    canonical: "https://db.nexanahq.com/open-calls",
  },
  openGraph: {
    title: "公募一覧 | Nexana Database",
    description: "企業や行政が募集する課題解決パートナー、協業相手の公募情報を掲載",
    type: "website",
    url: "https://db.nexanahq.com/open-calls",
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
    
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // 5分間キャッシュ
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
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

// 静的生成を強制してGoogleクローラーの問題を解決
export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ
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

  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        {/* ヒーローセクション - iPhone 16最適化 */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] aspect-[16/9] sm:aspect-[16/6] flex items-center group">
            {/* 背景画像 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
              style={{
                backgroundImage: "url('/open-calls.image.png')"
              }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            
            {/* 装飾的な要素 - iPhone 16最適化 */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-8 sm:h-12 bg-gradient-to-b from-purple-400 via-violet-400 to-indigo-400 rounded-full"></div>
                <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Handshake className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white font-bold">Open Calls</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative px-4 sm:px-8 md:px-16 py-10 sm:py-16 md:py-20 text-left max-w-5xl z-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-[0.95] tracking-tight" style={{
                textShadow: '0 4px 40px rgba(0,0,0,0.4), 0 2px 20px rgba(0,0,0,0.3)'
              }}>
                Open Calls
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light">公募一覧</p>
                <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-white/60 to-transparent"></div>
              </div>
              
              <div className="max-w-3xl space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-light">
                  企業や行政、大学が募集する協業、アクセラの公募情報を掲載
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70 font-light">
                  Open calls for partnership and collaboration opportunities
                </p>
              </div>
            </div>
          </div>
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