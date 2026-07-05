'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EnhancedButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loadingText?: string;
  onClick?: () => void;
}

export default function EnhancedButton({
  href,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loadingText,
  onClick
}: EnhancedButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const baseClasses = 'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-nowrap';

  const variantClasses = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-700',
    secondary: 'bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-900'
  };

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg'
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || isPending) {
      e.preventDefault();
      return;
    }

    // 即座の視覚的フィードバック
    setIsClicked(true);
    
    // 触覚フィードバック（対応デバイスのみ）
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50msの短い振動
    }
    
    // カスタムクリック処理があれば実行
    if (onClick) {
      onClick();
    }

    setIsPending(true);
    
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
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        ${isPending ? 'cursor-wait' : ''}
        ${isClicked ? 'scale-95' : ''}
        whitespace-nowrap
        min-w-0
      `}
      aria-label={isPending ? (loadingText || '読み込み中...') : undefined}
    >
      {/* ボタンコンテンツコンテナ */}
      <div className="flex items-center justify-center flex-nowrap">
        {/* ボタンテキスト */}
        <span className={`${isPending ? 'opacity-70' : ''} whitespace-nowrap flex-shrink-0`}>
          {isPending ? (loadingText || '読み込み中...') : children}
        </span>
      </div>
      
      {/* クリック時のリップル効果 */}
      {isClicked && (
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
      )}
      
      {/* ローディング時のオーバーレイ効果 - 控えめに */}
      {isPending && (
        <div className="absolute inset-0 bg-white/5 rounded-full" />
      )}
    </Link>
  );
}
