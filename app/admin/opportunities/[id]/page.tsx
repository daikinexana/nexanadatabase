"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
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
} from "lucide-react";

interface Form {
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

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/opportunities"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            一覧に戻る
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">オポチュニティを編集</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : !form ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {error || "データが見つかりませんでした"}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="種別">
                  <select
                    value={form.kind}
                    onChange={(e) => update("kind", e.target.value as Form["kind"])}
                    className={selectCls}
                  >
                    <option value="contest">コンテスト</option>
                    <option value="open-call">公募</option>
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

              <Field label="タイトル *">
                <input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
              </Field>

              <Field label="主催者 *">
                <input value={form.organizer} onChange={(e) => update("organizer", e.target.value)} className={inputCls} />
              </Field>

              <Field label="概要">
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className={inputCls} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="エリア *">
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

              <div className="grid grid-cols-2 gap-4">
                <Field label="締切日 *">
                  <input type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} className={inputCls} />
                </Field>
                <Field label="開始日 *">
                  <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="対象領域">
                  <input value={form.targetArea} onChange={(e) => update("targetArea", e.target.value)} className={inputCls} />
                </Field>
                <Field label="応募対象">
                  <input value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} className={inputCls} />
                </Field>
              </div>

              <Field label="画像URL">
                <input value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} className={inputCls} />
              </Field>

              <Field label="リンクURL *">
                <input value={form.website} onChange={(e) => update("website", e.target.value)} className={inputCls} />
              </Field>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                  className="w-4 h-4"
                />
                公開する（/opportunities に表示）
              </label>

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
                    変更を保存
                  </>
                )}
              </button>

              <div ref={feedbackRef}>
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {saved && (
                  <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
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
        </div>
        <Footer />
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
