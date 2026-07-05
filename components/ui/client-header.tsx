"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import HeaderNavLink from "./header-nav-link";
import Logo from "./logo";

const navigation = [
  { name: "コンテスト・公募・プログラム", nameEn: "Programs", href: "/opportunities" },
  { name: "ワークスペース", nameEn: "Workspace", href: "/workspace" },
  { name: "ニュース", nameEn: "News", href: "/news" },
];

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <HeaderNavLink href="/" onClick={closeMenu} isLogo={true}>
              <Logo variant="dark" />
            </HeaderNavLink>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden items-center gap-5 md:flex lg:gap-8">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <HeaderNavLink key={item.name} href={item.href}>
                  <span className="relative inline-block whitespace-nowrap">
                    {item.name}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-neutral-900 transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </span>
                </HeaderNavLink>
              );
            })}
            <a
              href="https://hp.nexanahq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="pill-ink px-5 py-2.5 text-sm"
            >
              運営会社
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>

          {/* ハンバーガー - モバイルのみ */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 md:hidden"
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* モバイル全画面メニュー（header の外に置くことで backdrop-filter の containing block を回避し、確実に viewport 全体を覆う） */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-white md:hidden">
          <nav className="flex flex-1 flex-col gap-1 px-6 pt-8">
            {navigation.map((item, i) => {
              const active = pathname === item.href;
              return (
                <HeaderNavLink
                  key={item.name}
                  href={item.href}
                  isMobile={true}
                  onClick={closeMenu}
                  className="border-b border-neutral-100"
                >
                  <div className="flex items-baseline justify-between">
                    <span className={active ? "text-neutral-900" : "text-neutral-900"}>
                      {item.name}
                    </span>
                    <span className="font-display text-xs uppercase tracking-[0.2em] text-neutral-400">
                      0{i + 1}
                    </span>
                  </div>
                  <span className="mt-0.5 block font-display text-xs uppercase tracking-[0.2em] text-neutral-400">
                    {item.nameEn}
                  </span>
                </HeaderNavLink>
              );
            })}
          </nav>
          <div className="px-6 pb-10">
            <a
              href="https://hp.nexanahq.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="pill-ink w-full px-6 py-4 text-base"
            >
              運営会社サイト
              <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
