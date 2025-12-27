"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "ホーム", nameEn: "Home", href: "/" },
  { name: "コンテスト", nameEn: "Contests", href: "/contests" },
  { name: "公募", nameEn: "Open Calls", href: "/open-calls" },
  { name: "ワークスペース", nameEn: "Workspace", href: "/workspace" },
  { name: "ニュース", nameEn: "News", href: "/news" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-8">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nexanadata.png"
                alt="Nexana Database"
                width={400}
                height={120}
                className="h-24 w-auto max-w-[300px] object-contain"
                decoding="async"
                style={{ color: 'transparent', aspectRatio: '400/120' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                <span className="block">{item.name}</span>
                <span className="block text-xs text-gray-500 font-normal">{item.nameEn}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">メニューを開く</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:bg-gray-50 ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="block">{item.name}</span>
                  <span className="block text-sm text-gray-500 font-normal">{item.nameEn}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
