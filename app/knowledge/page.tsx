import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Search, Filter as FilterIcon, BookOpen } from "lucide-react";

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

// サーバーサイドでデータを取得
async function getKnowledge(): Promise<Knowledge[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://db.nexanahq.com'}/api/knowledge`, {
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch knowledge:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return [];
  }
}

export default async function KnowledgePage() {
  const knowledge = await getKnowledge();

  // フィルタリング処理
  const filteredKnowledge = knowledge.filter((item) => {
    // アクティブなナレッジのみ表示
    return item.isActive;
  }).sort((a, b) => {
    // 公開日時の降順（新しい順）
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
    return bDate - aDate;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー - NewsPicks風 */}
        <div className="mb-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* バッジ */}
            <div className="inline-flex items-center px-3 py-1 bg-indigo-50 rounded-full mb-4">
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">KNOWLEDGE</span>
            </div>
            
            {/* メインタイトル */}
            <h1 className="text-3xl md:text-4xl font-news-heading text-gray-900 mb-4">
              Knowledge
              <span className="block text-lg font-news-subheading text-gray-500 mt-1">ナレッジ一覧</span>
            </h1>
            
            {/* 説明文 */}
            <p className="text-lg text-gray-600 font-news leading-relaxed">
              AI、ディープテック、最新技術情報とトレンドを提供しています
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
              <span className="font-news-subheading text-gray-900">{filteredKnowledge.length}</span>件のナレッジが見つかりました
            </p>
            <div className="text-sm text-gray-500">
              最新のナレッジを表示
            </div>
          </div>
        </div>

        {/* ナレッジ一覧 */}
        {filteredKnowledge.length > 0 ? (
          <div className="space-y-6">
            {filteredKnowledge.map((item) => (
              <article key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* 画像 */}
                  {item.imageUrl && (
                    <div className="md:w-48 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-32 md:h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* コンテンツ */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {item.categoryTag && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {item.categoryTag}
                        </span>
                      )}
                      {item.area && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.area}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-news-heading text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h2>
                    
                    {item.description && (
                      <p className="text-gray-600 font-news mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>
                        {item.publishedAt 
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