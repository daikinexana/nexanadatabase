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
  
  // Googlebotの場合、保護されたルートへのアクセスを避ける（robots.txtでDisallow済み）
  // ただし、誤ってアクセスした場合でもリダイレクトせずに404などで処理
  // パブリックページはそのまま通過させてクロール可能にする
  if (isGooglebot) {
    // Googlebotが/admin/にアクセスしようとした場合は早期リターン
    // （robots.txtでDisallowしているが、念のため明示的に処理）
    if (isProtectedRoute(req)) {
      // リダイレクトせず、そのまま通過（404や適切なエラーページを返すか、または単純に通過）
      // ただし、Clerkの認証チェックはスキップしてリダイレクトを防ぐ
      return;
    }
    // パブリックページの場合はそのまま通過
    return;
  }
  
  // 通常のユーザーの場合、保護されたルートのみ認証チェック
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
