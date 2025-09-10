"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export default function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  className = "",
  width,
  height 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
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
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      unoptimized={true} // 外部画像の最適化を無効化
    />
  );
}
