import Link from "next/link";

const navigation = {
  main: [
    { name: "ホーム", href: "/" },
    { name: "コンテスト", href: "/contests" },
    { name: "施設紹介", href: "/facilities" },
    { name: "展示会", href: "/events" },
    { name: "公募", href: "/open-calls" },
    { name: "ニュース", href: "/news" },
    { name: "ナレッジ", href: "/knowledge" },
  ],
  company: [
    { name: "運営会社", href: "https://hp.nexanahq.com/" },
    { name: "プライバシーポリシー", href: "/privacy" },
    { name: "利用規約", href: "/terms" },
    { name: "お問い合わせ", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-white font-semibold">Nexana Database</span>
          </div>
          <p className="text-center text-xs leading-5 text-gray-400 md:text-left">
            &copy; 2025 nexana inc. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* 下部ナビゲーション */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">サービス</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">会社情報</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
