'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-300">500</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">サーバーエラーが発生しました</h2>
          <p className="text-gray-600 mb-8">
            申し訳ございません。サーバーでエラーが発生しました。
            <br />
            しばらく時間をおいてから再度お試しください。
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors mr-4"
          >
            再試行
          </button>
          
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>問題が解決しない場合は、お問い合わせください。</p>
          <Link href="/contact" className="text-blue-600 hover:underline">
            お問い合わせページ
          </Link>
        </div>
      </div>
    </div>
  );
}
