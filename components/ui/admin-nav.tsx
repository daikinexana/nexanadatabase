"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Trophy, 
  Handshake, 
  Newspaper, 
  MapPin,
  Briefcase
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
  }
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h2 className="text-sm font-medium text-gray-500 mb-4">管理ページ</h2>
          <nav className="flex flex-wrap gap-2">
            {adminPages.map((page) => {
              const Icon = page.icon;
              const isActive = pathname === page.href;
              
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
