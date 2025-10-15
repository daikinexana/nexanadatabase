import { Metadata } from "next";
import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import EnhancedButton from "@/components/ui/enhanced-button";
import EnhancedCardButton from "@/components/ui/enhanced-card-button";
import { Trophy, Building, ArrowRight, Star, Globe, Zap, Target, TrendingUp, Lightbulb } from "lucide-react";
import { getDatabaseStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Nexana Database | オープンイノベーション・スタートアップ情報プラットフォーム",
  description: "オープンイノベーション、スタートアップコンテスト、ビジネスコンテスト、ピッチコンテスト、インキュベーション施設、スタートアップ調達ニュース、大学ディープテック事業化支援の総合情報データベース。大企業、大学、行政、スタートアップ向けの包括的なサポート情報を提供。",
  keywords: "オープンイノベーション, スタートアップコンテスト, ビジネスコンテスト, ピッチコンテスト, business competition, インキュベーション施設, スタートアップ調達ニュース, 大学ディープテック, 海外展開支援, マッチングサービス, プロジェクトマネジメント, コミュニティマネージメント, スタートアップ支援, 大企業, 大学, 行政, シェアハウスオーナー",
  openGraph: {
    title: "Nexana Database | オープンイノベーション・スタートアップ情報プラットフォーム",
    description: "オープンイノベーション、スタートアップコンテスト、ビジネスコンテスト、ピッチコンテスト、インキュベーション施設、スタートアップ調達ニュース、大学ディープテック事業化支援の総合情報データベース。",
    type: "website",
    locale: "ja_JP",
    url: "https://db.nexanahq.com",
    siteName: "Nexana Database",
  },
};

const features = [
  {
    name: "コンテスト",
    nameEn: "Contests",
    description: "スタートアップコンテスト、ハッカソン、ピッチコンテストなどの情報を掲載",
    descriptionEn: "Startup contests, hackathons, pitch competitions and more",
    href: "/contests",
    icon: Trophy,
    color: "from-gray-500 to-gray-700",
    bgColor: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    accentColor: "bg-gray-500",
  },
  {
    name: "公募",
    nameEn: "Open Calls",
    description: "企業や自治体が募集する課題解決パートナーや協業相手の公募情報",
    descriptionEn: "Open calls for partnerships and collaborations",
    href: "/open-calls",
    icon: Target,
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    accentColor: "bg-gray-600",
  },
  {
    name: "施設紹介",
    nameEn: "Facilities",
    description: "スタートアップ支援施設やイノベーション拠点を紹介",
    descriptionEn: "Startup support facilities and innovation hubs",
    href: "/facilities",
    icon: Building,
    color: "from-slate-500 to-slate-700",
    bgColor: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    accentColor: "bg-slate-500",
  },
  {
    name: "ニュース",
    nameEn: "News",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    descriptionEn: "Real-time startup funding, M&A, and IPO news",
    href: "/news",
    icon: TrendingUp,
    color: "from-zinc-500 to-zinc-700",
    bgColor: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    accentColor: "bg-zinc-500",
  },
  {
    name: "ナレッジベース",
    nameEn: "Knowledge",
    description: "AI、ディープテックなどの最新技術情報とトレンドを提供",
    descriptionEn: "Latest tech trends in AI, deep tech, and innovation",
    href: "/knowledge",
    icon: Lightbulb,
    color: "from-neutral-500 to-neutral-700",
    bgColor: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    accentColor: "bg-neutral-500",
  },
];



// 開発環境では短いキャッシュ時間、本番環境では10分間キャッシュ
export const revalidate = 30;

export default async function Home() {
  // データベースの統計情報を取得
  const stats = await getDatabaseStats();
  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />
      
      {/* ヒーローセクション - iPhone 16専用モバイルファーストデザイン */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center justify-center overflow-hidden">
        {/* 背景装飾 - iPhone 16のDynamic Islandを意識 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/20 rounded-b-2xl sm:hidden"></div>
        
        {/* モバイル用の装飾要素 */}
        <div className="absolute top-20 left-4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-8 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl"></div>
        
        {/* PC用の装飾要素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl hidden lg:block"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl hidden lg:block"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            {/* バッジ - iPhone 16風 */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-white/90">NEXANA DATABASE</span>
            </div>
            
            {/* メインタイトル - iPhone 16対応 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 sm:mb-8 max-w-4xl mx-auto font-news-heading leading-tight">
              <span className="block sm:hidden">
                スタートアップの
                <br />
                未来を情報で
                <br />
                切り拓く
              </span>
              <span className="hidden sm:block">
                スタートアップの未来を
                <br className="hidden md:block" />
                情報で切り拓く
              </span>
            </h1>
            
            {/* サブタイトル */}
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-4 sm:mb-6 font-medium">
              <span className="block sm:hidden">イノベーション情報プラットフォーム</span>
              <span className="hidden sm:block">イノベーション情報プラットフォーム</span>
            </p>
            
            {/* 説明文 - iPhone用 */}
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto font-news leading-relaxed px-4 sm:px-0">
              <span className="block sm:hidden">
                コンテスト、公募、施設、ニュース、ナレッジを<br />
                一箇所で検索・発見できる
              </span>
              <span className="hidden sm:block">
                コンテスト、公募、施設、ニュース、ナレッジを一箇所で検索・発見できる
                <br />
                スタートアップ支援の総合情報データベース
              </span>
            </p>
          </div>
          
          {/* CTAボタン群 - iPhone 16対応 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4 sm:px-0">
            <EnhancedButton
              href="/contests"
              variant="primary"
              size="md"
              className="w-full sm:w-auto whitespace-nowrap"
              loadingText="コンテストを読み込み中..."
            >
              コンテストを見る
            </EnhancedButton>
            
            <EnhancedButton
              href="/news"
              variant="secondary"
              size="md"
              className="w-full sm:w-auto whitespace-nowrap"
              loadingText="ニュースを読み込み中..."
            >
              最新ニュース
            </EnhancedButton>
          </div>
          
          {/* 統計情報 - iPhone用 */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.contests}+</div>
              <div className="text-sm text-gray-300">コンテスト</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.facilities}+</div>
              <div className="text-sm text-gray-300">施設</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.news}+</div>
              <div className="text-sm text-gray-300">ニュース</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stats.knowledge}+</div>
              <div className="text-sm text-gray-300">ナレッジ</div>
            </div>
          </div>
        </div>
        
        {/* スクロールインジケーター - iPhone風 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>


      {/* サービス紹介 - モダンでシンプルなデザイン */}
      <div className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        {/* 背景装飾 - 控えめに */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-48 h-48 bg-gray-500/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-slate-500/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 rounded-full mb-6 shadow-lg border border-gray-600">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-bold text-white uppercase tracking-wider">SERVICES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-news-heading text-gray-900 mb-4">
              サービス
              <span className="block text-lg sm:text-xl font-news-subheading text-gray-600 mt-2">Services</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-news leading-relaxed px-4 sm:px-0">
              スタートアップの成長を支援する多様な情報を提供します
            </p>
          </div>

          {/* コンパクトなカードレイアウト */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <EnhancedCardButton
                key={feature.name}
                href={feature.href}
                className="group relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-[1.02]"
                loadingText={`${feature.name}を読み込み中...`}
              >
                {/* カードの背景グラデーション */}
                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
                
                {/* 装飾的な要素 - 控えめに */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${feature.bgColor} rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300 opacity-10`}></div>
                
                <div className="relative p-6 sm:p-8">
                  {/* アイコン - コンパクトサイズ */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg relative`}>
                    <feature.icon className="h-8 w-8 text-white" />
                    {/* アイコンの光る効果 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* コンテンツ */}
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300 whitespace-nowrap">
                      {feature.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 mb-4 whitespace-nowrap">
                      {feature.nameEn}
                    </p>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6 overflow-hidden font-news" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                    {feature.description}
                  </p>
                  
                  {/* アローアイコン - シンプルスタイル */}
                  <div className="flex items-center text-gray-500 group-hover:text-gray-700 font-semibold text-sm transition-all duration-300 whitespace-nowrap">
                    <span>詳細を見る</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                  </div>
                </div>
                
                {/* ホバー時の光る効果 - 控えめに */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </EnhancedCardButton>
            ))}
          </div>
        </div>
        
        {/* セクション区切り - シンプルに */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* About セクション - iPhone 16専用モバイルファーストデザイン */}
      <div className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <span className="text-sm font-semibold text-white uppercase tracking-wider">ABOUT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-news-heading text-white mb-4">
              About NEXANA DATABASE
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto font-news leading-relaxed px-4 sm:px-0">
              挑戦者を支える情報プラットフォーム
              <span className="block text-base sm:text-lg text-blue-200 mt-2 font-news">Supporting Challengers with Information</span>
            </p>
            <p className="text-base sm:text-lg text-gray-300 mt-6 max-w-2xl mx-auto font-news px-4 sm:px-0">
              私たちは、日本で新しいことに挑戦する人たちをサポートし、<br className="hidden sm:block" />
              成功への第一歩を踏み出すための情報を提供します。
            </p>
          </div>

          {/* 特徴 - iPhone 16専用のグリッドレイアウト */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                <Globe className="h-8 w-8 text-blue-300" />
              </div>
              <h3 className="text-lg font-news-subheading mb-3 text-white">包括的な情報</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-news px-2 sm:px-0">コンテストからニュースまで、スタートアップに必要な情報を網羅</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                <Star className="h-8 w-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-news-subheading mb-3 text-white">厳選された情報</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-news px-2 sm:px-0">質の高い情報のみを厳選して提供</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                <Zap className="h-8 w-8 text-green-300" />
              </div>
              <h3 className="text-lg font-news-subheading mb-3 text-white">オープンアクセス</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-news px-2 sm:px-0">すべての情報に誰でもアクセス可能で、挑戦の障壁を下げる</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                <Target className="h-8 w-8 text-orange-300" />
              </div>
              <h3 className="text-lg font-news-subheading mb-3 text-white">発射台</h3>
              <p className="text-gray-300 text-sm leading-relaxed font-news px-2 sm:px-0">挑戦者を次のステップへと押し上げるプラットフォーム</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
