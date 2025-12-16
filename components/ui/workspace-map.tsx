"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type WorkspaceForMap = {
  id: string;
  name: string;
  address?: string | null;
  city: string;
  country: string;
  imageUrl?: string | null;
  isNexanaRecommended?: boolean;
};

// Google Maps型定義
type GoogleMapsMap = {
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  fitBounds: (bounds: GoogleMapsLatLngBounds, padding?: number) => void;
};

type GoogleMapsMarker = {
  setMap: (map: GoogleMapsMap | null) => void;
  addListener: (event: string, handler: () => void) => void;
};

type GoogleMapsInfoWindow = {
  open: (map: GoogleMapsMap, marker: GoogleMapsMarker) => void;
  close: () => void;
};

type GoogleMapsGeocoder = {
  geocode: (request: { address: string }) => Promise<{
    results: Array<{
      geometry: {
        location: {
          lat: () => number;
          lng: () => number;
        };
      };
    }>;
  }>;
};

type GoogleMapsLatLngBounds = {
  extend: (position: { lat: number; lng: number }) => void;
  isEmpty: () => boolean;
};

type GoogleMapsPoint = {
  x: number;
  y: number;
};

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: Record<string, unknown>) => GoogleMapsMap;
        Marker: new (options?: Record<string, unknown>) => GoogleMapsMarker;
        InfoWindow: new (options?: Record<string, unknown>) => GoogleMapsInfoWindow;
        Geocoder: new () => GoogleMapsGeocoder;
        LatLngBounds: new () => GoogleMapsLatLngBounds;
        Point: new (x: number, y: number) => GoogleMapsPoint;
        Animation: {
          DROP: unknown;
        };
      };
    };
  }
}

const DEFAULT_CENTER = { lat: 35.681236, lng: 139.767125 }; // 東京駅付近

function buildQueryAddress(ws: WorkspaceForMap) {
  const parts = [ws.name, ws.address, ws.city, ws.country].filter(Boolean);
  return parts.join(" ");
}

interface WorkspaceMapProps {
  workspaces: WorkspaceForMap[];
  onMarkerClick?: (workspaceId: string) => void;
}

export default function WorkspaceMap({ workspaces, onMarkerClick }: WorkspaceMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<GoogleMapsMap | null>(null);
  const markersRef = useRef<GoogleMapsMarker[]>([]);
  const infoWindowsRef = useRef<GoogleMapsInfoWindow[]>([]);
  const geocoderRef = useRef<GoogleMapsGeocoder | null>(null);
  const cacheRef = useRef<Record<string, { lat: number; lng: number }>>({});
  const hasInitializedRef = useRef<boolean>(false);
  const [mapsReady, setMapsReady] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 初期ロードチェック
  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps) {
      setMapsReady(true);
    }
  }, []);

  // マップ初期化
  useEffect(() => {
    if (!mapsReady || !mapRef.current || !window.google?.maps) return;
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [mapsReady]);

  // マーカー更新（フィルタリングに連動）
  useEffect(() => {
    if (!mapsReady || !mapInstanceRef.current || !geocoderRef.current) return;

    // 既存マーカーとInfoWindowをクリア
    markersRef.current.forEach((m) => m.setMap(null));
    infoWindowsRef.current.forEach((iw) => iw.close());
    markersRef.current = [];
    infoWindowsRef.current = [];

    // フィルタリング後のワークスペースが空の場合は何も表示しない
    if (!workspaces || workspaces.length === 0) {
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    const tasks = (workspaces || []).map(async (ws) => {
      const cacheHit = cacheRef.current[ws.id];
      let position;
      
      if (cacheHit) {
        position = cacheHit;
      } else {
        const query = buildQueryAddress(ws);
        if (!query || !geocoderRef.current) return;

        try {
          const result = await geocoderRef.current.geocode({ address: query });
          const loc = result?.results?.[0]?.geometry?.location;
          if (!loc) return;
          position = { lat: loc.lat(), lng: loc.lng() };
          cacheRef.current[ws.id] = position;
        } catch (error) {
          console.error("Geocode failed", ws.name, error);
          return;
        }
      }

      // マーカー作成（視認性の高い鮮やかなデザイン）
      const fillColor = ws.isNexanaRecommended ? "#f59e0b" : "#ef4444"; // amber-500（Best 3・オレンジ） or red-500（通常・赤）
      const strokeColor = "#ffffff"; // 白い縁取り
  
      // より大きく見やすいピン型SVGパス
      const pinPath = "M12 0C8.13 0 5 3.13 5 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";
      
      const markerIcon = {
        path: pinPath,
        fillColor: fillColor,
        fillOpacity: 1,
        strokeColor: strokeColor,
        strokeWeight: 3, // 太い白い縁取り
        scale: 1.6, // より大きく
        anchor: new window.google.maps.Point(12, 20),
      };

      const marker = new window.google.maps.Marker({
        map: mapInstanceRef.current,
        position,
        title: ws.name,
        icon: markerIcon,
      });

      // InfoWindow作成（コンパクトでスクロール不要なデザイン）
      const imageHtml = ws.imageUrl 
        ? `<div style="width: 100%; height: 80px; overflow: hidden; border-radius: 6px 6px 0 0; margin: -10px -10px 6px -10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <img src="${ws.imageUrl}" alt="${ws.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)';" />
          </div>`
        : `<div style="width: 100%; height: 80px; border-radius: 6px 6px 0 0; margin: -10px -10px 6px -10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;">
            <svg style="width: 32px; height: 32px; color: white; opacity: 0.7;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="width: 240px; max-width: 80vw; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: visible;">
            ${imageHtml}
            <div style="padding: 0 10px 10px 10px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #111827; line-height: 1.2; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${ws.name}</h3>
              ${ws.address ? `<div style="display: flex; align-items: start; gap: 4px; margin-bottom: 8px;">
                <svg style="width: 12px; height: 12px; color: #6b7280; margin-top: 1px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p style="margin: 0; font-size: 10px; color: #6b7280; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">${ws.address}</p>
              </div>` : ''}
              <button 
                id="info-window-btn-${ws.id}" 
                style="
                  width: 100%; 
                  padding: 8px 12px; 
                  background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                  color: white; 
                  border: none; 
                  border-radius: 6px; 
                  cursor: pointer; 
                  font-size: 11px; 
                  font-weight: 600; 
                  letter-spacing: 0.01em;
                  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
                  transition: all 0.2s ease;
                  margin-top: 0;
                "
                onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 10px rgba(16, 185, 129, 0.4)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(16, 185, 129, 0.3)';"
              >
                詳細を見る →
              </button>
            </div>
          </div>
        `,
        maxWidth: 260,
      });

      // マーカークリック時のイベント
      marker.addListener("click", () => {
        if (!mapInstanceRef.current) return;
        // 他のInfoWindowを閉じる
        infoWindowsRef.current.forEach((iw) => iw.close());
        // このInfoWindowを開く（マップの位置やズームは変更しない）
        infoWindow.open(mapInstanceRef.current, marker);
        
        // 詳細ボタンのクリックイベントを設定
        setTimeout(() => {
          const btn = document.getElementById(`info-window-btn-${ws.id}`);
          if (btn) {
            // 既存のイベントリスナーを削除してから追加
            const newBtn = btn.cloneNode(true);
            btn.parentNode?.replaceChild(newBtn, btn);
            newBtn.addEventListener("click", () => {
              if (onMarkerClick) {
                onMarkerClick(ws.id);
                infoWindow.close();
              }
            });
          }
        }, 100);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
      bounds.extend(position);
    });

    Promise.all(tasks).then(() => {
      if (!mapInstanceRef.current) return;
      
      if (!markersRef.current.length) {
        if (!hasInitializedRef.current) {
          mapInstanceRef.current.setCenter(DEFAULT_CENTER);
          mapInstanceRef.current.setZoom(12);
          hasInitializedRef.current = true;
        }
      } else if (!bounds.isEmpty()) {
        // 初回表示時のみfitBoundsを実行し、それ以降はユーザーの操作を維持
        if (!hasInitializedRef.current) {
          mapInstanceRef.current.fitBounds(bounds, 80);
          hasInitializedRef.current = true;
        }
        // フィルタリングでマーカーが変更されても、ユーザーのズーム/位置を維持
      }
    });
  }, [mapsReady, workspaces, onMarkerClick]);

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-700">
        <p className="font-semibold mb-2">Google Maps APIキーが未設定です。</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-600">
          <li>.env.local に <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=&lt;YOUR_KEY&gt;</code> を追加</li>
          <li>開発サーバーを再起動</li>
          <li>このページを再読み込み</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white/70 backdrop-blur shadow-sm overflow-hidden relative">
      {/* Scriptロード */}
      {!mapsReady && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setMapsReady(true)}
        />
      )}
      <div className="h-[360px] md:h-[420px]" ref={mapRef} />
      
      {/* ピンの説明（凡例） */}
      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm p-2 text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <svg width="16" height="20" viewBox="0 0 24 20" className="flex-shrink-0">
              <path
                d="M12 0C8.13 0 5 3.13 5 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
            <span className="text-gray-700 font-medium">nexana Best 3</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="20" viewBox="0 0 24 20" className="flex-shrink-0">
              <path
                d="M12 0C8.13 0 5 3.13 5 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </svg>
            <span className="text-gray-700 font-medium">通常</span>
          </div>
        </div>
      </div>
    </div>
  );
}

