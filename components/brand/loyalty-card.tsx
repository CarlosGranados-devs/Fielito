"use client";

import { Check, Gift, Sparkles } from "lucide-react";
import type { BrandColor } from "@/lib/types";
import { BRAND_GRADIENTS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LoyaltyCardProps {
  businessName: string;
  rewardDescription: string;
  currentStamps: number;
  requiredStamps: number;
  brandColor?: BrandColor;
  logoEmoji?: string;
  customerName?: string;
  className?: string;
  compact?: boolean;
  isCompleted?: boolean;
  animateLastStamp?: boolean;
}

export function LoyaltyCard({
  businessName,
  rewardDescription,
  currentStamps,
  requiredStamps,
  brandColor = "amber",
  logoEmoji = "☕",
  customerName,
  className,
  compact = false,
  isCompleted,
  animateLastStamp = false,
}: LoyaltyCardProps) {
  const completed = isCompleted ?? currentStamps >= requiredStamps;
  const columns = requiredStamps <= 6 ? requiredStamps : 5;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br text-white shadow-wallet ring-1 ring-white/25",
        BRAND_GRADIENTS[brandColor],
        compact ? "p-5" : "p-5 sm:p-6",
        className,
      )}
    >
      <div className="wallet-shine pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute -right-10 -top-14 -z-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid place-items-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-sm",
              compact ? "h-10 w-10 text-xl" : "h-12 w-12 text-2xl",
            )}
          >
            <span aria-hidden>{logoEmoji}</span>
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                "truncate font-display font-semibold leading-tight text-white",
                compact ? "text-base" : "text-lg",
              )}
            >
              {businessName}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/75">
              Tarjeta de lealtad
            </p>
          </div>
        </div>
        <span className="rounded-full bg-black/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur">
          {completed ? "Premio listo" : `${currentStamps}/${requiredStamps}`}
        </span>
      </div>

      <div className={cn("mt-5", compact ? "mt-4" : "sm:mt-6")}>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: requiredStamps }).map((_, index) => {
            const filled = index < currentStamps;
            const isNewStamp = animateLastStamp && filled && index === currentStamps - 1;
            return (
              <div
                key={index}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-full border shadow-inner transition-colors",
                  compact ? "text-[10px]" : "text-xs",
                  filled
                    ? "border-white/80 bg-white text-slate-900 shadow-sm"
                    : "border-white/40 bg-white/10 text-white/60",
                  isNewStamp && "animate-stamp-pop",
                )}
              >
                {filled ? (
                  <Check className="h-[55%] w-[55%]" strokeWidth={3} />
                ) : (
                  <span className="font-bold text-white/60">{index + 1}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn("mt-5 flex items-end justify-between gap-3", compact && "mt-4")}>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
            Recompensa
          </p>
          <p
            className={cn(
              "mt-0.5 flex items-center gap-1.5 font-semibold leading-snug",
              compact ? "text-xs" : "text-sm",
            )}
          >
            <Gift className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-2">{rewardDescription}</span>
          </p>
        </div>
        {customerName && (
          <p className="shrink-0 text-right text-[10px] font-medium uppercase tracking-wide text-white/70">
            {customerName}
          </p>
        )}
      </div>

      {completed && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-[11px] font-semibold ring-1 ring-white/30 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          ¡Completaste la tarjeta! Reclama tu premio en el local.
        </div>
      )}
    </div>
  );
}
