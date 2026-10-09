# RealDeal

**RealDeal** is an MVP for verifying certificate authenticity with SHA-256 and Solana.

> Prove what is real.

The application does not put certificate personal data on-chain. Instead, it creates a SHA-256 fingerprint from a fixed set of fields and stores that fingerprint through the Memo Program on Solana Devnet.

## Features

- issue certificates at `/issue`;
- choose a private or public organization;
- verify certificates at `/verify`;
- certificate pages at `/cert/[id]`;
- QR codes linking to certificates;
- SHA-256 hash records in Solana Memo transactions;
- Phantom Wallet connection;
- wallet balance in Devnet SOL;
- real Devnet payments through `SystemProgram.transfer`;
- clearly labeled Demo Mode without a server keypair;
- Russian and English language switching;
- cookie consent and Privacy, Terms, and License pages;
- animated `Data → SHA-256 → Memo → Real Deal` flow.

## Verification flow

1. Certificate fields are normalized into a stable order:
   `id`, `name`, `course`, `date`, and `issuer`.
2. A SHA-256 hash is calculated from that array.
3. The hash is written to a Solana transaction through the Memo Program.
4. During verification, the stored certificate data is hashed again.
5. The new hash is compared with the Solana record:
   - matching hash — `Real Deal`;
   - missing or modified certificate — `Fake`.

## Tech stack

- Next.js 14 App Router;
- React 18;
- TypeScript;
- `@solana/web3.js`;
- Phantom Wallet;
- Solana Devnet;
- Memo Program;
- `qrcode.react`;
- `lucide-react`.

## Local setup

Requirements:

- Node.js 18.17 or newer;
- npm;
- Phantom Wallet for payments and Memo transactions.

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example`:

```bash
copy .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
|---|---|
| `ISSUER_SECRET_KEY` | Server issuer keypair byte array. If omitted, the app uses Demo Mode. |
| `NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS` | Devnet wallet that receives service payments. |
| `NEXT_PUBLIC_ISSUE_PRICE_SOL` | Certificate issue price in SOL. Defaults to `0.25`. |
| `NEXT_PUBLIC_VERIFY_PRICE_SOL` | Verification price in SOL. Defaults to `0.02`. |

Example:

```env
ISSUER_SECRET_KEY=[...]
NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS=YourDevnetWalletAddress
NEXT_PUBLIC_ISSUE_PRICE_SOL=0.25
NEXT_PUBLIC_VERIFY_PRICE_SOL=0.02
```

Never commit `.env.local` or a private keypair to Git.

## Devnet and Phantom

For testing:

1. Install Phantom.
2. Switch Phantom to **Devnet**.
3. Get test SOL from the [Solana Faucet](https://faucet.solana.com/).
4. Set `NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS`.
5. Open the application in a standalone browser tab.

Payments and Memo transactions are submitted by the user through Phantom. The wallet also pays the Solana network fee.

## Demo Mode

When `ISSUER_SECRET_KEY` is not set, issuing a certificate does not submit an issuer transaction to Solana. Instead, the app creates an explicitly labeled demo signature. This is useful for UI demonstrations but is not a production issuance flow.

## Validation

```bash
npm run build
npm run lint
```

## MVP limitations

- Certificates currently use an in-memory store. Data is lost when the process restarts, and this is not suitable for scalable Vercel deployment.
- Replace the store with Supabase, PostgreSQL, or another persistent database before production.
- The issue and verification APIs should verify confirmed payment transactions server-side.
- SOL prices are currently fixed. A commercial launch should use a SOL/USD rate and server-side price calculation.
- The app uses Solana Devnet. Mainnet requires separate RPC, wallet, and payment configuration plus a security review.

## Project structure

```text
app/
  page.tsx                 home page
  issue/page.tsx           certificate issuance
  verify/page.tsx          certificate verification
  cert/[id]/page.tsx       certificate page
  api/issue                issuance API
  api/verify/[id]          verification API
components/
  wallet-provider.tsx      Phantom, balance, and payments
  language-provider.tsx    RU/EN localization
  blockchain-visual.tsx    blockchain flow animation
lib/
  solana.ts                SHA-256 and server-side Memo writing
  db.ts                    current MVP store
```

## License

Terms of use and license information are available in the application at `/terms` and `/license`.
