"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Fingerprint, ScanLine, ShieldCheck } from "lucide-react";
import { BlockchainVisual } from "@/components/blockchain-visual";
import { TrustedMarquee } from "@/components/trusted-marquee";
import { MemoWriter } from "@/components/memo-writer";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const { language } = useLanguage();
  const en = language === "en";
  return (
    <div className="page-shell">
      <TrustedMarquee />
      <section className="hero">
        <div className="hero-copy-column">
          <div className="eyebrow"><span className="pulse" /> VERIFICATION PROTOCOL / 001</div>
          <h1>{en ? <>Prove<br /><em>what is</em> real.</> : <>Докажи,<br /><em>что это</em> настоящее.</>}</h1>
          <p className="hero-copy">{en ? "RealDeal turns a certificate into a verifiable digital fingerprint. No trust in words — just facts on the blockchain." : "RealDeal превращает сертификат в проверяемый цифровой отпечаток. Без доверия к словам — только факт в блокчейне."}</p>
          <div className="hero-actions">
            <Link href="/verify" className="button button-primary">{en ? "Verify certificate" : "Проверить сертификат"} <ArrowUpRight size={17} /></Link>
            <Link href="/issue" className="button button-ghost">{en ? "Issue your own" : "Выпустить свой"} <span>→</span></Link>
          </div>
          <div className="hero-note"><ShieldCheck size={14} /> SHA-256 fingerprint <span /> {en ? "Solana verified" : "Solana verified"}</div>
        </div>
        <BlockchainVisual />
      </section>
      <MemoWriter />
      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><Fingerprint size={20} /></div><strong>01</strong><span>{en ? "Data → SHA-256" : "Данные → SHA-256"}</span></div>
        <div className="stat-card"><div className="stat-icon blue"><ScanLine size={20} /></div><strong>02</strong><span>{en ? "Fingerprint → Solana" : "Отпечаток → Solana"}</span></div>
        <div className="stat-card"><div className="stat-icon green"><BadgeCheck size={20} /></div><strong>03</strong><span>{en ? "Verification → Real Deal" : "Проверка → Real Deal"}</span></div>
      </section>
      <section className="quote-block"><span className="quote-mark">“</span><p>{en ? <>Trust no person.<br /><b>Trust the system.</b></> : <>Доверяй не человеку.<br /><b>Доверяй системе.</b></>}</p><span className="quote-caption">REALDEAL MANIFESTO</span></section>
    </div>
  );
}
