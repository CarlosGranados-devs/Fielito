"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  FlaskConical,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/recompensas", label: "Recompensas", icon: Gift },
  { href: "/dashboard/planes", label: "Plan y facturación", icon: CreditCard },
  { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings },
];

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Resumen", subtitle: "Tu negocio de un vistazo" },
  "/dashboard/clientes": { title: "Clientes", subtitle: "Quiénes están volviendo" },
  "/dashboard/recompensas": { title: "Recompensas", subtitle: "Premios listos y canjeados" },
  "/dashboard/planes": { title: "Plan y facturación", subtitle: "Simple, transparente, sin sorpresas" },
  "/dashboard/ajustes": { title: "Ajustes", subtitle: "Tu negocio y tu tarjeta de lealtad" },
};

export function MerchantShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, business, state, signOut, signInDemo, hydrated } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (profile?.role === "merchant" && !business) {
      router.replace("/onboarding");
    }
  }, [hydrated, profile, business, router]);

  const cardsHere = business
    ? state.cards.filter((card) => card.businessId === business.id)
    : [];
  const totalCustomers = new Set(cardsHere.map((card) => card.customerId)).size;
  const pendingRewards = cardsHere.filter((card) => card.isCompleted).length;
  const meta = titles[pathname] ?? titles["/dashboard"];
  const isPro = business?.plan === "pro";
  const usage = Math.min(Math.round((totalCustomers / 50) * 100), 100);

  function handleSignOut() {
    signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
  }

  function previewAsCustomer() {
    signInDemo("customer");
    toast.success("Modo demostración: ahora eres María López", {
      description: "Escanea el QR del comercio para probar el flujo completo.",
    });
    router.push("/wallet");
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo size="sm" />
        <Badge variant="muted" className="ml-auto">
          Comercio
        </Badge>
      </div>

      <div className="px-3 pt-2">
        <Link
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-amber-200"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-xl">
            {business?.logoEmoji ?? "🏪"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-900">
              {business?.name ?? "Tu negocio"}
            </span>
            <span className="block truncate text-[11px] text-slate-500">
              {business?.address ?? "Configura tu local"}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </Link>
      </div>

      <nav className="mt-5 flex-1 space-y-1 px-3">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Administración
        </p>
        {navigation.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white shadow-soft"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon
                className={cn("h-4 w-4", active ? "text-amber-400" : "text-slate-400")}
              />
              <span className="flex-1">{item.label}</span>
              {item.href === "/dashboard/recompensas" && pendingRewards > 0 && (
                <span
                  className={cn(
                    "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold",
                    active ? "bg-amber-400 text-amber-950" : "bg-amber-100 text-amber-700",
                  )}
                >
                  {pendingRewards}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Demo
          </p>
          <button
            type="button"
            onClick={previewAsCustomer}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Smartphone className="h-4 w-4 text-slate-400" />
            <span className="flex-1 text-left">Vista cliente</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </nav>

      <div className="p-3">
        {isPro ? (
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <Badge variant="pro">
                <Sparkles className="h-3 w-3" /> Pro
              </Badge>
              <span className="text-[10px] text-white/50">Activo</span>
            </div>
            <p className="mt-2 text-xs font-semibold">Clientes ilimitados</p>
            <p className="mt-0.5 text-[11px] text-white/60">
              Métricas avanzadas y exportación disponibles.
            </p>
            <Link
              href="/dashboard/planes"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:underline"
            >
              Gestionar plan <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
            <div className="flex items-center justify-between">
              <Badge>Plan Gratis</Badge>
              <span className="text-[10px] font-semibold text-slate-500">
                {totalCustomers}/50
              </span>
            </div>
            <Progress value={usage} className="mt-2.5 h-1.5" />
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              Llevas <strong className="text-slate-700">{totalCustomers} clientes</strong>. Pasa a
              Pro para crecer sin límites.
            </p>
            <Button asChild size="sm" variant="amber" className="mt-3 w-full">
              <Link href="/dashboard/planes">
                Mejorar a Pro <Sparkles className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-sm">
            {profile?.avatarEmoji ?? "👤"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">{profile?.fullName}</p>
            <p className="truncate text-[10px] text-slate-500">{profile?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-cream">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-slate-200 bg-cream/80 backdrop-blur lg:block">
        {SidebarContent}
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-cream/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg font-semibold text-slate-900">
                {meta.title}
              </h1>
              <p className="hidden truncate text-xs text-slate-500 sm:block">{meta.subtitle}</p>
            </div>

            <Badge variant="outline" className="hidden gap-1.5 bg-white sm:flex">
              <FlaskConical className="h-3 w-3 text-amber-500" /> Modo demo
            </Badge>

            <button
              type="button"
              onClick={previewAsCustomer}
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 sm:flex"
              title="Cambiar a la cuenta de cliente demo"
            >
              <Smartphone className="h-3.5 w-3.5" /> Vista cliente
            </button>

            <button
              type="button"
              onClick={() =>
                toast.info("Centro de ayuda", {
                  description: "Escríbenos a hola@fielito.sv y te respondemos el mismo día.",
                })
              }
              className="hidden h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-900 sm:grid"
              aria-label="Ayuda"
              title="Ayuda"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>

            <Link
              href="/dashboard/ajustes"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-amber-200"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-sm">
                {profile?.avatarEmoji ?? "👤"}
              </span>
              <span className="hidden max-w-[120px] truncate text-xs font-semibold text-slate-700 sm:block">
                {profile?.fullName?.split(" ")[0]}
              </span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {business ? children : <MerchantLoading />}
        </main>

        <footer className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-4 pb-8 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="flex items-center gap-1.5">
            <Store className="h-3 w-3" /> Fielito · Lealtad digital para negocios locales
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terminos" className="hover:text-slate-600">
              Términos
            </Link>
            <Link href="/legal/privacidad" className="hover:text-slate-600">
              Privacidad
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent
          hideClose
          className="left-0 top-0 h-dvh max-h-dvh w-[300px] max-w-[85vw] translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none rounded-r-3xl border-0 p-0"
        >
          <DialogTitle className="sr-only">Menú de administración</DialogTitle>
          {SidebarContent}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MerchantLoading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        Cargando tu negocio...
      </div>
    </div>
  );
}
