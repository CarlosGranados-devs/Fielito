"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  ChevronRight,
  Gift,
  MapPin,
  Plus,
  Sparkles,
  Stamp,
  Store,
  Wallet,
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
import { CATEGORY_META } from "@/lib/types";
import { formatDateTime, timeAgo } from "@/lib/utils";

export default function WalletPage() {
  const { state, profile, claimReward, joinBusiness } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cards = useMemo(
    () => (profile ? getCustomerCards(state, profile.id) : []),
    [state, profile],
  );

  if (!profile) return null;

  const ownedIds = new Set(cards.map((item) => item.card.businessId));
  const discover = state.businesses.filter((business) => !ownedIds.has(business.id)).slice(0, 4);
  const totalStamps = cards.reduce((sum, item) => sum + item.card.currentStamps, 0);
  const readyRewards = cards.filter((item) => item.card.isCompleted);

  const selected = cards.find((item) => item.card.id === selectedId) ?? null;
  const selectedTransactions = selected
    ? getCustomerTransactions(state, profile.id)
        .filter((transaction) => transaction.cardId === selected.card.id)
        .slice(0, 6)
    : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
  const firstName = profile.fullName.split(" ")[0];
  const nextReward = cards
    .filter((item) => !item.card.isCompleted)
    .sort(
      (a, b) =>
        b.card.currentStamps / b.business.requiredStamps -
        a.card.currentStamps / a.business.requiredStamps,
    )[0];
  const missingStamps = nextReward
    ? nextReward.business.requiredStamps - nextReward.card.currentStamps
    : 0;

  function handleClaim() {
    if (!selected) return;
    const updated = claimReward(selected.card.id);
    if (!updated) {
      toast.error("Este premio ya fue canjeado");
      return;
    }
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#F59E0B", "#FBBF24", "#4F46E5", "#10B981"],
    });
    toast.success("¡Premio canjeado!", {
      description: `Muestra esta confirmación en ${selected.business.name} para recibir tu ${selected.business.rewardDescription.toLowerCase()}.`,
    });
    setSelectedId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium capitalize text-slate-500">
            {new Intl.DateTimeFormat("es-SV", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(new Date())}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {nextReward
              ? `Te ${missingStamps === 1 ? "falta 1 sello" : `faltan ${missingStamps} sellos`} para tu premio en ${nextReward.business.name}.`
              : "Todas tus tarjetas están al día. ¡A seguir sumando!"}
          </p>
        </div>
        <Badge className="hidden shrink-0 gap-1 bg-slate-900 px-3 py-1.5 text-white sm:inline-flex">
          <Sparkles className="h-3 w-3 text-amber-400" /> Miembro Fiel
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {[
          { label: "Tarjetas", value: cards.length, icon: Wallet, tone: "bg-indigo-50 text-indigo-600" },
          { label: "Sellos", value: totalStamps, icon: Stamp, tone: "bg-amber-50 text-amber-600" },
          { label: "Premios listos", value: readyRewards.length, icon: Gift, tone: "bg-emerald-50 text-emerald-600" },
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

      {readyRewards.length > 0 && (
        <Link
          href="/premios"
          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900 p-4 text-white shadow-soft transition hover:bg-slate-800"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-amber-950">
              <Gift className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {readyRewards.length === 1
                  ? "Tienes 1 premio listo para disfrutar"
                  : `Tienes ${readyRewards.length} premios listos para disfrutar`}
              </p>
              <p className="text-[11px] text-white/60">
                {readyRewards.map((item) => item.business.name).join(" · ")}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-amber-400" />
        </Link>
      )}

      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Mis tarjetas</h2>
            <p className="text-xs text-slate-500">Toca una tarjeta para ver el detalle</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
            <Link href="/mapa">
              Agregar <Plus className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {cards.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-2xl">
              👜
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">
              Tu billetera está vacía
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500">
              Agrega una tarjeta de un negocio cerca de ti y empieza a sumar sellos hoy.
            </p>
            <Button asChild className="mt-4">
              <Link href="/mapa">
                <MapPin /> Explorar promos
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-3">
            {cards.map(({ card, business }) => (
              <div
                key={card.id}
                className="w-[86%] min-w-[86%] shrink-0 snap-center md:w-auto md:min-w-0"
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(card.id)}
                  className="block w-full text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <LoyaltyCard
                    businessName={business.name}
                    rewardDescription={business.rewardDescription}
                    currentStamps={card.currentStamps}
                    requiredStamps={business.requiredStamps}
                    brandColor={business.brandColor}
                    logoEmoji={business.logoEmoji}
                    isCompleted={card.isCompleted}
                  />
                </button>
                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <p className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{business.address}</span>
                  </p>
                  {card.isCompleted ? (
                    <button
                      type="button"
                      onClick={() => setSelectedId(card.id)}
                      className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700"
                    >
                      <Gift className="h-3 w-3" /> Canjear
                    </button>
                  ) : (
                    <span className="shrink-0 text-[10px] font-semibold text-amber-600">
                      {business.requiredStamps - card.currentStamps} para el premio
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {discover.length > 0 && (
        <section>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Descubre cerca de ti</h2>
              <p className="text-xs text-slate-500">Negocios con promos activas en San Salvador</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="px-2 text-xs">
              <Link href="/mapa">
                Ver mapa <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {discover.map((business) => (
              <div
                key={business.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-50 text-xl ring-1 ring-slate-100">
                  {business.logoEmoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{business.name}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {business.rewardDescription} · {business.requiredStamps} sellos
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                    <Store className="h-3 w-3" />
                    {CATEGORY_META[business.category].label}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    joinBusiness(business.id);
                    toast.success(`Tarjeta de ${business.name} agregada`, {
                      description: "Ya puedes sumar tu primer sello escaneando su QR.",
                    });
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100"
                  aria-label={`Agregar ${business.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-[11px] leading-relaxed text-slate-500 shadow-soft">
        <strong className="font-semibold text-slate-700">Recuerda:</strong> Fielito registra tus
        sellos, pero cada comercio es responsable de entregar la recompensa prometida.{" "}
        <Link href="/legal/terminos" className="font-semibold text-indigo-600 underline">
          Ver condiciones
        </Link>
        .
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xl">{selected.business.logoEmoji}</span>
                  {selected.business.name}
                </DialogTitle>
                <DialogDescription>
                  {CATEGORY_META[selected.business.category].label} ·{" "}
                  {selected.business.address}
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
                isCompleted={selected.card.isCompleted}
              />

              {selected.card.isCompleted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                    <Gift className="h-4 w-4" /> ¡Tu premio está listo!
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
                    Muestra esta tarjeta en {selected.business.name} para recibir:{" "}
                    <strong>{selected.business.rewardDescription}</strong>. Al canjearlo, la
                    tarjeta vuelve a cero.
                  </p>
                  <Button variant="amber" className="mt-3 w-full" onClick={handleClaim}>
                    <Gift /> Canjear premio ahora
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3.5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Próximo premio
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {selected.business.requiredStamps - selected.card.currentStamps} sellos más
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/escanear">
                      <Sparkles /> Escanear
                    </Link>
                  </Button>
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Movimientos recientes
                </p>
                <ul className="mt-2 space-y-1.5">
                  {selectedTransactions.map((transaction) => (
                    <li
                      key={transaction.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[11px]"
                    >
                      <span className="flex items-center gap-1.5 text-slate-600">
                        {transaction.type === "reward_claimed" ? (
                          <Gift className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Stamp className="h-3 w-3 text-amber-500" />
                        )}
                        {transaction.type === "reward_claimed" ? "Premio canjeado" : "Sello sumado"}
                      </span>
                      <span className="text-slate-400">
                        {transaction.type === "stamp_added"
                          ? timeAgo(transaction.scanDate)
                          : formatDateTime(transaction.scanDate)}
                      </span>
                    </li>
                  ))}
                  {selectedTransactions.length === 0 && (
                    <li className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-400">
                      Aún no hay movimientos en esta tarjeta.
                    </li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link href="/mapa">
                    <MapPin /> Ver en el mapa
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    toast.info("Código de cliente", {
                      description: "En producción, el comercio puede buscar tu tarjeta por este ID.",
                    })
                  }
                >
                  ID: {selected.card.id.slice(-6)}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
