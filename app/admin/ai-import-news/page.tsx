"use client";

import { useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import AutoTextarea from "@/components/ui/auto-textarea";
import ImageUpload from "@/components/ui/image-upload";
import DuplicateModal, { type DuplicateMatch } from "@/components/admin/duplicate-modal";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Save,
  Search,
} from "lucide-react";

const NEWS_TYPE_LABELS: Record<string, string> = {
  FUNDING: "投資",
  M_AND_A: "M&A",
  IPO: "IPO",
  PARTNERSHIP: "パートナーシップ",
  OTHER: "その他",
};

type SaveState = "idle" | "saving" | "saved" | "error" | "duplicate";

interface Draft {
  // 元URLごとの一意キー（Reactのkey / 状態管理用）
  key: string;
  sourceUrl: string;
  title: string;
  company: string;
  type: string;
  description: string;
  sector: string;
  amount: string;
  investors: string; // カンマ区切りの文字列で編集
  area: string;
  publishedAt: string; // YYYY-MM-DD
  imageUrl: string;
  isActive: boolean;
  // 保存状態
  saveState: SaveState;
  saveError?: string;
  // 重複候補（saveState === "duplicate" のとき）
  dupMatches?: DuplicateMatch[];
  // 解析エラー（抽出に失敗したURL）
  extractError?: string;
}

interface ImportResult {
  url: string;
  ok: boolean;
  data?: {
    title: string;
    company: string;
    type: string;
    description: string;
    sector: string;
    amount: string;
    investors: string[];
    area: string | null;
    publishedAt: string | null;
    imageUrl: string;
    sourceUrl: string;
  };
  error?: string;
}

let keyCounter = 0;
const nextKey = () => `d${keyCounter++}`;

export default function AiImportNewsPage() {
  const [urlsText, setUrlsText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [savingAll, setSavingAll] = useState(false);
  const [dupModalKey, setDupModalKey] = useState<string | null>(null);

  const urlLines = urlsText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const update = (key: string, patch: Partial<Draft>) => {
    setDrafts((prev) =>
      prev.map((d) => (d.key === key ? { ...d, ...patch } : d))
    );
  };

  const remove = (key: string) => {
    setDrafts((prev) => prev.filter((d) => d.key !== key));
  };

  const handleAnalyze = async () => {
    if (urlLines.length === 0) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-import-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ urls: urlLines }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "解析に失敗しました");
      }

      const results: ImportResult[] = data.results || [];
      const newDrafts: Draft[] = results.map((r) => {
        if (r.ok && r.data) {
          return {
            key: nextKey(),
            sourceUrl: r.data.sourceUrl || r.url,
            title: r.data.title || "",
            company: r.data.company || "",
            type: r.data.type || "FUNDING",
            description: r.data.description || "",
            sector: r.data.sector || "",
            amount: r.data.amount || "",
            investors: (r.data.investors || []).join(", "),
            area: r.data.area || "",
            publishedAt: r.data.publishedAt || "",
            imageUrl: r.data.imageUrl || "",
            isActive: true,
            saveState: "idle",
          };
        }
        return {
          key: nextKey(),
          sourceUrl: r.url,
          title: "",
          company: "",
          type: "FUNDING",
          description: "",
          sector: "",
          amount: "",
          investors: "",
          area: "",
          publishedAt: "",
          imageUrl: "",
          isActive: true,
          saveState: "idle",
          extractError: r.error || "解析に失敗しました",
        };
      });
      // 既存の解析結果は置き換え
      setDrafts(newDrafts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "解析に失敗しました");
    } finally {
      setAnalyzing(false);
    }
  };

  // 1件保存（成功時はtrueを返す）。confirmDuplicate=true で重複警告を無視して保存
  const saveDraft = async (
    draft: Draft,
    confirmDuplicate = false
  ): Promise<boolean> => {
    if (!draft.title.trim() || !draft.company.trim() || !draft.type) {
      update(draft.key, {
        saveState: "error",
        saveError: "タイトル・企業名・タイプは必須です",
      });
      return false;
    }
    update(draft.key, { saveState: "saving", saveError: undefined });
    try {
      const payload = {
        title: draft.title.trim(),
        company: draft.company.trim(),
        type: draft.type,
        description: draft.description || undefined,
        sector: draft.sector || undefined,
        amount: draft.amount || undefined,
        investors: draft.investors
          ? draft.investors.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        area: draft.area || undefined,
        publishedAt: draft.publishedAt || undefined,
        imageUrl: draft.imageUrl || undefined,
        sourceUrl: draft.sourceUrl || undefined,
        confirmDuplicate,
      };
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      // 重複検知（409）→ この項目を「要確認」状態にして候補を保持
      if (res.status === 409 && data?.duplicate) {
        update(draft.key, {
          saveState: "duplicate",
          dupMatches: data.matches ?? [],
          saveError: undefined,
        });
        return false;
      }
      if (!res.ok) {
        throw new Error(data?.error || "保存に失敗しました");
      }
      update(draft.key, { saveState: "saved", saveError: undefined, dupMatches: undefined });
      return true;
    } catch (e) {
      update(draft.key, {
        saveState: "error",
        saveError: e instanceof Error ? e.message : "保存に失敗しました",
      });
      return false;
    }
  };

  // まだ保存されていない（抽出成功した）ドラフトをまとめて保存。
  // 重複警告(duplicate)の項目は自動保存せず、個別に確認してもらう。
  const handleSaveAll = async () => {
    setSavingAll(true);
    const targets = drafts.filter(
      (d) => !d.extractError && d.saveState !== "saved" && d.saveState !== "duplicate"
    );
    for (const d of targets) {
      await saveDraft(d);
    }
    setSavingAll(false);
  };

  const savableCount = drafts.filter(
    (d) => !d.extractError && d.saveState !== "saved" && d.saveState !== "duplicate"
  ).length;
  const savedCount = drafts.filter((d) => d.saveState === "saved").length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AIでニュース一括取込
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              ニュース記事のURLを1行に1つずつ貼り付けて（最大15件）、AIが内容を解析してニュースデータを自動生成します。内容を確認・修正してから保存してください。
            </p>
          </div>

          {/* URL入力 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              取り込むページのURL（1行に1つ・最大15件）
            </label>
            <AutoTextarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              minRows={6}
              placeholder={"https://example.com/news/1\nhttps://example.com/news/2\nhttps://example.com/news/3"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm text-gray-900 font-mono"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {urlLines.length} 件のURL
              </span>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || urlLines.length === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-rose-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    解析中...（{urlLines.length}件）
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AIで一括解析
                  </>
                )}
              </button>
            </div>
          </div>

          {/* エラー */}
          {error && (
            <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 一括保存バー */}
          {drafts.length > 0 && (
            <div className="sticky top-4 z-10 mb-4 flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-700">
                解析結果 {drafts.length} 件
                {savedCount > 0 && (
                  <span className="text-emerald-700 font-semibold">
                    {" "}
                    / 保存済み {savedCount} 件
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {savedCount > 0 && (
                  <Link
                    href="/news"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 underline hover:no-underline"
                  >
                    ニュースページで確認
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                <button
                  onClick={handleSaveAll}
                  disabled={savingAll || savableCount === 0}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {savingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      未保存 {savableCount} 件をまとめて保存
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ドラフト一覧 */}
          <div className="space-y-4">
            {drafts.map((d, i) => (
              <DraftCard
                key={d.key}
                index={i}
                draft={d}
                onChange={(patch) => update(d.key, patch)}
                onSave={() => saveDraft(d)}
                onShowDuplicate={() => setDupModalKey(d.key)}
                onRemove={() => remove(d.key)}
              />
            ))}
          </div>
        </div>
      </div>

      {(() => {
        const target = dupModalKey ? drafts.find((d) => d.key === dupModalKey) : null;
        return (
          <DuplicateModal
            open={!!target}
            matches={target?.dupMatches ?? []}
            targetLabel={target?.title}
            saving={target?.saveState === "saving"}
            onConfirm={async () => {
              if (!target) return;
              const ok = await saveDraft(target, true);
              if (ok) setDupModalKey(null);
            }}
            onCancel={() => setDupModalKey(null)}
          />
        );
      })()}
    </AdminGuard>
  );
}

function DraftCard({
  index,
  draft,
  onChange,
  onSave,
  onShowDuplicate,
  onRemove,
}: {
  index: number;
  draft: Draft;
  onChange: (patch: Partial<Draft>) => void;
  onSave: () => void;
  onShowDuplicate: () => void;
  onRemove: () => void;
}) {
  const saved = draft.saveState === "saved";
  const isDuplicate = draft.saveState === "duplicate";

  // 抽出失敗したURLはエラー表示のみ
  if (draft.extractError) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-red-700 text-sm font-semibold mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              解析に失敗しました
            </div>
            <p className="text-xs text-gray-500 break-all">{draft.sourceUrl}</p>
            <p className="text-sm text-red-600 mt-1">{draft.extractError}</p>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-600 p-2 shrink-0"
            title="削除"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border p-4 sm:p-5 ${
        saved ? "border-emerald-300 ring-1 ring-emerald-100" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
            {index + 1}
          </span>
          <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full">
            {NEWS_TYPE_LABELS[draft.type] || draft.type}
          </span>
          {saved && (
            <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              保存済み
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* タイトルでGoogle画像検索 */}
          <a
            href={
              draft.title.trim()
                ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(draft.title.trim())}`
                : undefined
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!draft.title.trim()) e.preventDefault();
            }}
            aria-disabled={!draft.title.trim()}
            title={draft.title.trim() ? "タイトルでGoogle画像検索" : "先にタイトルを入力してください"}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              draft.title.trim()
                ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">画像検索</span>
          </a>
          <button
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="このニュースを一覧から除外"
            type="button"
            aria-label="このニュースを一覧から除外"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="タイトル *" full>
          <input
            value={draft.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="企業名 *">
          <input
            value={draft.company}
            onChange={(e) => onChange({ company: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="タイプ *">
          <select
            value={draft.type}
            onChange={(e) => onChange({ type: e.target.value })}
            className={selectCls}
          >
            {Object.entries(NEWS_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field label="概要" full>
          <AutoTextarea
            value={draft.description}
            onChange={(e) => onChange({ description: e.target.value })}
            minRows={2}
            className={inputCls}
          />
        </Field>

        <Field label="領域（セクター）">
          <input
            value={draft.sector}
            onChange={(e) => onChange({ sector: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="金額">
          <input
            value={draft.amount}
            onChange={(e) => onChange({ amount: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="投資家（カンマ区切り）" full>
          <input
            value={draft.investors}
            onChange={(e) => onChange({ investors: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="エリア">
          <input
            value={draft.area}
            onChange={(e) => onChange({ area: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="公開日">
          <input
            type="date"
            value={draft.publishedAt}
            onChange={(e) => onChange({ publishedAt: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="画像（プレビュー / 差し替え）" full>
          <ImageUpload
            value={draft.imageUrl || undefined}
            onChange={(url) => onChange({ imageUrl: url })}
            type="news"
          />
          <div className="mt-2">
            <label className="mb-1 block text-[11px] font-medium text-gray-500">
              画像URLを直接指定（アップロードの代わりに貼り付けも可能）
            </label>
            <input
              value={draft.imageUrl}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              onDrop={(e) => {
                // 画像ファイルをテキスト欄にドロップするとChromeがローカルの
                // 絶対パス(/var/folders/...)を挿入してしまうため、それを防ぐ。
                if (e.dataTransfer.files?.length) {
                  e.preventDefault();
                  alert(
                    "ここは画像URL（https://...）を貼り付ける欄です。\n" +
                      "画像ファイルは上のアップロード枠に入れてください。"
                  );
                }
              }}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
        </Field>

        <Field label="ソースURL" full>
          <input
            value={draft.sourceUrl}
            onChange={(e) => onChange({ sourceUrl: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={draft.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          公開する
        </label>

        <div className="flex items-center gap-3">
          {draft.saveState === "error" && draft.saveError && (
            <span className="text-xs text-red-600">{draft.saveError}</span>
          )}
          {isDuplicate && (
            <span className="text-xs font-semibold text-amber-700">
              似た既存データが{draft.dupMatches?.length ?? 0}件
            </span>
          )}
          {isDuplicate ? (
            <button
              onClick={onShowDuplicate}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              重複を確認
            </button>
          ) : (
            <button
              onClick={onSave}
              disabled={draft.saveState === "saving" || saved}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {draft.saveState === "saving" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  保存済み
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm text-gray-900";
const selectCls = inputCls + " bg-white";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
