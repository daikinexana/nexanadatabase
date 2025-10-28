import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/user(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Googlebotのクロールを妨げないようにする
  const userAgent = req.headers.get('user-agent') || '';
  const isGooglebot = userAgent.includes('Googlebot') || userAgent.includes('googlebot');
  
  // Googlebotの場合は認証チェックをスキップ
  if (isGooglebot) {
    return;
  }
  
  // 保護されたルートのみ認証チェック
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // 静的ファイル、_nextを除外しつつ、認証が必要なページとAPIは含める
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    // APIルートも含める（認証が必要なAPIは個別に保護）
    "/api/(.*)",
  ],
};
