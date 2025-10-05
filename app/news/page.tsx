import ServerHeader from "@/components/ui/server-header";
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
      <ServerHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - モダンでおしゃれなデザイン */}
        <div className="mb-12">
          <div className="relative overflow-hidden">
            {/* 背景グラデーション */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-rose-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-red-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative px-8 py-12 text-center">
              {/* バッジ - より洗練されたデザイン */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mb-6 shadow-lg">
                <Newspaper className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">NEWS</span>
              </div>
              
              {/* メインタイトル - より印象的なデザイン */}
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-rose-900 to-pink-900 bg-clip-text text-transparent mb-3">
                  News
                </h1>
                <div className="flex items-center justify-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1 max-w-24"></div>
                  <span className="text-lg font-medium text-slate-600 px-4 py-1 bg-white/60 rounded-full backdrop-blur-sm border border-white/20">
                    ニュース一覧
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1 max-w-24"></div>
                </div>
              </div>
              
              {/* 説明文 - より魅力的なレイアウト */}
              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-4">
                  スタートアップの調達、M&A、IPO情報をリアルタイムで配信しています
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Real-time startup funding, M&A, and IPO news delivery
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex justify-center items-center space-x-2 mt-8">
                <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
                    placeholder="企業名、セクター、金額、投資家、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
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
              <span className="font-news-subheading text-gray-900">{filteredNews.length}</span>件のニュースが見つかりました
            </p>
            <div className="text-sm text-gray-500">
              最新のニュースを表示
            </div>
          </div>
        </div>

        {/* ニュース一覧 */}
        {filteredNews.length > 0 ? (
          <div className="space-y-6">
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