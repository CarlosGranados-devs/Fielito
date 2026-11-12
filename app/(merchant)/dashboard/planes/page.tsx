"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Crown,
  Download,
  ExternalLink,
  Info,
  Lock,
  Minus,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SelectNative } from "@/components/ui/select-native";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type CheckoutStep = "form" | "processing" | "success";

const features = [
  ["Clientes registrados", "Hasta 50", "Ilimitados"],
  ["Tarjetas y sellos", "Ilimitados", "Ilimitados"],
  ["QR dinámico anti-fraude", true, true],
  ["Mapa de promos", true, true],
  ["Métricas básicas del día", true, true],
  ["Métricas avanzadas y cohortes", false, true],
  ["Exportar clientes a CSV", false, true],
  ["Recordatorios de premios", false, true],
  ["Soporte", "Por correo", "Prioritario WhatsApp"],
];

export default function PricingPage() {
  const { business, updateBusiness } = useApp();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [country, setCountry] = useState("SV");
  const [downgradeOpen, setDowngradeOpen] = useState(false);

  const isPro = business?.plan === "pro";

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "pro" && !isPro) {
        setCheckoutOpen(true);
      }
      window.localStorage.removeItem("fielito:plan-intent");
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!business) return null;

  function formatCard(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  function startCheckout() {
    setStep("form");
    setCheckoutOpen(true);
  }

  function pay() {
    setStep("processing");
    window.setTimeout(() => {
      setStep("success");
      updateBusiness(business!.id, { plan: "pro" });
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 },
        colors: ["#F59E0B", "#FBBF24", "#4F46E5", "#A5B4FC", "#FFFFFF"],
      });
      toast.success("¡Pago aprobado! Plan Pro activado", {
        description: "Modo de prueba de Stripe: no se realizó ningún cargo real.",
      });
    }, 1800);
  }

  function downgrade() {
    updateBusiness(business!.id, { plan: "free" });
    setDowngradeOpen(false);
    toast.success("Volviste al plan Gratis", {
      description: "Tu cuenta demo conserva clientes y tarjetas. Las métricas Pro se bloquearon.",
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">
          <Info className="h-3.5 w-3.5" />
          Pagos en modo de prueba (Stripe Test Mode). No se hacen cargos reales.
        </div>
        {isPro && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info("Método de pago ·•••• 4242", {
                description: "Administración de tarjeta simulada para este MVP.",
              })
            }
          >
            <CreditCard /> Administrar pago
          </Button>
        )}
      </div>

      {/* Plan actual */}
      <div
        className={cn(
          "overflow-hidden rounded-3xl p-6 shadow-soft sm:p-7",
          isPro
            ? "bg-slate-900 text-white"
            : "border border-slate-200/80 bg-white",
        )}
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={isPro ? "pro" : "muted"}>
                {isPro ? (
                  <>
                    <Crown className="h-3 w-3" /> Plan Pro
                  </>
                ) : (
                  "Plan Gratis"
                )}
              </Badge>
              <Badge variant={isPro ? "success" : "outline"}>
                {isPro ? "Activo" : "Actual"}
              </Badge>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold">
              {isPro ? "Tu negocio está creciendo sin límites" : "Estás listo para el siguiente paso"}
            </h2>
            <p className={cn("mt-1 text-sm", isPro ? "text-white/60" : "text-slate-500")}>
              {isPro
                ? "Plan Pro · $14.99/mes · Se renueva el 11 de diciembre de 2026"
                : "Llevas 8 de 50 clientes en el plan Gratis. Cuando pases a Pro, el límite desaparece."}
            </p>
          </div>

          <div className="w-full sm:w-64">
            <div className="flex items-center justify-between text-[11px]">
              <span className={isPro ? "text-white/50" : "text-slate-500"}>Uso de clientes</span>
              <span className="font-semibold">
                {isPro ? "Ilimitado" : "8 / 50"}
              </span>
            </div>
            <Progress
              value={isPro ? 18 : 16}
              className={cn("mt-1.5", isPro && "bg-white/10")}
              indicatorClassName={isPro ? "bg-amber-400" : "bg-amber-500"}
            />
            <p className={cn("mt-2 text-[10px]", isPro ? "text-white/40" : "text-slate-400")}>
              {isPro ? "Crece sin preocuparte por cupos." : "16% del plan gratuito utilizado."}
            </p>
          </div>
        </div>
      </div>

      {/* Planes */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Gratis</p>
              <p className="mt-2 font-display text-4xl font-bold text-slate-900">
                $0<span className="text-sm font-medium text-slate-400">/mes</span>
              </p>
            </div>
            {!isPro && <Badge variant="muted">Tu plan actual</Badge>}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Para probar la lealtad digital sin compromiso.
          </p>
          <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-600">
            {[
              "Hasta 50 clientes",
              "Tarjetas y sellos ilimitados",
              "QR dinámico anti-fraude",
              "Mapa de promos",
              "Métricas básicas",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          {isPro ? (
            <Button variant="outline" className="mt-6 w-full" onClick={() => setDowngradeOpen(true)}>
              Volver al plan Gratis
            </Button>
          ) : (
            <Button variant="outline" className="mt-6 w-full" disabled>
              Plan actual
            </Button>
          )}
        </div>

        <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-indigo-500 bg-slate-950 p-6 text-white shadow-lifted sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">Pro</p>
              <p className="mt-2 font-display text-4xl font-bold">
                $14.99<span className="text-sm font-medium text-white/40">/mes</span>
              </p>
            </div>
            {isPro ? (
              <Badge variant="pro">
                <Crown className="h-3 w-3" /> Activo
              </Badge>
            ) : (
              <Badge variant="pro">
                <Sparkles className="h-3 w-3" /> Recomendado
              </Badge>
            )}
          </div>
          <p className="relative mt-2 text-sm text-white/60">
            Para negocios que quieren clientes fieles de verdad.
          </p>
          <ul className="relative mt-5 flex-1 space-y-2.5 text-sm text-white/80">
            {[
              "Clientes ilimitados",
              "Métricas avanzadas y cohortes",
              "Exportar clientes a CSV",
              "Recordatorios de premios",
              "Soporte prioritario por WhatsApp",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-400" />
                {item}
              </li>
            ))}
          </ul>
          {isPro ? (
            <Button variant="amber" className="relative mt-6 w-full" disabled>
              <BadgeCheck /> Ya eres Pro
            </Button>
          ) : (
            <Button variant="amber" className="relative mt-6 w-full" onClick={startCheckout}>
              Actualizar a Pro <ArrowRight />
            </Button>
          )}
          <p className="relative mt-2 text-center text-[10px] text-white/35">
            Pago simulado · Sin contratos · Cancela cuando quieras
          </p>
        </div>
      </div>

      {/* Comparativa */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-slate-900">Compara los planes</h2>
          <p className="text-xs text-slate-500">Todo lo que incluye cada nivel, sin letra pequeña.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Función</th>
                <th className="px-5 py-3 text-center font-semibold">Gratis</th>
                <th className="px-5 py-3 text-center font-semibold text-indigo-600">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {features.map(([label, free, pro]) => (
                <tr key={String(label)}>
                  <td className="px-5 py-3 text-xs text-slate-600">{label}</td>
                  <td className="px-5 py-3 text-center text-xs text-slate-500">
                    {typeof free === "boolean" ? (
                      free ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-slate-300" />
                      )
                    ) : (
                      free
                    )}
                  </td>
                  <td className="bg-indigo-50/30 px-5 py-3 text-center text-xs font-medium text-slate-700">
                    {typeof pro === "boolean" ? (
                      pro ? (
                        <Check className="mx-auto h-4 w-4 text-indigo-600" />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-slate-300" />
                      )
                    ) : (
                      pro
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facturación */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
              <Receipt className="h-4 w-4 text-slate-400" /> Historial de facturación
            </h2>
            <Badge variant="outline">Modo demo</Badge>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {(isPro
              ? [
                  ["11 nov 2026", "$14.99", "Pagado"],
                  ["11 oct 2026", "$14.99", "Pagado"],
                  ["11 sep 2026", "$14.99", "Pagado"],
                ]
              : [["Sin facturas aún", "—", "—"]]
            ).map(([date, amount, status]) => (
              <li key={date} className="flex items-center justify-between gap-3 py-3 text-xs">
                <div>
                  <p className="font-medium text-slate-700">{date}</p>
                  <p className="text-[10px] text-slate-400">Fielito Pro · Mensual</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">{amount}</span>
                  {status === "Pagado" && <Badge variant="success">{status}</Badge>}
                  {status === "Pagado" && (
                    <button
                      type="button"
                      onClick={() =>
                        toast.success("Factura descargada (simulada)", {
                          description: "En producción, Stripe genera el PDF y lo envía por correo.",
                        })
                      }
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                      aria-label="Descargar factura"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Pagos seguros con Stripe
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            En producción, Fielito usa Stripe Checkout con tarjetas, Apple Pay y Google Pay. El MVP
            simula la pasarela y no almacena datos de tarjeta.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {["VISA", "Mastercard", "AMEX", "Apple Pay", "Stripe"].map((brand) => (
              <span
                key={brand}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-500"
              >
                {brand}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-[11px] text-emerald-800">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Los cobros se procesan en los servidores de Stripe. Fielito nunca ve ni guarda tu
              número de tarjeta.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 shadow-soft sm:flex-row">
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          ¿Necesitas más de 5 sucursales o facturación personalizada?
        </p>
        <a
          href="mailto:hola@fielito.sv"
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
        >
          Habla con ventas <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Checkout simulado */}
      <Dialog
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) window.setTimeout(() => setStep("form"), 200);
        }}
      >
        <DialogContent className="max-w-lg p-0">
          {step === "success" ? (
            <div className="p-7 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <BadgeCheck className="h-8 w-8" />
              </div>
              <DialogTitle className="mt-4 text-2xl">¡Pago aprobado!</DialogTitle>
              <DialogDescription className="mt-1.5">
                Tu Plan Pro está activo. Ya puedes usar clientes ilimitados, métricas avanzadas y
                exportaciones.
              </DialogDescription>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-semibold text-slate-900">Fielito Pro · Mensual</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Monto</span>
                  <span className="font-semibold text-slate-900">$14.99 USD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Método</span>
                  <span className="font-mono text-slate-700">•••• 4242</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Factura</span>
                  <span className="font-mono text-slate-700">FI-2026-0114</span>
                </div>
                <div className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-3 text-[10px] text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Prueba de Stripe · Ningún cargo real
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Button asChild variant="default">
                  <Link href="/dashboard">Ir al dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("Recibo enviado (simulado)", {
                      description: "Stripe enviaría la factura al correo del comercio.",
                    })
                  }
                >
                  <Receipt /> Enviar recibo
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-t-3xl bg-slate-950 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500 text-amber-950">
                      <Zap className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Fielito Pro</p>
                      <p className="text-[10px] text-white/50">Suscripción mensual</p>
                    </div>
                  </div>
                  <p className="font-display text-xl font-bold">$14.99</p>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px]">
                  <span className="text-white/60">Total hoy</span>
                  <span className="font-semibold">$14.99 USD</span>
                </div>
              </div>

              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-4 w-4" /> Datos de pago
                  </DialogTitle>
                  <DialogDescription>
                    Modo de prueba: puedes dejar los campos vacíos o usar cualquier tarjeta
                    inventada.
                  </DialogDescription>
                </DialogHeader>

                <button
                  type="button"
                  onClick={() => {
                    setCardNumber("4242 4242 4242 4242");
                    setExpiry("12/29");
                    setCvc("123");
                    setCardName("Carlos Granados");
                    toast.info("Tarjeta de prueba aplicada");
                  }}
                  className="mt-4 flex w-full items-center justify-between rounded-xl border border-dashed border-indigo-200 bg-indigo-50/60 px-3 py-2 text-left text-[11px] font-medium text-indigo-700 transition hover:bg-indigo-50"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Usar tarjeta de prueba 4242
                  </span>
                  <span className="font-mono">12/29 · 123</span>
                </button>

                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-name" className="text-xs">
                      Nombre en la tarjeta
                    </Label>
                    <Input
                      id="card-name"
                      placeholder="Como aparece en la tarjeta"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="card-number" className="text-xs">
                      Número de tarjeta
                    </Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        inputMode="numeric"
                        placeholder="1234 1234 1234 1234"
                        value={cardNumber}
                        onChange={(event) => setCardNumber(formatCard(event.target.value))}
                        className="pr-12 font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                        VISA
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry" className="text-xs">
                        Vencimiento
                      </Label>
                      <Input
                        id="expiry"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvc" className="text-xs">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        inputMode="numeric"
                        placeholder="123"
                        value={cvc}
                        onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs">
                      País
                    </Label>
                    <SelectNative
                      id="country"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                    >
                      <option value="SV">El Salvador</option>
                      <option value="GT">Guatemala</option>
                      <option value="HN">Honduras</option>
                      <option value="US">Estados Unidos</option>
                    </SelectNative>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-5 w-full"
                  onClick={pay}
                  loading={step === "processing"}
                >
                  {step === "processing" ? "Procesando pago..." : "Generar pago de $14.99"}
                  {step !== "processing" && <Lock />}
                </Button>

                <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-400">
                  Al generar el pago aceptas los{" "}
                  <Link href="/legal/terminos" className="underline">
                    términos
                  </Link>{" "}
                  de la suscripción. Renovación automática mensual; cancela cuando quieras. Esta es
                  una simulación: no se realizará ningún cargo.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Downgrade */}
      <Dialog open={downgradeOpen} onOpenChange={setDowngradeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Volver al plan Gratis?</DialogTitle>
            <DialogDescription>
              Mantendrás tus clientes y tarjetas, pero se bloquearán las métricas avanzadas y el
              límite volverá a 50 clientes. Esta acción es de demostración.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDowngradeOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={downgrade}>
              <X /> Sí, volver a Gratis
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
