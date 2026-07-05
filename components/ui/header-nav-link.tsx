'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface HeaderNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isMobile?: boolean;
  isLogo?: boolean;
}

export default function HeaderNavLink({
  href,
  children,
  className = '',
  onClick,
  isMobile = false,
  isLogo = false
}: HeaderNavLinkProps) {
  const [isPending, setIsPending] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    // 同じページへのナビゲーションを防ぐ
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    if (isPending) {
      e.preventDefault();
      return;
    }

    // 即座の視覚的フィードバック
    setIsClicked(true);
    setIsPending(true);
    
    // 触覚フィードバック（対応デバイスのみ）
    if ('vibrate' in navigator) {
      navigator.vibrate(30); // 30msの短い振動
    }
    
    // カスタムクリック処理があれば実行
    if (onClick) {
      onClick();
    }
    
    // ローディング状態をリセット（短時間後）
    setTimeout(() => {
      setIsPending(false);
      setIsClicked(false);
    }, 300);
  };

  const isActive = pathname === href;
  const baseClasses = isMobile
    ? 'block py-3 text-2xl font-semibold tracking-tight text-neutral-900 transition-colors duration-200 relative'
    : `px-1 py-2 text-sm font-medium tracking-tight transition-colors duration-200 group relative ${
        isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
      }`;

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
      {/* ローディングスピナー - ロゴの場合は表示しない */}
      {isPending && !isLogo && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg">
          <Loader2 className="h-4 w-4 text-neutral-900 animate-spin" />
        </div>
      )}

      {/* コンテンツ */}
      <div className={isPending && !isLogo ? 'opacity-50' : ''}>
        {children}
      </div>
    </Link>
  );
}
