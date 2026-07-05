/**
 * 各ページ（プログラム / ワークスペース / ニュース）を、スマホで見たときの
 * イメージとして縮小再現するモノクロのモックアップ。
 * サムネイルは public/previews の仮画像（グレースケールSVG）を表示している。
 * 実データ風のテキスト（見出し・タイトル・バッジ・日付）も入れている。
 */

type PagePreviewVariant = "programs" | "workspaces" | "news";

function Thumb({ src, className }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} loading="lazy" decoding="async" />
  );
}

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[178px] rounded-[1.6rem] border border-neutral-300 bg-white p-1.5 shadow-[0_16px_44px_-16px_rgba(0,0,0,0.3)]">
      <div className="relative aspect-[9/18] overflow-hidden rounded-[1.15rem] bg-white">
        {/* ノッチ */}
        <div className="absolute left-1/2 top-1.5 z-10 h-1 w-9 -translate-x-1/2 rounded-full bg-neutral-200" />
        <div className="h-full overflow-hidden px-2 pb-2 pt-4">{children}</div>
      </div>
    </div>
  );
}

/* ── プログラム（/opportunities） ─────────────────────────── */
const PROGRAM_ITEMS = [
  { title: "Startup Pitch 2026 東京", kind: "コンテスト", org: "◯◯株式会社", deadline: "締切 8/31", img: "/previews/ph-3.svg" },
  { title: "地域課題オープンイノベーション公募", kind: "公募", org: "△△市役所", deadline: "締切 9/15", img: "/previews/ph-1.svg" },
  { title: "アクセラレーションプログラム 第5期", kind: "プログラム", org: "◇◇ベンチャーズ", deadline: "締切 10/20", img: "/previews/ph-6.svg" },
];

function ProgramsPreview() {
  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="text-[8px] font-bold tracking-tight text-neutral-900">プログラム</span>
        <span className="text-[5px] text-neutral-400">12件</span>
      </div>
      <div className="mt-1.5 flex gap-0.5">
        <span className="rounded-full bg-neutral-900 px-1.5 py-[1.5px] text-[5px] font-semibold text-white">すべて</span>
        <span className="rounded-full border border-neutral-200 px-1.5 py-[1.5px] text-[5px] text-neutral-500">コンテスト</span>
        <span className="rounded-full border border-neutral-200 px-1.5 py-[1.5px] text-[5px] text-neutral-500">公募</span>
        <span className="rounded-full border border-neutral-200 px-1.5 py-[1.5px] text-[5px] text-neutral-500">プログラム</span>
      </div>
      <div className="mt-1.5 space-y-1.5">
        {PROGRAM_ITEMS.map((it) => (
          <div key={it.title} className="overflow-hidden rounded-md border border-neutral-200 bg-white">
            <div className="relative h-9 overflow-hidden bg-neutral-100">
              <Thumb src={it.img} className="h-full w-full object-cover" />
              <span className="absolute left-1 top-1 rounded-full bg-neutral-900/90 px-1 py-[0.5px] text-[4px] font-bold text-white">
                {it.kind}
              </span>
            </div>
            <div className="p-1.5">
              <div className="line-clamp-2 text-[6px] font-semibold leading-tight text-neutral-800">
                {it.title}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="truncate text-[5px] text-neutral-400">{it.org}</span>
                <span className="shrink-0 text-[5px] font-medium text-neutral-500">{it.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── ワークスペース（/workspace） ────────────────────────── */
const WORKSPACE_ITEMS = [
  { name: "Nexana Base", area: "東京・渋谷", img: "/previews/ph-3.svg" },
  { name: "Startup Hub", area: "福岡・天神", img: "/previews/ph-1.svg" },
  { name: "Co-Lab", area: "大阪・本町", img: "/previews/ph-6.svg" },
  { name: "The Garage", area: "京都", img: "/previews/ph-5.svg" },
  { name: "Harbor", area: "札幌", img: "/previews/ph-2.svg" },
  { name: "Studio", area: "名古屋", img: "/previews/ph-4.svg" },
];

function WorkspacesPreview() {
  return (
    <>
      <div className="flex items-baseline justify-between">
        <span className="text-[8px] font-bold tracking-tight text-neutral-900">ワークスペース</span>
      </div>
      <div className="mt-1.5 flex gap-0.5">
        <span className="rounded-full bg-neutral-900 px-1.5 py-[1.5px] text-[5px] font-semibold text-white">日本</span>
        <span className="rounded-full border border-neutral-200 px-1.5 py-[1.5px] text-[5px] text-neutral-500">海外</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        {WORKSPACE_ITEMS.map((w) => (
          <div key={w.name} className="overflow-hidden rounded-md border border-neutral-200 bg-white">
            <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
              <Thumb src={w.img} className="h-full w-full object-cover" />
            </div>
            <div className="px-1 py-0.5">
              <div className="truncate text-[5px] font-semibold text-neutral-800">{w.name}</div>
              <div className="truncate text-[4.5px] text-neutral-400">{w.area}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── ニュース（/news） ───────────────────────────────────── */
const NEWS_ITEMS = [
  { badge: "資金調達", title: "AIスタートアップが5億円を調達", date: "2026/6/30", img: "/previews/ph-4.svg" },
  { badge: "M&A", title: "◯◯が△△を買収", date: "2026/6/28", img: "/previews/ph-2.svg" },
  { badge: "IPO", title: "□□が東証グロースに上場", date: "2026/6/25", img: "/previews/ph-6.svg" },
  { badge: "業務提携", title: "◇◇が大手企業と業務提携", date: "2026/6/20", img: "/previews/ph-5.svg" },
];

function NewsPreview() {
  return (
    <>
      <span className="text-[8px] font-bold tracking-tight text-neutral-900">ニュース</span>
      <div className="mt-1.5 space-y-1.5">
        {NEWS_ITEMS.map((n) => (
          <div key={n.title} className="flex gap-1.5 border-b border-neutral-100 pb-1.5 last:border-b-0">
            <div className="h-7 w-9 shrink-0 overflow-hidden rounded bg-neutral-100">
              <Thumb src={n.img} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-neutral-900 px-1 py-[0.5px] text-[4px] font-bold text-white">
                {n.badge}
              </span>
              <div className="mt-0.5 line-clamp-2 text-[6px] font-semibold leading-tight text-neutral-800">
                {n.title}
              </div>
              <div className="text-[4.5px] text-neutral-400">{n.date}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function PagePreview({ variant }: { variant: PagePreviewVariant }) {
  return (
    <Phone>
      {variant === "programs" && <ProgramsPreview />}
      {variant === "workspaces" && <WorkspacesPreview />}
      {variant === "news" && <NewsPreview />}
    </Phone>
  );
}
