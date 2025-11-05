import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、インキュベーション施設をデータベース化。ネクサナ（nexana）が運営するスタートアップ・大企業・大学向けイノベーションデータベース。",
  keywords: "スタートアップ, オープンイノベーション, イノベーション, コンテスト, ビジネスコンテスト, アクセラ, アクセラレーション, プログラム, 公募, 募集, 開催, 調達, M&A, インキュベーション, プラットフォーム, データベース, ネクサナ, nexana, ねくさな, スタートアップコンテスト, ピッチコンテスト, business competition, インキュベーション施設, スタートアップ調達ニュース, 大学ディープテック, 海外展開支援, マッチングサービス, プロジェクトマネジメント, コミュニティマネージメント, スタートアップ支援, 大企業, 大学, 行政, シェアハウスオーナー",
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
    description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、インキュベーション施設をデータベース化。",
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
    description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、インキュベーション施設をデータベース化。",
    images: ["https://db.nexanahq.com/180logo.png"],
  },
};

// 構造化データを関数外に定義し、安全にシリアライズ
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nexana Database",
  "alternateName": ["Nexana Database - オープンイノベーション・スタートアップ情報プラットフォーム", "ネクサナデータベース", "nexana database"],
  "url": "https://db.nexanahq.com",
  "description": "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、インキュベーション施設をデータベース化。ネクサナ（nexana）が運営するスタートアップ・大企業・大学向けイノベーションデータベース",
  "keywords": ["スタートアップ", "オープンイノベーション", "イノベーション", "コンテスト", "ビジネスコンテスト", "アクセラ", "アクセラレーション", "プログラム", "公募", "募集", "開催", "調達", "M&A", "インキュベーション", "プラットフォーム", "データベース", "ネクサナ", "nexana", "ねくさな"],
  "publisher": {
    "@type": "Organization",
    "name": "Nexana HQ",
    "alternateName": ["ネクサナ", "nexana", "ねくさな"],
    "url": "https://db.nexanahq.com",
    "description": "スタートアップ・オープンイノベーション・イノベーション情報プラットフォームを運営"
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

// 安全にJSON-LDを文字列化する関数
function getStructuredDataScript(): string {
  try {
    // JSON.stringifyは自動的に適切なエスケープを行います
    return JSON.stringify(structuredData);
  } catch (error) {
    console.error("Error stringifying structured data:", error);
    return "{}";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 構造化データを有効化（SEO最適化のため）
  const enableStructuredData = true;
  const structuredDataScript = enableStructuredData ? getStructuredDataScript() : null;

  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // サーバーサイドでUser-Agentをチェック（Googlebot検出）
  // headers()を使って、middleware.tsで設定したX-Is-Googlebotヘッダーを確認
  let isGooglebot = false;
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    const isGooglebotHeader = headersList.get('x-is-googlebot');
    isGooglebot = isGooglebotHeader === 'true';
    
    // フォールバック: User-Agentを直接チェック
    if (!isGooglebot) {
      const userAgent = headersList.get('user-agent') || '';
      const ua = userAgent.toLowerCase();
      isGooglebot = (
        ua.includes('googlebot') ||
        ua.includes('google-inspectiontool') ||
        ua.includes('mediapartners-google') ||
        ua.includes('apis-google') ||
        ua.includes('feedfetcher-google')
      );
    }
  } catch (error) {
    // headers()が利用できない場合は通常ユーザーとして扱う
    console.warn('Could not check User-Agent:', error);
  }
  
  // 基本的なHTML構造（ClerkProviderなしでも動作）
  const baseHtml = (
    <html lang="ja">
      <head>
        {structuredDataScript && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: structuredDataScript,
            }}
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${notoSansJP.variable} ${jetBrainsMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
  
  // Googlebotの場合は、ClerkProviderを使わずに直接レンダリング
  // これによりクライアントサイドでのリダイレクトを完全に防ぐ
  if (isGooglebot) {
    return baseHtml;
  }
  
  // Clerkの環境変数が設定されていない場合も直接レンダリング
  if (!clerkPublishableKey) {
    console.warn("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. Running without authentication.");
    return baseHtml;
  }

  // Clerkのリダイレクト設定
  const signInFallbackRedirectUrl = 
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || 
    process.env.NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL || 
    '/';
  const signUpFallbackRedirectUrl = 
    process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || 
    process.env.NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL || 
    '/';

  // 通常ユーザーの場合のみClerkProviderを使用
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
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
    >
      {baseHtml}
    </ClerkProvider>
  );
}
