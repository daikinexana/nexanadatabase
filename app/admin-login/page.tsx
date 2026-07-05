"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "ログインに失敗しました");
      }
      // ログイン前にアクセスしようとしたページへ戻す（無ければ /admin）
      const next =
        new URLSearchParams(window.location.search).get("next") || "/admin";
      // Cookie反映のためフルリロードで遷移
      window.location.href = next.startsWith("/") ? next : "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">管理画面ログイン</h1>
            <p className="text-sm text-gray-500 mt-1">
              パスワードを入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-base"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  確認中...
                </>
              ) : (
                "ログイン"
              )}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          KYOSO BASE 管理画面
        </p>
      </div>
    </div>
  );
}
