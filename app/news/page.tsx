import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import NewsItem from "@/components/ui/news-item";
import NewsPagination from "@/components/ui/news-pagination";
import { Newspaper } from "lucide-react";
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
    const where = { isActive: true };
    
    // 総件数とデータを並列取得で最適化
    const [totalCount, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          company: true,
          sector: true,
          amount: true,
          investors: true,
          publishedAt: true,
          sourceUrl: true,
          type: true,
          area: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

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
export const revalidate = 300; // 5分キャッシュ（ニュースは更新頻度が高いため短めに設定）
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

  // データベース側で既にpublishedAt: "desc"でソート済みのため、追加のソートは不要
  const filteredNews = Array.isArray(news) ? news : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10">
        {/* シンプルなページヘッダー */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-400 via-indigo-400 to-purple-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm uppercase tracking-wider text-blue-600 font-bold">News</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            ニュース一覧
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            スタートアップの調達、M&A、IPO情報をリアルタイムで配信
          </p>
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