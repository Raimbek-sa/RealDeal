"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, CalendarDays, Check, Handshake, Landmark, LoaderCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useWallet } from "@/components/wallet-provider";
import { useLanguage } from "@/components/language-provider";

type OrganizationType = "private" | "public";

export default function IssuePage() {
  const [organizationType, setOrganizationType] = useState<OrganizationType | null>(null);
  const [form, setForm] = useState({ name: "", course: "", date: "", issuer: "", email: "", organizationName: "", website: "", country: "", organizationKind: "Университет" });
  const [result, setResult] = useState<{ id: string; signature: string; demo?: boolean }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { paySol, address } = useWallet();
  const { t, language } = useLanguage();
  const issuePrice = Number(process.env.NEXT_PUBLIC_ISSUE_PRICE_SOL || "0.25");
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await paySol(issuePrice, "выпуск сертификата");
      const response = await fetch("/api/issue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, organizationType }) });
      const data = await response.json();
      if (!response.ok) setError(data.error || "Не удалось выпустить сертификат");
      else setResult(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Оплата не прошла");
    } finally {
      setLoading(false);
    }
  }

  return <div className="page-shell narrow-page">
    <Link href="/" className="back-link"><ArrowLeft size={15} /> {t("home")}</Link>
    <div className="form-heading"><div className="eyebrow"><span className="pulse" /> ISSUE / NEW CERTIFICATE</div><h1>{t("issueTitle")}<br /><em>{t("issueAccent")}</em></h1><p>{t("issueCopy")}</p></div>
    <section className="collaboration-card">
      <div className="collaboration-icon"><Handshake size={17} /></div>
      <div><strong>{t("collaborate")}</strong><span>{t("collaborateCopy")}</span></div>
      <a href="mailto:partnerships@realdeal.app?subject=RealDeal%20partnership" className="collaboration-link">{t("collaborateAction")} <ArrowUpRight size={14} /></a>
    </section>
    {!result && !organizationType && <section className="organization-choice"><div className="choice-label">{t("whoIssues")}</div><div className="choice-grid"><button type="button" onClick={() => setOrganizationType("private")}><Building2 size={23} /><b>{t("privateOrg")}</b><span>{t("privateDesc")}</span></button><button type="button" onClick={() => setOrganizationType("public")}><Landmark size={23} /><b>{t("publicOrg")}</b><span>{t("publicDesc")}</span></button></div><div className="price-note">{t("issue")} <b>$25 / {issuePrice} SOL</b> <span>Devnet</span></div></section>}
    {!result && organizationType && <form className="cert-form" onSubmit={submit}>
      <button type="button" className="form-back-choice" onClick={() => setOrganizationType(null)}>{t("changeOrg")}</button>
      <label>{t("recipient")}<input required value={form.name} onChange={update("name")} placeholder={t("privatePlaceholder")} /></label>
      <label>{t("course")}<input required value={form.course} onChange={update("course")} placeholder="Web3 Fundamentals" /></label>
      <div className="form-row"><label>{t("issueDate")}<div className="input-with-icon"><input required type="date" value={form.date} onChange={update("date")} /><CalendarDays size={17} /></div></label><label>{t("issuer")}<input required value={form.issuer} onChange={update("issuer")} placeholder={t("orgPlaceholder")} /></label></div>
      {organizationType === "private" ? <div className="organization-fields"><label>{t("orgName")}<input required value={form.organizationName} onChange={update("organizationName")} placeholder="RealDeal Academy" /></label><label>{t("workEmail")}<input required type="email" value={form.email} onChange={update("email")} placeholder="admin@company.com" /></label><label>{t("website")} <span className="optional">{t("optional")}</span><input value={form.website} onChange={update("website")} placeholder="https://..." /></label></div> : <div className="organization-fields"><label>{t("country")}<input required value={form.country} onChange={update("country")} placeholder={language === "en" ? "United States" : "Казахстан"} /></label><label>{t("orgKind")}<select value={form.organizationKind} onChange={update("organizationKind")}><option>{language === "en" ? "University" : "Университет"}</option><option>{language === "en" ? "College" : "Колледж"}</option><option>{language === "en" ? "School" : "Школа"}</option><option>{language === "en" ? "Government institution" : "Государственное учреждение"}</option><option>{language === "en" ? "Other" : "Другое"}</option></select></label><label>{t("orgName")}<input required value={form.organizationName} onChange={update("organizationName")} placeholder={t("orgPlaceholder")} /></label><label>{t("officialEmail")}<input required type="email" value={form.email} onChange={update("email")} placeholder="office@edu.gov" /></label></div>}
      {error && <p className="error-message">{error}</p>}
      <div className="payment-summary"><span>{t("pay")}</span><b>$25 · {issuePrice} SOL</b><small>{address ? t("payConnected") : t("payOpens")}</small></div>
      <button className="button button-primary submit-button" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={17} /> {t("payingIssue")}</> : <>{t("payIssue")} <ArrowUpRight size={17} /></>}</button>
      <p className="form-footnote">Будет записан только SHA-256 хэш. Личные данные остаются приватными.</p>
    </form>}
    {result && <div className="success-card"><div className="success-check"><Check size={25} /></div><span className="eyebrow">{t("certificateIssued")}</span><h2>{t("done")} <em>Real Deal.</em></h2><div className="qr-wrap"><QRCodeSVG value={`${window.location.origin}/cert/${result.id}`} size={150} bgColor="#ffffff" fgColor="#08090b" /></div><div className="id-label">CERTIFICATE ID</div><div className="cert-id">{result.id}</div><Link href={`/cert/${result.id}`} className="button button-primary full-button">Открыть сертификат <ArrowUpRight size={17} /></Link>{result.demo && <p className="demo-note">Demo mode: добавьте ISSUER_SECRET_KEY для записи в devnet.</p>}</div>}
  </div>;
}
