import {
  Battery,
  Gift,
  MapPin,
  QrCode,
  Signal,
  Wallet,
  Wifi,
  Sparkles,
} from "lucide-react";
import { LoyaltyCard } from "@/components/brand/loyalty-card";

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-[296px] sm:w-[330px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="absolute -right-8 top-24 -z-10 h-40 w-40 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative rounded-[3rem] border-[9px] border-slate-900 bg-slate-900 shadow-[0_40px_80px_-30px_rgba(15,23,42,0.55)]">
        <div className="relative overflow-hidden rounded-[2.35rem] bg-cream">
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900" />

          <div className="px-4 pb-3 pt-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-900">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-slate-500">Buenos días, María</p>
                <p className="font-display text-base font-bold text-slate-900">Mi billetera</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-amber-300 text-sm ring-2 ring-white">
                👩🏽
              </div>
            </div>

            <div className="mt-4">
              <LoyaltyCard
                businessName="Café La Esquina"
                rewardDescription="Un café americano gratis"
                currentStamps={3}
                requiredStamps={5}
                brandColor="amber"
                logoEmoji="☕"
                compact
              />
            </div>

            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-base">
                  🫓
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    Pupusería El Buen Gusto
                  </p>
                  <p className="text-[10px] text-slate-500">7 de 10 sellos · 3 para tu premio</p>
                </div>
                <span className="text-[10px] font-bold text-amber-600">+1</span>
              </div>
              <div className="mt-2.5 flex gap-1">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 flex-1 rounded-full ${
                      index < 7 ? "bg-rose-400" : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-900 px-3.5 py-3 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-[10px] font-semibold">Tu café de hoy está cerca</p>
                  <p className="text-[9px] text-white/60">2 sellos más y el próximo va gratis</p>
                </div>
              </div>
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-amber-950">
                Ver
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between px-2 pb-2">
              {[
                { icon: Wallet, label: "Billetera", active: true },
                { icon: MapPin, label: "Mapa", active: false },
                { icon: QrCode, label: "", active: false, primary: true },
                { icon: Gift, label: "Premios", active: false },
                { icon: Sparkles, label: "Perfil", active: false },
              ].map((item, index) => (
                <div key={index} className="flex w-12 flex-col items-center gap-1">
                  {item.primary ? (
                    <div className="-mt-5 grid h-12 w-12 place-items-center rounded-full bg-amber-500 text-amber-950 shadow-glow ring-4 ring-cream">
                      <QrCode className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <>
                      <item.icon
                        className={`h-[18px] w-[18px] ${
                          item.active ? "text-slate-900" : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`text-[8px] font-semibold ${
                          item.active ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -left-10 top-28 animate-float rounded-2xl border border-white/70 bg-white/95 px-3.5 py-3 shadow-lifted backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-900">¡+1 sello!</p>
            <p className="text-[10px] text-slate-500">Café La Esquina</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-8 bottom-24 animate-float rounded-2xl border border-white/70 bg-white/95 px-3.5 py-3 shadow-lifted backdrop-blur [animation-delay:1.2s]">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Sello escaneado
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <QrCode className="h-3.5 w-3.5 text-amber-500" /> QR verificado
        </p>
      </div>
    </div>
  );
}
