import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * 保護されたルート（認証が必要なページ）
 * - /admin配下の全ページ
 * - /api/user配下のAPIエンドポイント
 */
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/user(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Googlebotのクロールを妨げないようにする（SEO対策）
  const userAgent = req.headers.get('user-agent') || '';
  const isGooglebot = userAgent.includes('Googlebot') || userAgent.includes('googlebot');
  
  // Googlebotの場合は認証チェックをスキップ
  if (isGooglebot) {
    return;
  }
  
  // 保護されたルートのみ認証チェック（パブリックページは通過）
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
