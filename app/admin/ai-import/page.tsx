"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import { OpportunityCard, type OpportunityItem } from "@/components/ui/opportunities-list";
import { Sparkles, Link2, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

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

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ダッシュボードに戻る
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AIでURL取込</h1>
            </div>
            <p className="text-gray-600 text-sm">
              コンテスト/公募のページURLを貼り付けると、AIが内容を解析してカード用データを自動生成します。内容を確認・修正してから保存してください。
            </p>
          </div>

          {/* URL入力 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              取り込むページのURL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !analyzing && handleAnalyze()}
                  placeholder="https://example.com/contest"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !url.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    解析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AIで解析
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

          {/* 保存完了 */}
          {savedId && (
            <div className="mb-6 flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
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

          {/* 編集フォーム + プレビュー */}
          {draft && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* フォーム */}
              <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">抽出結果を確認・編集</h2>

                <div className="grid grid-cols-2 gap-4">
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

                <Field label="タイトル *">
                  <input
                    value={draft.title}
                    onChange={(e) => update("title", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="主催者 *">
                  <input
                    value={draft.organizer}
                    onChange={(e) => update("organizer", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="概要">
                  <textarea
                    value={draft.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={3}
                    className={inputCls}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="エリア *">
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

                <div className="grid grid-cols-2 gap-4">
                  <Field label="締切日 *">
                    <input
                      type="date"
                      value={draft.deadline}
                      onChange={(e) => update("deadline", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="開始日 *">
                    <input
                      type="date"
                      value={draft.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <Field label="画像URL">
                  <input
                    value={draft.imageUrl}
                    onChange={(e) => update("imageUrl", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <Field label="リンクURL *">
                  <input
                    value={draft.website}
                    onChange={(e) => update("website", e.target.value)}
                    className={inputCls}
                  />
                </Field>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all min-h-[48px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      この内容で保存
                    </>
                  )}
                </button>

                {/* ボタン直下のフィードバック（画面外にならないように） */}
                <div ref={feedbackRef}>
                  {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  {savedId && (
                    <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
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
                <div className="sticky top-6">
                  <h2 className="text-sm font-semibold text-gray-500 mb-3">
                    カードプレビュー（/opportunities での表示）
                  </h2>
                  {previewItem && (
                    <div className="max-w-sm">
                      <OpportunityCard item={previewItem} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900";
const selectCls = inputCls + " bg-white";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
