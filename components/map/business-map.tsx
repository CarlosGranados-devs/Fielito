"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { ArrowRight, BadgeCheck, MapPin, Plus } from "lucide-react";
import type { Business } from "@/lib/types";
import { BRAND_SOLIDS, CATEGORY_META } from "@/lib/types";

const DEFAULT_CENTER: [number, number] = [13.6929, -89.2182];

function createPin(business: Business) {
  const color = BRAND_SOLIDS[business.brandColor];
  return L.divIcon({
    className: "fielito-pin",
    html: `<div class="fielito-pin-inner" style="background:${color}">${business.logoEmoji}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -24],
  });
}

function FlyTo({ business }: { business: Business | null }) {
  const map = useMap();
  useEffect(() => {
    if (business) {
      map.flyTo([business.latitude, business.longitude], 15, { duration: 0.9 });
    }
  }, [business, map]);
  return null;
}

interface BusinessMapProps {
  businesses: Business[];
  focus?: Business | null;
  cards?: Record<string, { currentStamps: number; isCompleted: boolean }>;
  onJoin?: (business: Business) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function BusinessMap({
  businesses,
  focus,
  cards = {},
  onJoin,
  center = DEFAULT_CENTER,
  zoom = 13,
  className,
}: BusinessMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className ?? "h-full w-full"}
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FlyTo business={focus ?? null} />
      {businesses.map((business) => {
        const card = cards[business.id];
        return (
          <Marker
            key={business.id}
            position={[business.latitude, business.longitude]}
            icon={createPin(business)}
          >
            <Popup closeButton>
              <div className="p-4">
                <div className="flex items-start gap-2.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">
                    {business.logoEmoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold text-slate-900">
                      {business.name}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                      {CATEGORY_META[business.category].label} · {business.requiredStamps} sellos
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Recompensa
                  </p>
                  <p className="text-xs font-semibold text-amber-950">
                    {business.rewardDescription}
                  </p>
                </div>

                <p className="mt-2 flex items-start gap-1 text-[10px] text-slate-500">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                  {business.address}
                </p>

                {card ? (
                  <div className="mt-2.5 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                      <BadgeCheck className="h-3 w-3 text-emerald-500" />
                      {card.isCompleted ? "Premio listo" : "Ya tienes tarjeta"}
                    </span>
                    <span className="text-[10px] font-bold tabular-nums text-slate-700">
                      {card.currentStamps}/{business.requiredStamps}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onJoin?.(business)}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Plus className="h-3 w-3" /> Agregar tarjeta
                  </button>
                )}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cómo llegar <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
