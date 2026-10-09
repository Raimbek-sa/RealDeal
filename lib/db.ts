export type Certificate = {
  id: string;
  name: string;
  course: string;
  date: string;
  issuer: string;
  hash: string;
  signature: string;
};

const globalStore = globalThis as typeof globalThis & { __realDealCertificates?: Map<string, Certificate> };
const certificates = globalStore.__realDealCertificates ?? new Map<string, Certificate>();
globalStore.__realDealCertificates = certificates;

export const db = {
  insert(cert: Certificate) {
    certificates.set(cert.id, cert);
    return cert;
  },
  find(id: string) {
    return certificates.get(id.toUpperCase());
  },
};
