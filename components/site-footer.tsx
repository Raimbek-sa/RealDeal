"use client";
import { useLanguage } from "./language-provider";
export function SiteFooter() {
  const { t } = useLanguage();
  return <footer className="footer"><span>RealDeal / certificate integrity protocol</span><span className="footer-dot">●</span><span>{t("powered")}</span><nav className="footer-links"><a href="/privacy">{t("privacy")}</a><a href="/terms">{t("terms")}</a><a href="/license">{t("license")}</a></nav></footer>;
}
