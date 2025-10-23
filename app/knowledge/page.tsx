import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import KnowledgePagination from "@/components/ui/knowledge-pagination";
import Image from "next/image";
import { Search, Filter as FilterIcon, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ナレッジ一覧 | Nexana Database",
  description: "AI、ディープテック、最新技術情報とトレンドを提供",
  keywords: "AI, ディープテック, 技術, トレンド, ナレッジ, イノベーション",
  openGraph: {
    title: "ナレッジ一覧 | Nexana Database",
    description: "AI、ディープテック、最新技術情報とトレンドを提供",
    type: "website",
  },
};

interface Knowledge {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  publishedAt?: string;
  categoryTag?: string;
  website?: string;
  area?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
interface KnowledgeResponse {
  data: Knowledge[];
  pagination: PaginationInfo;
}

// サーバーサイドでデータを取得
async function getKnowledge(page: number = 1, limit: number = 50): Promise<KnowledgeResponse> {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : (process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com');
    const url = `${baseUrl}/api/knowledge?page=${page}&limit=${limit}`;
    
    console.log('Fetching knowledge from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // 5分間キャッシュ
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
      
      // 後方互換性: 古いAPI形式（配列を直接返す）の場合
      if (Array.isArray(data)) {
        return {
          data: data,
          pagination: {
            page: 1,
            limit: data.length,
            totalCount: data.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
      
      // 新しいAPI形式（dataとpaginationを含む）
      return data;
    } else {
      console.error("Failed to fetch knowledge:", response.status, response.statusText);
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
  } catch (error) {
    console.error("Error fetching knowledge:", error);
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

// 静的生成を強制してGoogleクローラーの問題を解決
export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const knowledgeResponse = await getKnowledge(currentPage, 50);
  
  // エラーハンドリング: データが存在しない場合のデフォルト値
  const knowledge = knowledgeResponse?.data || [];
  const pagination = knowledgeResponse?.pagination || {
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // フィルタリング処理（API側で既にフィルタリングされているため、ここではソートのみ）
  const filteredKnowledge = Array.isArray(knowledge) ? knowledge.sort((a, b) => {
    // 公開日時の降順（新しい順）
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
    return bDate - aDate;
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション - 背景画像を使用 */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center">
            {/* 背景画像 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/knowledge.image.png')"
              }}
            ></div>
            
            {/* オーバーレイ - 左側に青色のグラデーション */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-800/60 to-transparent"></div>
            
            {/* コンテンツ */}
            <div className="relative px-8 py-16 text-left max-w-4xl">
              {/* バッジ */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-500 to-blue-600 rounded-full mb-6 shadow-lg">
                <BookOpen className="w-4 h-4 text-white mr-2" />
                <span className="text-sm font-semibold text-white uppercase tracking-wider">KNOWLEDGE</span>
              </div>
              
              {/* メインタイトル */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  Knowledge
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="h-px bg-gradient-to-r from-slate-300 to-transparent flex-1 max-w-32"></div>
                  <span className="text-lg font-medium text-slate-100 px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                    ナレッジ一覧
                  </span>
                </div>
              </div>
              
              {/* 説明文 */}
              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl text-white leading-relaxed font-medium mb-4">
                  新規事業やスタートアップに関するレポートを提供
                </p>
                <p className="text-base text-slate-100 font-medium">
                  Report on new businesses and startups
                </p>
              </div>
              
              {/* 装飾的な要素 */}
              <div className="flex items-center space-x-2 mt-8">
                <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
                    placeholder="AI技術, ディープテック, 最新技術, ナレッジベース, 大学研究, 技術移転, 事業化, 社会実装, イノベーション, 研究開発などで検索..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-news text-gray-900 placeholder-gray-500"
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
              <span className="font-news-subheading text-gray-900">{pagination.totalCount.toLocaleString()}</span>件のナレッジが見つかりました
            </p>
            <div className="text-sm text-gray-500">
              最新のナレッジを表示
            </div>
          </div>
        </div>

        {/* ナレッジ一覧 */}
        {filteredKnowledge.length > 0 ? (
          <>
            <div className="space-y-6">
              {filteredKnowledge.map((item) => (
                <article key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* 画像 */}
                    {item.imageUrl ? (
                      <div className="md:w-80 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={320}
                          height={192}
                          className="w-full h-48 md:h-40 object-cover rounded-xl shadow-sm"
                          sizes="(max-width: 768px) 100vw, 320px"
                        />
                      </div>
                    ) : (
                      <div className="md:w-80 flex-shrink-0">
                        <div className="w-full h-48 md:h-40 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center rounded-xl shadow-sm border border-slate-200">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                              <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">ナレッジ</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* コンテンツ */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {item.categoryTag && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200">
                            📚 {item.categoryTag}
                          </span>
                        )}
                        {item.area && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200">
                            {item.area}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-news-heading text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                        {item.title}
                      </h2>
                      
                      {item.description && (
                        <p className="text-gray-600 font-news mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="text-slate-500">
                          📅 {item.publishedAt 
                            ? new Date(item.publishedAt).toLocaleDateString('ja-JP')
                            : new Date(item.createdAt).toLocaleDateString('ja-JP')
                          }
                        </span>
                      </div>
                      
                      {item.website && (
                        <div className="mt-3">
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            詳細を見る
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ページネーション */}
            <div className="mt-8 sm:mt-12">
              <KnowledgePagination
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
                <BookOpen className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-news-heading text-gray-900 mb-2">
                該当するナレッジが見つかりませんでした
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