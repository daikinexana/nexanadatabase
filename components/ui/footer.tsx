import Link from "next/link";

const navigation = {
  main: [
    { name: "ホーム", href: "/" },
    { name: "コンテスト", href: "/contests" },
    { name: "施設紹介", href: "/facilities" },
    { name: "展示会", href: "/events" },
    { name: "公募", href: "/open-calls" },
    { name: "助成金", href: "/subsidies" },
    { name: "アセット提供", href: "/asset-provisions" },
    { name: "技術情報", href: "/technologies" },
    { name: "ニュース", href: "/news" },
    { name: "ナレッジ", href: "/knowledge" },
  ],
  company: [
    { name: "運営会社", href: "https://hp.nexanahq.com/" },
    { name: "プライバシーポリシー", href: "/privacy" },
    { name: "利用規約", href: "/terms" },
    { name: "お問い合わせ", href: "/contact" },
  ],
  social: [
    {
      name: "Twitter",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-white font-semibold">Nexana Database</span>
          </div>
          <p className="text-center text-xs leading-5 text-gray-400 md:text-left">
            &copy; 2024 Nexana HQ. All rights reserved.
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
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">事業を活性化するメディア</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link
                    href="/knowledge"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    ナレッジベース
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    スタートアップニュース
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technologies"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    技術情報
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">オープンイノベーション・新規事業の基礎知識</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link
                    href="/facilities"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    支援施設
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subsidies"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    助成金・補助金
                  </Link>
                </li>
                <li>
                  <Link
                    href="/asset-provisions"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    アセット提供
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge?category=AI"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    AI・機械学習
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge?category=DEEPTECH"
                    className="text-sm leading-6 text-gray-300 hover:text-white"
                  >
                    ディープテック
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
