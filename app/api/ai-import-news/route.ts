import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { extractNewsFromUrl, type ExtractedNews } from "@/lib/extract-news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 一度に処理できるURLの上限
const MAX_URLS = 15;

interface ImportResult {
  url: string;
  ok: boolean;
  data?: ExtractedNews;
  error?: string;
}

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (!["http:", "https:"].includes(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // 単一URL（url）と複数URL（urls配列）の両方を受け付ける
    const rawList: string[] = Array.isArray(body?.urls)
      ? body.urls
      : typeof body?.url === "string"
      ? [body.url]
      : [];

    // 空行除去・重複排除・バリデーション
    const seen = new Set<string>();
    const urls: string[] = [];
    const invalid: ImportResult[] = [];
    for (const raw of rawList) {
      if (typeof raw !== "string") continue;
      const normalized = normalizeUrl(raw);
      if (!normalized) {
        if (raw.trim()) {
          invalid.push({ url: raw.trim(), ok: false, error: "有効なURLではありません" });
        }
        continue;
      }
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      urls.push(normalized);
    }

    if (urls.length === 0 && invalid.length === 0) {
      return NextResponse.json({ error: "URLを入力してください" }, { status: 400 });
    }
    if (urls.length > MAX_URLS) {
      return NextResponse.json(
        { error: `一度に処理できるURLは${MAX_URLS}件までです` },
        { status: 400 }
      );
    }

    // 並列で解析（1件失敗しても他は継続）
    const settled = await Promise.all(
      urls.map(async (url): Promise<ImportResult> => {
        try {
          const data = await extractNewsFromUrl(url);
          return { url, ok: true, data };
        } catch (e) {
          return {
            url,
            ok: false,
            error: e instanceof Error ? e.message : "解析に失敗しました",
          };
        }
      })
    );

    const results = [...settled, ...invalid];
    const successCount = results.filter((r) => r.ok).length;

    return NextResponse.json(
      { results, successCount, total: results.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI import (news) error:", error);
    const message =
      error instanceof Error ? error.message : "解析中にエラーが発生しました";
    const status = message.includes("OPENROUTER_API_KEY") ? 500 : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
