import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const QR_TTL_SECONDS = 60;

export interface QrPayload {
  v: 1;
  b: string;
  n: string;
  iat: number;
  exp: number;
}

function getSecret() {
  return process.env.QR_SIGNING_SECRET ?? "fielito-dev-secret-cambiar-en-produccion";
}

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function createScanToken(businessId: string) {
  const now = Date.now();
  const payload: QrPayload = {
    v: 1,
    b: businessId,
    n: randomBytes(12).toString("hex"),
    iat: now,
    exp: now + QR_TTL_SECONDS * 1000,
  };
  const body = base64url(JSON.stringify(payload));
  const signature = base64url(createHmac("sha256", getSecret()).update(body).digest());
  return {
    token: `${body}.${signature}`,
    expiresAt: payload.exp,
    ttlSeconds: QR_TTL_SECONDS,
  };
}

export type VerifyResult =
  | { valid: true; payload: QrPayload }
  | { valid: false; reason: "formato" | "firma" | "expirado" };

export function verifyScanToken(token: string): VerifyResult {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, reason: "formato" };
  }
  const [body, signature] = token.split(".");
  if (!body || !signature) return { valid: false, reason: "formato" };

  const expected = base64url(createHmac("sha256", getSecret()).update(body).digest());
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return { valid: false, reason: "firma" };
  }

  let payload: QrPayload;
  try {
    payload = JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as QrPayload;
  } catch {
    return { valid: false, reason: "formato" };
  }

  if (payload.v !== 1 || typeof payload.b !== "string" || !payload.n || typeof payload.exp !== "number") {
    return { valid: false, reason: "formato" };
  }

  if (Date.now() > payload.exp) {
    return { valid: false, reason: "expirado" };
  }

  return { valid: true, payload };
}

/**
 * Registro de nonces usados (anti-replay).
 *
 * En el MVP vive en memoria del servidor. En producción, `supabase/schema.sql`
 * incluye la tabla `scan_nonces` y la función `redeem_scan_token` que hace esta
 * validación de forma atómica en PostgreSQL.
 */
type NonceStore = Map<string, number>;
const globalStore = globalThis as unknown as { __fielitoNonces?: NonceStore };
const nonces: NonceStore = globalStore.__fielitoNonces ?? new Map();
globalStore.__fielitoNonces = nonces;

export function consumeNonce(nonce: string) {
  const now = Date.now();
  for (const [key, expiresAt] of nonces) {
    if (expiresAt < now) nonces.delete(key);
  }
  if (nonces.has(nonce)) return false;
  nonces.set(nonce, now + 5 * 60 * 1000);
  return true;
}
