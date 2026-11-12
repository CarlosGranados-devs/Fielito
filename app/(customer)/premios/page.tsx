"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  BadgeCheck,
  Gift,
  History,
  MapPin,
  PartyPopper,
  Sparkles,
  Stamp,
  Trophy,
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
import { LoyaltyCard } from "@/components/brand/loyalty-card";
import { useApp } from "@/lib/store";
import { getCustomerCards, getCustomerTransactions } from "@/lib/selectors";
import type { CardWithBusiness } from "@/lib/selectors";
import { formatDateTime } from "@/lib/utils";

export default function CustomerRewardsPage() {
  const { state, profile, claimReward } = useApp();
  const [selected, setSelected] = useState<CardWithBusiness | null>(null);

  const cards = useMemo(
    () => (profile ? getCustomerCards(state, profile.id) : []),
    [state, profile],
  );

  const history = useMemo(() => {
    if (!profile) return [];
    return getCustomerTransactions(state, profile.id).filter(
      (transaction) => transaction.type === "reward_claimed",
    );
  }, [state, profile]);

  if (!profile) return null;

  const ready = cards.filter((item) => item.card.isCompleted);
  const totalRedeemed = cards.reduce((sum, item) => sum + item.card.rewardsRedeemed, 0);
  const totalStamps = cards.reduce((sum, item) => sum + item.card.currentStamps, 0);

  function confirmClaim() {
    if (!selected) return;
    const updated = claimReward(selected.card.id);
    if (!updated) {
      toast.error("Este premio ya fue canjeado");
      setSelected(null);
      return;
    }
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#FBBF24", "#4F46E5", "#10B981", "#FFFFFF"],
    });
    toast.success("¡Premio canjeado!", {
      description: `Muestra esta confirmación en ${selected.business.name}. La tarjeta volvió a cero.`,
    });
    setSelected(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
          <Trophy className="h-3.5 w-3.5" /> Tus logros
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          Premios y recompensas
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Cada sello cuenta. Aquí ves lo que ya ganaste y lo que viene.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {[
          { label: "Listos", value: ready.length, icon: Gift, tone: "bg-amber-50 text-amber-600" },
          { label: "Canjeados", value: totalRedeemed, icon: Trophy, tone: "bg-emerald-50 text-emerald-600" },
          { label: "Sellos activos", value: totalStamps, icon: Stamp, tone: "bg-indigo-50 text-indigo-600" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft sm:gap-3 sm:p-4"
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.tone}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                {item.label}
              </p>
              <p className="font-display text-lg font-bold leading-none text-slate-900 sm:text-xl">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Premios disponibles</h2>
          <Badge variant={ready.length ? "default" : "muted"}>{ready.length} listos</Badge>
        </div>

        {ready.length === 0 ? (
          <div className="mt-3 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-2xl">
              🎯
            </div>
            <h3 className="mt-3 font-display text-base font-semibold text-slate-900">
              Todavía no tienes premios listos
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
              Sigue escaneando en tus negocios favoritos. Cada sello te acerca a tu próxima
              recompensa.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button asChild size="sm">
                <Link href="/escanear">
                  <Sparkles /> Escanear sello
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/mapa">Ver promos</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {ready.map((item) => (
              <div
                key={item.card.id}
                className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-soft sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-emerald-100">
                      {item.business.logoEmoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-display text-sm font-bold text-slate-900">
                          {item.business.name}
                        </p>
                        <Badge variant="success" className="shrink-0">
                          <BadgeCheck className="h-3 w-3" /> Listo
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-slate-600">
                        {item.business.rewardDescription}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                        <MapPin className="h-3 w-3" /> {item.business.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/wallet">Ver tarjeta</Link>
                    </Button>
                    <Button variant="amber" size="sm" onClick={() => setSelected(item)}>
                      <Gift /> Canjear premio
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
            <History className="h-4 w-4 text-slate-400" /> Historial de canjes
          </h2>
          <span className="text-[10px] text-slate-400">{history.length} en total</span>
        </div>

        <ul className="mt-3 divide-y divide-slate-100">
          {history.slice(0, 10).map((transaction) => {
            const business = state.businesses.find(
              (item) => item.id === transaction.businessId,
            );
            return (
              <li key={transaction.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <PartyPopper className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {business?.name ?? "Comercio"}
                  </p>
                  <p className="truncate text-[10px] text-slate-400">
                    {business?.rewardDescription}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-slate-400">
                  {formatDateTime(transaction.scanDate)}
                </span>
              </li>
            );
          })}
          {history.length === 0 && (
            <li className="py-6 text-center text-[11px] text-slate-400">
              Aún no has canjeado premios. ¡Tu primero está más cerca de lo que crees!
            </li>
          )}
        </ul>
      </section>

      <div className="flex flex-col items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-center text-[11px] text-slate-500 shadow-soft sm:flex-row sm:text-left">
        <p>
          ¿Quieres más promos? Explora los negocios afiliados cerca de ti.
        </p>
        <Link
          href="/mapa"
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-indigo-600 hover:underline"
        >
          Ir al mapa <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Canjear premio</DialogTitle>
                <DialogDescription>
                  Confirma que estás en {selected.business.name}. El comercio te entregará:{" "}
                  <strong>{selected.business.rewardDescription}</strong>.
                </DialogDescription>
              </DialogHeader>

              <LoyaltyCard
                businessName={selected.business.name}
                rewardDescription={selected.business.rewardDescription}
                currentStamps={selected.card.currentStamps}
                requiredStamps={selected.business.requiredStamps}
                brandColor={selected.business.brandColor}
                logoEmoji={selected.business.logoEmoji}
                customerName={profile.fullName}
                isCompleted
              />

              <div className="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                Al canjear, tu tarjeta vuelve a 0 sellos y el comercio registrará la entrega. Esta
                acción no se puede deshacer.
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Cancelar
                </Button>
                <Button variant="amber" onClick={confirmClaim}>
                  <Gift /> Sí, canjear ahora
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <p className="text-center text-[10px] text-slate-400">
        Recompensas administradas por cada comercio.{" "}
        <Link href="/legal/terminos#recompensas" className="underline">
          Ver condiciones
        </Link>
      </p>
    </div>
  );
}
