import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 画像最適化を有効化（パフォーマンス向上）
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30日間キャッシュ
    // 画像の遅延読み込み最適化
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // パフォーマンス最適化
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'],
  },
  // App Routerでは個別のAPIルートで設定
  // コンパイル最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // キャッシュ戦略の最適化
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // 静的生成の最適化
  trailingSlash: false,
  generateEtags: true,
  // SEO最適化
  poweredByHeader: false,
  compress: true,
        // ヘッダー設定（SEO改善）
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
                },
                {
                  key: 'X-Robots-Tag',
                  value: 'index, follow',
                },
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
                },
                {
                  key: 'X-Frame-Options',
                  value: 'DENY',
                },
                {
                  key: 'Referrer-Policy',
                  value: 'strict-origin-when-cross-origin',
                },
              ],
            },
          ]
        },
  // リダイレクト設定を一時的に無効化（Googleインデックス問題解決のため）
  async redirects() {
    return [
      // リダイレクトを無効化してGoogleクローラーの問題を解決
    ]
  },
};

export default nextConfig;
