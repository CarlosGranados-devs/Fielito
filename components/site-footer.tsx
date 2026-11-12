import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container py-10">
        <div className={compact ? "grid gap-6" : "grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]"}>
          <div className="max-w-sm">
            <Logo size="sm" />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Lealtad digital para los negocios que hacen grande a El Salvador. Sellos
              digitales, sin tarjetas de papel y sin fricción.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              Hecho con 🇸🇻 en San Salvador · Fielito SV, S.A. de C.V.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Producto</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/register?role=merchant" className="hover:text-indigo-600">
                  Para comercios
                </Link>
              </li>
              <li>
                <Link href="/register?role=customer" className="hover:text-indigo-600">
                  Para clientes
                </Link>
              </li>
              <li>
                <Link href="/#planes" className="hover:text-indigo-600">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600">
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/legal/terminos" className="hover:text-indigo-600">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="hover:text-indigo-600">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos#recompensas" className="hover:text-indigo-600">
                  Responsabilidad del comercio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contacto</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>hola@fielito.sv</li>
              <li>+503 2500 0000</li>
              <li>San Salvador, El Salvador</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="rounded-2xl bg-slate-50 p-4 text-[11px] leading-relaxed text-slate-500">
          <strong className="font-semibold text-slate-600">Aviso legal:</strong> Fielito actúa
          únicamente como plataforma de registro de puntos. El comercio afiliado es el único
          responsable de honrar y entregar las recompensas prometidas. Nos reservamos el derecho
          de suspender cuentas por fraude de sellos. Los programas de lealtad son administrados
          por cada comercio; Fielito no vende ni entrega los productos o servicios promocionados.
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Fielito. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
              PWA instalable
            </span>
            <span>Hecho para iOS y Android</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
