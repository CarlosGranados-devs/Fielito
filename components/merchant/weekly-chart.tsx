import { BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DailyPoint {
  date: string;
  label: string;
  stamps: number;
  rewards: number;
}

export function WeeklyChart({ data }: { data: DailyPoint[] }) {
  const max = Math.max(1, ...data.map((point) => Math.max(point.stamps, point.rewards)));
  const ticks = [max, Math.round(max * 0.66), Math.round(max * 0.33), 0];
  const totalStamps = data.reduce((sum, point) => sum + point.stamps, 0);
  const totalRewards = data.reduce((sum, point) => sum + point.rewards, 0);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
            <BarChart3 className="h-4 w-4 text-slate-400" />
            Actividad de la semana
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">Sellos emitidos y premios canjeados</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Sellos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Premios
          </span>
          <Badge variant="muted" className="hidden sm:inline-flex">
            {totalStamps} sellos · {totalRewards} premios
          </Badge>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex h-40 flex-col justify-between pb-6 text-right text-[9px] tabular-nums text-slate-400">
          {ticks.map((tick, index) => (
            <span key={index}>{tick}</span>
          ))}
        </div>

        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[136px]">
            {[0, 1, 2, 3].map((line) => (
              <div
                key={line}
                className="absolute inset-x-0 border-t border-dashed border-slate-100"
                style={{ top: `${(line / 3) * 100}%` }}
              />
            ))}
          </div>

          <div className="relative flex h-[136px] items-end justify-between gap-2 sm:gap-4">
            {data.map((point, index) => {
              const isToday = index === data.length - 1;
              return (
                <div
                  key={point.date}
                  className="group flex h-full flex-1 items-end justify-center gap-1"
                >
                  <div
                    className={`w-full max-w-[18px] rounded-t-md transition-all duration-500 ${
                      isToday ? "bg-amber-500" : "bg-amber-200 group-hover:bg-amber-300"
                    }`}
                    style={{ height: `${Math.max(4, (point.stamps / max) * 100)}%` }}
                    title={`${point.stamps} sellos`}
                  />
                  <div
                    className={`w-full max-w-[18px] rounded-t-md transition-all duration-500 ${
                      isToday ? "bg-indigo-500" : "bg-indigo-200 group-hover:bg-indigo-300"
                    }`}
                    style={{ height: `${Math.max(2, (point.rewards / max) * 100)}%` }}
                    title={`${point.rewards} premios`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between gap-2 sm:gap-4">
            {data.map((point, index) => (
              <div key={point.date} className="flex-1 text-center">
                <span
                  className={`text-[10px] font-medium capitalize ${
                    index === data.length - 1 ? "font-bold text-amber-600" : "text-slate-400"
                  }`}
                >
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
