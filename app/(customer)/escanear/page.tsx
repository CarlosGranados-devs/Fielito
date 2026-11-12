"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { Html5Qrcode } from "html5-qrcode";
import {
  ArrowRight,
  Camera,
  CameraOff,
  Check,
  Gift,
  History,
  Keyboard,
  Loader2,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stamp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { getCustomerTransactions, getCustomerCards } from "@/lib/selectors";
import type { ScanResult } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/utils";

function extractToken(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.includes("token=")) {
    try {
      const url = new URL(trimmed);
      return url.searchParams.get("token") ?? trimmed;
    } catch {
      const match = trimmed.match(/token=([^&\s]+)/);
      return match ? decodeURIComponent(match[1]) : trimmed;
    }
  }
  return trimmed;
}

export default function ScanPage() {
  const { state, profile, addStamp } = useApp();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const autoRedeemed = useRef(false);
  const processingRef = useRef(false);

  const recent = profile
    ? getCustomerTransactions(state, profile.id)
        .filter((transaction) => transaction.type === "stamp_added")
        .slice(0, 5)
    : [];
  const cards = profile ? getCustomerCards(state, profile.id) : [];

  async function stopScanner() {
    const scanner = scannerRef.current;
    if (!scanner) {
      setCameraActive(false);
      return;
    }
    try {
      await scanner.stop();
      scanner.clear();
    } catch {
      // La cámara pudo haberse detenido ya.
    }
    scannerRef.current = null;
    setCameraActive(false);
  }

  async function startScanner() {
    setStarting(true);
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const element = document.getElementById("fielito-scanner");
      if (!element) throw new Error("Contenedor no disponible");
      const scanner = new Html5Qrcode("fielito-scanner", { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (decodedText) => {
          void redeemToken(extractToken(decodedText));
        },
        () => {
          // Ignorar lecturas fallidas mientras enfoca.
        },
      );
      setCameraActive(true);
      toast.success("Cámara activa", {
        description: "Apunta al QR que muestra el comercio.",
      });
    } catch {
      setCameraError(
        "No pudimos acceder a la cámara. Revisa los permisos del navegador o usa el código de demostración.",
      );
      toast.error("Cámara no disponible", {
        description: "Puedes probar el flujo con el botón de demostración.",
      });
    } finally {
      setStarting(false);
    }
  }

  async function redeemToken(rawToken: string) {
    if (!profile) return;
    if (processingRef.current) return;
    const token = extractToken(rawToken);
    if (!token) {
      toast.error("Código vacío");
      return;
    }
    processingRef.current = true;
    setProcessing(true);
    await stopScanner();
    try {
      const response = await fetch("/api/qr/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await response.json()) as { businessId?: string; error?: string };
      if (!response.ok || !data.businessId) {
        toast.error(data.error ?? "No pudimos validar el código QR");
        return;
      }

      const business = state.businesses.find((item) => item.id === data.businessId);
      if (!business) {
        toast.error("Este comercio no está disponible en la demo");
        return;
      }

      const result = addStamp(business.id, profile.id);
      if (!result) {
        toast.error("No pudimos sumar el sello. Intenta de nuevo.");
        return;
      }

      setScanResult(result);
      setManualToken("");
      if (result.completed) {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.55 },
          colors: ["#F59E0B", "#FBBF24", "#4F46E5", "#10B981", "#FFFFFF"],
        });
        toast.success("¡Completaste la tarjeta!", {
          description: `Tu premio en ${business.name} está listo para canjear.`,
        });
      } else {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F59E0B", "#FBBF24", "#FFFFFF"],
        });
        toast.success("¡+1 sello sumado!", {
          description: `${result.stampsAfter} de ${business.requiredStamps} en ${business.name}.`,
        });
      }
    } catch {
      toast.error("Error de conexión", {
        description: "Verifica tu internet e intenta de nuevo.",
      });
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }

  async function demoScan() {
    const business = state.businesses.find((item) => item.id === "b_cafe") ?? state.businesses[0];
    if (!business) return;
    setProcessing(true);
    try {
      const response = await fetch("/api/qr/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id }),
      });
      if (!response.ok) throw new Error("token");
      const data = (await response.json()) as { token: string };
      await redeemToken(data.token);
    } catch {
      toast.error("No pudimos generar el QR de demostración");
      setProcessing(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token && !autoRedeemed.current) {
      autoRedeemed.current = true;
      window.history.replaceState({}, "", "/escanear");
      void redeemToken(token);
    }
    return () => {
      void stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile) return null;

  const resultBusiness = scanResult?.business;
  const missingToReward =
    scanResult && resultBusiness
      ? resultBusiness.requiredStamps - scanResult.stampsAfter
      : 0;
  const cardForResult = scanResult
    ? cards.find((item) => item.business.id === scanResult.business.id)
    : null;

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <Badge className="gap-1 bg-amber-100 text-amber-800">
          <ScanLine className="h-3 w-3" /> Escáner de sellos
        </Badge>
        <h1 className="mt-3 font-display text-2xl font-bold text-slate-900">
          Escanea y suma un sello
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Apunta la cámara al QR del comercio. También puedes probar el flujo completo en modo demo.
        </p>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-slate-950 p-4 shadow-lifted">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-900">
          <div id="fielito-scanner" className="h-full w-full overflow-hidden [&>video]:h-full [&>video]:w-full [&>video]:object-cover" />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white/5 ring-1 ring-white/10">
                  <QrCode className="h-10 w-10 text-white/70" />
                </div>
                <span className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-amber-500 text-amber-950">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {cameraError ? "Cámara no disponible" : "Tu cámara está lista"}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/50">
                  {cameraError ??
                    "Activa la cámara y apunta al código QR que muestra el comercio en su mostrador."}
                </p>
              </div>
              <Button variant="amber" onClick={startScanner} loading={starting}>
                <Camera /> {starting ? "Abriendo cámara..." : "Activar cámara"}
              </Button>
            </div>
          )}

          {cameraActive && (
            <>
              <div className="pointer-events-none absolute inset-0 z-10">
                <div className="absolute inset-x-[18%] inset-y-[18%]">
                  <span className="absolute -left-1 -top-1 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-amber-400" />
                  <span className="absolute -right-1 -top-1 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-amber-400" />
                  <span className="absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-amber-400" />
                  <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-amber-400" />
                  <div className="absolute inset-x-0 top-2 h-0.5 animate-scan-line bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#F59E0B]" />
                </div>
                <div className="absolute inset-x-0 bottom-3 flex justify-center">
                  <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-medium text-white backdrop-blur">
                    Buscando código...
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void stopScanner()}
                className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
                aria-label="Detener cámara"
              >
                <CameraOff className="h-4 w-4" />
              </button>
            </>
          )}

          {processing && (
            <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-white">
                <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
                <p className="text-xs font-medium">Validando sello...</p>
                <p className="text-[10px] text-white/50">Verificando firma y expiración</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <Button variant="outline" size="lg" onClick={demoScan} disabled={processing}>
          <Zap className="text-amber-500" /> Escanear QR de demostración
        </Button>
        <p className="text-center text-[10px] text-slate-400">
          Genera un sello en Café La Esquina para probar la experiencia completa.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
          <Keyboard className="h-4 w-4 text-slate-400" /> Ingresar código manualmente
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Si el QR no escanea, pide al comercio que comparta el enlace de su código.
        </p>
        <div className="mt-3 flex gap-2">
          <Input
            value={manualToken}
            onChange={(event) => setManualToken(event.target.value)}
            placeholder="Pega el token del QR..."
            className="font-mono text-xs"
          />
          <Button
            onClick={() => void redeemToken(manualToken)}
            disabled={!manualToken.trim() || processing}
            variant="secondary"
            size="icon"
            aria-label="Validar código"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
          <History className="h-4 w-4 text-slate-400" /> Tus últimos sellos
        </p>
        <ul className="mt-2 divide-y divide-slate-100">
          {recent.map((transaction) => {
            const business = state.businesses.find(
              (item) => item.id === transaction.businessId,
            );
            return (
              <li key={transaction.id} className="flex items-center gap-2.5 py-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-sm">
                  {business?.logoEmoji ?? "☕"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-slate-800">
                    {business?.name ?? "Comercio"}
                  </p>
                  <p className="text-[9px] text-slate-400">{formatDateTime(transaction.scanDate)}</p>
                </div>
                <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  <Stamp className="h-2.5 w-2.5" /> +1
                </span>
              </li>
            );
          })}
          {recent.length === 0 && (
            <li className="py-4 text-center text-[11px] text-slate-400">
              Aún no has escaneado sellos. ¡Empieza hoy!
            </li>
          )}
        </ul>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50/70 p-3.5 text-[11px] leading-relaxed text-amber-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>
          Cada código es único, firmado y vence en 60 segundos. No se puede reutilizar una captura
          de pantalla. Si el código está vencido, pide uno nuevo.
        </p>
      </div>

      <Dialog open={Boolean(scanResult)} onOpenChange={(open) => !open && setScanResult(null)}>
        <DialogContent className="max-w-sm p-0">
          {scanResult && resultBusiness && (
            <>
              <div
                className={`relative overflow-hidden rounded-t-3xl px-6 pb-6 pt-7 text-center ${
                  scanResult.completed
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                    : "bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1.5px,transparent_1px)] [background-size:18px_18px]" />
                <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 text-3xl ring-1 ring-white/30 backdrop-blur">
                  {scanResult.completed ? "🎁" : resultBusiness.logoEmoji}
                </div>
                <DialogTitle className="relative mt-3 text-2xl">
                  {scanResult.completed ? "¡Premio desbloqueado!" : "¡Sello sumado!"}
                </DialogTitle>
                <DialogDescription
                  className={`relative mt-1 ${scanResult.completed ? "text-white/80" : "text-amber-950/70"}`}
                >
                  {scanResult.completed
                    ? `Completaste tu tarjeta en ${resultBusiness.name}`
                    : `+1 sello en ${resultBusiness.name}`}
                </DialogDescription>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Tu tarjeta: {scanResult.stampsAfter}/{resultBusiness.requiredStamps}
                  </p>
                  <Badge variant={scanResult.completed ? "success" : "default"}>
                    {scanResult.completed ? "Premio listo" : "En progreso"}
                  </Badge>
                </div>
                <Progress
                  value={(scanResult.stampsAfter / resultBusiness.requiredStamps) * 100}
                  className="mt-2 h-2"
                  indicatorClassName={scanResult.completed ? "bg-emerald-500" : "bg-amber-500"}
                />
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: resultBusiness.requiredStamps }).map((_, index) => (
                    <div
                      key={index}
                      className={`grid aspect-square flex-1 place-items-center rounded-full border ${
                        index < scanResult.stampsAfter
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-300"
                      }`}
                    >
                      {index < scanResult.stampsAfter ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : (
                        <span className="text-[8px] font-bold">{index + 1}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-900">
                    <Gift className="h-3.5 w-3.5 text-amber-500" />
                    {resultBusiness.rewardDescription}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                    {scanResult.completed
                      ? "Muéstralo en el local para reclamar tu premio. Al canjearlo, la tarjeta vuelve a cero."
                      : `Te ${missingToReward === 1 ? "falta 1 sello" : `faltan ${missingToReward} sellos`} para tu recompensa.`}
                  </p>
                </div>

                <div className="mt-4 grid gap-2">
                  <Button asChild variant={scanResult.completed ? "success" : "default"}>
                    <Link href={scanResult.completed ? "/premios" : "/wallet"}>
                      {scanResult.completed ? (
                        <>
                          <Gift /> Ver mi premio
                        </>
                      ) : (
                        <>
                          <Sparkles /> Ver mi billetera
                        </>
                      )}
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setScanResult(null)}>
                    Escanear otro sello
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {cardForResult && scanResult && !scanResult.completed && (
        <p className="mt-3 text-center text-[10px] text-slate-400">
          Último escaneo {timeAgo(new Date().toISOString())}
        </p>
      )}
    </div>
  );
}
