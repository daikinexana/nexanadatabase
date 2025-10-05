"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "コンテスト", nameEn: "Contests", href: "/contests" },
  { name: "公募", nameEn: "Open Calls", href: "/open-calls" },
  { name: "施設", nameEn: "Facilities", href: "/facilities" },
  { name: "ニュース", nameEn: "News", href: "/news" },
  { name: "ナレッジ", nameEn: "Knowledge", href: "/knowledge" },
];

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Image
                src="/nexanadata.svg"
                alt="Nexana Database"
                width={120}
                height={32}
                className="h-6 sm:h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-colors duration-200 group"
              >
                <div className="flex flex-col items-center">
                  <span className="leading-tight">{item.name}</span>
                  <span className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                    {item.nameEn}
                  </span>
                </div>
              </Link>
            ))}
          </nav>

          {/* ハンバーガーメニューボタン - モバイルのみ */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-label="メニューを開く"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  onClick={closeMenu}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.nameEn}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
