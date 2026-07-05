"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/admin-guard";
import AutoTextarea from "@/components/ui/auto-textarea";
import ImageUpload from "@/components/ui/image-upload";
import {
  ORGANIZER_TYPE_OPTIONS,
  JAPAN_AREAS,
  OVERSEAS_AREAS,
} from "@/lib/opportunity-constants";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";

interface Form {
  kind: "contest" | "open-call" | "program";
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
  isActive: boolean;
}

// ISO文字列 -> input[type=date] 用の YYYY-MM-DD
function toDateInput(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function EditOpportunityPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/opportunities/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("データの取得に失敗しました");
        const o = await res.json();
        setForm({
          kind: o.kind,
          title: o.title ?? "",
          organizer: o.organizer ?? "",
          organizerType: o.organizerType ?? "その他",
          description: o.description ?? "",
          area: o.area ?? "",
          deadline: toDateInput(o.deadline),
          startDate: toDateInput(o.startDate),
          website: o.website ?? "",
          targetArea: o.targetArea ?? "",
          targetAudience: o.targetAudience ?? "",
          benefit: o.benefit ?? "",
          imageUrl: o.imageUrl ?? "",
          isActive: o.isActive ?? true,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "取得に失敗しました");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!form) return;
    const missing: string[] = [];
    if (!form.title.trim()) missing.push("タイトル");
    if (!form.organizer.trim()) missing.push("主催者");
    if (!form.area.trim()) missing.push("エリア");
    if (!form.deadline.trim()) missing.push("締切日");
    if (!form.startDate.trim()) missing.push("開始日");
    if (!form.website.trim()) missing.push("リンクURL");
    if (missing.length > 0) {
      setError(`必須項目を入力してください: ${missing.join("、")}`);
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: form.kind,
          title: form.title.trim(),
          organizer: form.organizer.trim(),
          organizerType: form.organizerType || undefined,
          area: form.area,
          deadline: form.deadline,
          startDate: form.startDate,
          website: form.website.trim(),
          description: form.description || undefined,
          imageUrl: form.imageUrl || undefined,
          benefit: form.benefit || undefined,
          targetArea: form.targetArea || undefined,
          targetAudience: form.targetAudience || undefined,
          isActive: form.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "保存に失敗しました");
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const googleImageHref = form?.title.trim()
    ? `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(form.title.trim())}`
    : undefined;

  return (
    <AdminGuard>
      <div className="min-h-dvh bg-gray-50">
        {/* Sticky app bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4 sm:px-6 lg:px-8">
            <Link
              href="/admin/opportunities"
              className="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">一覧に戻る</span>
            </Link>
            <span className="h-5 w-px bg-gray-200" aria-hidden />
            <h1 className="flex-1 truncate text-[15px] font-semibold text-gray-900">
              オポチュニティを編集
            </h1>
            {/* タイトルをGoogle画像検索 */}
            <a
              href={googleImageHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!form?.title.trim()) e.preventDefault();
              }}
              aria-disabled={!form?.title.trim()}
              title={
                form?.title.trim()
                  ? "タイトルをGoogle画像検索"
                  : "先にタイトルを入力してください"
              }
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                form?.title.trim()
                  ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">画像を検索</span>
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !form ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error || "データが見つかりませんでした"}
            </div>
          ) : (
            <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="種別">
                  <select
                    value={form.kind}
                    onChange={(e) => update("kind", e.target.value as Form["kind"])}
                    className={selectCls}
                  >
                    <option value="contest">コンテスト</option>
                    <option value="open-call">公募</option>
                    <option value="program">プログラム</option>
                  </select>
                </Field>
                <Field label="主催者タイプ">
                  <select
                    value={form.organizerType}
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
                <input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
              </Field>

              <Field label="主催者" required>
                <input value={form.organizer} onChange={(e) => update("organizer", e.target.value)} className={inputCls} />
              </Field>

              <Field label="概要">
                <AutoTextarea value={form.description} onChange={(e) => update("description", e.target.value)} minRows={3} className={inputCls} />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="エリア" required>
                  <select value={form.area} onChange={(e) => update("area", e.target.value)} className={selectCls}>
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
                  <input value={form.benefit} onChange={(e) => update("benefit", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="締切日" required>
                  <input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className={inputCls} />
                </Field>
                <Field label="開始日" required>
                  <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="対象領域">
                  <input value={form.targetArea} onChange={(e) => update("targetArea", e.target.value)} className={inputCls} />
                </Field>
                <Field label="応募対象">
                  <input value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <Field label="画像">
                <ImageUpload
                  value={form.imageUrl || undefined}
                  onChange={(imageUrl) => update("imageUrl", imageUrl)}
                  type="opportunity"
                />
                <div className="mt-2">
                  <label className="mb-1 block text-[11px] font-medium text-gray-500">
                    画像URLを直接指定（アップロードの代わりに貼り付けも可能）
                  </label>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => update("imageUrl", e.target.value)}
                    placeholder="https://..."
                    className={inputCls}
                  />
                </div>
              </Field>

              <Field label="リンクURL" required>
                <input value={form.website} onChange={(e) => update("website", e.target.value)} className={inputCls} />
              </Field>

              <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  公開する
                  <span className="ml-1 text-gray-400">（/opportunities に表示）</span>
                </span>
              </label>

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
                    変更を保存
                  </>
                )}
              </button>

              <div ref={feedbackRef} aria-live="polite">
                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {saved && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      保存しました。
                    </span>
                    <button
                      onClick={() => router.push("/admin/opportunities")}
                      className="font-semibold underline hover:no-underline"
                    >
                      一覧へ戻る →
                    </button>
                  </div>
                )}
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
