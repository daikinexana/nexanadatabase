"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import { Trophy, Newspaper, BookOpen, Building, Calendar, Handshake, Gift, Package, Cpu } from "lucide-react";

// サンプルデータ（実際の実装ではAPIから取得）
const sampleData = {
  contests: [
    {
      id: "1",
      title: "NEXCO東日本『E-NEXCO OPEN INNOVATION PROGRAM 2025』",
      deadline: new Date("2025-09-17"),
      organizer: "東日本高速道路株式会社",
      category: "INNOVATION_CHALLENGE",
      isActive: true,
      createdAt: new Date("2025-08-01"),
    },
    {
      id: "2",
      title: "渋沢MIXオープンイノベーションプログラム Canvas",
      deadline: new Date("2025-10-10"),
      organizer: "埼玉県",
      category: "STARTUP_CONTEST",
      isActive: true,
      createdAt: new Date("2025-08-02"),
    },
  ],
  news: [
    {
      id: "1",
      title: "終活プラットフォーム「SouSou」、プレシリーズA追加調達で累計3億円超",
      company: "そうそう",
      type: "FUNDING",
      amount: "3億円",
      publishedAt: new Date("2025-09-02"),
      isActive: true,
      createdAt: new Date("2025-09-02"),
    },
    {
      id: "2",
      title: "ドクターズプライム、シリーズA完結で4行から4億2,000万円デット調達",
      company: "ドクターズプライム",
      type: "FUNDING",
      amount: "4億2,000万円",
      publishedAt: new Date("2025-09-02"),
      isActive: true,
      createdAt: new Date("2025-09-02"),
    },
  ],
  knowledge: [
    {
      id: "1",
      title: "バイブコーディングは本格開発に使えるの？——PolyscapeのAI駆動開発",
      category: "AI",
      author: "kigoyama",
      publishedAt: new Date("2025-08-26"),
      isActive: true,
      createdAt: new Date("2025-08-26"),
    },
    {
      id: "2",
      title: "あるようでなかった「賃貸初期費用の分割払い」で急成長——20億円調達、40万人が利用するスムーズとは？",
      category: "FINTECH",
      author: "kigoyama",
      publishedAt: new Date("2025-08-26"),
      isActive: true,
      createdAt: new Date("2025-08-26"),
    },
  ],
};

export default function AdminPage() {
  const [data] = useState(sampleData);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">管理者ダッシュボード</h1>
            <p className="text-gray-600">コンテンツの管理と編集を行います</p>
          </div>

          {/* 管理ページへのナビゲーション */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">管理ページ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/contests"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-blue-500 text-white mr-4">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    コンテスト管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  コンテストの作成、編集、削除を行います
                </p>
              </Link>

              <Link
                href="/admin/facilities"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-indigo-500 text-white mr-4">
                    <Building className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    施設紹介管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  スタートアップ支援施設の管理を行います
                </p>
              </Link>

              <Link
                href="/admin/events"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-green-500 text-white mr-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    展示会・イベント管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  展示会やイベントの管理を行います
                </p>
              </Link>

              <Link
                href="/admin/open-calls"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-purple-500 text-white mr-4">
                    <Handshake className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    公募管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  課題解決パートナー募集などの公募情報を管理します
                </p>
              </Link>

              <Link
                href="/admin/subsidies"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-yellow-500 text-white mr-4">
                    <Gift className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    助成金管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  スタートアップ向けの助成金・補助金情報を管理します
                </p>
              </Link>

              <Link
                href="/admin/asset-provisions"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-orange-500 text-white mr-4">
                    <Package className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    アセット提供管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  資金、設備、施設、技術、知識、ネットワークの提供公募を管理します
                </p>
              </Link>

              <Link
                href="/admin/technologies"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-cyan-500 text-white mr-4">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                    技術情報管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  提供可能な技術・ノウハウ情報を管理します
                </p>
              </Link>

              <Link
                href="/admin/news"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-red-500 text-white mr-4">
                    <Newspaper className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    ニュース管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  スタートアップの調達情報、M&A情報を管理します
                </p>
              </Link>

              <Link
                href="/admin/knowledge"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-lg bg-pink-500 text-white mr-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    ナレッジ管理
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  AI、ディープテックなどの最新技術情報を管理します
                </p>
              </Link>

            </div>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        コンテスト数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.contests.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Newspaper className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        ニュース数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.news.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        ナレッジ数
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data.knowledge.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}