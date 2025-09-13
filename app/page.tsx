import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Trophy, Calendar, Newspaper, BookOpen, Building, Handshake } from "lucide-react";

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
    description: "スタートアップコンテスト、ハッカソン、ピッチコンテストなどの情報を掲載",
    href: "/contests",
    icon: Trophy,
    color: "bg-blue-500",
  },
  {
    name: "施設紹介",
    description: "スタートアップ支援施設やイノベーション拠点を紹介",
    href: "/facilities",
    icon: Building,
    color: "bg-indigo-500",
  },
  {
    name: "展示会・イベント",
    description: "スタートアップ関連の展示会、カンファレンス、イベント情報を提供",
    href: "/events",
    icon: Calendar,
    color: "bg-green-500",
  },
  {
    name: "公募",
    description: "企業や自治体が募集する課題解決パートナーや協業相手の公募情報",
    href: "/open-calls",
    icon: Handshake,
    color: "bg-purple-500",
  },
  {
    name: "ニュース",
    description: "スタートアップの調達情報、M&A情報、IPO情報をリアルタイムで配信",
    href: "/news",
    icon: Newspaper,
    color: "bg-red-500",
  },
  {
    name: "ナレッジベース",
    description: "AI、ディープテックなどの最新技術情報とトレンドを提供",
    href: "/knowledge",
    icon: BookOpen,
    color: "bg-pink-500",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* ヒーローセクション */}
      <div className="relative bg-gradient-to-r from-blue-600 to-green-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Nexana Database
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              スタートアップ向けの包括的な情報キュレーションサイト
            </p>
            <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
              コンテスト、展示会、公募、ニュース、ナレッジベースを一箇所で。エリアや主催者タイプでフィルタリングして、あなたに最適な情報を見つけましょう。
            </p>
          </div>
        </div>
      </div>


      {/* 機能紹介 */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              提供サービス
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              スタートアップの成長を支援する多様な情報を提供します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white mr-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
}
