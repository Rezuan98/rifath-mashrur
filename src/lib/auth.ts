import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

/** Hash a password as "salt:derivedKey" using scrypt (no external deps). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

/** Constant-time check of a plaintext password against a stored "salt:hash". */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, derived] = stored.split(":");
  if (!salt || !derived) return false;
  const expected = Buffer.from(derived, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
