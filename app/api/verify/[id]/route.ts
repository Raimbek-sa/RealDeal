import { db } from "@/lib/db";
import { hashCert, readFromSolana } from "@/lib/solana";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const cert = db.find(params.id);
  if (!cert) return Response.json({ valid: false, reason: "Сертификат не найден" }, { status: 404 });
  const expected = `realdeal:${cert.id}:${hashCert(cert)}`;
  const onchain = await readFromSolana(cert.signature);
  const demoSignature = `demo-${cert.id.toLowerCase()}-${hashCert(cert)}`;
  const valid = onchain === expected || cert.signature === demoSignature;
  return Response.json({
    valid,
    cert,
    explorer: cert.signature.startsWith("demo-") ? null : `https://explorer.solana.com/tx/${cert.signature}?cluster=devnet`,
  });
}
