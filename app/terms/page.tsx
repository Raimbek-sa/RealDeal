import Link from "next/link";

export default function TermsPage() {
  return <div className="legal-page"><Link href="/" className="back-link">← На главную</Link><div className="eyebrow">LEGAL / TERMS</div><h1>Условия<br /><em>использования.</em></h1><p className="legal-lead">Используя RealDeal, вы соглашаетесь с условиями ниже.</p><LegalSection title="Назначение сервиса"><p>RealDeal — демонстрационный протокол для выпуска и проверки цифровых сертификатов. Сервис не заменяет официальную аккредитацию, нотариальное заверение или юридическую экспертизу документа.</p></LegalSection><LegalSection title="Solana devnet"><p>Транзакции выполняются в тестовой сети Solana. Devnet SOL не имеет денежной ценности, а доступность сети и Phantom зависит от сторонних сервисов.</p></LegalSection><LegalSection title="Ответственное использование"><p>Пользователь отвечает за содержание отправляемых Memo, безопасность своего кошелька и проверку данных до публикации их в публичной сети.</p></LegalSection><p className="legal-updated">Последнее обновление: 7 октября 2026</p></div>;
}

function LegalSection({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return <section className="legal-section"><h2>{title}</h2>{children}</section>;
}
