import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "./logo";

const navigation = {
  services: [
    { name: "ホーム", nameEn: "Home", href: "/" },
    { name: "コンテスト・公募・プログラム", nameEn: "Programs", href: "/opportunities" },
    { name: "ワークスペース", nameEn: "Workspace", href: "/workspace" },
    { name: "ニュース", nameEn: "News", href: "/news" },
  ],
  company: [
    { name: "運営会社", nameEn: "Company", href: "https://hp.nexanahq.com/", external: true },
    { name: "お問い合わせ", nameEn: "Contact", href: "/contact" },
    { name: "プライバシーポリシー", nameEn: "Privacy", href: "/privacy" },
    { name: "利用規約", nameEn: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* 上部：大きなステートメント */}
        <div className="grid gap-12 border-b border-white/10 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow !text-neutral-500">KYOSO BASE（共創ベース）</p>
            <h2 className="display mt-5 text-3xl text-white sm:text-5xl">
              挑戦者を、
              <br />
              情報で支える。
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-400">
              KYOSO BASE（キョウソウベース）は、nexana（ネクサナ）が運営する「共創（きょうそう・協創）」から生まれたプラットフォーム。
              コンテスト・公募・プログラム、ワークスペース、ニュースを一箇所に。
              挑戦する人のためのKYOSO（共創）データベースです。
            </p>
          </div>

          {/* リンク列 */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500">
                Services
              </h3>
              <ul className="mt-6 space-y-4">
                {navigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-baseline gap-1 text-[15px] font-medium text-neutral-200 transition-colors hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500">
                Company
              </h3>
              <ul className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-1 text-[15px] font-medium text-neutral-200 transition-colors hover:text-white"
                    >
                      {item.name}
                      {item.external && (
                        <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500 transition-colors group-hover:text-white" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 下部：ロゴ + Powered by nexana */}
        <div className="flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-end">
          <Logo variant="light" className="[&_.font-display]:text-2xl" />

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <a
              href="https://hp.nexanahq.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 transition-opacity hover:opacity-80"
            >
              <span className="font-display text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Powered by
              </span>
              <span className="font-display text-base font-semibold tracking-tight text-white">
                nexana
              </span>
            </a>
            <p className="font-display text-xs tracking-wide text-neutral-500">
              &copy; {new Date().getFullYear()} nexana inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
