'use client';

import { ReactNode } from 'react';
import { useLoadingButton } from '@/hooks/use-loading-button';
import { Loader2 } from 'lucide-react';

interface LoadingCardButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onNavigate?: () => void;
  loadingText?: string;
}

export default function LoadingCardButton({
  href,
  children,
  className = '',
  disabled = false,
  onNavigate,
  loadingText
}: LoadingCardButtonProps) {
  const { isLoading, handleClick } = useLoadingButton({ onNavigate });

  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={() => handleClick(href)}
      disabled={isDisabled}
      className={`
        group relative w-full text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
        ${isLoading ? 'cursor-wait' : ''}
      `}
      aria-label={isLoading ? (loadingText || '読み込み中...') : undefined}
    >
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">{loadingText || '読み込み中...'}</span>
          </div>
        </div>
      )}
      
      {/* カードコンテンツ */}
      <div className={isLoading ? 'opacity-50' : ''}>
        {children}
      </div>
    </button>
  );
}
