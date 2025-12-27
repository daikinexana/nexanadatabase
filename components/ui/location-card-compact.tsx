"use client";

import Link from "next/link";
import SimpleImage from "@/components/ui/simple-image";
import { MapPin } from "lucide-react";

interface LocationCardCompactProps {
  location: {
    id: string;
    slug: string;
    country: string;
    city: string;
    description?: string | null;
    topImageUrl?: string | null;
    workspaces: Array<{
      id: string;
      name: string;
      imageUrl?: string | null;
    }>;
  };
}

export default function LocationCardCompact({ location }: LocationCardCompactProps) {
  return (
    <Link
      href={`/workspace/${location.slug}`}
      className="group relative bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200/50 cursor-pointer block active:scale-[0.97] touch-manipulation transition-all duration-300 hover:border-emerald-300/70 hover:shadow-xl hover:-translate-y-1"
    >
      {/* グラデーションアクセント（ホバー時） */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none z-0"></div>
      
      {/* 画像エリア - コンパクト */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 z-10">
        {location.topImageUrl ? (
          <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-out">
            <SimpleImage
              src={location.topImageUrl}
              alt={location.city}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
          </div>
        )}
        
        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
        
        {/* ワークスペース数バッジ - より洗練された */}
        {location.workspaces && location.workspaces.length > 0 && (
          <div className="absolute bottom-2 left-2 z-20">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold rounded-md border border-white/20 shadow-sm">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
              {location.workspaces.length}
            </span>
          </div>
        )}
      </div>
      
      {/* テキストブロック - コンパクト */}
      <div className="p-2.5 sm:p-3 bg-white relative z-10">
        <div className="text-[10px] sm:text-[11px] text-gray-500 mb-1 font-medium truncate">
          {location.country}
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
          {location.city}
        </h4>
      </div>

      {/* ホバー時のアクセントライン */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"></div>
    </Link>
  );
}
