import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(secret: string): Promise<string> {
  const nonce = crypto.randomUUID();
  const sig = await hmacSign(nonce, secret);
  return `${nonce}.${sig}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return false;
  const nonce = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacSign(nonce, secret);
  return sig === expected;
}

export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;
  return verifySessionToken(token, secret);
}
