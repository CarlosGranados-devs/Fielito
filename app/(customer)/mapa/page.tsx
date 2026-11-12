"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { BusinessMapDynamic } from "@/components/map/business-map-dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import { CATEGORY_META } from "@/lib/types";
import type { Business, BusinessCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | BusinessCategory;

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function MapPage() {
  const { state, profile, joinBusiness } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<Business | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const cards = useMemo(() => {
    if (!profile) return {};
    return Object.fromEntries(
      state.cards
        .filter((card) => card.customerId === profile.id)
        .map((card) => [
          card.businessId,
          { currentStamps: card.currentStamps, isCompleted: card.isCompleted },
        ]),
    );
  }, [state.cards, profile]);

  const list = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return state.businesses
      .filter((business) => {
        const matchesCategory = filter === "all" || business.category === filter;
        const matchesQuery =
          !normalized ||
          business.name.toLowerCase().includes(normalized) ||
          business.rewardDescription.toLowerCase().includes(normalized);
        return matchesCategory && matchesQuery;
      })
      .map((business) => ({
        business,
        distance: coords
          ? haversine(coords.lat, coords.lng, business.latitude, business.longitude)
          : null,
      }))
      .sort((a, b) => {
        if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
        return 0;
      });
  }, [state.businesses, filter, query, coords]);

  if (!profile) return null;

  function locate() {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }
    toast.info("Buscando tu ubicación...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        toast.success("Mostrando los negocios más cercanos a ti");
      },
      () => {
        toast.error("No pudimos obtener tu ubicación", {
          description: "Activa el permiso de ubicación o usa el mapa manualmente.",
        });
      },
      { timeout: 8000 },
    );
  }

  function handleJoin(business: Business) {
    joinBusiness(business.id);
    toast.success(`Tarjeta de ${business.name} agregada`, {
      description: "Escanea el QR del local para sumar tu primer sello.",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
            <Compass className="h-3.5 w-3.5" /> Descubre
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Promos cerca de ti
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {list.length} negocios afiliados en San Salvador. Toca un pin para ver la recompensa.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={locate} className="w-fit">
          <LocateFixed className={cn(coords && "text-indigo-600")} />
          {coords ? "Ubicación activa" : "Usar mi ubicación"}
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar café, pupusas, car wash..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition",
              filter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            Todos
          </button>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as Filter)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition",
                filter === key
                  ? "bg-amber-500 text-amber-950 shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <span aria-hidden>{meta.emoji}</span>
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.25fr]">
        <div className="order-2 space-y-2.5 lg:order-1 lg:max-h-[calc(100dvh-15rem)] lg:overflow-y-auto lg:pr-1">
          {list.map(({ business, distance }) => {
            const card = cards[business.id];
            const isFocused = focus?.id === business.id;
            return (
              <div
                key={business.id}
                className={cn(
                  "rounded-2xl border bg-white p-3.5 shadow-soft transition",
                  isFocused
                    ? "border-amber-300 ring-2 ring-amber-100"
                    : "border-slate-200/80 hover:border-amber-200",
                )}
              >
                <button
                  type="button"
                  onClick={() => setFocus(business)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ring-1 ring-slate-100"
                    style={{ backgroundColor: "#F8FAFC" }}
                  >
                    {business.logoEmoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-bold text-slate-900">
                          {business.name}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {CATEGORY_META[business.category].label} · {business.requiredStamps}{" "}
                          sellos
                        </p>
                      </div>
                      {distance !== null ? (
                        <Badge variant="indigo" className="shrink-0">
                          <Navigation className="h-2.5 w-2.5" />
                          {distance < 1
                            ? `${Math.round(distance * 1000)} m`
                            : `${distance.toFixed(1)} km`}
                        </Badge>
                      ) : (
                        <Badge variant="success" className="shrink-0 gap-1">
                          <Star className="h-2.5 w-2.5 fill-current" /> Activa
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-[11px] font-medium text-amber-700">
                      🎁 {business.rewardDescription}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{business.address}</span>
                    </p>
                  </div>
                </button>

                <div className="mt-2 flex items-center justify-between gap-2 pl-[60px]">
                  {card ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                      <BadgeCheck className="h-3 w-3" />
                      {card.isCompleted
                        ? "Premio listo"
                        : `Tu tarjeta: ${card.currentStamps}/${business.requiredStamps}`}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      Aún no tienes esta tarjeta
                    </span>
                  )}
                  {!card ? (
                    <button
                      type="button"
                      onClick={() => handleJoin(business)}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 transition hover:bg-indigo-100"
                    >
                      <Plus className="h-3 w-3" /> Agregar
                    </button>
                  ) : (
                    <Link
                      href="/wallet"
                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                      Ver tarjeta <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {list.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-slate-900">Sin resultados</p>
              <p className="mt-1 text-xs text-slate-500">
                Prueba con otra categoría o borra la búsqueda.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  setFilter("all");
                  setQuery("");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          <p className="px-1 text-[10px] leading-relaxed text-slate-400">
            Ubicaciones aproximadas para el MVP. El mapa usa OpenStreetMap + Leaflet. Las recompensas
            son responsabilidad de cada comercio.
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative h-[360px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-soft sm:h-[460px] lg:sticky lg:top-24 lg:h-[calc(100dvh-9rem)]">
            <BusinessMapDynamic
              businesses={list.map((item) => item.business)}
              focus={focus}
              cards={cards}
              onJoin={handleJoin}
              center={coords ? [coords.lat, coords.lng] : undefined}
              zoom={coords ? 14 : 13}
              className="h-full w-full"
            />

            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[400] flex items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 shadow-lifted backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-xs">
                  📍
                </span>
                <div>
                  <p className="text-[10px] font-bold text-slate-900">San Salvador</p>
                  <p className="text-[9px] text-slate-500">
                    {list.length} promos · {Object.keys(cards).length} tarjetas tuyas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={locate}
                className="pointer-events-auto flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1.5 text-[9px] font-bold text-white transition hover:bg-slate-800"
              >
                <LocateFixed className="h-3 w-3 text-amber-400" /> Centrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
