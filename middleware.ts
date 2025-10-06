import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/user(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
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
