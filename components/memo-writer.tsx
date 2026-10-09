"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, LoaderCircle, Send, Wallet } from "lucide-react";
import { useWallet } from "./wallet-provider";
import { useLanguage } from "./language-provider";

export function MemoWriter() {
  const { address, connect, error: walletError, writeMemo, records } = useWallet();
  const { t } = useLanguage();
  const [text, setText] = useState("RealDeal: certificate integrity verified");
  const [state, setState] = useState<"idle" | "writing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!address) {
      await connect();
      setMessage(walletError || `${t("connectWallet")} Phantom`);
      return;
    }
    setState("writing");
    try {
      setSignature(await writeMemo(text));
      setState("success");
    } catch (cause) {
      setState("error");
      setMessage(cause instanceof Error ? cause.message : "Произошла ошибка записи");
    }
  }

  return <section className="memo-writer">
    <div className="writer-heading"><div><div className="eyebrow"><span className="pulse" /> ON-CHAIN MEMO</div><h2>Оставь запись<br /><em>в блокчейне.</em></h2></div><div className="writer-lock"><Wallet size={18} /></div></div>
    <p className="writer-copy">{t("memoCopy")}</p>
    <form className="memo-form" onSubmit={submit}><input value={text} onChange={(event) => setText(event.target.value)} maxLength={120} aria-label={t("write")} /><button className="button button-primary" disabled={state === "writing" || !text.trim()}>{state === "writing" ? <><LoaderCircle className="spin" size={16} /> {t("writing")}</> : <><Send size={15} /> {t("write")}</>}</button></form>
    {state === "success" && <div className="write-success"><CheckCircle2 size={18} /><span>{t("recorded")}</span><a target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}>{t("viewRecord")} <ExternalLink size={13} /></a></div>}
    {(state === "error" || message || walletError) && <div className="write-error">{message || walletError}</div>}
    {records.length > 0 && <div className="records"><div className="records-title">{t("recent")} <span>{records.length}</span></div>{records.map((record) => <div className="record" key={record.signature}><div><b>{record.text}</b><small>{record.time}</small></div><a target="_blank" rel="noreferrer" href={`https://explorer.solana.com/tx/${record.signature}?cluster=devnet`}><ExternalLink size={14} /></a></div>)}</div>}
  </section>;
}
