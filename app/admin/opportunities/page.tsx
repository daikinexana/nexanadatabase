"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import SimpleImage from "@/components/ui/simple-image";
import {
  Sparkles,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Trophy,
  Handshake,
  Loader2,
} from "lucide-react";

interface Opportunity {
  id: string;
  kind: "contest" | "open-call";
  title: string;
  organizer: string;
  organizerType?: string | null;
  area: string;
  deadline: string;
  startDate: string;
  website: string;
  description?: string | null;
  imageUrl?: string | null;
  benefit?: string | null;
  targetArea?: string | null;
  targetAudience?: string | null;
  isActive: boolean;
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function AdminOpportunitiesPage() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/opportunities?admin=1", { cache: "no-store" });
      if (!res.ok) throw new Error("一覧の取得に失敗しました");
      setItems(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      [i.title, i.organizer, i.area, i.organizerType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  const toggleActive = async (item: Opportunity) => {
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/opportunities/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: !item.isActive }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error || "更新に失敗しました");
      }
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "更新に失敗しました");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item: Opportunity) => {
    if (!confirm(`「${item.title}」を削除します。よろしいですか？`)) return;
    setBusyId(item.id);
    try {
      const res = await fetch(`/api/opportunities/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.error || "削除に失敗しました");
      }
      setItems((prev) => prev.filter((p) => p.id !== item.id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    } finally {
      setBusyId(null);
    }
  };

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

          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">オポチュニティ管理</h1>
              <p className="text-gray-500 text-sm mt-1">
                コンテスト・公募の一覧 / 編集 / 削除 / 公開切替
              </p>
            </div>
            <Link
              href="/admin/ai-import"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-indigo-600 hover:to-blue-600 transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              AIで新規登録
            </Link>
          </div>

          {/* 検索 */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="タイトル・主催者・エリアで検索..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-sm shadow-sm"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              {items.length === 0
                ? "まだ登録がありません。「AIで新規登録」から追加できます。"
                : "条件に該当する項目がありません"}
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">{filtered.length}件</p>
              <div className="space-y-2">
                {filtered.map((item) => {
                  const KindIcon = item.kind === "contest" ? Trophy : Handshake;
                  const busy = busyId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 ${
                        item.isActive ? "" : "opacity-60"
                      }`}
                    >
                      {/* サムネ */}
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {item.imageUrl ? (
                          <SimpleImage
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <KindIcon className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* 情報 */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.kind === "contest"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            <KindIcon className="w-2.5 h-2.5" />
                            {item.kind === "contest" ? "コンテスト" : "公募"}
                          </span>
                          {!item.isActive && (
                            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              非公開
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 truncate">
                          {item.organizer} ・ {item.area} ・ 締切 {formatDate(item.deadline)}
                        </p>
                      </div>

                      {/* 操作 */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleActive(item)}
                          disabled={busy}
                          title={item.isActive ? "非公開にする" : "公開する"}
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                        >
                          {item.isActive ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/admin/opportunities/${item.id}`}
                          title="編集"
                          className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => remove(item)}
                          disabled={busy}
                          title="削除"
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-40"
                        >
                          {busy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
