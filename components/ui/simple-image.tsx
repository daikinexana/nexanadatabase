"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

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
    <img
      src={src}
      alt={alt}
      className={className}
      style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      onError={() => setHasError(true)}
    />
  );
}
