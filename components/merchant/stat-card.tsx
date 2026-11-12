import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  rose: "bg-rose-50 text-rose-600 ring-rose-100",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "slate",
  locked = false,
  onLockedClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof tones;
  locked?: boolean;
  onLockedClick?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl ring-1", tones[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className={cn("mt-2 font-display text-3xl font-bold text-slate-900", locked && "blur-[7px] select-none")}>
        {value}
      </p>
      {hint && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-[11px] text-slate-500",
            locked && "blur-[4px] select-none",
          )}
        >
          {!locked && hint.startsWith("+") && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
          {hint}
        </p>
      )}
      {locked && (
        <button
          type="button"
          onClick={onLockedClick}
          className="absolute inset-0 grid place-items-center bg-white/40 backdrop-blur-[1.5px]"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white shadow-lifted">
            <Lock className="h-3 w-3 text-amber-400" /> Disponible en Pro
          </span>
        </button>
      )}
    </div>
  );
}
