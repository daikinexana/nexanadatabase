import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 環境変数でカスタムパスを設定可能（デフォルト: /admin）
 */
const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || "/admin";

/**
 * 本番環境かどうかを判定
 * 本番環境ではadminページへのアクセスを完全にブロック（ローカルのみ編集可能）
 */
const isProduction = process.env.NODE_ENV === 'production' || 
                     process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

/**
 * Adminページへのアクセスを許可するかどうか
 * 本番環境ではfalse（アクセス不可）、開発環境ではtrue（アクセス可能）
 */
const isAdminAccessAllowed = !isProduction || 
                            process.env.ALLOW_ADMIN_IN_PRODUCTION === 'true';

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
 * Adminページへのアクセスをチェック
 * 本番環境では404を返して完全にブロック
 */
function checkAdminAccess(req: NextRequest): NextResponse | null {
  // Adminページへのアクセスかどうか
  const isAdminPage = req.nextUrl.pathname.startsWith(ADMIN_PATH) || 
                      req.nextUrl.pathname.startsWith('/api/admin/');
  
  if (isAdminPage && !isAdminAccessAllowed) {
    // 本番環境ではadminページへのアクセスを完全にブロック（404を返す）
    return new NextResponse(null, { status: 404 });
  }
  
  return null;
}

/**
 * メインミドルウェア
 * Clerk認証を完全に削除し、Googlebot対応とadminページのブロックのみを行う
 */
export default function middleware(req: NextRequest): NextResponse {
  const userAgent = req.headers.get('user-agent') || '';
  
  // 本番環境でadminページへのアクセスをブロック（最優先）
  const adminAccessCheck = checkAdminAccess(req);
  if (adminAccessCheck) {
    return adminAccessCheck;
  }
  
  // Googlebotの場合はSEO用ヘッダーを追加
  if (isGooglebot(userAgent)) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'index, follow');
    response.headers.set('X-Is-Googlebot', 'true');
    return response;
  }
  
  // 通常のリクエストはそのまま通過
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 静的ファイル、_next、favicon、robots.txt、sitemap.xmlなどを除外
    // パブリックページと保護されたページの両方を含む
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    // APIルートも含める（認証が必要なAPIは個別に保護）
    "/api/(.*)",
  ],
};
