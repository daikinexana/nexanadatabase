import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, computeToken } from "@/lib/admin-auth";
import { SITE_CLOSED } from "@/lib/site-status";

/**
 * 環境変数でカスタムパスを設定可能（デフォルト: /admin）
 */
const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || "/admin";

/**
 * 本番環境かどうかを判定
 */
const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production";

/**
 * Googlebotを検出する関数
 */
function isGooglebot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  const googlebotPatterns = [
    "googlebot",
    "google-inspectiontool",
    "mediapartners-google",
    "apis-google",
    "feedfetcher-google",
    "google page speed",
    "lighthouse",
    "google structured data testing tool",
    "google favicon",
    "google image",
    "google news",
  ];
  if (googlebotPatterns.some((pattern) => ua.includes(pattern))) return true;
  if (ua.includes("mozilla") && ua.includes("compatible")) {
    if (ua.includes("google") || (ua.includes("chrome") && ua.includes("w.x.y.z"))) {
      return true;
    }
  }
  return false;
}

/**
 * このリクエストがパスワード保護の対象か判定する。
 * - 管理画面ページ（/admin*）
 * - 管理系API（/api/admin/*, /api/ai-import*, /api/upload）
 * - データAPI への書き込み（POST/PUT/DELETE/PATCH）※公開アクションは除外
 */
function needsGate(req: NextRequest): boolean {
  const p = req.nextUrl.pathname;

  // ログイン画面・ログインAPI自体は保護しない（保護すると入口が無くなる）
  if (p === "/admin-login" || p.startsWith("/api/admin-login")) return false;

  if (p.startsWith(ADMIN_PATH)) return true;
  if (p.startsWith("/api/admin/")) return true;
  if (p.startsWith("/api/ai-import")) return true;
  if (p === "/api/upload") return true;

  const method = req.method.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method) && p.startsWith("/api/")) {
    // 一般ユーザーが使う公開アクションは保護しない
    if (p.startsWith("/api/contact")) return false;
    if (p.startsWith("/api/webhooks")) return false;
    if (/^\/api\/[^/]+\/[^/]+\/(like|comments)$/.test(p)) return false; // いいね・コメント
    return true;
  }

  return false;
}

// 認証されていないときの応答（ページ→ログインへ誘導、API→401）
function challenge(req: NextRequest): NextResponse {
  const p = req.nextUrl.pathname;
  if (p.startsWith("/api/")) {
    return NextResponse.json(
      { error: "認証が必要です。管理画面にログインしてください。" },
      { status: 401 }
    );
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin-login";
  url.search = `?next=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

// 公開停止中でも通すパス（管理画面とそのログイン）
function isAdminPath(p: string): boolean {
  return (
    p.startsWith(ADMIN_PATH) ||
    p === "/admin-login" ||
    p.startsWith("/api/admin-login") ||
    p.startsWith("/api/admin/")
  );
}

async function isAdmin(req: NextRequest): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return !isProduction;
  return req.cookies.get(ADMIN_COOKIE)?.value === (await computeToken(password));
}

const CLOSED_HTML = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>KYOSO BASE</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;background:#fff;color:#111;padding:16px;box-sizing:border-box}main{text-align:center;max-width:480px}h1{font-size:22px;margin:0 0 12px}p{color:#555;line-height:1.7;margin:0}</style></head><body><main><h1>KYOSO BASE</h1><p>現在、本サービスは公開を停止しています。</p></main></body></html>`;

function closedResponse(req: NextRequest): NextResponse {
  const headers = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "サービスは公開停止中です" }, { status: 503, headers });
  }
  return new NextResponse(CLOSED_HTML, {
    status: 503,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}

export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const userAgent = req.headers.get("user-agent") || "";

  // 公開停止中: 管理画面と、ログイン済み管理者のアクセス以外は停止ページを返す（DBに触れない）
  if (SITE_CLOSED && !isAdminPath(req.nextUrl.pathname) && !(await isAdmin(req))) {
    return closedResponse(req);
  }

  // 管理画面・書き込みAPIのパスワード保護
  if (needsGate(req)) {
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      // パスワード未設定: 本番では安全側に倒してブロック、ローカル(dev)は素通り
      if (isProduction) return challenge(req);
    } else {
      const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
      const expected = await computeToken(password);
      if (cookie !== expected) return challenge(req);
    }
  }

  // Googlebotの場合はSEO用ヘッダーを追加
  if (isGooglebot(userAgent)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "index, follow");
    response.headers.set("X-Is-Googlebot", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    "/api/(.*)",
  ],
};
