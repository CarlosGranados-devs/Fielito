"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Gift,
  Lock,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stamp,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScanQrDialog } from "@/components/merchant/scan-qr-dialog";
import { StatCard } from "@/components/merchant/stat-card";
import { WeeklyChart } from "@/components/merchant/weekly-chart";
import { useApp } from "@/lib/store";
import { getMerchantStats } from "@/lib/selectors";
import { cn, timeAgo } from "@/lib/utils";

export default function DashboardPage() {
  const { profile, business, state } = useApp();
  const [qrOpen, setQrOpen] = useState(false);

  const stats = useMemo(
    () => (business ? getMerchantStats(state, business) : null),
    [state, business],
  );

  const advanced = useMemo(() => {
    if (!business) return null;
    const stampTx = state.transactions.filter(
      (transaction) =>
        transaction.businessId === business.id && transaction.type === "stamp_added",
    );
    const perCustomer = new Map<string, number>();
    stampTx.forEach((transaction) => {
      perCustomer.set(
        transaction.customerId,
        (perCustomer.get(transaction.customerId) ?? 0) + 1,
      );
    });
    const repeat = Array.from(perCustomer.values()).filter((value) => value >= 2).length;
    const bestDay = stats
      ? [...stats.daily].sort((a, b) => b.stamps - a.stamps)[0]
      : null;
    return {
      returnRate: perCustomer.size ? Math.round((repeat / perCustomer.size) * 100) : 0,
      perCustomer: perCustomer.size
        ? (stampTx.length / perCustomer.size).toFixed(1)
        : "0",
      bestDay: bestDay?.label ?? "—",
      bestDayStamps: bestDay?.stamps ?? 0,
    };
  }, [business, state.transactions, stats]);

  if (!business || !stats) return null;

  const isPro = business.plan === "pro";
  const firstName = profile?.fullName.split(" ")[0] ?? "hola";
  const yesterday = stats.daily[stats.daily.length - 2]?.stamps ?? 0;
  const today = stats.daily[stats.daily.length - 1]?.stamps ?? 0;
  const weeklyGoal = 60;
  const weeklyProgress = Math.min(100, Math.round((stats.stampsLast7 / weeklyGoal) * 100));
  const todayDate = new Intl.DateTimeFormat("es-SV", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Saludo */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium capitalize text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" /> {todayDate}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Hola, {firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Esto es lo que está pasando hoy en{" "}
            <strong className="font-semibold text-slate-700">{business.name}</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isPro ? "pro" : "default"} className="h-8 px-3">
            {isPro ? (
              <>
                <Crown className="h-3.5 w-3.5" /> Plan Pro
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" /> Plan Gratis
              </>
            )}
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/ajustes">
              Mi tarjeta <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>

      {/* QR + plan */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-6 text-amber-950 shadow-glow sm:p-8 lg:col-span-2">
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(#78350F_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-amber-900/20 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-md">
              <Badge className="border border-amber-950/10 bg-amber-950/10 text-amber-950 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-700 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-800" />
                </span>
                Listo para sellar
              </Badge>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-[1.75rem]">
                Genera el QR de tu próximo sello
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-amber-950/70">
                Muéstralo en tu mostrador. Tus clientes lo escanean desde su billetera y el sello se
                suma al instante.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button variant="dark" size="lg" onClick={() => setQrOpen(true)}>
                  <QrCode /> Generar código QR
                </Button>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-950/10 px-3 py-1.5 text-[11px] font-semibold text-amber-950/80">
                  <Clock className="h-3 w-3" /> Se renueva cada 60 s
                </span>
              </div>
            </div>

            <div className="hidden shrink-0 rotate-3 md:block">
              <div className="w-[168px] rounded-2xl border border-white/50 bg-white p-3.5 shadow-lifted">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-base">
                    {business.logoEmoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-bold text-slate-900">{business.name}</p>
                    <p className="text-[8px] uppercase tracking-wide text-slate-400">Sello digital</p>
                  </div>
                </div>
                <div className="mt-3 grid aspect-square place-items-center rounded-xl bg-slate-900">
                  <QrCode className="h-16 w-16 text-white" strokeWidth={1.4} />
                </div>
                <p className="mt-2 text-center text-[8px] font-medium text-slate-400">
                  Escanea para sumar 1 sello
                </p>
              </div>
              <p className="mt-2 text-center text-[10px] font-bold text-amber-950/60">
                {business.requiredStamps} sellos = {business.rewardDescription}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col justify-between rounded-3xl p-5 shadow-soft sm:p-6",
            isPro
              ? "bg-slate-900 text-white"
              : "border border-slate-200/80 bg-white text-slate-900",
          )}
        >
          <div>
            <div className="flex items-center justify-between">
              <p className={cn("text-[11px] font-bold uppercase tracking-wide", isPro ? "text-amber-400" : "text-slate-400")}>
                Tu plan
              </p>
              <Badge variant={isPro ? "pro" : "muted"}>
                {isPro ? (
                  <>
                    <Crown className="h-3 w-3" /> Pro
                  </>
                ) : (
                  "Gratis"
                )}
              </Badge>
            </div>
            <p className="mt-2 font-display text-xl font-bold">
              {isPro ? "Creciendo sin límites" : "Todo listo para despegar"}
            </p>
            <p className={cn("mt-1 text-xs", isPro ? "text-white/60" : "text-slate-500")}>
              {isPro
                ? "Clientes ilimitados, métricas avanzadas y soporte prioritario."
                : "Hasta 50 clientes registrados, tarjetas ilimitadas y QR dinámico."}
            </p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] font-medium">
                <span className={isPro ? "text-white/60" : "text-slate-500"}>
                  Clientes registrados
                </span>
                <span className={isPro ? "text-white" : "text-slate-900"}>
                  {stats.totalCustomers}
                  {!isPro && " / 50"}
                </span>
              </div>
              <Progress
                value={isPro ? 22 : Math.min((stats.totalCustomers / 50) * 100, 100)}
                className={cn("mt-1.5 h-1.5", isPro && "bg-white/10")}
                indicatorClassName={isPro ? "bg-amber-400" : "bg-amber-500"}
              />
            </div>

            <div className={cn("mt-4 space-y-2 rounded-2xl p-3 text-[11px]", isPro ? "bg-white/5" : "bg-slate-50")}>
              <div className="flex items-center justify-between">
                <span className={isPro ? "text-white/60" : "text-slate-500"}>Meta semanal</span>
                <span className="font-semibold">{weeklyProgress}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isPro ? "text-white/60" : "text-slate-500"}>Premios pendientes</span>
                <span className="font-semibold">{stats.rewardsPending}</span>
              </div>
            </div>
          </div>

          {isPro ? (
            <Button asChild variant="amber" size="sm" className="mt-4 w-full">
              <Link href="/dashboard/planes">
                Gestionar suscripción <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="mt-4 w-full">
              <Link href="/dashboard/planes">
                <Sparkles /> Mejorar a Pro · $14.99
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Clientes totales"
          value={String(stats.totalCustomers)}
          hint={`${Math.max(0, 50 - stats.totalCustomers)} cupos en el plan Gratis`}
          tone="indigo"
        />
        <StatCard
          icon={Stamp}
          label="Sellos hoy"
          value={String(today)}
          hint={`${today >= yesterday ? "+" : ""}${today - yesterday} vs. ayer`}
          tone="amber"
        />
        <StatCard
          icon={Gift}
          label="Premios canjeados"
          value={String(stats.rewardsClaimed)}
          hint={`${stats.rewardsPending} listos para canjear`}
          tone="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label="Sellos esta semana"
          value={String(stats.stampsLast7)}
          hint={`Meta ${weeklyGoal} · ${weeklyProgress}% completado`}
          tone="rose"
        />
      </div>

      {/* Chart + clientes */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyChart data={stats.daily} />
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                <Flame className="h-4 w-4 text-amber-500" />
                Clientes frecuentes
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">Los que más te visitan</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/dashboard/clientes">
                Ver todos <ChevronRight />
              </Link>
            </Button>
          </div>

          <ul className="mt-4 flex-1 divide-y divide-slate-100">
            {stats.topCustomers.slice(0, 5).map((customer) => {
              const profileEmoji = state.profiles.find(
                (item) => item.id === customer.card.customerId,
              )?.avatarEmoji;
              return (
                <li key={customer.card.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm ring-2 ring-white">
                    {profileEmoji ?? customer.fullName[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {customer.fullName}
                    </p>
                    <p className="text-[10px] text-slate-400">{timeAgo(customer.lastVisit)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[10px] font-bold tabular-nums text-slate-500">
                      {customer.card.currentStamps}/{business.requiredStamps}
                    </span>
                    <div className="w-12">
                      <Progress
                        value={(customer.card.currentStamps / business.requiredStamps) * 100}
                        className="h-1.5"
                        indicatorClassName="bg-amber-400"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[10px] leading-relaxed text-slate-500">
            <strong className="font-semibold text-slate-600">Tip:</strong> saluda por su nombre a
            quienes ya tienen un premio listo. Vuelven más rápido.
          </p>
        </div>
      </div>

      {/* Actividad + avanzado */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                <Clock className="h-4 w-4 text-slate-400" />
                Actividad reciente
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">Últimos escaneos y premios</p>
            </div>
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En vivo
            </Badge>
          </div>

          <ul className="mt-4 divide-y divide-slate-100">
            {stats.recent.map((item) => {
              const isReward = item.transaction.type === "reward_claimed";
              const emoji = state.profiles.find(
                (profileItem) => profileItem.id === item.transaction.customerId,
              )?.avatarEmoji;
              return (
                <li key={item.transaction.id} className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm ring-2 ring-white",
                      isReward
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gradient-to-br from-amber-100 to-amber-200",
                    )}
                  >
                    {isReward ? <Gift className="h-4 w-4" /> : emoji ?? "👤"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-slate-600">
                      <strong className="font-semibold text-slate-900">{item.customerName}</strong>{" "}
                      {isReward ? "canjeó un premio" : "sumó 1 sello"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {isReward ? "Recompensa entregada" : "Escaneo verificado"}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {timeAgo(item.transaction.scanDate)}
                  </span>
                </li>
              );
            })}
            {stats.recent.length === 0 && (
              <li className="py-8 text-center text-xs text-slate-400">
                Aún no hay actividad. Genera tu primer QR para empezar.
              </li>
            )}
          </ul>
        </div>

        {isPro ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Métricas Pro
              </h2>
              <Badge variant="pro">Activo</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Tasa de retorno", `${advanced?.returnRate ?? 0}%`, "Clientes con 2+ visitas"],
                ["Sellos por cliente", `${advanced?.perCustomer ?? "0"}`, "Promedio histórico"],
                ["Mejor día", advanced?.bestDay ?? "—", `${advanced?.bestDayStamps ?? 0} sellos emitidos`],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-3.5 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-slate-500">{label}</p>
                    <p className="font-display text-lg font-bold capitalize text-slate-900">
                      {value}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400">{hint}</p>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link href="/dashboard/clientes">
                Exportar clientes <ArrowUpRight />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-soft sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-2xl" />
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                <Lock className="h-4 w-4 text-amber-400" />
                Métricas avanzadas
              </h2>
              <Badge variant="pro">Pro</Badge>
            </div>
            <p className="mt-1.5 text-xs text-white/60">
              Descubre la tasa de retorno, el mejor día y el valor de cada cliente.
            </p>

            <div className="mt-4 space-y-2">
              {[
                ["Tasa de retorno", `${advanced?.returnRate ?? 0}%`],
                ["Sellos por cliente", advanced?.perCustomer ?? "0"],
                ["Mejor día", advanced?.bestDay ?? "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-3"
                >
                  <span className="text-[11px] text-white/50">{label}</span>
                  <span className="select-none font-display text-sm font-bold blur-[5px]">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <Button asChild variant="amber" size="sm" className="mt-4 w-full">
              <Link href="/dashboard/planes">
                <Sparkles /> Desbloquear con Pro
              </Link>
            </Button>
            <p className="mt-2 text-center text-[10px] text-white/30">
              $14.99/mes · Cancela cuando quieras
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 shadow-soft sm:flex-row sm:items-center">
        <p className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          Cada escaneo se valida en el servidor con un token firmado. Los sellos nunca se guardan
          solo en el celular del cliente.
        </p>
        <Link
          href="/legal/terminos#recompensas"
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-indigo-600 hover:underline"
        >
          Responsabilidad del comercio <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <ScanQrDialog open={qrOpen} onOpenChange={setQrOpen} business={business} />
    </div>
  );
}
