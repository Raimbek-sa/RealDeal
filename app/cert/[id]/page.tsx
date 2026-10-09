import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const cert = db.find(params.id);
  if (!cert) return <div className="page-shell narrow-page"><Link href="/verify" className="back-link"><ArrowLeft size={15} /> Проверка</Link><div className="empty-state"><h1>Сертификат<br /><em>не найден.</em></h1><p>Проверьте ID и попробуйте ещё раз.</p><Link href="/verify" className="button button-primary">Вернуться к проверке <ArrowUpRight size={17} /></Link></div></div>;
  return <div className="page-shell narrow-page cert-page"><Link href="/verify" className="back-link"><ArrowLeft size={15} /> Проверка</Link>
    <div className="cert-status"><CheckCircle2 size={21} /><span>REAL DEAL / VERIFIED</span></div>
    <div className="certificate"><div className="cert-top"><span>REALDEAL</span><span>VERIFIED ON SOLANA</span></div><div className="cert-main"><div className="cert-seal">RD<br /><span>✓</span></div><p className="cert-kicker">CERTIFICATE OF COMPLETION</p><h1>Сертификат<br /><em>подлинности</em></h1><p className="cert-description">Этот документ подтверждает, что данные сертификата зафиксированы и могут быть проверены.</p></div><div className="cert-bottom"><span>ID / {params.id.toUpperCase()}</span><span>SHA-256 + MEMO</span></div></div>
    <div className="cert-details"><div><span>ISSUED TO</span><b>{cert.name}</b></div><div><span>COURSE</span><b>{cert.course}</b></div><div><span>ISSUER</span><b>{cert.issuer}</b></div></div>
    <div className="cert-actions"><Link href="/verify" className="button button-ghost full-button"><ArrowLeft size={16} /> Проверить другой ID</Link>{!cert.signature.startsWith("demo-") && <a className="button button-ghost full-button" target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${cert.signature}?cluster=devnet`}>Открыть в Explorer <ExternalLink size={15} /></a>}</div><p className="cert-demo">Отпечаток SHA-256 подтверждён в Solana devnet.</p>
  </div>;
}
