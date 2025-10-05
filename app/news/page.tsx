import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import NewsItem from "@/components/ui/news-item";
import { Search, Filter as FilterIcon, Newspaper } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ニュース一覧 | Nexana Database",
  description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
  keywords: "スタートアップ, 調達, M&A, IPO, 投資, ニュース",
  openGraph: {
    title: "ニュース一覧 | Nexana Database",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    type: "website",
  },
};

interface News {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  company: string;
  sector?: string;
  amount?: string;
  investors?: string;
  publishedAt?: string;
  sourceUrl?: string;
  type: string;
  area?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// サーバーサイドでデータを取得
async function getNews(): Promise<News[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/news`, {
      next: { revalidate: 300 }, // 5分間キャッシュ
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch news:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

// 5分間キャッシュしてISRを有効化
export const revalidate = 300;

export default async function NewsPage() {
  const news = await getNews();

  // フィルタリング処理
  const filteredNews = news.filter((item) => {
    // アクティブなニュースのみ表示
    return item.isActive;
  }).sort((a, b) => {
    // 公開日時の降順（新しい順）
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
    return bDate - aDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ヘッダー - iPhone 16専用プレミアムデザイン */}
        <div className="mb-12 sm:mb-16">
          <div className="relative overflow-hidden">
            {/* 背景グラデーション - エメラルド系に変更 */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl sm:rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-tr from-teal-400/10 to-cyan-400/10 rounded-full blur-2xl sm:blur-3xl"></div>
            
            <div className="relative px-4 sm:px-8 py-8 sm:py-12 text-center">
              {/* バッジ - エメラルド系プレミアムデザイン */}
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full mb-6 sm:mb-8 shadow-xl">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <Newspaper className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">NEWS</span>
              </div>
              
              {/* メインタイトル - iPhone 16対応 */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
                  News
                </h1>
                <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 max-w-16 sm:max-w-24"></div>
                  <span className="text-base sm:text-lg font-medium text-slate-600 px-3 sm:px-4 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/20">
                    ニュース一覧
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent flex-1 max-w-16 sm:max-w-24"></div>
                </div>
              </div>
              
              {/* 説明文 - iPhone 16最適化 */}
              <div className="max-w-2xl mx-auto px-4 sm:px-0">
                <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-3 sm:mb-4">
                  <span className="block sm:hidden">
                    スタートアップの調達、M&A、IPO情報を<br />
                    リアルタイムで配信しています
                  </span>
                  <span className="hidden sm:block">
                    スタートアップの調達、M&A、IPO情報をリアルタイムで配信しています
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Real-time startup funding, M&A, and IPO news delivery
                </p>
              </div>
              
              {/* 装飾的な要素 - エメラルド系 */}
              <div className="flex justify-center items-center space-x-2 mt-6 sm:mt-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 検索・フィルター - iPhone 16専用プレミアムデザイン */}
        <div className="mb-8 sm:mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="企業名、セクター、金額、投資家、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                    disabled
                  />
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-gray-200/50 rounded-xl text-sm sm:text-base font-news-subheading text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 shadow-sm"
                disabled
              >
                <FilterIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                フィルター
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 text-center">
              ※ 検索・フィルター機能は現在開発中です
            </p>
          </div>
        </div>

        {/* 結果表示 - iPhone 16専用プレミアムデザイン */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-white/20 gap-2 sm:gap-0">
            <p className="text-sm sm:text-base text-gray-600 font-news">
              <span className="font-news-subheading text-gray-900 text-lg sm:text-xl">{filteredNews.length}</span>件のニュースが見つかりました
            </p>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50/50 px-3 py-1 rounded-full">
              最新のニュースを表示
            </div>
          </div>
        </div>

        {/* ニュース一覧 - iPhone 16最適化 */}
        {filteredNews.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {filteredNews.map((item) => (
               <NewsItem
                 key={item.id}
                 title={item.title}
                 description={item.description}
                 imageUrl={item.imageUrl}
                 company={item.company}
                 sector={item.sector}
                 amount={item.amount}
                 investors={item.investors}
                 publishedAt={item.publishedAt}
                 sourceUrl={item.sourceUrl}
                 type={item.type}
                 area={item.area}
                 createdAt={item.createdAt}
               />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Newspaper className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当するニュースが見つかりませんでした
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