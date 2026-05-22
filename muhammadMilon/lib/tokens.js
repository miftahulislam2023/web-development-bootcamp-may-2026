import { randomBytes } from "crypto";

export function createSecureToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function tokenExpires(hours = 24) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}
