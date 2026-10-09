"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "./language-provider";

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <span className="brand-logo"><img src="/realdeal-logo.png" alt="RealDeal" /></span>
      </Link>
      <nav>
        <Link className={pathname === "/verify" ? "active" : ""} href="/verify">{t("verify")}</Link>
        <Link className={pathname === "/issue" ? "active" : ""} href="/issue">{t("issue")}</Link>
      </nav>
      <div className="network-pill"><i /> DEVNET</div>
      <LanguageSwitcher /><WalletButton />
    </header>
  );
}
