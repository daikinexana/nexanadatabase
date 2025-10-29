'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface EnhancedCardButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  loadingText?: string;
  onClick?: () => void;
}

export default function EnhancedCardButton({
  href,
  children,
  className = '',
  disabled = false,
  loadingText,
  onClick
}: EnhancedCardButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isPending) {
      e.preventDefault();
      return;
    }

    // 即座の視覚的フィードバック
    setIsClicked(true);
    setIsPending(true);
    
    // 触覚フィードバック（対応デバイスのみ）
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50msの短い振動
    }
    
    // カスタムクリック処理があれば実行
    if (onClick) {
      onClick();
    }

    // ナビゲーション処理
    router.push(href);

    // ローディング状態をリセット（短時間後）
    setTimeout(() => {
      setIsPending(false);
      setIsClicked(false);
    }, 300);
  };


  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        group relative w-full text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
        ${isPending ? 'cursor-wait' : ''}
        ${isClicked ? 'scale-[0.98]' : ''}
        whitespace-nowrap
        flex-nowrap
      `}
      aria-label={isPending ? (loadingText || '読み込み中...') : undefined}
    >
      {/* ローディングオーバーレイ */}
      {isPending && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">{loadingText || '読み込み中...'}</span>
          </div>
        </div>
      )}
      
      {/* クリック時のリップル効果 */}
      {isClicked && (
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping z-5" />
      )}
      
      {/* カードコンテンツ */}
      <div className={isPending ? 'opacity-50' : ''}>
        {children}
      </div>
    </Link>
  );
}
