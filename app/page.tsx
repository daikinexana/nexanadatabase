import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Trophy, Calendar, Newspaper, BookOpen, Building, Handshake, ArrowRight, Play, Star, Users, Globe, Zap, Target, TrendingUp, Lightbulb, Briefcase, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Nexana Database - スタートアップ向け情報キュレーションサイト",
  description: "スタートアップ向けのコンテスト、展示会、公募、ニュース、ナレッジベースを提供する情報キュレーションサイト",
  keywords: "スタートアップ, コンテスト, 展示会, 公募, 投資, M&A, イノベーション",
  openGraph: {
    title: "Nexana Database - スタートアップ向け情報キュレーションサイト",
    description: "スタートアップ向けのコンテスト、展示会、公募、ニュース、ナレッジベースを提供する情報キュレーションサイト",
    type: "website",
    locale: "ja_JP",
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
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    name: "施設紹介",
    nameEn: "Facilities",
    description: "スタートアップ支援施設やイノベーション拠点を紹介",
    descriptionEn: "Startup support facilities and innovation hubs",
    href: "/facilities",
    icon: Building,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    name: "展示会・イベント",
    nameEn: "Events",
    description: "スタートアップ関連の展示会、カンファレンス、イベント情報を提供",
    descriptionEn: "Startup exhibitions, conferences, and events",
    href: "/events",
    icon: Calendar,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    name: "公募",
    nameEn: "Open Calls",
    description: "企業や自治体が募集する課題解決パートナーや協業相手の公募情報",
    descriptionEn: "Open calls for partnerships and collaborations",
    href: "/open-calls",
    icon: Target,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  {
    name: "ニュース",
    nameEn: "News",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    descriptionEn: "Real-time startup funding, M&A, and IPO news",
    href: "/news",
    icon: TrendingUp,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
  },
  {
    name: "ナレッジベース",
    nameEn: "Knowledge",
    description: "AI、ディープテックなどの最新技術情報とトレンドを提供",
    descriptionEn: "Latest tech trends in AI, deep tech, and innovation",
    href: "/knowledge",
    icon: Lightbulb,
    color: "from-cyan-500 to-sky-600",
    bgColor: "bg-gradient-to-br from-cyan-50 to-sky-50",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-200",
  },
];



export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
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
              コンテスト、展示会、公募、ニュース、ナレッジベースを一箇所で。
              <br />
              エリアや主催者タイプでフィルタリングして、あなたに最適な情報を見つけましょう。
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
            {features.map((feature, index) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* カードの背景グラデーション */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-8 transition-opacity duration-500`}></div>
                
                {/* 装飾的な要素 */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${feature.bgColor} rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700`}></div>
                
                <div className="relative p-6">
                  {/* アイコン */}
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 shadow-sm border ${feature.borderColor}`}>
                    <feature.icon className={`h-7 w-7 ${feature.textColor}`} />
                  </div>
                  
                  {/* コンテンツ */}
                  <div className="mb-4">
                    <h3 className="text-lg font-news-subheading text-slate-900 mb-1 group-hover:text-slate-700 transition-colors duration-300">
                      {feature.name}
                    </h3>
                    <p className="text-sm font-news text-slate-500 mb-3">
                      {feature.nameEn}
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3 font-news">
                    {feature.description}
                  </p>
                  
                  {/* アローアイコン */}
                  <div className="flex items-center text-slate-500 group-hover:text-slate-700 font-semibold text-sm transition-all duration-300">
                    詳細を見る
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                {/* ホバー時の光る効果 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
