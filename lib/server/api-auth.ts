import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Account, SafeAccount } from "@/src/types/domain";

interface AuthTokenPayload {
  sub: string;
  email: string;
  exp: number;
}

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "dev-only-change-me";
const AUTH_TOKEN_TTL_SECONDS = Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 12);

function base64UrlEncode(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function signPayload(payload: string): string {
  return createHmac("sha256", AUTH_TOKEN_SECRET).update(payload).digest("base64url");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [scheme, salt, storedHash] = passwordHash.split(":");

  if (scheme !== "scrypt" || !salt || !storedHash) {
    return false;
  }

  const computedHash = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (computedHash.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(computedHash, storedBuffer);
}

export function createAuthToken(account: Pick<Account, "id" | "email">): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: account.id,
      email: account.email,
      exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_TTL_SECONDS,
    } satisfies AuthTokenPayload),
  );

  const signature = signPayload(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(`${header}.${payload}`);

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(base64UrlDecode(payload)) as AuthTokenPayload;

    if (parsedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
}

export function toSafeAccount(account: Account): SafeAccount {
  return {
    id: account.id,
    email: account.email,
    display_name: account.display_name,
    grade_band: account.grade_band,
    created_at: account.created_at,
  };
}
