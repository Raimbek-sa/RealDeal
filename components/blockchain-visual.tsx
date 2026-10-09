"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Fingerprint, LockKeyhole } from "lucide-react";

const HASHES = ["7f3a...c91e", "a82d...14bf", "c04e...8d72", "91be...f03a"];
const blocks = [
  { id: "01", label: "CERT", tone: "violet" },
  { id: "02", label: "HASH", tone: "blue" },
  { id: "03", label: "MEMO", tone: "cyan" },
  { id: "04", label: "LOCK", tone: "green" },
];

export function BlockchainVisual() {
  const [hashIndex, setHashIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHashIndex((current) => (current + 1) % HASHES.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="chain-visual" aria-label="Анимация передачи сертификата через блокчейн" role="img">
      <div className="chain-topline"><span className="pulse" /> LIVE BLOCKCHAIN FLOW <span className="chain-topline-line" /></div>
      <div className="flow-stage">
        <div className="flow-source">
          <div className="source-icon"><Fingerprint size={20} /></div>
          <span>YOUR DATA</span>
          <b>certificate</b>
        </div>
        <div className="flow-track">
          <div className="track-line" />
          <div className="track-glow" />
          <span className="flow-packet packet-a" />
          <span className="flow-packet packet-b" />
          <span className="flow-packet packet-c" />
        </div>
        <div className="block-row">
          {blocks.map((block) => (
            <div className={`data-block ${block.tone}`} key={block.id}>
              <div className="block-face"><span>{block.id}</span><i>{block.label === "LOCK" ? <LockKeyhole size={15} /> : block.label}</i></div>
              <small>{block.label === "HASH" ? HASHES[hashIndex].slice(0, 7) : "verified"}</small>
            </div>
          ))}
        </div>
        <div className="flow-track output-track">
          <div className="track-line" />
          <div className="track-glow" />
          <span className="flow-packet packet-d" />
        </div>
        <div className="flow-result">
          <div className="result-check"><Check size={17} /></div>
          <span>REAL DEAL</span>
          <b>verified</b>
        </div>
      </div>
      <div className="hash-strip">
        <div className="hash-strip-mark">#</div>
        <div><span>SHA-256 FINGERPRINT</span><b key={HASHES[hashIndex]}>{HASHES[hashIndex]}</b></div>
        <ArrowRight className="hash-arrow" size={15} />
      </div>
      <div className="chain-bottomline"><span>IMMUTABLE LEDGER</span><i /><span>SOLANA DEVNET</span></div>
    </div>
  );
}
