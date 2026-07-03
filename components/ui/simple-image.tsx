"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}

export default function SimpleImage({ 
  src, 
  alt, 
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  loading,
  style
}: SimpleImageProps) {
  const [hasError, setHasError] = useState(false);

  // srcの末尾のスペースや制御文字を削除
  const cleanSrc = src?.trimEnd() || "";

  if (hasError || !cleanSrc) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <p className="text-xs">画像なし</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={cleanSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      loading={loading || (priority ? "eager" : "lazy")}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      // Vercelの画像最適化(/_next/image)はカタログ全1000枚超の変換で
      // クォータ上限に達し402を返す→「画像なし」表示になる。元画像(S3のwebp/jpg等)は
      // 既に軽量なので最適化を経由せず直接配信し、確実に表示されるようにする。
      unoptimized
    />
  );
}
