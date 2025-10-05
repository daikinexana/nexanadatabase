import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import OpenCallsWithFilter from "@/components/ui/open-calls-with-filter";
import { Handshake } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "公募一覧 | Nexana Database",
  description: "企業や自治体が募集する課題解決パートナー、協業相手の公募情報を掲載",
  keywords: "公募, パートナーシップ, 協業, 課題解決, 企業, 自治体",
  openGraph: {
    title: "公募一覧 | Nexana Database",
    description: "企業や自治体が募集する課題解決パートナー、協業相手の公募情報を掲載",
    type: "website",
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

// 5分間キャッシュしてISRを有効化
export const revalidate = 300;

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
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - モダンでおしゃれなデザイン */}
        <div className="mb-12">
          <div className="relative overflow-hidden">
            {/* 背景グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/10 to-violet-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative px-8 py-12 text-center">
              {/* バッジ - より洗練されたデザイン */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mb-6 shadow-lg">
                <Handshake className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">OPEN CALLS</span>
              </div>
              
              {/* メインタイトル - より印象的なデザイン */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-violet-900 bg-clip-text text-transparent mb-3">
                  Open Calls
                </h1>
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1 max-w-24"></div>
                  <span className="text-lg font-medium text-slate-600 px-4 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/20">
                    公募一覧
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1 max-w-24"></div>
                </div>
              </div>
              
              {/* 説明文 - より魅力的なレイアウト */}
              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-4">
                  企業や自治体、大学が募集する協業の公募情報を掲載しています
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Open calls for partnership and collaboration opportunities from companies and municipalities
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex justify-center items-center space-x-2 mt-8">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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