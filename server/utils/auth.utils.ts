import { randomBytes } from "crypto";

export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export function generatePasswordResetExpiry(): Date {
  return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
}

export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
