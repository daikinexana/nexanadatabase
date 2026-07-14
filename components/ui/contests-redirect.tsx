"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /contests は /opportunities（コンテスト・公募の統合ページ）へ移行済み。
 * Google等の検索結果から /contests に来訪したユーザーを、
 * クライアント側で /opportunities に転送する。
 *
 * サーバーリダイレクト(301)はSEO配慮のため無効化しているため、
 * ページ描画後にJSで遷移させる方式にしている（Googlebotにはページ自体は見せる）。
 */
export default function ContestsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/opportunities");
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        <p className="text-sm text-gray-600">
          コンテスト・公募一覧ページへ移動しています…
        </p>
        <a href="/opportunities" className="text-sm text-amber-600 underline">
          自動で移動しない場合はこちら
        </a>
      </div>
    </div>
  );
}
