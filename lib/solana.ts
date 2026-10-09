import crypto from "crypto";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import type { Certificate } from "./db";

const MEMO = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
export const connection = new Connection("https://api.devnet.solana.com", "confirmed");

export function hashCert(cert: Pick<Certificate, "id" | "name" | "course" | "date" | "issuer">) {
  const stable = JSON.stringify([cert.id, cert.name, cert.course, cert.date, cert.issuer]);
  return crypto.createHash("sha256").update(stable).digest("hex");
}

export async function writeToSolana(id: string, hash: string) {
  const secret = process.env.ISSUER_SECRET_KEY;
  if (!secret) return `demo-${id.toLowerCase()}-${hash}`;
  const issuer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(secret)));
  const instruction = new TransactionInstruction({
    keys: [],
    programId: MEMO,
    data: Buffer.from(`realdeal:${id}:${hash}`),
  });
  return sendAndConfirmTransaction(connection, new Transaction().add(instruction), [issuer]);
}

export async function readFromSolana(signature: string) {
  if (signature.startsWith("demo-")) return signature;
  const tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: "confirmed" });
  const memo = tx?.transaction.message.instructions.find((instruction) => "program" in instruction && instruction.program === "spl-memo");
  return memo && "parsed" in memo ? String(memo.parsed) : undefined;
}
