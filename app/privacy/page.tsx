import Link from "next/link";

export default function PrivacyPage() {
  return <div className="legal-page"><Link href="/" className="back-link">← На главную</Link><div className="eyebrow">LEGAL / PRIVACY</div><h1>Политика<br /><em>конфиденциальности.</em></h1><p className="legal-lead">RealDeal сохраняет минимум данных, необходимый для выпуска и проверки сертификатов.</p><LegalSection title="Какие данные мы обрабатываем"><p>При выпуске сертификата могут сохраняться имя получателя, название курса, дата, организатор, идентификатор сертификата и подпись транзакции. Секретный ключ кошелька никогда не передаётся сайту.</p></LegalSection><LegalSection title="Блокчейн и публичность"><p>Хэш сертификата и данные Memo в Solana devnet являются публичными и неизменяемыми. Не добавляйте в Memo персональные или конфиденциальные сведения.</p></LegalSection><LegalSection title="Cookie"><p>Мы используем необходимые cookie для сохранения вашего выбора. Аналитические cookie включаются только после согласия и в текущей версии не используются.</p></LegalSection><p className="legal-updated">Последнее обновление: 7 октября 2026</p></div>;
}

function LegalSection({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return <section className="legal-section"><h2>{title}</h2>{children}</section>;
}
