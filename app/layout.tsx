import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
  description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、ロケーション・ワークスペース情報をデータベース化。ネクサナ（nexana）が運営するスタートアップ・大企業・大学向けイノベーションデータベース。",
  keywords: "スタートアップ, スタートアップ情報, スタートアップデータベース, スタートアップコンテスト, スタートアップ支援, スタートアップ採用, スタートアップ就職, スタートアップ調達, スタートアップ調達ニュース, スタートアップM&A, 起業, 起業家, 起業したい, 起業支援, 新規事業, 新規事業担当, CEO, オープンイノベーション, オープンイノベーション情報, オープンイノベーションプラットフォーム, イノベーション, イノベーション情報, イノベーションデータベース, コンテスト, コンテスト情報, ビジネスコンテスト, ピッチコンテスト, ピッチ, ハッカソン, アクセラ, アクセラレーション, アクセラレータ, アクセラレータープログラム, プログラム, 公募, 公募情報, 募集, 募集情報, 開催, 開催情報, 調達, 調達情報, 調達ニュース, 資金調達, ファンディング, 投資, 投資情報, M&A, M&A情報, M&Aニュース, 買収, 合併, IPO, 上場, インキュベーション, インキュベーター, インキュベータープログラム, 共創, 共創プロジェクト, 協業, パートナーシップ, プラットフォーム, データベース, ネクサナ, nexana, ねくさな, ロケーション, ワークスペース, コワーキングスペース, シェアオフィス, シェアオフィス運営, ビジネスコンテスト主催, ビジネスコンテスト主催者, VC, ベンチャーキャピタル, CVC, コーポレートベンチャーキャピタル, 広域行政, 市区町村, 行政担当者, 大学, 大学担当者, ディープテック, ディープテックスタートアップ, 技術データベース, プロダクトデータベース, 企業データベース, 行政データベース, 大学データベース, 融資, 融資情報, マッチングサービス, プロジェクトマネジメント, コミュニティマネジメント, 大企業, 行政, シェアハウスオーナー, startup, startup database, startup information, startup contest, pitch contest, business competition, accelerator, acceleration program, open innovation, innovation platform, funding, venture capital, CVC, corporate venture capital, M&A, IPO, workspace, coworking space, deep tech, deep tech startup, entrepreneurship, entrepreneur, business competition organizer, startup support, innovation database",
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
    // デフォルト文字列を避け、未設定時はタグ自体を出さない
    google: process.env.GOOGLE_VERIFICATION_CODE || undefined,
  },
  alternates: {
    canonical: "https://db.nexanahq.com",
    languages: {
      'ja': 'https://db.nexanahq.com',
      'en': 'https://db.nexanahq.com',
      'x-default': 'https://db.nexanahq.com',
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    url: "https://db.nexanahq.com",
    siteName: "Nexana Database",
    title: "Nexana Database | オープンイノベーション・スタートアップ情報プラットフォーム",
    description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、ロケーション・ワークスペース情報をデータベース化。",
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
    description: "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、ロケーション・ワークスペース情報をデータベース化。",
    images: ["https://db.nexanahq.com/180logo.png"],
  },
};

// 構造化データを関数外に定義し、安全にシリアライズ
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nexana Database",
    "alternateName": [
      "Nexana Database - オープンイノベーション・スタートアップ情報プラットフォーム",
      "ネクサナデータベース",
      "nexana database",
      "スタートアップ情報プラットフォーム",
      "オープンイノベーションプラットフォーム",
      "イノベーションデータベース"
    ],
    "url": "https://db.nexanahq.com",
    "description": "スタートアップ・オープンイノベーション・イノベーション情報の総合プラットフォーム。コンテスト、ビジネスコンテスト、アクセラレーションプログラム、公募・募集・開催情報、調達・M&Aニュース、ロケーション・ワークスペース情報をデータベース化。ネクサナ（nexana）が運営するスタートアップ・大企業・大学向けイノベーションデータベース",
    "keywords": [
      "スタートアップ", "スタートアップ情報", "スタートアップデータベース", "スタートアップコンテスト", "スタートアップ支援", "スタートアップ採用", "スタートアップ就職", "スタートアップ調達",
      "オープンイノベーション", "オープンイノベーション情報", "オープンイノベーションプラットフォーム",
      "イノベーション", "イノベーション情報", "イノベーションデータベース",
      "コンテスト", "コンテスト情報", "ビジネスコンテスト", "ピッチコンテスト", "ピッチ", "ハッカソン",
      "アクセラ", "アクセラレーション", "アクセラレータ", "アクセラレータープログラム",
      "プログラム", "公募", "公募情報", "募集", "募集情報", "開催", "開催情報",
      "調達", "調達情報", "調達ニュース", "資金調達", "ファンディング", "投資", "投資情報",
      "M&A", "M&A情報", "M&Aニュース", "買収", "合併", "IPO", "上場",
      "インキュベーション", "インキュベーター", "インキュベータープログラム",
      "共創", "共創プロジェクト", "協業", "パートナーシップ",
      "プラットフォーム", "データベース",
      "ネクサナ", "nexana", "ねくさな",
      "ロケーション", "ワークスペース", "コワーキングスペース", "シェアオフィス",
      "VC", "ベンチャーキャピタル", "CVC", "コーポレートベンチャーキャピタル",
      "ディープテック", "ディープテックスタートアップ",
      "起業", "起業家", "起業したい", "起業支援",
      "新規事業", "新規事業担当", "CEO",
      "startup", "startup database", "startup information", "startup contest",
      "pitch contest", "business competition", "accelerator", "acceleration program",
      "open innovation", "innovation platform", "funding", "venture capital", "CVC",
      "corporate venture capital", "M&A", "IPO", "workspace", "coworking space",
      "deep tech", "deep tech startup", "entrepreneurship", "entrepreneur"
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Nexana HQ",
      "alternateName": ["ネクサナ", "nexana", "ねくさな"],
      "url": "https://db.nexanahq.com",
      "description": "スタートアップ・オープンイノベーション・イノベーション情報プラットフォームを運営",
      "logo": {
        "@type": "ImageObject",
        "url": "https://db.nexanahq.com/nexanadata.png"
      }
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
          "name": "ロケーション",
          "url": "https://db.nexanahq.com/workspace"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "ニュース",
          "url": "https://db.nexanahq.com/news"
        },
      ]
    },
    "inLanguage": ["ja", "en"]
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nexana HQ",
    "url": "https://db.nexanahq.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://db.nexanahq.com/nexanadata.png",
      "width": 1200,
      "height": 630
    },
    "sameAs": [
      "https://db.nexanahq.com"
    ],
    "description": "スタートアップ・オープンイノベーション・イノベーション情報プラットフォームを運営する組織"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "スタートアップコンテスト情報はどこで見られますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "スタートアップコンテスト、ビジネスコンテスト、ピッチコンテストの情報は、コンテスト一覧ページ（https://db.nexanahq.com/contests）で確認できます。エリアや主催者タイプでフィルタリングも可能です。"
        }
      },
      {
        "@type": "Question",
        "name": "オープンイノベーションの公募情報はどこで見られますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "企業や行政が募集する課題解決パートナー、協業相手の公募情報は、公募一覧ページ（https://db.nexanahq.com/open-calls）で確認できます。"
        }
      },
      {
        "@type": "Question",
        "name": "スタートアップの調達情報はどこで見られますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "スタートアップの調達情報、M&A情報、IPO情報は、ニュース一覧ページ（https://db.nexanahq.com/news）でリアルタイムに確認できます。"
        }
      },
      {
        "@type": "Question",
        "name": "ワークスペース情報はどこで見られますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "世界各国・都市のワークスペース情報は、ワークスペース一覧ページ（https://db.nexanahq.com/workspace）で確認できます。"
        }
      },
      {
        "@type": "Question",
        "name": "起業したい人向けの情報はありますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、スタートアップコンテスト、アクセラレーションプログラム、資金調達情報など、起業を検討している方に役立つ情報を幅広く提供しています。"
        }
      },
      {
        "@type": "Question",
        "name": "VCやCVCの情報はありますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "現在、VCやCVCのデータベースを準備中です。調達情報やニュースページで、VCやCVCが関与する案件の情報を確認できます。"
        }
      }
    ]
  }
];

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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2H4DNG9KGB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2H4DNG9KGB');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
  
  // Clerk認証を完全に削除したため、常にbaseHtmlを返す
  return baseHtml;
}
