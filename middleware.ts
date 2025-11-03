import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 保護されたルート（認証が必要なページ）
 * - /admin配下の全ページ
 * - /api/user配下のAPIエンドポイント
 */
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/user(.*)",
]);

/**
 * パブリックルート（認証不要なページ）
 * これらのルートはClerkの認証チェックを完全にスキップ
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/contests(.*)",
  "/open-calls(.*)",
  "/facilities(.*)",
  "/news(.*)",
  "/knowledge(.*)",
  "/contact",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/icon.svg",
  "/apple-icon.svg",
  "/google-site-verification.html",
]);

/**
 * Googlebotを検出する関数
 */
function isGooglebot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return (
    ua.includes('googlebot') ||
    ua.includes('google-inspectiontool') ||
    ua.includes('mediapartners-google') ||
    ua.includes('apis-google') ||
    ua.includes('feedfetcher-google')
  );
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const userAgent = req.headers.get('user-agent') || '';
  const pathname = req.nextUrl.pathname;
  
  // Googlebotの場合は、Clerkの処理を完全にスキップしてリダイレクトを防ぐ
  if (isGooglebot(userAgent)) {
    // パブリックページはそのまま通過（リダイレクトなし）
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }
    // 保護されたページは403を返す（リダイレクトしない）
    if (isProtectedRoute(req)) {
      return new NextResponse(null, { status: 403 });
    }
    // その他のページも通過
    return NextResponse.next();
  }
  
  // 通常のユーザーアクセス
  // パブリックページは認証チェックなしで通過
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  // 保護されたルートのみ認証チェック（auth.protect()はリダイレクトする可能性がある）
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 静的ファイル、_next、favicon、robots.txt、sitemap.xmlなどを除外
    // パブリックページと保護されたページの両方を含む
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    // APIルートも含める（認証が必要なAPIは個別に保護）
    "/api/(.*)",
  ],
};
