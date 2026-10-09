import Link from "next/link";

export default function LicensePage() {
  return <div className="legal-page"><Link href="/" className="back-link">← На главную</Link><div className="eyebrow">LEGAL / LICENSE</div><h1>Лицензия<br /><em>RealDeal.</em></h1><p className="legal-lead">Информация о программном обеспечении и открытых компонентах проекта.</p><LegalSection title="Лицензия проекта"><p>Исходный код RealDeal распространяется на условиях лицензии, указанных владельцем репозитория. Бренд RealDeal, логотип и визуальные материалы не передаются автоматически вместе с исходным кодом.</p></LegalSection><LegalSection title="Сторонние компоненты"><p>Проект использует Next.js, React, Solana Web3.js, Lucide и QRCode React. Их права и лицензии регулируются соответствующими пакетами и их авторами.</p></LegalSection><LegalSection title="Контакты правообладателя"><p>Перед публикацией продукта замените этот шаблон на юридическое название организации, адрес и контакт для обращений по лицензированию.</p></LegalSection><p className="legal-updated">Версия документа: 1.0 / 7 октября 2026</p></div>;
}

function LegalSection({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return <section className="legal-section"><h2>{title}</h2>{children}</section>;
}
