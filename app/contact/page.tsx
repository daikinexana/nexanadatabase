import { redirect } from 'next/navigation';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | Nexana Database",
  description: "Nexana Databaseのお問い合わせページ",
};

export default function ContactPage() {
  // 外部のお問い合わせページにリダイレクト
  redirect('https://hp.nexanahq.com/contact');
}
