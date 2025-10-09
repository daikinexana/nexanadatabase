'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseLoadingButtonOptions {
  onNavigate?: () => void;
  delay?: number; // 最小表示時間（ミリ秒）
}

export function useLoadingButton(options: UseLoadingButtonOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onNavigate, delay = 500 } = options;

  const handleClick = useCallback(async (href: string) => {
    if (isLoading) return; // 重複クリック防止

    setIsLoading(true);
    
    // カスタムナビゲーション処理があれば実行
    if (onNavigate) {
      onNavigate();
    }

    try {
      // 最小表示時間を保証（UX向上のため）
      const [navigationPromise] = await Promise.allSettled([
        new Promise(resolve => setTimeout(resolve, delay)),
        router.push(href)
      ]);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // ローディング状態をリセット（実際のナビゲーション完了後）
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [isLoading, router, onNavigate, delay]);

  return {
    isLoading,
    handleClick
  };
}
