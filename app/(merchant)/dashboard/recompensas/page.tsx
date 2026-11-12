"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CalendarClock,
  Check,
  Gift,
  History,
  PartyPopper,
  Sparkles,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/store";
import { formatDateTime, timeAgo } from "@/lib/utils";
import type { LoyaltyCard, Profile } from "@/lib/types";

const CONFETTI_COLORS = ["#F59E0B", "#FBBF24", "#4F46E5", "#10B981", "#FFFFFF"];

export default function RewardsPage() {
  const { state, business, claimReward } = useApp();
  const [selected, setSelected] = useState<LoyaltyCard | null>(null);

  const pending = useMemo(() => {
    if (!business) return [];
    return state.cards
      .filter((card) => card.businessId === business.id && card.isCompleted)
      .sort((a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt));
  }, [state.cards, business]);

  const history = useMemo(() => {
    if (!business) return [];
    return state.transactions
      .filter(
        (transaction) =>
          transaction.businessId === business.id && transaction.type === "reward_claimed",
      )
      .sort((a, b) => +new Date(b.scanDate) - +new Date(a.scanDate));
  }, [state.transactions, business]);

  if (!business) return null;

  function profileFor(card: LoyaltyCard): Profile | undefined {
    return state.profiles.find((profile) => profile.id === card.customerId);
  }

  const claimedCount = history.length;
  const conversion = claimedCount + pending.length
    ? Math.round((claimedCount / (claimedCount + pending.length)) * 100)
    : 0;

  function confirmClaim() {
    if (!selected) return;
    const customerName = profileFor(selected)?.fullName ?? "Tu cliente";
    const updated = claimReward(selected.id);
    if (!updated) {
      toast.error("Este premio ya fue canjeado");
      setSelected(null);
      return;
    }
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
    });
    toast.success(`¡Premio entregado a ${customerName}!`, {
      description: "La tarjeta volvió a cero y ya puede empezar a sumar de nuevo.",
    });
    setSelected(null);
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pendientes", value: pending.length, icon: Ticket, tone: "bg-amber-50 text-amber-600" },
          { label: "Canjeados", value: claimedCount, icon: Trophy, tone: "bg-emerald-50 text-emerald-600" },
          { label: "Tasa de canje", value: `${conversion}%`, icon: Sparkles, tone: "bg-indigo-50 text-indigo-600" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-soft sm:p-5"
          >
            <span className={`hidden h-10 w-10 place-items-center rounded-xl sm:grid ${item.tone}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                {item.label}
              </p>
              <p className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                  <Gift className="h-4 w-4 text-amber-500" />
                  Premios listos para entregar
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Estos clientes completaron su tarjeta de {business.requiredStamps} sellos.
                </p>
              </div>
              <Badge variant={pending.length ? "default" : "muted"}>
                {pending.length} {pending.length === 1 ? "pendiente" : "pendientes"}
              </Badge>
            </div>

            <div className="mt-4 space-y-2.5">
              {pending.map((card) => {
                const profile = profileFor(card);
                return (
                  <div
                    key={card.id}
                    className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50/80 to-white p-3.5 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-amber-300 text-lg ring-2 ring-white">
                        {profile?.avatarEmoji ?? "👤"}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {profile?.fullName ?? "Cliente"}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {business.rewardDescription}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                          <CalendarClock className="h-3 w-3" />
                          Completó {timeAgo(card.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <div className="mr-1 hidden items-center gap-1 sm:flex">
                        {Array.from({ length: business.requiredStamps }).map((_, index) => (
                          <span
                            key={index}
                            className="grid h-4 w-4 place-items-center rounded-full bg-amber-500 text-[8px] text-white"
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3} />
                          </span>
                        ))}
                      </div>
                      <Button size="sm" variant="amber" onClick={() => setSelected(card)}>
                        <Gift /> Canjear
                      </Button>
                    </div>
                  </div>
                );
              })}

              {pending.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <PartyPopper className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">
                    Todo al día, sin premios pendientes
                  </p>
                  <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
                    Cuando un cliente complete sus {business.requiredStamps} sellos, aparecerá aquí
                    para que le entregues su recompensa.
                  </p>
                  <Button asChild size="sm" variant="outline" className="mt-4">
                    <Link href="/dashboard">Generar QR de sello</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-soft">
            <Badge variant="pro">
              <Sparkles className="h-3 w-3" /> Recomendación
            </Badge>
            <h3 className="mt-3 font-display text-base font-semibold">
              Entrega el premio con una sonrisa
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-white/60">
              Confirma el canje en Fielito justo cuando entregues el producto. Así mantienes tus
              métricas reales y evitas dobles canjes.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-[11px] text-white/70">
              <Users className="h-3.5 w-3.5 text-amber-400" />
              {pending.length} clientes esperando
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-900">
                <History className="h-4 w-4 text-slate-400" /> Historial
              </h3>
              <span className="text-[10px] text-slate-400">{history.length} canjes</span>
            </div>
            <ul className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">
              {history.slice(0, 12).map((transaction) => {
                const profile = state.profiles.find(
                  (item) => item.id === transaction.customerId,
                );
                return (
                  <li key={transaction.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-slate-800">
                        {profile?.fullName ?? "Cliente"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatDateTime(transaction.scanDate)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                      -1
                    </span>
                  </li>
                );
              })}
              {history.length === 0 && (
                <li className="text-[11px] text-slate-400">Aún no has canjeado premios.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[11px] leading-relaxed text-slate-500 shadow-soft">
        <strong className="font-semibold text-slate-700">Importante:</strong> Fielito registra el
        canje, pero la entrega del premio es responsabilidad exclusiva del comercio. Ver{" "}
        <Link href="/legal/terminos#recompensas" className="font-semibold text-indigo-600 underline">
          términos y condiciones
        </Link>
        .
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>¿Entregar el premio?</DialogTitle>
                <DialogDescription>
                  Vas a registrar el canje de <strong>{business.rewardDescription}</strong> para{" "}
                  <strong>{profileFor(selected)?.fullName}</strong>. Su tarjeta volverá a 0 sellos.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl shadow-sm">
                  {profileFor(selected)?.avatarEmoji ?? "🎁"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-950">
                    {profileFor(selected)?.fullName}
                  </p>
                  <p className="text-[11px] text-amber-800/70">
                    Completó {business.requiredStamps} de {business.requiredStamps} sellos
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Cancelar
                </Button>
                <Button variant="amber" onClick={confirmClaim}>
                  <Check /> Marcar como entregado
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
