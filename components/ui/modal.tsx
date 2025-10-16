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
      {/* オーバーレイ - 洗練された黒背景 */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ - 白・黒・グレー基調の洗練されたデザイン */}
      <div className="relative bg-white shadow-2xl w-full max-w-6xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-500 border border-gray-200 rounded-lg">
        {/* ヘッダー - 洗練された白・黒・グレーデザイン */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 bg-white">
          {title && (
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              {/* コンテストカードと同じアイコン */}
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight break-words overflow-wrap-anywhere">{title}</h2>
            </div>
          )}
          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            {/* 共有オプション */}
            {shareOptions}
            
            {/* 閉じるボタン - 洗練されたグレーデザイン */}
            <button
              onClick={onClose}
              className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-shrink-0 group"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
        
        {/* コンテンツ - 洗練された白背景 */}
        <div className="flex-1 overflow-y-auto bg-white">
          {children}
        </div>
        
        {/* フッター - 洗練された白・黒・グレーボタン */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="group flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
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
