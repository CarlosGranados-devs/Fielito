"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  Check,
  Copy,
  Gift,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PENDING_SCAN_KEY } from "@/lib/scan-handoff";
import { useApp } from "@/lib/store";
import type { Business } from "@/lib/types";

interface ScanSession {
  token: string;
  expiresAt: number;
  ttlSeconds: number;
}

export function ScanQrDialog({
  open,
  onOpenChange,
  business,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: Business;
}) {
  const { signInDemo } = useApp();
  const [session, setSession] = useState<ScanSession | null>(null);
  const [remaining, setRemaining] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const refreshing = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshing.current || !business) return;
    refreshing.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/qr/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id }),
      });
      if (!response.ok) throw new Error("No se pudo generar el código");
      const data = (await response.json()) as ScanSession;
      setSession(data);
      setRemaining(Math.max(0, Math.ceil((data.expiresAt - Date.now()) / 1000)));
    } catch {
      setError("No pudimos generar el código. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
      refreshing.current = false;
    }
  }, [business]);

  useEffect(() => {
    if (open) {
      setSession(null);
      void refresh();
    }
  }, [open, refresh]);

  useEffect(() => {
    if (!open || !session) return;
    const interval = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((session.expiresAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) void refresh();
    }, 1000);
    return () => window.clearInterval(interval);
  }, [open, session, refresh]);

  const ttl = session?.ttlSeconds ?? 60;
  const progress = Math.max(0, Math.min(100, (remaining / ttl) * 100));

  async function copyLink() {
    if (!session) return;
    const url = `${window.location.origin}/escanear?token=${encodeURIComponent(session.token)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Enlace de prueba copiado", {
        description: "Ábrelo en la cuenta de cliente demo para simular el escaneo.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar. Selecciona el enlace manualmente.");
    }
  }

  function tryAsCustomer() {
    if (!session) return;
    // El cambio de rol redirige a /wallet; el token se entrega al shell de
    // cliente para que abra el escáner y canjee el sello automáticamente.
    window.sessionStorage.setItem(PENDING_SCAN_KEY, session.token);
    signInDemo("customer");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <div className="rounded-t-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 px-6 pb-5 pt-6 text-amber-950">
          <Badge className="border border-amber-950/10 bg-white/30 text-amber-950 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700" />
            </span>
            QR dinámico activo
          </Badge>
          <DialogHeader className="mt-3">
            <DialogTitle className="text-2xl text-amber-950">
              Suma un sello en {business.name}
            </DialogTitle>
            <DialogDescription className="text-amber-950/70">
              Muestra este código en tu mostrador. Se renueva automáticamente cada minuto y solo
              puede usarse una vez.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6">
          <div className="mx-auto mt-5 w-full max-w-[280px]">
            <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
              <span className="absolute -left-1.5 -top-1.5 h-5 w-5 rounded-tl-xl border-l-2 border-t-2 border-amber-400" />
              <span className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-tr-xl border-r-2 border-t-2 border-amber-400" />
              <span className="absolute -bottom-1.5 -left-1.5 h-5 w-5 rounded-bl-xl border-b-2 border-l-2 border-amber-400" />
              <span className="absolute -bottom-1.5 -right-1.5 h-5 w-5 rounded-br-xl border-b-2 border-r-2 border-amber-400" />

              {session ? (
                <QRCode
                  value={session.token}
                  size={240}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <div className="grid aspect-square w-full place-items-center rounded-xl bg-slate-50">
                  {error ? (
                    <div className="px-4 text-center">
                      <p className="text-xs text-rose-600">{error}</p>
                      <Button size="sm" variant="outline" className="mt-3" onClick={() => void refresh()}>
                        <RefreshCw /> Reintentar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                      <span className="text-xs">Generando código seguro...</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <Progress
                    value={progress}
                    className="h-1.5"
                    indicatorClassName={remaining <= 10 ? "bg-rose-500" : "bg-emerald-500"}
                  />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold tabular-nums text-slate-600">
                  <Timer className="h-3 w-3" />
                  {String(Math.floor(remaining / 60)).padStart(2, "0")}:
                  {String(remaining % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <Gift className="h-3.5 w-3.5 text-amber-500" />
                {business.rewardDescription}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Tarjeta de {business.requiredStamps} sellos · {business.category === "cafe" ? "Café" : business.category === "comida" ? "Comida" : "Servicios"}
              </p>
            </div>
            {session && (
              <span className="shrink-0 rounded-lg bg-white px-2 py-1 font-mono text-[10px] text-slate-400 ring-1 ring-slate-200">
                #{session.token.slice(-6)}
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button variant="amber" onClick={tryAsCustomer} disabled={!session}>
              <Smartphone /> Probar escaneo (demo)
            </Button>
            <Button variant="outline" onClick={copyLink} disabled={!session}>
              {copied ? <Check className="text-emerald-500" /> : <Copy />}
              {copied ? "Enlace copiado" : "Copiar enlace de prueba"}
            </Button>
          </div>

          <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            Token firmado con HMAC-SHA256, válido por 60 segundos y de un solo uso. Una captura de
            pantalla deja de funcionar al expirar.
          </p>

          {loading && session && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin" /> Renovando código...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
