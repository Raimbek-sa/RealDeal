"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "ru" | "en";

const translations = {
  ru: {
    verify: "Проверить", issue: "Выпустить", connectWallet: "Подключить кошелёк",
    home: "На главную", publicVerification: "PUBLIC VERIFICATION",
    verifyTitle: "Проверь,", verifyTitleAccent: "что это реально.",
    verifyCopy: "Введи ID сертификата. Мы сравним его данные с неизменяемой записью в Solana.",
    verification: "Проверка сертификата", payVerify: "Оплатить и проверить",
    payingVerify: "Оплачиваем и проверяем...", devnetPhantom: "Оплата через Phantom · Devnet",
    realDeal: "Real Deal", verifiedBlockchain: "Сертификат подтверждён блокчейном.",
    fake: "Fake / не найден", failedVerification: "Этот ID не прошёл проверку.",
    tryId: "Попробуйте ID выпущенного сертификата или создайте",
    newCertificate: "новый сертификат →", issueTitle: "Выпустить", issueAccent: "сертификат.",
    issueCopy: "Выберите тип организации, заполните данные и оплатите выпуск через Phantom.",
    whoIssues: "КТО ВЫПУСКАЕТ СЕРТИФИКАТ?", privateOrg: "Частная организация",
    privateDesc: "Компания, академия или бизнес", publicOrg: "Государственная организация",
    publicDesc: "Университет, колледж или учреждение", changeOrg: "← Изменить тип организации",
    recipient: "Имя получателя", course: "Название курса", issueDate: "Дата выдачи",
    issuer: "Организатор", orgName: "Название организации", workEmail: "Рабочий email",
    website: "Сайт организации", optional: "(необязательно)", country: "Страна",
    orgKind: "Тип организации", officialEmail: "Официальный email", pay: "К оплате",
    payConnected: "Оплата через подключённый Phantom", payOpens: "После нажатия откроется Phantom",
    payIssue: "Оплатить и выпустить", payingIssue: "Оплачиваем и выпускаем...",
    privatePlaceholder: "Например, Анна Петрова", orgPlaceholder: "Название организации",
    done: "Готово. Это", certificate: "сертификат", openCertificate: "Открыть сертификат",
    certificateIssued: "CERTIFICATE ISSUED", check: "Проверить", language: "Язык",
    memoTitle: "Оставь запись", memoAccent: "в блокчейне.", memoCopy: "Подпишите короткое сообщение кошельком Phantom. Комиссию оплачивает ваш devnet-кошелёк.",
    write: "Записать", writing: "Записываем в блокчейн…", recorded: "Записано в блокчейн",
    viewRecord: "Посмотреть запись", recent: "ПОСЛЕДНИЕ ЗАПИСИ", cookieTitle: "Мы используем cookie",
    cookieCopy: "Необходимые cookie помогают сайту работать. Аналитические cookie включаются только с вашего согласия.",
    more: "Подробнее", customize: "Настроить", necessaryOnly: "Только необходимые", acceptAll: "Принять все",
    privacy: "Конфиденциальность", terms: "Условия", license: "Лицензия", powered: "Powered by Solana devnet",
    collaborate: "Работайте с нами", collaborateCopy: "Подключите выдачу сертификатов для своей организации.",
    collaborateAction: "Предложить сотрудничество",
  },
  en: {
    verify: "Verify", issue: "Issue", connectWallet: "Connect wallet",
    home: "Home", publicVerification: "PUBLIC VERIFICATION",
    verifyTitle: "Verify", verifyTitleAccent: "what is real.",
    verifyCopy: "Enter a certificate ID. We compare its data with an immutable record on Solana.",
    verification: "Certificate verification", payVerify: "Pay and verify",
    payingVerify: "Paying and verifying...", devnetPhantom: "Payment via Phantom · Devnet",
    realDeal: "Real Deal", verifiedBlockchain: "Certificate verified by the blockchain.",
    fake: "Fake / not found", failedVerification: "This ID did not pass verification.",
    tryId: "Try an issued certificate ID or create a", newCertificate: "new certificate →",
    issueTitle: "Issue", issueAccent: "a certificate.", issueCopy: "Choose an organization type, fill in the details and pay through Phantom.",
    whoIssues: "WHO IS ISSUING THE CERTIFICATE?", privateOrg: "Private organization",
    privateDesc: "Company, academy or business", publicOrg: "Public organization",
    publicDesc: "University, college or institution", changeOrg: "← Change organization type",
    recipient: "Recipient name", course: "Course name", issueDate: "Issue date", issuer: "Issuer",
    orgName: "Organization name", workEmail: "Work email", website: "Organization website",
    optional: "(optional)", country: "Country", orgKind: "Organization type", officialEmail: "Official email",
    pay: "Amount due", payConnected: "Payment via connected Phantom", payOpens: "Phantom will open after clicking",
    payIssue: "Pay and issue", payingIssue: "Paying and issuing...", privatePlaceholder: "For example, Anna Petrova",
    orgPlaceholder: "Organization name", done: "Done. This is", certificate: "certificate",
    openCertificate: "Open certificate", certificateIssued: "CERTIFICATE ISSUED", check: "Verify",
    language: "Language", memoTitle: "Leave a record", memoAccent: "on-chain.",
    memoCopy: "Sign a short message with your Phantom wallet. Your devnet wallet pays the network fee.",
    write: "Write record", writing: "Writing to the blockchain…", recorded: "Recorded on blockchain",
    viewRecord: "View record", recent: "RECENT RECORDS", cookieTitle: "We use cookies",
    cookieCopy: "Essential cookies keep the site working. Analytics cookies are enabled only with your consent.",
    more: "Learn more", customize: "Customize", necessaryOnly: "Necessary only", acceptAll: "Accept all",
    privacy: "Privacy", terms: "Terms", license: "License", powered: "Powered by Solana devnet",
    collaborate: "Work with us", collaborateCopy: "Bring verifiable certificates to your organization.",
    collaborateAction: "Start a partnership",
  },
} as const;

type TranslationKey = keyof typeof translations.en;
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string } | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ru");
  useEffect(() => {
    const saved = window.localStorage.getItem("realdeal-language");
    if (saved === "en" || saved === "ru") {
      setLanguage(saved);
      document.documentElement.lang = saved;
    }
  }, []);
  const changeLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem("realdeal-language", next);
    document.documentElement.lang = next;
  };
  const value = useMemo(() => ({ language, setLanguage: changeLanguage, t: (key: TranslationKey) => translations[language][key] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
