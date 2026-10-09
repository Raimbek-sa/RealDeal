"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
  on?: (event: string, callback: () => void) => void;
  removeListener?: (event: string, callback: () => void) => void;
};

declare global {
  interface Window {
    phantom?: { solana?: PhantomProvider };
  }
}

export type ChainRecord = { text: string; time: string; signature: string };
type WalletContextValue = {
  wallet: PhantomProvider | null;
  address: string | null;
  balance: number | null;
  error: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  writeMemo: (text: string) => Promise<string>;
  paySol: (amountSol: number, purpose: string) => Promise<string>;
  records: ChainRecord[];
};

const DEVNET = "https://api.devnet.solana.com";
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const WalletContext = createContext<WalletContextValue | null>(null);

function getPhantom() {
  return typeof window !== "undefined" ? window.phantom?.solana ?? null : null;
}

export function WalletProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [wallet, setWallet] = useState<PhantomProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [records, setRecords] = useState<ChainRecord[]>([]);
  const connection = useMemo(() => new Connection(DEVNET, "confirmed"), []);

  const refreshBalance = async (publicKey: PublicKey) => {
    const lamports = await connection.getBalance(publicKey, "confirmed");
    setBalance(lamports / 1_000_000_000);
  };

  const connect = async () => {
    setError("");
    const provider = getPhantom();
    if (!provider) {
      setError("Откройте приложение в отдельной вкладке с установленным Phantom");
      return;
    }
    try {
      const response = await provider.connect();
      setWallet(provider);
      setAddress(response.publicKey.toBase58());
      await refreshBalance(response.publicKey);
    } catch (cause) {
      setError(cause instanceof Error && cause.message.toLowerCase().includes("reject") ? "Подключение отменено в Phantom" : "Не удалось подключить кошелёк");
    }
  };

  const disconnect = async () => {
    if (wallet) await wallet.disconnect();
    setWallet(null);
    setAddress(null);
    setBalance(null);
  };

  const writeMemo = async (text: string) => {
    if (!wallet?.publicKey) {
      await connect();
      throw new Error("Сначала подключите кошелёк");
    }
    const instruction = new TransactionInstruction({
      keys: [],
      programId: new PublicKey(MEMO_PROGRAM_ID),
      // web3.js 1.x types this field as Buffer, while Phantom accepts the
      // browser-native Uint8Array produced by TextEncoder.
      data: new TextEncoder().encode(text) as unknown as Buffer,
    });
    const transaction = new Transaction().add(instruction);
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
    try {
      const { signature } = await wallet.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "confirmed");
      await refreshBalance(wallet.publicKey);
      setRecords((current) => [{ text, time: new Date().toLocaleString("ru-RU"), signature }, ...current]);
      return signature;
    } catch (cause) {
      if (cause instanceof Error && cause.message.toLowerCase().includes("reject")) throw new Error("Вы отменили запись в Phantom");
      throw new Error("Не удалось записать данные в Solana. Проверьте баланс devnet SOL.");
    }
  };

  const paySol = async (amountSol: number, purpose: string) => {
    let activeWallet = wallet;
    if (!activeWallet?.publicKey) {
      const provider = getPhantom();
      if (!provider) {
        await connect();
        throw new Error("Откройте приложение в отдельной вкладке с установленным Phantom");
      }
      try {
        const response = await provider.connect();
        activeWallet = provider;
        setWallet(provider);
        setAddress(response.publicKey.toBase58());
        await refreshBalance(response.publicKey);
      } catch (cause) {
        if (cause instanceof Error && cause.message.toLowerCase().includes("reject")) throw new Error("Подключение отменено в Phantom");
        throw new Error("Не удалось подключить кошелёк");
      }
    }
    const recipientAddress = process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS;
    if (!recipientAddress) throw new Error("Адрес получателя платежа ещё не настроен");
    let recipient: PublicKey;
    try {
      recipient = new PublicKey(recipientAddress);
    } catch {
      throw new Error("Адрес получателя платежа настроен неверно");
    }
    const payer = activeWallet.publicKey;
    if (!payer) throw new Error("Phantom не вернул адрес кошелька");
    const lamports = Math.round(amountSol * 1_000_000_000);
    if (lamports <= 0) throw new Error("Некорректная сумма платежа");
    const latest = await connection.getLatestBlockhash("confirmed");
    const transaction = new Transaction({
      feePayer: payer,
      recentBlockhash: latest.blockhash,
    }).add(SystemProgram.transfer({ fromPubkey: payer, toPubkey: recipient, lamports }));
    try {
      const { signature } = await activeWallet.signAndSendTransaction(transaction);
      await connection.confirmTransaction({ signature, ...latest }, "confirmed");
      await refreshBalance(payer);
      setRecords((current) => [{ text: `Оплата: ${purpose} (${amountSol} SOL)`, time: new Date().toLocaleString("ru-RU"), signature }, ...current]);
      return signature;
    } catch (cause) {
      if (cause instanceof Error && cause.message.toLowerCase().includes("reject")) throw new Error("Вы отменили платёж в Phantom");
      throw new Error("Платёж не прошёл. Проверьте баланс devnet SOL и попробуйте снова");
    }
  };

  useEffect(() => {
    const provider = getPhantom();
    if (!provider?.on) return;
    const handleDisconnect = () => { setWallet(null); setAddress(null); setBalance(null); };
    provider.on("disconnect", handleDisconnect);
    return () => provider.removeListener?.("disconnect", handleDisconnect);
  }, []);

  return <WalletContext.Provider value={{ wallet, address, balance, error, connect, disconnect, writeMemo, paySol, records }}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const value = useContext(WalletContext);
  if (!value) throw new Error("useWallet must be used inside WalletProvider");
  return value;
}
