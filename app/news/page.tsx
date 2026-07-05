import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import NewsItem from "@/components/ui/news-item";
import NewsPagination from "@/components/ui/news-pagination";
import { Newspaper } from "lucide-react";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ニュース一覧 | KYOSO BASE | スタートアップ調達・M&A情報",
  description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信。VC、CVCの投資情報、資金調達ニュース、買収・合併情報も掲載。イノベーション・オープンイノベーションに関する最新ニュースをデータベース化。ネクサナ（nexana）が運営するプラットフォーム。",
  keywords: "スタートアップ, スタートアップ情報, スタートアップ調達, スタートアップ調達ニュース, スタートアップM&A, 調達, 調達情報, 調達ニュース, 資金調達, ファンディング, 投資, 投資情報, M&A, M&A情報, M&Aニュース, 買収, 合併, IPO, IPO情報, 上場, 上場情報, VC, ベンチャーキャピタル, CVC, コーポレートベンチャーキャピタル, ニュース, イノベーション, イノベーション情報, オープンイノベーション, オープンイノベーション情報, プラットフォーム, データベース, ネクサナ, nexana, ねくさな, startup funding, startup M&A, startup IPO, venture capital, CVC, corporate venture capital, funding news, M&A news, IPO news, investment, innovation news",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://db.nexanahq.com/news",
    languages: {
      'ja': 'https://db.nexanahq.com/news',
      'en': 'https://db.nexanahq.com/news',
    },
  },
  openGraph: {
    title: "ニュース一覧 | KYOSO BASE | スタートアップ調達・M&A情報",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信。VC、CVCの投資情報、資金調達ニュースも掲載。",
    type: "website",
    url: "https://db.nexanahq.com/news",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    siteName: "KYOSO BASE",
    images: [
      {
        url: "https://db.nexanahq.com/news.image.png",
        width: 1200,
        height: 630,
        alt: "スタートアップ調達・M&A情報",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ニュース一覧 | KYOSO BASE",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    images: ["https://db.nexanahq.com/news.image.png"],
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
    // インデックスを活用したwhere条件
    const where = { 
      isActive: true,
    };
    
    // 総件数とデータを並列取得で最適化
    const [totalCount, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        // 必要なフィールドのみ選択（パフォーマンス向上）
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
          createdAt: true,
          updatedAt: true, // 構造化データで必要
          // isActiveは不要なので削除
        },
        // publishedAtのインデックスを活用
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

    // 投資家を配列に変換（一度だけ実行）
    const newsWithArrayInvestors = news.map(newsItem => ({
      ...newsItem,
      investors: newsItem.investors ? newsItem.investors.split(',').filter(Boolean) : []
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

// ISRを使用してパフォーマンスを最適化（5分ごとに再生成）
export const revalidate = 300; // 5分キャッシュ（作成/更新/削除時はrevalidatePathで即時反映）
export const runtime = 'nodejs';
export const preferredRegion = 'sin1'; // DB(ap-southeast-1)と同一リージョンでレイテンシ削減

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

  // 構造化データ（BreadcrumbList）
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ホーム",
        "item": "https://db.nexanahq.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "ニュース",
        "item": "https://db.nexanahq.com/news"
      }
    ]
  };

  // 構造化データ（CollectionPage + ItemList）
  const collectionPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ニュース一覧",
    "description": "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    "url": "https://db.nexanahq.com/news",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": pagination.totalCount,
      "itemListElement": filteredNews.slice(0, 10).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "NewsArticle",
          "headline": item.title,
          "description": item.description || "",
          "datePublished": item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date(item.createdAt).toISOString(),
          "dateModified": item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date(item.createdAt).toISOString(),
          "author": {
            "@type": "Organization",
            "name": item.company
          },
          "publisher": {
            "@type": "Organization",
            "name": "KYOSO BASE",
            "logo": {
              "@type": "ImageObject",
              "url": "https://db.nexanahq.com/nexanadata.png"
            }
          },
          "url": item.sourceUrl || `https://db.nexanahq.com/news`,
          "image": item.imageUrl ? {
            "@type": "ImageObject",
            "url": item.imageUrl
          } : undefined
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <Script
        id="collection-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageStructuredData),
        }}
      />
      <ClientHeader />

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
        {/* ページヘッダー */}
        <div className="mb-8 border-b border-neutral-200 pb-8 sm:mb-10">
          <p className="eyebrow">
            <Newspaper className="h-3.5 w-3.5" />
            News
          </p>
          <h1 className="display-2 mt-4 text-4xl text-neutral-900 sm:text-6xl">
            ニュース
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            スタートアップの調達、M&A、IPO情報をリアルタイムで配信。
          </p>
        </div>

        {/* 件数表示 */}
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
          <p className="text-xs sm:text-sm text-neutral-500">
            <span className="tnum font-bold text-neutral-900 text-base sm:text-lg">{pagination.totalCount.toLocaleString()}</span>
            <span className="ml-1">件のニュース</span>
          </p>
          <span className="font-display text-[11px] uppercase tracking-[0.2em] text-neutral-400">
            Latest
          </span>
        </div>

        {/* ニュース一覧 */}
        {filteredNews.length > 0 ? (
          <>
            <div className="divide-y divide-neutral-200 border-b border-neutral-200">
              {filteredNews.map((item, index) => (
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
                   priority={index < 3} // 最初の3枚の画像を優先読み込み
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
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-neutral-200 mb-4">
              <Newspaper className="h-6 w-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-neutral-900 mb-1">
              該当するニュースが見つかりませんでした
            </h3>
            <p className="text-sm text-neutral-500">
              検索条件を変更して再度お試しください
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}