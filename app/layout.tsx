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
  title: "Nexana Database - スタートアップ向け情報キュレーションサイト",
  description: "スタートアップ向けのコンテスト、展示会、公募、ニュース、ナレッジベースを提供する情報キュレーションサイト",
  keywords: "スタートアップ, コンテスト, 展示会, 公募, 助成金, 投資, M&A, イノベーション",
  authors: [{ name: "Nexana HQ" }],
  creator: "Nexana HQ",
  publisher: "Nexana HQ",
  icons: {
    icon: "/logofavicon.ico",
    shortcut: "/logofavicon.ico",
    apple: [
      { url: "/180logo.png", sizes: "180x180", type: "image/png" },
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
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://nexanadatabase.com",
    siteName: "Nexana Database",
    title: "Nexana Database - スタートアップ向け情報キュレーションサイト",
    description: "スタートアップ向けのコンテスト、展示会、公募、ニュース、ナレッジベースを提供する情報キュレーションサイト",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexana Database",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexana Database - スタートアップ向け情報キュレーションサイト",
    description: "スタートアップ向けのコンテスト、展示会、公募、ニュース、ナレッジベースを提供する情報キュレーションサイト",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body
          className={`${inter.variable} ${notoSansJP.variable} ${jetBrainsMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
