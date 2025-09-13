"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
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
      className={className}
      {...(fill ? { fill: true } : { width, height })}
      loading={priority ? "eager" : "lazy"}
      onError={() => setHasError(true)}
    />
  );
}
