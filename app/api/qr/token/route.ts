import { NextResponse } from "next/server";
import { createScanToken } from "@/lib/qr-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const businessId =
    typeof body === "object" && body !== null && "businessId" in body
      ? String((body as { businessId: unknown }).businessId)
      : "";

  if (!businessId || businessId.length > 80) {
    return NextResponse.json({ error: "Comercio inválido" }, { status: 400 });
  }

  const scan = createScanToken(businessId);
  return NextResponse.json(scan, {
    headers: { "Cache-Control": "no-store" },
  });
}
