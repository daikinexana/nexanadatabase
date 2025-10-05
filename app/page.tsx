import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import ServerHeader from "@/components/ui/server-header";
import Footer from "@/components/ui/footer";
import { Trophy, Building, ArrowRight, Star, Globe, Zap, Target, TrendingUp, Lightbulb } from "lucide-react";

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
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    accentColor: "bg-amber-400",
  },
  {
    name: "公募",
    nameEn: "Open Calls",
    description: "企業や自治体が募集する課題解決パートナーや協業相手の公募情報",
    descriptionEn: "Open calls for partnerships and collaborations",
    href: "/open-calls",
    icon: Target,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    accentColor: "bg-purple-400",
  },
  {
    name: "施設紹介",
    nameEn: "Facilities",
    description: "スタートアップ支援施設やイノベーション拠点を紹介",
    descriptionEn: "Startup support facilities and innovation hubs",
    href: "/facilities",
    icon: Building,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    accentColor: "bg-blue-400",
  },
  {
    name: "ニュース",
    nameEn: "News",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    descriptionEn: "Real-time startup funding, M&A, and IPO news",
    href: "/news",
    icon: TrendingUp,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-rose-50 via-pink-50 to-red-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    accentColor: "bg-rose-400",
  },
  {
    name: "ナレッジベース",
    nameEn: "Knowledge",
    description: "AI、ディープテックなどの最新技術情報とトレンドを提供",
    descriptionEn: "Latest tech trends in AI, deep tech, and innovation",
    href: "/knowledge",
    icon: Lightbulb,
    color: "from-slate-500 to-blue-600",
    bgColor: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-200",
    accentColor: "bg-slate-400",
  },
];



// 10分間キャッシュしてISRを有効化（ホームページは更新頻度が低い）
export const revalidate = 600;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ServerHeader />
      
      {/* ヒーローセクション - スタートアップ画像背景 */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="/startup.jpg"
            alt="スタートアップの未来"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* ダークオーバーレイ */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* 装飾的な要素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-white mb-8 max-w-4xl mx-auto font-news-heading">
              スタートアップの未来を
              <br className="hidden sm:block" />
              情報で切り拓く
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto font-news leading-relaxed">
              イノベーションに必要な情報を一箇所で探そう。
              <br />
              エリアや主催者タイプでフィルタリングして、あなたに最適な情報を見つけよう。
            </p>
          </div>
          
          {/* CTAボタン */}
          <div className="flex justify-center items-center">
            <Link
              href="/contests"
              className="group bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              コンテストを見る
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>


      {/* サービス紹介 - コンサル企業風の洗練されたデザイン */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-full mb-6">
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">SERVICES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-news-heading text-slate-900 mb-2">
              サービス
              <span className="block text-xl font-news-subheading text-slate-500 mt-1">Services</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-news leading-relaxed">
              スタートアップの成長を支援する多様な情報を提供します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* カードの背景グラデーション */}
                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* 装飾的な要素 */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgColor} rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 opacity-20`}></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 ${feature.bgColor} rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700 opacity-10`}></div>
                
                <div className="relative p-8">
                  {/* アイコン */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* コンテンツ */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors duration-300">
                      {feature.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-4">
                      {feature.nameEn}
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 font-news">
                    {feature.description}
                  </p>
                  
                  {/* アローアイコン */}
                  <div className="flex items-center text-slate-500 group-hover:text-slate-700 font-semibold text-sm transition-all duration-300">
                    詳細を見る
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  
                  {/* 装飾的なドット */}
                  <div className="flex justify-center items-center space-x-1 mt-6">
                    <div className={`w-1.5 h-1.5 ${feature.accentColor} rounded-full opacity-60`}></div>
                    <div className={`w-1.5 h-1.5 ${feature.accentColor} rounded-full opacity-40`}></div>
                    <div className={`w-1.5 h-1.5 ${feature.accentColor} rounded-full opacity-20`}></div>
                  </div>
                </div>
                
                {/* ホバー時の光る効果 */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* About セクション - シンプルモダン */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-slate-200 rounded-full mb-6">
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">ABOUT</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-news-heading text-slate-900 mb-2">
              About NEXANA DATABASE
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto font-news leading-relaxed">
              挑戦者を支える情報プラットフォーム
              <span className="block text-base text-slate-500 mt-1 font-news">Supporting Challengers with Information</span>
            </p>
            <p className="text-base text-slate-500 mt-4 max-w-2xl mx-auto font-news">
              私たちは、日本で新しいことに挑戦する人たちをサポートし、<br />
              成功への第一歩を踏み出すための情報を提供します。
            </p>
          </div>

          {/* 特徴 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 border border-slate-200">
                <Globe className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-news-subheading mb-2 text-slate-900">包括的な情報</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-news">コンテストからニュースまで、スタートアップに必要な情報を網羅</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 border border-slate-200">
                <Star className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-news-subheading mb-2 text-slate-900">厳選された情報</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-news">質の高い情報のみを厳選して提供</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 border border-slate-200">
                <Zap className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-news-subheading mb-2 text-slate-900">オープンアクセス</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-news">すべての情報に誰でもアクセス可能で、挑戦の障壁を下げる</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 border border-slate-200">
                <Target className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-news-subheading mb-2 text-slate-900">発射台</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-news">挑戦者を次のステップへと押し上げるプラットフォーム</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
