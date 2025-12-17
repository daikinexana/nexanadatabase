import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import NewsItem from "@/components/ui/news-item";
import NewsPagination from "@/components/ui/news-pagination";
import { Search, Filter as FilterIcon, Newspaper } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ニュース一覧 | Nexana Database | スタートアップ調達・M&A情報",
  description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信。イノベーション・オープンイノベーションに関する最新ニュースをデータベース化。ネクサナ（nexana）が運営するプラットフォーム。",
  keywords: "スタートアップ, 調達, M&A, IPO, 投資, ニュース, イノベーション, オープンイノベーション, プラットフォーム, データベース, ネクサナ, nexana",
  alternates: {
    canonical: "https://db.nexanahq.com/news",
  },
  openGraph: {
    title: "ニュース一覧 | Nexana Database",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    type: "website",
    url: "https://db.nexanahq.com/news",
  },
};

interface News {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  company: string;
  sector: string | null;
  amount: string | null;
  investors: string[];
  publishedAt: Date | null;
  sourceUrl: string | null;
  type: string;
  area: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ページネーション情報の型定義
interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// APIレスポンスの型定義
interface NewsResponse {
  data: News[];
  pagination: PaginationInfo;
}

// サーバーサイドでデータを取得（直接Prismaを使用）
async function getNews(page: number = 1, limit: number = 50): Promise<NewsResponse> {
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const skip = (page - 1) * limit;
    
    // 総件数を取得
    const totalCount = await prisma.news.count({
      where: {
        isActive: true,
      },
    });

    // ページネーション付きでニュースを取得
    const news = await prisma.news.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: limit,
    });

    // 投資家を配列に変換
    const newsWithArrayInvestors = news.map(newsItem => ({
      ...newsItem,
      investors: newsItem.investors ? newsItem.investors.split(',') : []
    }));

    // ページネーション情報を含めて返す
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      data: newsWithArrayInvestors,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 50,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

// 動的レンダリングに変更して最新データを常に取得（削除されたデータを即座に反映）
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0; // キャッシュを無効化
export const fetchCache = 'force-no-store'; // キャッシュを保存しない
export const preferredRegion = 'auto';

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const newsResponse = await getNews(currentPage, 50);
  
  // エラーハンドリング: データが存在しない場合のデフォルト値
  const news = newsResponse?.data || [];
  const pagination = newsResponse?.pagination || {
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // フィルタリング処理（API側で既にフィルタリングされているため、ここではソートのみ）
  const filteredNews = Array.isArray(news) ? news.sort((a, b) => {
    // 公開日時の降順（新しい順）
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
    return bDate - aDate;
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        {/* ヒーローセクション - iPhone 16最適化 */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] aspect-[16/9] sm:aspect-[16/6] flex items-center group">
            {/* 背景画像 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-[1000ms] ease-out"
              style={{
                backgroundImage: "url('/news.image.png')"
              }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
            
            {/* 装飾的な要素 - iPhone 16最適化 */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-0.5 sm:w-1 h-8 sm:h-12 bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 rounded-full"></div>
                <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Newspaper className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white font-bold">News</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative px-4 sm:px-8 md:px-16 py-10 sm:py-16 md:py-20 text-left max-w-5xl z-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-[0.95] tracking-tight" style={{
                textShadow: '0 4px 40px rgba(0,0,0,0.4), 0 2px 20px rgba(0,0,0,0.3)'
              }}>
                News
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light">ニュース一覧</p>
                <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-white/60 to-transparent"></div>
              </div>
              
              <div className="max-w-3xl space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 leading-relaxed font-light">
                  スタートアップの調達、M&A、IPO情報をリアルタイムで配信
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70 font-light">
                  Real-time startup funding, M&A, and IPO news delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 検索・フィルター - iPhone 16最適化 */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="企業名、セクター、金額、投資家、全国、東京都、大阪府、兵庫県、大分県、中国などで検索..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 md:py-4 border border-gray-200/50 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm text-sm sm:text-base min-h-[44px]"
                    disabled
                  />
                </div>
              </div>
              <button
                className="inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 border border-gray-200/50 rounded-lg sm:rounded-xl text-sm sm:text-base font-news-subheading text-gray-700 bg-white/50 backdrop-blur-sm hover:bg-white/70 active:bg-white/80 transition-all duration-300 shadow-sm min-h-[44px] min-w-[100px] sm:min-w-[120px]"
                disabled
              >
                <FilterIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                フィルター
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 text-center">
              ※ 検索・フィルター機能は現在開発中です
            </p>
          </div>
        </div>

        {/* 結果表示 - iPhone 16最適化 */}
        <div className="mb-5 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-lg border border-white/20 gap-2 sm:gap-0">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-news leading-relaxed">
              <span className="font-news-subheading text-gray-900 text-base sm:text-lg md:text-xl">{pagination.totalCount.toLocaleString()}</span>件のニュースが見つかりました
            </p>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
              最新のニュースを表示
            </div>
          </div>
        </div>

        {/* ニュース一覧 - iPhone 16最適化 */}
        {filteredNews.length > 0 ? (
          <>
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
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

            {/* ページネーション */}
            <div className="mt-6 sm:mt-8 md:mt-12">
              <NewsPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                limit={pagination.limit}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <Newspaper className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-news-heading text-gray-900 mb-2">
                該当するニュースが見つかりませんでした
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-news">
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