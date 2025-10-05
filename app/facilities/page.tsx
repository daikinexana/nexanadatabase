import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import FacilitiesWithFilter from "@/components/ui/facilities-with-filter";
import { Building2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "施設一覧 | Nexana Database",
  description: "スタートアップ支援施設、インキュベーション施設、イノベーション拠点の情報を掲載",
  keywords: "スタートアップ, 施設, インキュベーション, イノベーション, 支援",
  openGraph: {
    title: "施設一覧 | Nexana Database",
    description: "スタートアップ支援施設、インキュベーション施設、イノベーション拠点の情報を掲載",
    type: "website",
  },
};

interface Facility {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  facilityInfo?: string;
  program?: string;
  targetArea?: string;
  targetAudience?: string;
  isDropinAvailable: boolean;
  isNexanaAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// サーバーサイドでデータを取得
async function getFacilities(search?: string): Promise<Facility[]> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/facilities`);
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
      console.error("Failed to fetch facilities:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return [];
  }
}

// 5分間キャッシュしてISRを有効化
export const revalidate = 300;

export default async function FacilitiesPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const resolvedSearchParams = await searchParams;
  const facilities = await getFacilities(resolvedSearchParams.search);

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
  const sortedFacilities = facilities.filter((facility) => {
    // アクティブな施設のみ表示
    return facility.isActive;
  }).sort((a, b) => {
    const aOrder = getAreaOrder(a.area);
    const bOrder = getAreaOrder(b.area);
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    // 同じエリア内では作成日時の降順（新しい順）
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-violet-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative px-8 py-12 text-center">
              {/* バッジ - より洗練されたデザイン */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                <Building2 className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">FACILITIES</span>
              </div>
              
              {/* メインタイトル - より印象的なデザイン */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  Facilities
                </h1>
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-24"></div>
                  <span className="text-lg font-medium text-slate-600 px-4 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/20">
                    施設一覧
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1 max-w-24"></div>
                </div>
              </div>
              
              {/* 説明文 - より魅力的なレイアウト */}
              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-4">
                  スタートアップ支援施設、イノベーション拠点の情報を掲載しています
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Information about startup support facilities, incubation centers, and innovation hubs
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex justify-center items-center space-x-2 mt-8">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* フィルター機能付き表示 */}
        <FacilitiesWithFilter
          initialFacilities={sortedFacilities}
          japanAreas={japanAreas}
          overseasAreas={overseasAreas}
        />
      </div>

      <Footer />
    </div>
  );
}