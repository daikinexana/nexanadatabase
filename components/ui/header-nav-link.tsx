'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface HeaderNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isMobile?: boolean;
}

export default function HeaderNavLink({
  href,
  children,
  className = '',
  onClick,
  isMobile = false
}: HeaderNavLinkProps) {
  const [isPending, startTransition] = useTransition();
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (isPending) {
      e.preventDefault();
      return;
    }

    // 即座の視覚的フィードバック
    setIsClicked(true);
    
    // 触覚フィードバック（対応デバイスのみ）
    if ('vibrate' in navigator) {
      navigator.vibrate(30); // 30msの短い振動
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
    }, 150);
  };

  const baseClasses = isMobile 
    ? 'block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 relative'
    : 'text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-all duration-200 group relative';

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        ${baseClasses}
        ${className}
        ${isPending ? 'cursor-wait' : ''}
        ${isClicked ? (isMobile ? 'scale-95' : 'scale-95') : ''}
      `}
      aria-label={isPending ? '読み込み中...' : undefined}
    >
      {/* ローディングスピナー */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        </div>
      )}
      
      {/* クリック時のリップル効果 */}
      {isClicked && (
        <div className="absolute inset-0 bg-blue-100/50 rounded-lg animate-ping" />
      )}
      
      {/* コンテンツ */}
      <div className={isPending ? 'opacity-50' : ''}>
        {children}
      </div>
    </Link>
  );
}
