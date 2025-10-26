import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "ページが見つかりません | Nexana Database",
  description: "お探しのページが見つかりませんでした。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ページが見つかりません</h2>
          <p className="text-gray-600 mb-8">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>または、以下のページからお探しください：</p>
            <div className="mt-4 space-x-4">
              <Link href="/contests" className="text-blue-600 hover:underline">コンテスト</Link>
              <Link href="/events" className="text-blue-600 hover:underline">イベント</Link>
              <Link href="/facilities" className="text-blue-600 hover:underline">施設</Link>
              <Link href="/news" className="text-blue-600 hover:underline">ニュース</Link>
              <Link href="/knowledge" className="text-blue-600 hover:underline">ナレッジ</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
