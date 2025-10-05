"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
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
          <button
            onClick={onClose}
            className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-all duration-300 flex-shrink-0 group backdrop-blur-sm"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* コンテンツ - iPhone 16最適化 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}
