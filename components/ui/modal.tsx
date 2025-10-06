"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  shareOptions?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children, title, shareOptions }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* オーバーレイ - iPhone 16対応 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ - iPhone 16専用デザイン */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-500 border border-white/20">
        {/* ヘッダー - iPhone 16風 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100/50 flex-shrink-0 bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-4 leading-tight">{title}</h2>
          )}
          <div className="flex items-center space-x-2">
            {/* 共有オプション */}
            {shareOptions}
            
            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-300 flex-shrink-0 group backdrop-blur-sm"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
        
        {/* コンテンツ - iPhone 16最適化 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </div>
        
        {/* フッター - 閉じるボタン付き */}
        <div className="flex-shrink-0 border-t border-gray-100/50 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium text-sm sm:text-base">閉じる</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
