import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { WalletProvider } from "@/components/wallet-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "RealDeal — verify what is real",
  description: "Проверка подлинности сертификатов в Solana",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <LanguageProvider><WalletProvider>
          <Header />
          <main>{children}</main>
          <SiteFooter />
          <CookieConsent />
        </WalletProvider></LanguageProvider>
      </body>
    </html>
  );
}
