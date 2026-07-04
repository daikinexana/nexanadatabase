"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import ImageUpload from "@/components/ui/image-upload";
import AutoTextarea from "@/components/ui/auto-textarea";
import { OpportunityCard, type OpportunityItem } from "@/components/ui/opportunities-list";
import { Sparkles, Link2, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Search } from "lucide-react";

const ORGANIZER_TYPE_OPTIONS = ["企業", "行政", "大学", "CV", "その他"];

const JAPAN_AREAS = [
  "全国", "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];
const OVERSEAS_AREAS = [
  "アメリカ", "カナダ", "イギリス", "エストニア", "オランダ", "スペイン", "ドイツ",
  "フランス", "ポルトガル", "中国", "台湾", "韓国", "インドネシア", "シンガポール",
  "タイ", "ベトナム", "インド", "UAE（ドバイ/アブダビ）", "オーストラリア", "海外", "その他",
];

interface Draft {
  kind: "contest" | "open-call";
  title: string;
  organizer: string;
  organizerType: string;
  description: string;
  area: string;
  deadline: string;
  startDate: string;
  website: string;
  targetArea: string;
  targetAudience: string;
  benefit: string;
  imageUrl: string;
}

const EMPTY_DRAFT: Draft = {
  kind: "contest",
  title: "",
  organizer: "",
  organizerType: "その他",
  description: "",
  area: "",
  deadline: "",
  startDate: "",
  website: "",
  targetArea: "",
  targetAudience: "",
  benefit: "",
  imageUrl: "",
};

export default function AiImportPage() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setSavedId(null);
  };

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setError(null);
    setSavedId(null);
    try {
      const res = await fetch("/api/ai-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "解析に失敗しました");
      }
      setDraft({
        ...EMPTY_DRAFT,
        ...data,
        area: data.area ?? "",
        deadline: data.deadline ?? "",
        startDate: data.startDate ?? "",
        website: data.website || url.trim(),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "解析に失敗しました");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    // 必須項目チェック（エリア・締切日・開始日・リンクURLも必須）
    const missing: string[] = [];
    if (!draft.title.trim()) missing.push("タイトル");
    if (!draft.organizer.trim()) missing.push("主催者");
    if (!draft.area.trim()) missing.push("エリア");
    if (!draft.deadline.trim()) missing.push("締切日");
    if (!draft.startDate.trim()) missing.push("開始日");
    if (!draft.website.trim()) missing.push("リンクURL");
    if (missing.length > 0) {
      setError(`必須項目を入力してください: ${missing.join("、")}`);
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        kind: draft.kind,
        title: draft.title.trim(),
        organizer: draft.organizer.trim(),
        organizerType: draft.organizerType || undefined,
        area: draft.area,
        deadline: draft.deadline,
        startDate: draft.startDate,
        website: draft.website.trim(),
        description: draft.description || undefined,
        imageUrl: draft.imageUrl || undefined,
        benefit: draft.benefit || undefined,
        targetArea: draft.targetArea || undefined,
        targetAudience: draft.targetAudience || undefined,
      };

      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "保存に失敗しました");
      }
      setSavedId(data.id ?? "ok");
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const previewItem: OpportunityItem | null = draft
    ? {
        id: "preview",
        kind: draft.kind,
        title: draft.title || "（タイトル未設定）",
        description: draft.description,
        imageUrl: draft.imageUrl || undefined,
        deadline: draft.deadline || undefined,
        startDate: draft.startDate || undefined,
        area: draft.area || undefined,
        organizer: draft.organizer || "（主催者未設定）",
        organizerType: draft.organizerType || undefined,
        website: draft.website || undefined,
        benefit: draft.benefit,
        targetArea: draft.targetArea,
        targetAudience: draft.targetAudience,
        createdAt: new Date().toISOString(),
      }
    : null;

  const googleImageHref = draft?.title.trim()
    ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(draft.title.trim())}`
    : undefined;

  return (
    <AdminGuard>
      <div className="min-h-dvh bg-gray-50">
        {/* Sticky app bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">ダッシュボード</span>
            </Link>
            <span className="h-5 w-px bg-gray-200" aria-hidden />
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <h1 className="truncate text-[15px] font-semibold text-gray-900">AIでURL取込</h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 max-w-2xl">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              コンテスト・公募をAIで取込
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              ページURLを貼り付けると、AIが内容を解析してカード用データを自動生成します。内容を確認・修正してから保存してください。
            </p>
          </div>

          {/* URL入力 */}
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <label htmlFor="import-url" className="mb-2 block text-sm font-semibold text-gray-700">
              取り込むページのURL
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="import-url"
                  type="url"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !analyzing && handleAnalyze()}
                  placeholder="https://example.com/contest"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !url.trim()}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-600 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    解析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AIで解析
                  </>
                )}
              </button>
            </div>
          </div>

          {/* トップレベルのエラー */}
          {error && !draft && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 解析前の空状態 */}
          {!draft && !analyzing && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/50 px-6 py-14 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-900">まだデータがありません</p>
              <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500">
                上の入力欄にURLを貼り付けて「AIで解析」を押すと、ここに編集フォームとプレビューが表示されます。
              </p>
            </div>
          )}

          {/* 解析中のスケルトン */}
          {!draft && analyzing && (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
              <Loader2 className="mx-auto mb-4 h-7 w-7 animate-spin text-indigo-500" />
              <p className="text-sm font-medium text-gray-900">AIがページを解析しています…</p>
              <p className="mt-1 text-sm text-gray-500">数十秒かかる場合があります。</p>
            </div>
          )}

          {/* 編集フォーム + プレビュー */}
          {draft && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* フォーム */}
              <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-gray-900">抽出結果を確認・編集</h2>
                  {/* タイトルをGoogle画像検索 */}
                  <a
                    href={googleImageHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!draft.title.trim()) e.preventDefault();
                    }}
                    aria-disabled={!draft.title.trim()}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                      draft.title.trim()
                        ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    }`}
                    title={
                      draft.title.trim()
                        ? "タイトルをGoogle画像検索"
                        : "先にタイトルを入力してください"
                    }
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">画像を検索</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="種別">
                    <select
                      value={draft.kind}
                      onChange={(e) => update("kind", e.target.value as Draft["kind"])}
                      className={selectCls}
                    >
                      <option value="contest">コンテスト</option>
                      <option value="open-call">公募</option>
                    </select>
                  </Field>
                  <Field label="主催者タイプ">
                    <select
                      value={draft.organizerType}
                      onChange={(e) => update("organizerType", e.target.value)}
                      className={selectCls}
                    >
                      {ORGANIZER_TYPE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="タイトル" required>
                  <input
                    value={draft.title}
                    onChange={(e) => update("title", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="主催者" required>
                  <input
                    value={draft.organizer}
                    onChange={(e) => update("organizer", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="概要">
                  <AutoTextarea
                    value={draft.description}
                    onChange={(e) => update("description", e.target.value)}
                    minRows={3}
                    className={inputCls}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="エリア" required>
                    <select
                      value={draft.area}
                      onChange={(e) => update("area", e.target.value)}
                      className={selectCls}
                    >
                      <option value="">未設定</option>
                      <optgroup label="日本">
                        {JAPAN_AREAS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </optgroup>
                      <optgroup label="海外">
                        {OVERSEAS_AREAS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </optgroup>
                    </select>
                  </Field>
                  <Field label="Benefit（賞金・特典 / 提供リソース）">
                    <input
                      value={draft.benefit}
                      onChange={(e) => update("benefit", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="締切日" required>
                    <input
                      type="date"
                      value={draft.deadline}
                      onChange={(e) => update("deadline", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="開始日" required>
                    <input
                      type="date"
                      value={draft.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="対象領域">
                    <input
                      value={draft.targetArea}
                      onChange={(e) => update("targetArea", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="応募対象">
                    <input
                      value={draft.targetAudience}
                      onChange={(e) => update("targetAudience", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="画像">
                  <ImageUpload
                    value={draft.imageUrl || undefined}
                    onChange={(imageUrl) => update("imageUrl", imageUrl)}
                    type="opportunity"
                  />
                  <div className="mt-2">
                    <label className="mb-1 block text-[11px] font-medium text-gray-500">
                      画像URLを直接指定（アップロードの代わりに貼り付けも可能）
                    </label>
                    <input
                      value={draft.imageUrl}
                      onChange={(e) => update("imageUrl", e.target.value)}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                </Field>

                <Field label="リンクURL" required>
                  <input
                    value={draft.website}
                    onChange={(e) => update("website", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      この内容で保存
                    </>
                  )}
                </button>

                {/* ボタン直下のフィードバック（画面外にならないように） */}
                <div ref={feedbackRef} aria-live="polite">
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {savedId && (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        保存しました。
                      </span>
                      <Link
                        href="/opportunities"
                        target="_blank"
                        className="font-semibold underline hover:no-underline"
                      >
                        一覧ページで確認 →
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* プレビュー */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-20">
                  <div className="mb-3 flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-500">カードプレビュー</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      /opportunities での表示
                    </span>
                  </div>
                  {previewItem && (
                    <div className="max-w-sm">
                      <OpportunityCard item={previewItem} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";
const selectCls = inputCls + " bg-white";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
