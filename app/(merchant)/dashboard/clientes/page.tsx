"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BellRing,
  Check,
  Gift,
  Mail,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoyaltyCard } from "@/components/brand/loyalty-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/store";
import { downloadCsv, formatDate, formatDateTime, timeAgo } from "@/lib/utils";
import type { LoyaltyCard as LoyaltyCardType, Profile } from "@/lib/types";

type Filter = "all" | "ready" | "close";

interface Row {
  card: LoyaltyCardType;
  profile: Profile | undefined;
  visits: number;
  lastVisit: string;
}

export default function ClientsPage() {
  const { state, business } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Row | null>(null);

  const isPro = business?.plan === "pro";

  const rows = useMemo<Row[]>(() => {
    if (!business) return [];
    return state.cards
      .filter((card) => card.businessId === business.id)
      .map((card) => {
        const profile = state.profiles.find((item) => item.id === card.customerId);
        const transactions = state.transactions
          .filter(
            (transaction) =>
              transaction.cardId === card.id && transaction.type === "stamp_added",
          )
          .sort((a, b) => +new Date(a.scanDate) - +new Date(b.scanDate));
        return {
          card,
          profile,
          visits: transactions.length,
          lastVisit: transactions.length
            ? transactions[transactions.length - 1].scanDate
            : card.updatedAt,
        };
      })
      .sort((a, b) => +new Date(b.lastVisit) - +new Date(a.lastVisit));
  }, [state, business]);

  if (!business) return null;

  const filtered = rows.filter((row) => {
    const query = search.trim().toLowerCase();
    const matchesQuery =
      !query ||
      row.profile?.fullName.toLowerCase().includes(query) ||
      row.profile?.email.toLowerCase().includes(query);
    const closeToReward =
      row.card.currentStamps >= business.requiredStamps - 2 && !row.card.isCompleted;
    const matchesFilter =
      filter === "all" ||
      (filter === "ready" && row.card.isCompleted) ||
      (filter === "close" && closeToReward);
    return matchesQuery && matchesFilter;
  });

  const readyCount = rows.filter((row) => row.card.isCompleted).length;
  const activeThisMonth = rows.filter(
    (row) => Date.now() - new Date(row.lastVisit).getTime() < 30 * 24 * 60 * 60 * 1000,
  ).length;

  function exportCsv() {
    if (!isPro) {
      toast.info("Exportar clientes es una función Pro", {
        description: "Mejora tu plan para descargar tu base de clientes en CSV.",
      });
      return;
    }
    downloadCsv(
      `fielito-clientes-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((row) => ({
        Nombre: row.profile?.fullName ?? "",
        Correo: row.profile?.email ?? "",
        Telefono: row.profile?.phone ?? "",
        Sellos: `${row.card.currentStamps}/${business.requiredStamps}`,
        Visitas: row.visits,
        "Ultima visita": new Date(row.lastVisit).toISOString(),
        Estado: row.card.isCompleted ? "Premio listo" : "En progreso",
      })),
    );
    toast.success("Clientes exportados", {
      description: `${filtered.length} registros descargados en CSV.`,
    });
  }

  const detailTransactions = selected
    ? state.transactions
        .filter((transaction) => transaction.cardId === selected.card.id)
        .sort((a, b) => +new Date(b.scanDate) - +new Date(a.scanDate))
        .slice(0, 6)
    : [];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            {rows.length} clientes registrados en{" "}
            <strong className="font-semibold text-slate-700">{business.name}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}>
            {isPro ? <ArrowUpRight /> : <Sparkles className="text-amber-500" />}
            Exportar CSV
            {!isPro && <Badge variant="pro">Pro</Badge>}
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">
              <Gift /> Generar sello
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total clientes", value: rows.length, icon: Users, tone: "text-indigo-600 bg-indigo-50" },
          { label: "Activos este mes", value: activeThisMonth, icon: Check, tone: "text-emerald-600 bg-emerald-50" },
          { label: "Premios listos", value: readyCount, icon: Gift, tone: "text-amber-600 bg-amber-50" },
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

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-soft">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="pl-10"
            />
          </div>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="ready">Premio listo</TabsTrigger>
              <TabsTrigger value="close">Cerca</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 font-semibold">Cliente</th>
                <th className="px-5 py-3 font-semibold">Progreso</th>
                <th className="px-5 py-3 font-semibold">Visitas</th>
                <th className="px-5 py-3 font-semibold">Última visita</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((row) => (
                <tr key={row.card.id} className="group transition hover:bg-slate-50/60">
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => setSelected(row)}
                      className="flex items-center gap-3 text-left"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm ring-2 ring-white">
                        {row.profile?.avatarEmoji ?? "👤"}
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-slate-900">
                          {row.profile?.fullName ?? "Cliente"}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {row.profile?.email}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: business.requiredStamps }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 w-2.5 rounded-full ${
                              index < row.card.currentStamps ? "bg-amber-500" : "bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold tabular-nums text-slate-500">
                        {row.card.currentStamps}/{business.requiredStamps}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-600">{row.visits}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">{timeAgo(row.lastVisit)}</td>
                  <td className="px-5 py-3.5">
                    {row.card.isCompleted ? (
                      <Badge variant="success">Premio listo</Badge>
                    ) : (
                      <Badge variant="muted">En progreso</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(row)}
                      className="rounded-lg p-1.5 text-slate-300 transition hover:bg-white hover:text-slate-600"
                      aria-label={`Ver ${row.profile?.fullName}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {filtered.map((row) => (
            <li key={row.card.id}>
              <button
                type="button"
                onClick={() => setSelected(row)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-base">
                  {row.profile?.avatarEmoji ?? "👤"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-slate-900">
                      {row.profile?.fullName}
                    </p>
                    {row.card.isCompleted && <Badge variant="success">Listo</Badge>}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {row.card.currentStamps}/{business.requiredStamps} sellos · {row.visits} visitas
                  </p>
                  <div className="mt-1.5 flex gap-0.5">
                    {Array.from({ length: business.requiredStamps }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-1 flex-1 rounded-full ${
                          index < row.card.currentStamps ? "bg-amber-500" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300" />
              </button>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">No encontramos clientes</p>
            <p className="mt-1 text-xs text-slate-500">
              Prueba con otro término o genera un QR para que escaneen.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard">Generar sello</Link>
            </Button>
          </div>
        )}
      </div>

      <p className="text-center text-[11px] text-slate-400">
        Los datos de clientes se usan solo para administrar tu programa de lealtad. Consulta la{" "}
        <Link href="/legal/privacidad" className="font-medium text-slate-500 underline">
          política de privacidad
        </Link>
        .
      </p>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Ficha del cliente</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-xl">
                  {selected.profile?.avatarEmoji ?? "👤"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-semibold text-slate-900">
                    {selected.profile?.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{selected.profile?.email}</p>
                  <p className="text-[11px] text-slate-400">
                    Cliente desde {formatDate(selected.card.createdAt)}
                  </p>
                </div>
                {selected.card.isCompleted ? (
                  <Badge variant="success">Premio listo</Badge>
                ) : (
                  <Badge variant="muted">En progreso</Badge>
                )}
              </div>

              <LoyaltyCard
                businessName={business.name}
                rewardDescription={business.rewardDescription}
                currentStamps={selected.card.currentStamps}
                requiredStamps={business.requiredStamps}
                brandColor={business.brandColor}
                logoEmoji={business.logoEmoji}
                customerName={selected.profile?.fullName}
                compact
              />

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["Visitas", selected.visits],
                  ["Sellos", selected.card.currentStamps],
                  ["Canjes", selected.card.rewardsRedeemed],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 px-2 py-2.5">
                    <p className="font-display text-lg font-bold text-slate-900">{value}</p>
                    <p className="text-[10px] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Últimos movimientos
                </p>
                <ul className="mt-2 space-y-1.5">
                  {detailTransactions.map((transaction) => (
                    <li
                      key={transaction.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-[11px]"
                    >
                      <span className="flex items-center gap-1.5 text-slate-600">
                        {transaction.type === "reward_claimed" ? (
                          <Gift className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Sparkles className="h-3 w-3 text-amber-500" />
                        )}
                        {transaction.type === "reward_claimed" ? "Premio canjeado" : "Sello sumado"}
                      </span>
                      <span className="text-slate-400">{formatDateTime(transaction.scanDate)}</span>
                    </li>
                  ))}
                  {detailTransactions.length === 0 && (
                    <li className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-400">
                      Sin movimientos todavía.
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    toast.success("Recordatorio enviado (demo)", {
                      description: `Le avisamos a ${selected.profile?.fullName} que tiene un premio esperando.`,
                    })
                  }
                >
                  <BellRing /> Recordar premio
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() =>
                    toast.info(`Correo: ${selected.profile?.email}`, {
                      description: "El envío real se conecta con Resend/Supabase en producción.",
                    })
                  }
                >
                  <Mail /> Contactar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
