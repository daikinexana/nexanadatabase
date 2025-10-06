import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 静的ファイルやAPIルートは除外
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // 保護されたルートのみ認証チェック
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // 静的ファイル、API、_nextを除外
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*|api/).*)",
  ],
};
