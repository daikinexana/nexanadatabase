import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { extractWorkspaceFromUrl } from "@/lib/extract-workspace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 一度に処理できるURLの上限（精度・レート制御のため）
const MAX_URLS = 10;

function normalizeUrl(raw: unknown): string | null {
  const url = typeof raw === "string" ? raw.trim() : "";
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    // 単一URL（url）と複数URL（urls）の両方を受け付ける
    const rawList: unknown[] = Array.isArray(body?.urls)
      ? body.urls
      : body?.url != null
      ? [body.url]
      : [];

    if (rawList.length === 0) {
      return NextResponse.json({ error: "URLを入力してください" }, { status: 400 });
    }

    // 正規化 + 重複除去
    const seen = new Set<string>();
    const urls: string[] = [];
    const invalid: string[] = [];
    for (const raw of rawList) {
      const normalized = normalizeUrl(raw);
      if (!normalized) {
        if (typeof raw === "string" && raw.trim()) invalid.push(raw.trim());
        continue;
      }
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      urls.push(normalized);
    }

    if (urls.length === 0) {
      return NextResponse.json(
        { error: "有効なhttp(s)のURLがありません" },
        { status: 400 }
      );
    }
    if (urls.length > MAX_URLS) {
      return NextResponse.json(
        { error: `一度に処理できるURLは${MAX_URLS}件までです` },
        { status: 400 }
      );
    }

    // 各URLを個別にAI抽出（1URL=1LLM呼び出しなので精度は単体登録と同等）。
    // 1件失敗しても他を止めない。
    const results = await Promise.all(
      urls.map(async (url) => {
        try {
          const data = await extractWorkspaceFromUrl(url);
          return { url, ok: true as const, data };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "解析に失敗しました";
          return { url, ok: false as const, error: message };
        }
      })
    );

    // APIキー未設定など致命的なエラーは全体エラーとして返す
    const keyMissing = results.find(
      (r) => !r.ok && r.error.includes("OPENROUTER_API_KEY")
    );
    if (keyMissing) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    return NextResponse.json({ results, invalid }, { status: 200 });
  } catch (error) {
    console.error("AI import workspace error:", error);
    const message =
      error instanceof Error ? error.message : "解析中にエラーが発生しました";
    const status = message.includes("認証")
      ? 401
      : message.includes("管理者権限")
      ? 403
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
