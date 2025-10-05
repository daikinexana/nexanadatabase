import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "コンテスト", nameEn: "Contests", href: "/contests" },
  { name: "公募", nameEn: "Open Calls", href: "/open-calls" },
  { name: "施設", nameEn: "Facilities", href: "/facilities" },
  { name: "ニュース", nameEn: "News", href: "/news" },
  { name: "ナレッジ", nameEn: "Knowledge", href: "/knowledge" },
];

export default function ServerHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/nexanadata.svg"
                alt="Nexana Database"
                width={120}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 group"
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

          {/* 右側のアクション - ログイン・登録ボタンを削除 */}
          <div className="flex items-center">
            {/* 将来の機能拡張用のスペース */}
          </div>
        </div>
      </div>
    </header>
  );
}
