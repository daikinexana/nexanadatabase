'use client';

import { ReactNode } from 'react';
import { useLoadingButton } from '@/hooks/use-loading-button';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onNavigate?: () => void;
  loadingText?: string;
}

export default function LoadingButton({
  href,
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onNavigate,
  loadingText
}: LoadingButtonProps) {
  const { isLoading, handleClick } = useLoadingButton({ onNavigate });

  const baseClasses = 'group relative inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-white text-slate-900 hover:bg-gray-100 shadow-2xl hover:shadow-3xl',
    secondary: 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
  };
  
  const sizeClasses = {
    sm: 'px-6 py-3 text-base rounded-xl',
    md: 'px-8 py-4 text-lg rounded-2xl',
    lg: 'px-10 py-5 text-xl rounded-2xl'
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={() => handleClick(href)}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        ${isLoading ? 'cursor-wait' : ''}
      `}
      aria-label={isLoading ? (loadingText || '読み込み中...') : undefined}
    >
      {/* ローディングスピナー */}
      {isLoading && (
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
      )}
      
      {/* ボタンテキスト */}
      <span className={isLoading ? 'opacity-70' : ''}>
        {isLoading ? (loadingText || '読み込み中...') : children}
      </span>
      
      {/* ローディング時のオーバーレイ効果 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
      )}
    </button>
  );
}
