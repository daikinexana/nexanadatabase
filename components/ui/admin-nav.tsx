"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, 
  Handshake, 
  Newspaper, 
  MapPin,
  Briefcase,
  Rocket
} from "lucide-react";

const adminPages = [
  {
    name: "コンテスト",
    href: "/admin/contests",
    icon: Trophy,
    description: "コンテスト情報の管理"
  },
  {
    name: "公募",
    href: "/admin/open-calls",
    icon: Handshake,
    description: "公募情報の管理"
  },
  {
    name: "ニュース",
    href: "/admin/news",
    icon: Newspaper,
    description: "ニュース情報の管理"
  },
  {
    name: "ロケーション",
    href: "/admin/location",
    icon: MapPin,
    description: "ロケーション情報の管理"
  },
  {
    name: "ワークスペース",
    href: "/admin/workspace",
    icon: Briefcase,
    description: "ワークスペース情報の管理"
  },
  {
    name: "スタートアップボード",
    href: "/admin/startup-boards",
    icon: Rocket,
    description: "スタートアップボード情報の管理"
  }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-3.5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            管理ページ
          </h2>
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
            {adminPages.map((page) => {
              const Icon = page.icon;
              const isActive = pathname === page.href;

              return (
                <Link
                  key={page.href}
                  href={page.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex min-h-[40px] shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                    isActive
                      ? "border border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                      : "border border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  title={page.description}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{page.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
