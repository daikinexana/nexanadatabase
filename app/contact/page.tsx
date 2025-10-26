import { redirect } from 'next/navigation';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | Nexana Database",
  description: "Nexana Databaseのお問い合わせページ",
  keywords: "お問い合わせ, サポート, ヘルプ, 連絡先",
  openGraph: {
    title: "お問い合わせ | Nexana Database",
    description: "Nexana Databaseのお問い合わせページ",
    type: "website",
  },
};

export default function ContactPage() {
  // 外部のお問い合わせページにリダイレクト
  redirect('https://hp.nexanahq.com/contact');
}
