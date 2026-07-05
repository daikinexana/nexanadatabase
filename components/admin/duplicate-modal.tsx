"use client";

import { AlertTriangle, X, ExternalLink } from "lucide-react";

export interface DuplicateMatch {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  strength: "exact" | "likely";
  reason: string;
}

interface DuplicateModalProps {
  open: boolean;
  matches: DuplicateMatch[];
  /** 保存対象の見出し（例: 新規のタイトル）。任意 */
  targetLabel?: string;
  saving?: boolean;
  onConfirm: () => void; // 「それでも保存」
  onCancel: () => void; // 「やめる」
}

/**
 * 重複候補を提示し、「それでも保存」か「やめる」かを選ばせる確認モーダル。
 * 単体保存・バッチ保存の両方から利用する。
 */
export default function DuplicateModal({
  open,
  matches,
  targetLabel,
  saving = false,
  onConfirm,
  onCancel,
}: DuplicateModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 p-4">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-gray-900">
                似た既存データが{matches.length}件あります
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {targetLabel ? `「${targetLabel}」は` : "この内容は"}
                既存と重複している可能性があります。内容を確認してください。
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            type="button"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto p-4">
          {matches.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    m.strength === "exact"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {m.strength === "exact" ? "ほぼ一致" : "類似"}
                </span>
                <p className="truncate text-sm font-semibold text-gray-900">{m.title}</p>
              </div>
              {m.subtitle && (
                <p className="mt-1 truncate text-xs text-gray-600">{m.subtitle}</p>
              )}
              {m.meta && <p className="mt-0.5 truncate text-[11px] text-gray-400">{m.meta}</p>}
              <p className="mt-1 text-[11px] text-amber-700">理由: {m.reason}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 p-4 sm:flex-row-reverse">
          <button
            onClick={onConfirm}
            disabled={saving}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            {saving ? "保存中..." : "重複を承知で、それでも保存"}
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            type="button"
          >
            やめる（保存しない）
          </button>
        </div>
        <p className="px-4 pb-4 text-center text-[11px] text-gray-400">
          <ExternalLink className="mr-1 inline h-3 w-3" />
          毎年開催・別ラウンドの調達など、正当に異なる場合は「それでも保存」で登録できます
        </p>
      </div>
    </div>
  );
}
