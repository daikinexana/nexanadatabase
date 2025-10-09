import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 画像最適化を有効化（パフォーマンス向上）
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30日間キャッシュ
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
  // リダイレクト設定（SEO改善）
  async redirects() {
    return [
      // wwwなしのドメインにリダイレクト（HTTPS強制）
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.db.nexanahq.com',
          },
        ],
        destination: 'https://db.nexanahq.com/:path*',
        permanent: true,
      },
      // HTTPからHTTPSへのリダイレクト
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://db.nexanahq.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
