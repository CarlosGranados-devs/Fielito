import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo size="sm" />
          <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Link
              href="/legal/terminos"
              className="rounded-lg px-3 py-2 transition hover:bg-white hover:text-slate-900"
            >
              Términos
            </Link>
            <Link
              href="/legal/privacidad"
              className="rounded-lg px-3 py-2 transition hover:bg-white hover:text-slate-900"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>

      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Logo size="sm" />
            <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-400">
              Fielito SV, S.A. de C.V. · San Salvador, El Salvador · Documento informativo de la
              versión MVP.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-900">
              <ArrowLeft className="h-3 w-3" /> Volver al inicio
            </Link>
            <Link href="/legal/terminos" className="hover:text-slate-900">
              Términos
            </Link>
            <Link href="/legal/privacidad" className="hover:text-slate-900">
              Privacidad
            </Link>
            <span className="inline-flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="h-3 w-3" /> Tus datos, protegidos
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
