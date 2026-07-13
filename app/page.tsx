import { Metadata } from "next";
import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import EnhancedButton from "@/components/ui/enhanced-button";
import PagePreview from "@/components/ui/page-preview";
import { Trophy, Building, TrendingUp, LayoutGrid } from "lucide-react";
import { getDatabaseStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "KYOSO BASE | オープンイノベーション・スタートアップ情報プラットフォーム",
  description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、ロケーション・ワークスペース情報をデータベース化。ネクサナ（nexana）が運営するスタートアップ・大企業・大学向けイノベーションデータベース。",
  keywords: "スタートアップ, オープンイノベーション, イノベーション, コンテスト, ビジネスコンテスト, アクセラ, アクセラレーション, プログラム, 公募, 募集, 開催, 調達, M&A, インキュベーション, プラットフォーム, データベース, ネクサナ, nexana, ねくさな, スタートアップコンテスト, ピッチコンテスト, business competition, ロケーション, ワークスペース, コワーキングスペース, スタートアップ調達ニュース, 大学ディープテック, 海外展開支援, マッチングサービス, プロジェクトマネジメント, コミュニティマネージメント, スタートアップ支援, 大企業, 大学, 行政",
  openGraph: {
    title: "KYOSO BASE | オープンイノベーション・スタートアップ情報プラットフォーム",
    description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、ロケーション・ワークスペース情報をデータベース化。",
    type: "website",
    locale: "ja_JP",
    url: "https://db.nexanahq.com",
    siteName: "KYOSO BASE",
    images: [
      {
        url: "https://db.nexanahq.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "KYOSO BASE - オープンイノベーション・スタートアップ情報プラットフォーム",
      },
    ],
  },
};

const databases = [
  {
    name: "コンテスト・公募・プログラム",
    nameEn: "Programs",
    icon: Trophy,
    preview: "programs" as const,
    description:
      "スタートアップコンテスト、ピッチ、ハッカソン、アクセラレーション、そして企業・行政・大学によるオープンイノベーション公募まで。挑戦の機会を種別・エリア・締切で横断的に検索できます。",
    tags: ["コンテスト", "ピッチ", "ハッカソン", "アクセラ", "公募", "補助金"],
  },
  {
    name: "ワークスペース",
    nameEn: "Workspaces",
    icon: Building,
    preview: "workspaces" as const,
    description:
      "国内外のシェアオフィス、コワーキング、インキュベーション施設をエリア別に掲載。設備・料金・コミュニティ情報から、挑戦の拠点となる場所を見つけられます。",
    tags: ["コワーキング", "シェアオフィス", "インキュベーション", "拠点探し"],
  },
  {
    name: "ニュース",
    nameEn: "News",
    icon: TrendingUp,
    preview: "news" as const,
    description:
      "スタートアップの資金調達、M&A、IPO、パートナーシップをリアルタイムで配信。投資家・調達額・セクターの情報を添えて、業界の動向を追えます。",
    tags: ["資金調達", "M&A", "IPO", "業務提携"],
  },
];



// メインページの静的生成を最強化
export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const revalidate = 3600; // 1時間キャッシュ
export const fetchCache = 'force-cache';
export const preferredRegion = 'auto';

export default async function Home() {
  // データベースの統計情報を取得
  const stats = await getDatabaseStats();
  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />

      {/* ヒーロー — 白背景・巨大タイポグラフィ */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-900" />
            KYOSO BASE（共創ベース）
          </p>

          <h1 className="display mt-6 text-[3rem] leading-[0.98] text-neutral-900 sm:text-[5.5rem] lg:text-[7.5rem]">
            挑戦者を、
            <br />
            情報で<span className="text-neutral-300">支える。</span>
          </h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <p className="max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg">
              KYOSO BASE（キョウソウベース）は、nexana（ネクサナ）が運営する「共創（きょうそう・協創）」から生まれたプラットフォーム。
              コンテスト・公募・プログラム、ワークスペース、ニュースを一箇所で。
              挑戦する人のためのKYOSO（共創）データベースです。
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <EnhancedButton
                href="/opportunities"
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
                loadingText="読み込み中..."
              >
                挑戦機会を探す
              </EnhancedButton>
              <EnhancedButton
                href="/news"
                variant="secondary"
                size="md"
                className="w-full sm:w-auto"
                loadingText="読み込み中..."
              >
                最新ニュース
              </EnhancedButton>
            </div>
          </div>

          {/* 統計 */}
          <div className="mt-16 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-8 sm:mt-20">
            {[
              { value: stats.programs, label: "コンテスト・公募・プログラム", labelEn: "Programs" },
              { value: stats.workspaces, label: "ワークスペース", labelEn: "Workspaces" },
              { value: stats.news, label: "ニュース", labelEn: "News" },
            ].map((s) => (
              <div key={s.labelEn}>
                <div className="tnum text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                  {s.value}
                  <span className="text-neutral-300">+</span>
                </div>
                <div className="mt-1 text-xs text-neutral-500 sm:text-sm">{s.label}</div>
                <div className="font-display text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  {s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* データベース — 3つの領域を説明 */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">
              <LayoutGrid className="h-3.5 w-3.5" />
              Databases
            </p>
            <h2 className="display-2 mt-4 text-3xl text-neutral-900 sm:text-5xl">
              3つのデータベース
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm leading-relaxed text-neutral-500 sm:block">
            挑戦のあらゆる局面に必要な情報を、横断的に。
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 lg:grid-cols-3">
          {databases.map((db, i) => (
            <div key={db.name} className="flex h-full flex-col bg-white">
              {/* ヘッダー：番号 + アイコン */}
              <div className="flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-8">
                <span className="font-display text-sm font-semibold tracking-[0.15em] text-neutral-300">
                  0{i + 1}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200">
                  <db.icon className="h-5 w-5 text-neutral-900" strokeWidth={1.75} />
                </span>
              </div>

              {/* スマホで見たページのプレビュー */}
              <div className="flex justify-center bg-gradient-to-b from-white to-neutral-50 px-6 py-7">
                <PagePreview variant={db.preview} />
              </div>

              {/* テキスト */}
              <div className="flex flex-1 flex-col px-6 pb-7 sm:px-8">
                <h3 className="text-xl font-bold leading-snug tracking-tight text-neutral-900 sm:text-2xl">
                  {db.name}
                </h3>
                <p className="font-display mt-1.5 text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {db.nameEn}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                  {db.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-1.5 border-t border-neutral-100 pt-5">
                  {db.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
