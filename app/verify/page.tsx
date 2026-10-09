"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Search, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@/components/wallet-provider";
import { useLanguage } from "@/components/language-provider";

export default function VerifyPage() {
  const [id, setId] = useState(""); const [status, setStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [error, setError] = useState("");
  const { paySol } = useWallet();
  const { t } = useLanguage();
  const verifyPrice = Number(process.env.NEXT_PUBLIC_VERIFY_PRICE_SOL || "0.02");
  async function verify(event: React.FormEvent) { event.preventDefault(); setStatus("loading"); setError(""); try { await paySol(verifyPrice, "проверка сертификата"); const res = await fetch(`/api/verify/${id.trim()}`); setStatus(res.ok ? (await res.json()).valid ? "valid" : "invalid" : "invalid"); } catch (cause) { setStatus("idle"); setError(cause instanceof Error ? cause.message : "Оплата проверки не прошла"); } }
  return <div className="page-shell verify-page">
    <div className="verify-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><Search size={29} /></div></div>
    <div className="eyebrow centered"><span className="pulse" /> {t("publicVerification")}</div><h1>{t("verifyTitle")}<br /><em>{t("verifyTitleAccent")}</em></h1><p className="center-copy">{t("verifyCopy")}</p>
    <div className="verification-price"><span>{t("verification")}</span><b>$2 · {verifyPrice} SOL</b><small>{t("devnetPhantom")}</small></div>
    <form className="verify-form" onSubmit={verify}><input required value={id} onChange={(e) => setId(e.target.value)} placeholder="RD-XXXXXX" /><button className="button button-primary" disabled={status === "loading"}>{status === "loading" ? t("payingVerify") : <>{t("payVerify")} <ArrowUpRight size={17} /></>}</button></form>
    {error && <p className="error-message">{error}</p>}
    {status === "valid" && <div className="result-banner valid"><CheckCircle2 size={23} /><div><b>{t("realDeal")}</b><span>{t("verifiedBlockchain")}</span></div><Link href={`/cert/${id.toUpperCase()}`}><ArrowUpRight size={17} /></Link></div>}
    {status === "invalid" && <div className="result-banner invalid"><ShieldAlert size={23} /><div><b>{t("fake")}</b><span>{t("failedVerification")}</span></div></div>}
    <p className="verify-hint">{t("tryId")} <Link href="/issue">{t("newCertificate")}</Link></p>
  </div>;
}
