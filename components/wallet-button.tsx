"use client";

import { useState } from "react";
import { LoaderCircle, LogOut, Wallet } from "lucide-react";
import { useWallet } from "./wallet-provider";
import { useLanguage } from "./language-provider";

export function WalletButton() {
  const { address, balance, error, connect, disconnect } = useWallet();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

  const handleClick = async () => {
    setLoading(true);
    if (address) await disconnect(); else await connect();
    setLoading(false);
  };

  return <div className="wallet-control">
    <button className={`wallet-button ${address ? "wallet-connected" : ""}`} onClick={handleClick} disabled={loading}>
      {loading ? <LoaderCircle className="spin" size={15} /> : address ? <LogOut size={14} /> : <Wallet size={14} />}
      {address ? shortAddress : t("connectWallet")}
      {address && <span className="wallet-balance">{balance === null ? "…" : `${balance.toFixed(3)} SOL`}</span>}
    </button>
    {error && <span className="wallet-error">{error}</span>}
  </div>;
}
