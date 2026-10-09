"use client";

import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return <div className="language-switcher" aria-label={t("language")}>
    <button className={language === "ru" ? "active" : ""} onClick={() => setLanguage("ru")}>RU</button>
    <span>/</span>
    <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
  </div>;
}
