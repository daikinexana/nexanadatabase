"use client";

import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import {
  Sparkles,
  ListChecks,
  Newspaper,
  Briefcase,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const CARDS = [
  {
    href: "/admin/ai-import",
    title: "AIでURL取込",
    desc: "URLからAIがオポチュニティを自動抽出して登録",
    icon: Sparkles,
    accent: "from-indigo-500 to-blue-500",
    primary: true,
  },
  {
    href: "/admin/ai-import-news",
    title: "AIでニュース一括取込",
    desc: "複数URL（最大15件）からAIがニュースを自動抽出して登録",
    icon: Sparkles,
    accent: "from-rose-500 to-red-500",
    primary: true,
  },
  {
    href: "/admin/opportunities",
    title: "オポチュニティ管理",
    desc: "コンテスト・公募の一覧 / 編集 / 削除 / 公開切替",
    icon: ListChecks,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    href: "/admin/news",
    title: "ニュース管理",
    desc: "調達・M&Aなどのニュースを管理",
    icon: Newspaper,
    accent: "from-rose-500 to-red-500",
  },
  {
    href: "/admin/workspace",
    title: "ワークスペース管理",
    desc: "ワークスペース情報を管理",
    icon: Briefcase,
    accent: "from-teal-500 to-emerald-500",
  },
];

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            トップに戻る
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">管理ダッシュボード</h1>
            <p className="text-gray-500 text-sm mt-1">コンテンツの登録・管理を行います</p>
          </div>

          <div className="space-y-3">
            {CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className={`group flex items-center gap-4 bg-white rounded-xl border p-4 sm:p-5 transition-all hover:shadow-md ${
                    c.primary
                      ? "border-indigo-200 ring-1 ring-indigo-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`shrink-0 p-3 rounded-lg bg-gradient-to-br ${c.accent} text-white`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{c.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
