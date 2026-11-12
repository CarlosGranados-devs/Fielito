"use client";

import dynamic from "next/dynamic";
import type { Business } from "@/lib/types";

const BusinessMapInner = dynamic(
  () => import("./business-map").then((module) => module.BusinessMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full w-full place-items-center bg-slate-100">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-xs font-medium">Cargando mapa de promos...</span>
        </div>
      </div>
    ),
  },
);

interface BusinessMapProps {
  businesses: Business[];
  focus?: Business | null;
  cards?: Record<string, { currentStamps: number; isCompleted: boolean }>;
  onJoin?: (business: Business) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function BusinessMapDynamic(props: BusinessMapProps) {
  return <BusinessMapInner {...props} />;
}
