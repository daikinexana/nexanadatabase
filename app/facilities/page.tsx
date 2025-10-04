import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import Card from "@/components/ui/card";
import { Search, Filter as FilterIcon, Building2 } from "lucide-react";

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
async function getFacilities(): Promise<Facility[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/facilities`, {
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

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

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
  const filteredFacilities = facilities.filter((facility) => {
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
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - NewsPicks風 */}
        <div className="mb-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* バッジ */}
            <div className="inline-flex items-center px-3 py-1 bg-purple-50 rounded-full mb-4">
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">FACILITIES</span>
            </div>
            
            {/* メインタイトル */}
            <h1 className="text-3xl md:text-4xl font-news-heading text-gray-900 mb-4">
              Facilities
              <span className="block text-lg font-news-subheading text-gray-500 mt-1">施設一覧</span>
            </h1>
            
            {/* 説明文 */}
            <p className="text-lg text-gray-600 font-news leading-relaxed">
              スタートアップ支援施設、インキュベーション施設、イノベーション拠点の情報を掲載しています
            </p>
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
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
              <span className="font-news-subheading text-gray-900">{filteredFacilities.length}</span>件の施設が見つかりました
            </p>
            <div className="text-sm text-gray-500">
              アクティブな施設のみ表示
            </div>
          </div>
        </div>

        {/* 施設カード一覧 */}
        {filteredFacilities.length > 0 ? (
          <div className="space-y-12">
            {areaOrder.map((area) => {
              const areaFacilities = filteredFacilities.filter(facility => facility.area === area);
              if (areaFacilities.length === 0) return null;

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
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {areaFacilities.map((facility) => (
                      <Card
                        key={facility.id}
                        id={facility.id}
                        title={facility.title}
                        description={facility.description}
                        imageUrl={facility.imageUrl}
                        area={facility.area}
                        organizer={facility.organizer}
                        organizerType={facility.organizerType || "その他"}
                        website={facility.website}
                        targetArea={facility.targetArea}
                        targetAudience={facility.targetAudience}
                        incentive={facility.facilityInfo}
                        operatingCompany={facility.organizer}
                        type="facility"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* エリア未設定の施設 */}
            {(() => {
              const unassignedFacilities = filteredFacilities.filter(facility => !areaOrder.includes(facility.area || ''));
              if (unassignedFacilities.length === 0) return null;

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
                    {unassignedFacilities.map((facility) => (
                      <Card
                        key={facility.id}
                        id={facility.id}
                        title={facility.title}
                        description={facility.description}
                        imageUrl={facility.imageUrl}
                        area={facility.area}
                        organizer={facility.organizer}
                        organizerType={facility.organizerType || "その他"}
                        website={facility.website}
                        targetArea={facility.targetArea}
                        targetAudience={facility.targetAudience}
                        incentive={facility.facilityInfo}
                        operatingCompany={facility.organizer}
                        type="facility"
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
                <Building2 className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当する施設が見つかりませんでした
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