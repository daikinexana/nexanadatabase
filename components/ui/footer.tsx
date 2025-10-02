import Link from "next/link";
import Image from "next/image";

const navigation = {
  main: [
    { name: "ホーム", nameEn: "Home", href: "/" },
    { name: "コンテスト", nameEn: "Contests", href: "/contests" },
    { name: "施設紹介", nameEn: "Facilities", href: "/facilities" },
    { name: "公募", nameEn: "Open Calls", href: "/open-calls" },
    { name: "ニュース", nameEn: "News", href: "/news" },
    { name: "ナレッジ", nameEn: "Knowledge", href: "/knowledge" },
  ],
  company: [
    { name: "運営会社", nameEn: "Company", href: "https://hp.nexanahq.com/" },
    { name: "プライバシーポリシー", nameEn: "Privacy Policy", href: "/privacy" },
    { name: "利用規約", nameEn: "Terms of Service", href: "/terms" },
    { name: "お問い合わせ", nameEn: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div>
          <div className="flex items-center justify-center md:justify-start mb-4">
            <Image
              src="/nexanadataw.svg"
              alt="Nexana Database"
              width={150}
              height={45}
              className="h-8 w-auto"
            />
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
              <h3 className="text-sm font-semibold leading-6 text-white">
                サービス
                <span className="block text-xs text-gray-400 font-normal">Services</span>
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white block"
                    >
                      <span className="block">{item.name}</span>
                      <span className="block text-xs text-gray-500">{item.nameEn}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">
                会社情報
                <span className="block text-xs text-gray-400 font-normal">Company</span>
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white block"
                    >
                      <span className="block">{item.name}</span>
                      <span className="block text-xs text-gray-500">{item.nameEn}</span>
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
