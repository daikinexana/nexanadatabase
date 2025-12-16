"use client";

import Link from "next/link";
import SimpleImage from "@/components/ui/simple-image";
import { MapPin } from "lucide-react";

interface LocationCardProps {
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

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <Link
      href={`/location/${location.slug}`}
      className="group relative bg-white/90 backdrop-blur-xl rounded-[32px] overflow-hidden border border-gray-200/50 cursor-pointer block"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 32px 64px rgba(16,185,129,0.15), 0 16px 32px rgba(6,182,212,0.1)';
        e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
      }}
    >
      {/* グラデーションアクセント（左上） */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-10"></div>
      
      {/* 画像エリア */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {location.topImageUrl ? (
          <div className="absolute inset-0 group-hover:scale-125 transition-transform duration-[1000ms] ease-out">
            <SimpleImage
              src={location.topImageUrl}
              alt={location.city}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        {/* 動的なグラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-teal-500/0 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all duration-700"></div>
        
        {/* 上部説明文（日本語、中央上部） */}
        {location.description && (
          <div className="absolute top-6 left-0 right-0 text-center z-20">
            <p className="text-white text-sm md:text-base font-bold leading-relaxed px-4" style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.5)'
            }}>
              {location.description}
            </p>
          </div>
        )}
        
        {/* メインタイトル（Slug、中央上部寄り、大きく太字） */}
        <div className="absolute inset-0 flex items-start justify-center pt-12 md:pt-16 z-20">
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight text-center px-4" style={{
            textShadow: '0 4px 40px rgba(0,0,0,0.5), 0 2px 20px rgba(0,0,0,0.4)'
          }}>
            {location.slug}
          </h3>
        </div>
        
        {/* タグ（左下） */}
        {location.workspaces && location.workspaces.length > 0 && (
          <div className="absolute bottom-6 left-6 z-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              {location.workspaces.length} Workspaces
            </span>
          </div>
        )}
      </div>
      
      {/* テキストブロック */}
      <div className="bg-white px-6 md:px-8 py-6 md:py-8 relative">
        {/* 詳細情報 */}
        <div className="text-sm text-gray-500 mb-3 font-light">
          {location.country}
        </div>
        
        {/* タイトル（都市名） */}
        <h4 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-emerald-700 to-gray-900 group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-cyan-600 transition-all duration-500">
          {location.city}
        </h4>
      </div>

      {/* ホバー時のグラデーションライン */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 via-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
      
      {/* グロー効果 */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/5 group-hover:via-teal-500/5 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none"></div>
    </Link>
  );
}
