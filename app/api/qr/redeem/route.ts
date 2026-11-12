import { NextResponse } from "next/server";
import { consumeNonce, verifyScanToken } from "@/lib/qr-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const token =
    typeof body === "object" && body !== null && "token" in body
      ? String((body as { token: unknown }).token)
      : "";

  if (!token) {
    return NextResponse.json({ error: "Falta el código QR" }, { status: 400 });
  }

  const result = verifyScanToken(token);
  if (!result.valid) {
    const message =
      result.reason === "expirado"
        ? "Este código QR expiró. Pide al comercio que genere uno nuevo."
        : "Código QR inválido. Verifica que estés escaneando el código correcto.";
    return NextResponse.json({ error: message, reason: result.reason }, { status: 400 });
  }

  if (!consumeNonce(result.payload.n)) {
    return NextResponse.json(
      { error: "Este código ya fue utilizado. Genera uno nuevo en el comercio." },
      { status: 409 },
    );
  }

  /**
   * Nota de producción:
   * Aquí se debe resolver el usuario autenticado (Supabase Auth) y llamar a la
   * función SQL `redeem_scan_token(token)` con RLS, en lugar de confiar en el
   * cliente. Ver `supabase/schema.sql`.
   */
  return NextResponse.json(
    {
      ok: true,
      businessId: result.payload.b,
      issuedAt: new Date(result.payload.iat).toISOString(),
      redeemedAt: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
