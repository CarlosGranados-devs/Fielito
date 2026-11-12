"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Gift, MapPin, ScanLine, User, Wallet } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PENDING_SCAN_KEY } from "@/lib/scan-handoff";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/wallet", label: "Billetera", icon: Wallet },
  { href: "/mapa", label: "Mapa", icon: MapPin },
  { href: "/escanear", label: "Escanear", icon: ScanLine, primary: true },
  { href: "/premios", label: "Premios", icon: Gift },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useApp();

  // Handoff del botón "Probar escaneo" del panel de comercio: primero se cambia
  // a la sesión demo de cliente (lo que redirige a /wallet) y luego se lleva el
  // token al escáner, evitando que la redirección de rol descarte la ruta.
  useEffect(() => {
    const token = window.sessionStorage.getItem(PENDING_SCAN_KEY);
    if (!token) return;
    window.sessionStorage.removeItem(PENDING_SCAN_KEY);
    router.replace(`/escanear?token=${encodeURIComponent(token)}`);
  }, [router]);

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo size="sm" />

          <nav className="hidden items-center gap-1 md:flex">
            {items
              .filter((item) => !item.primary)
              .map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition",
                      active
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:bg-white/70 hover:text-slate-900",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active && "text-amber-500")} />
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/escanear"
              className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 md:flex"
            >
              <ScanLine className="h-4 w-4 text-amber-400" /> Escanear sello
            </Link>
            <Link
              href="/perfil"
              className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-base ring-2 ring-white"
              aria-label="Mi perfil"
            >
              {profile?.avatarEmoji ?? "👤"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 md:pb-12">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl md:hidden">
        <div className="safe-bottom safe-top mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-2">
          {items.map((item) => {
            const active = pathname === item.href;
            if (item.primary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-end pb-1.5"
                  aria-label="Escanear sello"
                >
                  <span className="absolute -top-7 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-glow ring-[5px] ring-cream transition active:scale-95">
                    <ScanLine className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <span className="mt-7 text-[10px] font-semibold text-slate-500">Escanear</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 rounded-xl py-1.5"
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition",
                    active ? "text-amber-600" : "text-slate-400",
                  )}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold",
                    active ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    "h-1 w-1 rounded-full",
                    active ? "bg-amber-500" : "bg-transparent",
                  )}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
