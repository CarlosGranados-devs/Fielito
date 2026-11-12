import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function LegalNotice({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 text-amber-900",
        className,
      )}
    >
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className={cn("leading-relaxed", compact ? "text-[11px]" : "text-xs")}>
          <p>
            <strong className="font-semibold">Condiciones:</strong> Fielito actúa únicamente como
            plataforma de registro de puntos. El comercio afiliado es el único responsable de
            honrar y entregar las recompensas prometidas. Nos reservamos el derecho de suspender
            cuentas por fraude de sellos.
          </p>
          {!compact && (
            <p className="mt-2 text-amber-800/80">
              Al crear una cuenta aceptas los{" "}
              <Link href="/legal/terminos" className="font-semibold underline">
                Términos de uso
              </Link>{" "}
              y la{" "}
              <Link href="/legal/privacidad" className="font-semibold underline">
                Política de privacidad
              </Link>{" "}
              de Fielito SV, S.A. de C.V.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
