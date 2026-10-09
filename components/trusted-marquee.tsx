"use client";
import { useLanguage } from "./language-provider";

const companies = [
  { name: "Coursera", tone: "coursera" },
  { name: "◎ Solana", tone: "solana" },
  { name: "Google", tone: "google" },
  { name: "steam", tone: "steam" },
  { name: "Microsoft", tone: "microsoft" },
  { name: "△ Revolut", tone: "revolut" },
  { name: "Stripe", tone: "stripe" },
  { name: "M", tone: "mastercard" },
];

function CompanySet() {
  return (
    <>
      {companies.map((company) => (
        <div className="trusted-company" key={`${company.tone}-${company.name}`}>
          <span className={`company-logo ${company.tone}`}>{company.name}</span>
          <span className="company-divider" />
        </div>
      ))}
    </>
  );
}

export function TrustedMarquee() {
  const { language } = useLanguage();
  return (
    <section className="trusted-marquee" aria-label={language === "en" ? "Organizations using RealDeal" : "Организации, использующие RealDeal"}>
      <div className="trusted-heading">
        <span className="pulse" />
        <span>TRUSTED BY THE<br />DIGITAL WORLD</span>
      </div>
      <div className="marquee-window">
        <div className="marquee-track">
          <CompanySet />
          <CompanySet />
        </div>
      </div>
    </section>
  );
}
