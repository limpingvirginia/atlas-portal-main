import crypto from "node:crypto";

export const MAX_LICENSES = 20;

export function generateLicenseKey() {
  const block = () => crypto.randomBytes(2).toString("hex").toUpperCase();
  return `SHDCN-${block()}-${block()}-${block()}-${block()}`;
}
