import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { extractOpportunityFromUrl } from "@/lib/extract-opportunity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "URLを入力してください" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "有効なURLを入力してください" }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "http(s) のURLを入力してください" },
        { status: 400 }
      );
    }

    const extracted = await extractOpportunityFromUrl(parsedUrl.toString());
    return NextResponse.json(extracted, { status: 200 });
  } catch (error) {
    console.error("AI import error:", error);
    const message =
      error instanceof Error ? error.message : "解析中にエラーが発生しました";
    const status = message.includes("OPENROUTER_API_KEY") ? 500 : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
