import ServerHeader from "@/components/ui/server-header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import { Search, Filter as FilterIcon, Trophy } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "コンテスト一覧 | Nexana Database",
  description: "スタートアップコンテスト、ピッチコンテスト、ハッカソンなどの情報を掲載",
  keywords: "スタートアップ, コンテスト, ピッチ, ハッカソン, 起業",
  openGraph: {
    title: "コンテスト一覧 | Nexana Database",
    description: "スタートアップコンテスト、ピッチコンテスト、ハッカソンなどの情報を掲載",
    type: "website",
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
async function getContests(): Promise<Contest[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/contests`, {
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

// 5分間キャッシュしてISRを有効化
export const revalidate = 300;

export default async function ContestsPage() {
  const contests = await getContests();

  // エリアの順序定義（全国/47都道府県/国外）
  const areaOrder = [
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
    '沖縄県',
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

  // エリアの順序を取得する関数
  const getAreaOrder = (area: string | undefined) => {
    if (!area) return 999; // エリアが未設定の場合は最後に配置
    const index = areaOrder.indexOf(area);
    return index === -1 ? 999 : index;
  };

  // フィルタリング処理
  const filteredContests = contests.filter((contest) => {
    // 過去のコンテストのフィルタリング（現在は全て表示）
    const now = new Date();
    if (contest.deadline) {
      return new Date(contest.deadline) >= now;
    }
    return true;
  }).sort((a, b) => {
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
      <ServerHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - モダンでおしゃれなデザイン */}
        <div className="mb-12">
          <div className="relative overflow-hidden">
            {/* 背景グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-orange-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative px-8 py-12 text-center">
              {/* バッジ - より洗練されたデザイン */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6 shadow-lg">
                <Trophy className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">CONTESTS</span>
              </div>
              
              {/* メインタイトル - より印象的なデザイン */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-amber-900 to-orange-900 bg-clip-text text-transparent mb-3">
                  Contests
                </h1>
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-24"></div>
                  <span className="text-lg font-medium text-slate-600 px-4 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/20">
                    コンテスト一覧
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1 max-w-24"></div>
                </div>
              </div>
              
              {/* 説明文 - より魅力的なレイアウト */}
              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-4">
                  スタートアップコンテスト、ピッチコンテスト情報を掲載しています
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Information about startup contests, pitch competitions, and hackathons
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex justify-center items-center space-x-2 mt-8">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
        {/* 検索・フィルター - NewsPicks風 */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="企業、行政、大学と研究機関、その他、不動産系、企業R&D、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
                    disabled
                  />
                </div>
              </div>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-news-subheading text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                disabled
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                フィルター
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              ※ 検索・フィルター機能は現在開発中です
            </p>
          </div>
        </div>


        {/* 結果表示 - NewsPicks風 */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-gray-600 font-news">
              <span className="font-news-subheading text-gray-900">{filteredContests.length}</span>件のコンテストが見つかりました
            </p>
            <div className="text-sm text-gray-500">
              現在募集中のコンテストのみ表示
            </div>
          </div>
        </div>

        {/* コンテストカード一覧 */}
        {filteredContests.length > 0 ? (
          <div className="space-y-12">
            {areaOrder.map((area) => {
              const areaContests = filteredContests.filter(contest => contest.area === area);
              if (areaContests.length === 0) return null;

              return (
                <div key={area}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
                      {area}
                      <span className="block text-sm font-news-subheading text-gray-500 mt-1">
                        {area === '全国' ? 'Nationwide' : 
                         area === '東京都' ? 'Tokyo' :
                         area === '大阪府' ? 'Osaka' :
                         area === '兵庫県' ? 'Hyogo' :
                         area === '大分県' ? 'Oita' :
                         area === '中国' ? 'China' :
                         area === 'その他' ? 'Others' : area}
                      </span>
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {areaContests.map((contest) => (
                      <Card
                        key={contest.id}
                        id={contest.id}
                        title={contest.title}
                        description={contest.description}
                        imageUrl={contest.imageUrl}
                        deadline={contest.deadline ? new Date(contest.deadline) : undefined}
                        startDate={contest.startDate ? new Date(contest.startDate) : undefined}
                        area={contest.area}
                        organizer={contest.organizer}
                        organizerType={contest.organizerType || "その他"}
                        website={contest.website}
                        targetArea={contest.targetArea}
                        targetAudience={contest.targetAudience}
                        incentive={contest.incentive}
                        operatingCompany={contest.operatingCompany}
                        isPopular={contest.isPopular}
                        type="contest"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* エリア未設定のコンテスト */}
            {(() => {
              const unassignedContests = filteredContests.filter(contest => !areaOrder.includes(contest.area || ''));
              if (unassignedContests.length === 0) return null;

              return (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-news-heading text-gray-900 mb-2">
                      その他
                      <span className="block text-sm font-news-subheading text-gray-500 mt-1">Others</span>
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {unassignedContests.map((contest) => (
                      <Card
                        key={contest.id}
                        id={contest.id}
                        title={contest.title}
                        description={contest.description}
                        imageUrl={contest.imageUrl}
                        deadline={contest.deadline ? new Date(contest.deadline) : undefined}
                        startDate={contest.startDate ? new Date(contest.startDate) : undefined}
                        area={contest.area}
                        organizer={contest.organizer}
                        organizerType={contest.organizerType || "その他"}
                        website={contest.website}
                        targetArea={contest.targetArea}
                        targetAudience={contest.targetAudience}
                        incentive={contest.incentive}
                        operatingCompany={contest.operatingCompany}
                        isPopular={contest.isPopular}
                        type="contest"
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当するコンテストが見つかりませんでした
              </h3>
              <p className="text-gray-600 font-news">
                検索条件を変更して再度お試しください
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
