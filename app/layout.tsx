import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import { ClerkProvider, ClerkLoaded, ClerkLoading, ClerkFailed } from "@clerk/nextjs";
import { CustomClerkFailed } from "@/components/ui/clerk-failed";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexana Database | オープンイノベーション・スタートアップ情報プラットフォーム",
  description: "オープンイノベーション、スタートアップコンテスト、ビジネスコンテスト、ピッチコンテスト、インキュベーション施設、スタートアップ調達ニュース、大学ディープテック事業化支援の総合情報データベース。大企業、大学、行政、スタートアップ向けの包括的なサポート情報を提供。",
  keywords: "オープンイノベーション, スタートアップコンテスト, ビジネスコンテスト, ピッチコンテスト, business competition, インキュベーション施設, スタートアップ調達ニュース, 大学ディープテック, 海外展開支援, マッチングサービス, プロジェクトマネジメント, コミュニティマネージメント, スタートアップ支援, 大企業, 大学, 行政, シェアハウスオーナー",
  authors: [{ name: "Nexana HQ" }],
  creator: "Nexana HQ",
  publisher: "Nexana HQ",
  metadataBase: new URL('https://db.nexanahq.com'),
  // サブドメイン専用の設定
  icons: {
    icon: [
      { url: "/logofavicon.ico", sizes: "any" },
      { url: "/nexana-favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logofavicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",
  },
  // サブドメイン専用のcanonical URL設定
  other: {
    'canonical': 'https://db.nexanahq.com',
  },
  alternates: {
    canonical: "https://db.nexanahq.com",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://db.nexanahq.com",
    siteName: "Nexana Database",
    title: "Nexana Database | オープンイノベーション・スタートアップ情報プラットフォーム",
    description: "オープンイノベーション、スタートアップコンテスト、ビジネスコンテスト、ピッチコンテスト、インキュベーション施設、スタートアップ調達ニュース、大学ディープテック事業化支援の総合情報データベース。",
    images: [
      {
        url: "https://db.nexanahq.com/180logo.png",
        width: 1200,
        height: 630,
        alt: "Nexana Database - オープンイノベーション・スタートアップ情報プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexana Database | オープンイノベーション・スタートアップ情報プラットフォーム",
    description: "オープンイノベーション、スタートアップコンテスト、ビジネスコンテスト、ピッチコンテスト、インキュベーション施設、スタートアップ調達ニュースの総合情報データベース。",
    images: ["https://db.nexanahq.com/180logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nexana Database",
    "alternateName": "Nexana Database - オープンイノベーション・スタートアップ情報プラットフォーム",
    "url": "https://db.nexanahq.com",
    "description": "オープンイノベーション、スタートアップコンテスト、ビジネスコンテスト、ピッチコンテスト、インキュベーション施設、スタートアップ調達ニュース、大学ディープテック事業化支援の総合情報データベース",
    "publisher": {
      "@type": "Organization",
      "name": "Nexana HQ",
      "url": "https://db.nexanahq.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://db.nexanahq.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "コンテスト",
          "url": "https://db.nexanahq.com/contests"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "公募",
          "url": "https://db.nexanahq.com/open-calls"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "施設紹介",
          "url": "https://db.nexanahq.com/facilities"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "ニュース",
          "url": "https://db.nexanahq.com/news"
        },
        {
          "@type": "ListItem",
          "position": 5,
          "name": "ナレッジ",
          "url": "https://db.nexanahq.com/knowledge"
        }
      ]
    }
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      afterSignInUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
      afterSignUpUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#2563eb",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
        },
      }}
      localization={{
        locale: "ja",
      }}
      // デバッグモードを有効化（開発環境のみ）
      {...(process.env.NODE_ENV === 'development' && { 
        debug: true 
      })}
    >
      <html lang="ja">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        </head>
        <body
          className={`${inter.variable} ${notoSansJP.variable} ${jetBrainsMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          <ClerkLoaded>
            {children}
          </ClerkLoaded>
          <ClerkLoading>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            </div>
          </ClerkLoading>
          <ClerkFailed>
            <CustomClerkFailed />
          </ClerkFailed>
        </body>
      </html>
    </ClerkProvider>
  );
}
