import crypto from "crypto";
import { db } from "@/lib/db";
import { hashCert, writeToSolana } from "@/lib/solana";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, course, date, issuer, organizationType, organizationName, email, country, organizationKind } = body;
  if (![name, course, date, issuer].every((value) => typeof value === "string" && value.trim())) {
    return Response.json({ error: "Заполните все поля" }, { status: 400 });
  }
  if (!["private", "public"].includes(organizationType) || !organizationName || !email) return Response.json({ error: "Заполните данные организации" }, { status: 400 });
  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  const cert = { id, name: name.trim(), course: course.trim(), date, issuer: issuer.trim() };
  const hash = hashCert(cert);
  const signature = await writeToSolana(id, hash);
  db.insert({ ...cert, hash, signature });
  return Response.json({ id, signature, demo: signature.startsWith("demo-") });
}
