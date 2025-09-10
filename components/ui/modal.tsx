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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-[95vw] max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-gray-50 to-white">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 truncate pr-4">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 flex-shrink-0 group"
          >
            <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        
        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
