"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import { Trophy, Newspaper, BookOpen, Building, Handshake } from "lucide-react";

export default function AdminPage() {

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

        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}