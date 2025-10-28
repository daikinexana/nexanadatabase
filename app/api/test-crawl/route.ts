import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Googlebotのクロールテスト用エンドポイント
  const userAgent = request.headers.get('user-agent') || '';
  const isGooglebot = userAgent.includes('Googlebot') || userAgent.includes('googlebot');
  
  if (isGooglebot) {
    return NextResponse.json({
      status: 'success',
      message: 'Googlebot detected - site is crawlable',
      timestamp: new Date().toISOString(),
      url: 'https://db.nexanahq.com',
      sitemap: 'https://db.nexanahq.com/sitemap.xml',
      robots: 'https://db.nexanahq.com/robots.txt'
    });
  }
  
  return NextResponse.json({
    status: 'error',
    message: 'This endpoint is for Googlebot testing only',
    timestamp: new Date().toISOString()
  });
}
