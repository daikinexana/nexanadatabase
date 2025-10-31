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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ヒーローセクション - 背景画像を使用 */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center">
            {/* 背景画像 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/news.image.png')"
              }}
            ></div>
            
            {/* オーバーレイ - 左側に緑色のグラデーション */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-teal-800/60 to-transparent"></div>
            
            {/* コンテンツ */}
            <div className="relative px-8 py-16 text-left max-w-4xl">
              {/* バッジ */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg">
                <Newspaper className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">NEWS</span>
              </div>
              
              {/* メインタイトル */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  News
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-emerald-300 to-transparent flex-1 max-w-32"></div>
                  <span className="text-lg font-medium text-emerald-100 px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    ニュース一覧
                  </span>
                </div>
              </div>
              
              {/* 説明文 */}
              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-4">
                  スタートアップの調達、M&A、IPO情報をリアルタイムで配信
                </p>
                <p className="text-base text-emerald-100 font-medium">
                  Real-time startup funding, M&A, and IPO news delivery
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex items-center space-x-2 mt-8">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
              <span className="font-news-subheading text-gray-900 text-lg sm:text-xl">{pagination.totalCount.toLocaleString()}</span>件のニュースが見つかりました
            </p>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50/50 px-3 py-1 rounded-full">
              最新のニュースを表示
            </div>
          </div>
        </div>

        {/* ニュース一覧 - iPhone 16最適化 */}
        {filteredNews.length > 0 ? (
          <>
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

            {/* ページネーション */}
            <div className="mt-8 sm:mt-12">
              <NewsPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
                limit={pagination.limit}
              />
            </div>
          </>
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