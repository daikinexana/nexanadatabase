'use client';

import { ReactNode, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
  const [isPending, startTransition] = useTransition();
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const baseClasses = 'group relative inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-nowrap';
  
  const variantClasses = {
    primary: 'bg-white text-slate-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl',
    secondary: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
  };
  
  const sizeClasses = {
    sm: 'px-6 py-3 text-base rounded-xl',
    md: 'px-8 py-4 text-lg rounded-2xl',
    lg: 'px-10 py-5 text-xl rounded-2xl'
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

    // ナビゲーション処理
    startTransition(() => {
      router.push(href);
    });

    // クリック状態をリセット（短時間後）
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
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
      <div className="flex items-center gap-3 flex-nowrap">
        {/* ローディングスピナー */}
        {isPending && (
          <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
        )}
        
        {/* ボタンテキスト */}
        <span className={`${isPending ? 'opacity-70' : ''} whitespace-nowrap flex-shrink-0`}>
          {isPending ? (loadingText || '読み込み中...') : children}
        </span>
      </div>
      
      {/* クリック時のリップル効果 */}
      {isClicked && (
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping" />
      )}
      
      {/* ローディング時のオーバーレイ効果 */}
      {isPending && (
        <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
      )}
    </Link>
  );
}
