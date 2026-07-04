"use client";

import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import {
  Sparkles,
  ListChecks,
  Newspaper,
  Briefcase,
  Building2,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

type AiCard = {
  href: string;
  title: string;
  desc: string;
  icon: typeof Sparkles;
  gradient: string;
};

type ManageCard = {
  href: string;
  title: string;
  desc: string;
  icon: typeof ListChecks;
  iconBg: string;
  iconText: string;
};

const AI_CARDS: AiCard[] = [
  {
    href: "/admin/ai-import",
    title: "AIでURL取込",
    desc: "URLからAIがオポチュニティを自動抽出して登録",
    icon: Sparkles,
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    href: "/admin/ai-import-news",
    title: "AIでニュース一括取込",
    desc: "複数URL（最大15件）からAIがニュースを自動抽出して登録",
    icon: Sparkles,
    gradient: "from-rose-500 to-red-600",
  },
  {
    href: "/admin/ai-import-workspace",
    title: "AIで施設をURL取込",
    desc: "施設ページのURL（最大10件）からAIがワークスペース情報を自動抽出して登録",
    icon: Building2,
    gradient: "from-teal-500 to-emerald-600",
  },
];

const MANAGE_CARDS: ManageCard[] = [
  {
    href: "/admin/opportunities",
    title: "オポチュニティ管理",
    desc: "コンテスト・公募の一覧 / 編集 / 削除 / 公開切替",
    icon: ListChecks,
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
  },
  {
    href: "/admin/news",
    title: "ニュース管理",
    desc: "調達・M&Aなどのニュースを管理",
    icon: Newspaper,
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
  },
  {
    href: "/admin/workspace",
    title: "ワークスペース管理",
    desc: "ワークスペース情報を管理",
    icon: Briefcase,
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
];

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-dvh bg-gray-50">
        {/* Sticky app bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <h1 className="text-[15px] font-semibold text-gray-900">管理ダッシュボード</h1>
            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">トップに戻る</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              コンテンツの登録・管理
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              AIによる自動取込と各コンテンツの管理を行います。
            </p>
          </div>

          {/* AI 自動取込 */}
          <section className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                AI 自動取込
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AI_CARDS.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-sm`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-gray-900">{c.title}</h4>
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                          AI
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-gray-500">{c.desc}</p>
                    </div>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500 motion-reduce:transition-none" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* コンテンツ管理 */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-gray-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                コンテンツ管理
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MANAGE_CARDS.map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg} ${c.iconText}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500 motion-reduce:transition-none" />
                    </div>
                    <h4 className="text-base font-semibold text-gray-900">{c.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{c.desc}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </AdminGuard>
  );
}
