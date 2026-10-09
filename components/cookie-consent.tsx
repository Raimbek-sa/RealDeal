"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import { useLanguage } from "./language-provider";

type Consent = "all" | "necessary";

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const saved = document.cookie.split("; ").find((item) => item.startsWith("realdeal_cookie_consent="));
    if (saved) setConsent(saved.split("=")[1] as Consent);
  }, []);

  const save = (value: Consent) => {
    document.cookie = `realdeal_cookie_consent=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
    setConsent(value);
    setSettingsOpen(false);
  };

  if (consent) return null;

  return <div className="cookie-banner" role="dialog" aria-label={t("customize")}>
    <div className="cookie-icon"><Cookie size={20} /></div>
    <div className="cookie-copy">
      <strong>{t("cookieTitle")}</strong>
      <p>{t("cookieCopy")} <Link href="/privacy">{t("more")}</Link></p>
      {settingsOpen && <div className="cookie-settings"><label><input type="checkbox" checked readOnly /> {t("necessaryOnly")}</label><label><input type="checkbox" /> Analytics</label></div>}
    </div>
    <div className="cookie-actions">
      <button className="cookie-button cookie-settings-button" onClick={() => setSettingsOpen((open) => !open)}><Settings2 size={14} /> {t("customize")}</button>
      <button className="cookie-button" onClick={() => save("necessary")}>{t("necessaryOnly")}</button>
      <button className="cookie-button cookie-accept" onClick={() => save("all")}>{t("acceptAll")}</button>
    </div>
    <button className="cookie-close" onClick={() => save("necessary")} aria-label="Закрыть"><X size={16} /></button>
  </div>;
}
