"use client";

import { useState } from "react";
import Image from "next/image";

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function SimpleImage({ 
  src, 
  alt, 
  className = "",
  fill = false,
  width,
  height,
  priority = false
}: SimpleImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // URLのトリム処理
  const trimmedSrc = src?.trim();

  // 無効なURLの場合は即座にエラー状態にする
  // Base64形式の画像も許可する
  const isValidUrl = trimmedSrc && 
    (trimmedSrc.startsWith('http') || 
     trimmedSrc.startsWith('data:image/') ||
     trimmedSrc.startsWith('/'));
  
  if (!isValidUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <p className="text-xs">画像なし</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <p className="text-xs">画像なし</p>
        </div>
      </div>
    );
  }

  // Base64形式の場合は常にunoptimizedを使用
  const isBase64 = trimmedSrc.startsWith('data:image/');
  
  return (
    <Image
      src={trimmedSrc}
      alt={alt}
      className={className}
      {...(fill ? { fill: true } : { width, height })}
      loading={priority ? "eager" : "lazy"}
      onError={() => {
        console.log('Image load error for:', trimmedSrc.substring(0, 50) + '...');
        setHasError(true);
        setIsLoading(false);
      }}
      onLoad={() => {
        console.log('Image loaded successfully:', trimmedSrc.substring(0, 50) + '...');
        setIsLoading(false);
      }}
      unoptimized={true}
      style={{ display: hasError ? 'none' : 'block' }}
    />
  );
}
