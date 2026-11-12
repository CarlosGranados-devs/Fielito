import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LoyaltyCard } from "@/components/brand/loyalty-card";
import { Badge } from "@/components/ui/badge";

export function AuthShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "login" | "register";
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.02fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-14">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:26px_26px]" />
        </div>

        <div className="relative">
          <Logo variant="light" />
          <Badge className="mt-8 border border-white/15 bg-white/5 text-white/80" variant="outline">
            <span>🇸🇻</span> Lealtad digital hecha en El Salvador
          </Badge>
          <h1 className="mt-5 max-w-md font-display text-4xl font-bold leading-[1.1] xl:text-[2.9rem]">
            La forma más fácil de que tus clientes{" "}
            <span className="text-amber-400">vuelvan</span>.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Sellos digitales, QR anti-fraude y una billetera que tus clientes van a querer abrir
            todos los días.
          </p>

          <div className="mt-8 max-w-xs rotate-[-3deg]">
            <LoyaltyCard
              businessName="Café La Esquina"
              rewardDescription="Un café americano gratis"
              currentStamps={3}
              requiredStamps={5}
              brandColor="amber"
              logoEmoji="☕"
              customerName="María L."
              compact
            />
          </div>

          <ul className="mt-8 space-y-3 text-sm text-white/75">
            {[
              "Gratis hasta 50 clientes",
              "QR que cambia cada minuto",
              "Funciona en iPhone y Android",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-10 space-y-4">
          <figure className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Sparkles key={index} className="h-3 w-3" />
              ))}
            </div>
            <blockquote className="mt-2 text-sm leading-relaxed text-white/80">
              “Mis clientes ya no pierden la tarjeta. El QR de la caja lo escanean en dos
              segundos.”
            </blockquote>
            <figcaption className="mt-3 text-xs text-white/50">
              Rosa Mejía · Pupusería El Buen Gusto
            </figcaption>
          </figure>
          <p className="flex items-start gap-2 text-[10px] leading-relaxed text-white/35">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Fielito solo registra puntos. El comercio afiliado es el único responsable de honrar las
            recompensas prometidas.
          </p>
        </div>
      </aside>

      <main className="relative flex min-h-dvh flex-col bg-cream px-5 py-5 sm:px-10 sm:py-8">
        <div className="flex items-center justify-between lg:hidden">
          <Logo size="sm" />
          <Link
            href={mode === "login" ? "/register" : "/login"}
            className="text-xs font-semibold text-indigo-600"
          >
            {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8 sm:py-10">
          {children}
        </div>

        <div className="mx-auto w-full max-w-[420px] text-center text-[11px] leading-relaxed text-slate-400">
          Al continuar aceptas nuestros{" "}
          <Link href="/legal/terminos" className="font-medium text-slate-500 underline">
            Términos de uso
          </Link>{" "}
          y la{" "}
          <Link href="/legal/privacidad" className="font-medium text-slate-500 underline">
            Política de privacidad
          </Link>
          . Fielito no entrega premios: cada comercio es responsable de sus recompensas.
        </div>
      </main>
    </div>
  );
}
