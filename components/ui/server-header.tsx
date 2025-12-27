import Link from "next/link";

const navigation = [
  { name: "コンテスト", nameEn: "Contests", href: "/contests" },
  { name: "公募", nameEn: "Open Calls", href: "/open-calls" },
  { name: "ワークスペース", nameEn: "Workspace", href: "/workspace" },
  { name: "ニュース", nameEn: "News", href: "/news" },
];

export default function ServerHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          {/* ロゴ - iPhone対応 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nexanadata.png"
                alt="Nexana Database"
                width={240}
                height={64}
                className="h-12 sm:h-16 w-auto max-w-[180px] sm:max-w-[240px]"
                decoding="async"
                style={{ color: 'transparent' }}
              />
            </Link>
          </div>

          {/* ナビゲーション - iPhone対応 */}
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

          {/* iPhone用の簡易ナビゲーション */}
          <nav className="flex md:hidden space-x-3">
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 px-2 py-1 text-xs font-medium transition-colors duration-200"
              >
                {item.name}
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
