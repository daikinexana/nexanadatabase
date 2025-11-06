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
  "/location(.*)",
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
 * Googlebotを検出する関数（より包括的に）
 * 実際のGooglebotのUser-Agentパターンを網羅
 */
function isGooglebot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  
  // 主要なGooglebotパターン
  const googlebotPatterns = [
    'googlebot',
    'google-inspectiontool',
    'mediapartners-google',
    'apis-google',
    'feedfetcher-google',
    'google page speed',
    'lighthouse',
    'google structured data testing tool',
    'google favicon',
    'google image',
    'google news',
  ];
  
  // パターンマッチング
  if (googlebotPatterns.some(pattern => ua.includes(pattern))) {
    return true;
  }
  
  // Google Search Consoleのライブテスト用（より寛容な検出）
  if (ua.includes('mozilla') && ua.includes('compatible')) {
    // Google関連のキーワードを含む場合
    if (ua.includes('google') || ua.includes('chrome') && ua.includes('w.x.y.z')) {
      return true;
    }
  }
  
  return false;
}

/**
 * カスタムミドルウェア（Googlebot専用）
 * Clerkを完全にバイパスして、リダイレクトを防ぐ
 */
function googlebotMiddleware(req: NextRequest): NextResponse | null {
  const userAgent = req.headers.get('user-agent') || '';
  
  if (!isGooglebot(userAgent)) {
    return null; // Googlebotでない場合はnullを返してclerkMiddlewareに処理を委譲
  }
  
  // Googlebotの場合は、Clerkを完全にスキップ
  if (isPublicRoute(req)) {
    const response = NextResponse.next();
    // SEO用のヘッダーを追加
    response.headers.set('X-Robots-Tag', 'index, follow');
    // Googlebot検出フラグを追加（layout.tsxで使用）
    response.headers.set('X-Is-Googlebot', 'true');
    return response;
  }
  
  // 保護されたページは403を返す（リダイレクトしない）
  if (isProtectedRoute(req)) {
    return new NextResponse(null, { status: 403 });
  }
  
  // その他のページも通過
  const response = NextResponse.next();
  response.headers.set('X-Is-Googlebot', 'true');
  return response;
}

/**
 * Clerk用の認証ハンドラー
 */
const clerkAuthHandler = async (auth: any, req: NextRequest) => {
  // パブリックページは認証チェックなしで通過
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }
  
  // APIルートの処理
  if (req.nextUrl.pathname.startsWith("/api/")) {
    // GETリクエストは認証不要（admin API以外）
    if (req.method === "GET" && !req.nextUrl.pathname.startsWith("/api/admin/") && !req.nextUrl.pathname.startsWith("/api/user/")) {
      return NextResponse.next();
    }
    
    // POST/PUT/DELETEは保護されたAPIのみ認証チェック
    if (isProtectedRoute(req)) {
      await auth.protect();
    } else {
      // 保護されていないAPIは通過（各APIルートで認証チェック）
      return NextResponse.next();
    }
  }
  
  // 保護されたルートのみ認証チェック
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  return NextResponse.next();
};

/**
 * メインミドルウェア
 * Googlebotの場合は独自のミドルウェアを使用し、それ以外はClerkを使用
 */
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const userAgent = req.headers.get('user-agent') || '';
  
  // まずGooglebotをチェック（Clerkより先に処理）
  if (isGooglebot(userAgent)) {
    // Googlebotの場合は独自のミドルウェアロジックを使用
    const googlebotResponse = googlebotMiddleware(req);
    if (googlebotResponse) {
      return googlebotResponse;
    }
  }
  
  // Googlebotでない場合は、通常のClerk認証処理
  return clerkAuthHandler(auth, req);
})

export const config = {
  matcher: [
    // 静的ファイル、_next、favicon、robots.txt、sitemap.xmlなどを除外
    // パブリックページと保護されたページの両方を含む
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    // APIルートも含める（認証が必要なAPIは個別に保護）
    "/api/(.*)",
  ],
};
