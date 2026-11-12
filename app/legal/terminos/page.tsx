import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, FileText, Scale, ShieldCheck } from "lucide-react";
import { LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Términos y condiciones de uso de Fielito, la plataforma de tarjetas de sellos digitales para negocios de El Salvador.",
};

const sections = [
  { id: "identificacion", title: "1. Identificación del prestador" },
  { id: "objeto", title: "2. Objeto y aceptación" },
  { id: "cuentas", title: "3. Registro y cuentas" },
  { id: "programa", title: "4. Programa de sellos y recompensas" },
  { id: "qr", title: "5. Códigos QR y antifraude" },
  { id: "planes", title: "6. Planes, pagos y facturación" },
  { id: "uso", title: "7. Uso aceptable" },
  { id: "propiedad", title: "8. Propiedad intelectual" },
  { id: "responsabilidad", title: "9. Disponibilidad y responsabilidad" },
  { id: "terminacion", title: "10. Suspensión y terminación" },
  { id: "ley", title: "11. Ley aplicable y contacto" },
];

export default function TermsPage() {
  return (
    <article className="animate-fade-up">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
          <FileText className="h-3 w-3" /> Documento legal
        </span>
        <span className="text-[11px] text-slate-400">Última actualización: 11 de noviembre de 2026</span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        Términos de uso
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
        Estos términos regulan el uso de Fielito por parte de comercios afiliados y clientes
        finales en El Salvador. Al crear una cuenta, escanear un código o reclamar una recompensa,
        aceptas estas condiciones.
      </p>

      <LegalNotice className="mt-6" />

      <nav className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Contenido
        </p>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <span>{section.title}</span>
              <ArrowRight className="h-3 w-3 shrink-0 text-slate-300 transition group-hover:text-amber-500" />
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600">
        <section id="identificacion" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            1. Identificación del prestador
          </h2>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs">
            <p>
              <strong className="text-slate-900">Fielito SV, S.A. de C.V.</strong> (“Fielito”,
              “nosotros” o “la Plataforma”), sociedad constituida bajo las leyes de la República de
              El Salvador, con domicilio en San Salvador y correo de contacto{" "}
              <a href="mailto:hola@fielito.sv" className="font-semibold text-indigo-600 underline">
                hola@fielito.sv
              </a>
              .
            </p>
            <p className="mt-2 text-slate-500">
              Fielito es una plataforma tecnológica de registro de sellos digitales. No es una
              entidad financiera, no emite dinero electrónico y no forma parte de la cadena de
              entrega de los productos o servicios de los comercios afiliados.
            </p>
          </div>
        </section>

        <section id="objeto" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            2. Objeto y aceptación
          </h2>
          <p className="mt-3">
            Fielito permite a los comercios afiliados crear tarjetas de lealtad digitales, emitir
            sellos mediante códigos QR y entregar recompensas a sus clientes. Los clientes finales
            pueden reunir sus tarjetas en una billetera digital disponible como aplicación web
            progresiva (PWA).
          </p>
          <p className="mt-3">
            El uso de la Plataforma implica la aceptación plena de estos Términos, de la{" "}
            <Link href="/legal/privacidad" className="font-semibold text-indigo-600 underline">
              Política de privacidad
            </Link>{" "}
            y de las condiciones particulares que el comercio afiliado comunique a sus clientes. Si
            no estás de acuerdo, debes abstenerte de usar el servicio.
          </p>
        </section>

        <section id="cuentas" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            3. Registro y cuentas
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Para operar como comercio debes ser mayor de 18 años, tener capacidad legal para
              contratar y contar con autorización para representar al negocio registrado.
            </li>
            <li>
              La información de registro (nombre, correo, teléfono, dirección y ubicación del
              local) debe ser veraz, exacta y mantenerse actualizada.
            </li>
            <li>
              Eres responsable de la confidencialidad de tus credenciales y de toda actividad
              realizada desde tu cuenta. Notifica de inmediato cualquier acceso no autorizado a{" "}
              <a href="mailto:seguridad@fielito.sv" className="font-semibold text-indigo-600 underline">
                seguridad@fielito.sv
              </a>
              .
            </li>
            <li>
              El acceso de clientes puede realizarse mediante Google OAuth o enlace mágico. En la
              versión de demostración, el acceso es simulado y los datos se guardan localmente en el
              navegador.
            </li>
          </ul>
        </section>

        <section id="programa" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            4. Programa de sellos y recompensas
          </h2>
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>
                <strong>Cláusula esencial:</strong> Fielito actúa únicamente como plataforma de
                registro de puntos. El comercio afiliado es el único responsable de honrar y
                entregar las recompensas prometidas. Nos reservamos el derecho de suspender cuentas
                por fraude de sellos.
              </span>
            </p>
          </div>
          <p className="mt-3">
            Cada comercio afiliado define libremente el número de sellos requeridos, la recompensa,
            las condiciones de participación y la vigencia de su programa. Fielito no garantiza la
            disponibilidad, calidad, cantidad ni entrega de las recompensas; esa obligación es
            exclusiva del comercio.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Los sellos son un registro de fidelidad sin valor monetario, no son transferibles, no
              son canjeables por dinero y no constituyen un título valor.
            </li>
            <li>
              La tarjeta se completa al alcanzar el número de sellos configurado. El canje debe
              realizarse directamente en el local del comercio, salvo que este indique otro
              mecanismo.
            </li>
            <li>
              El comercio puede limitar la entrega de una recompensa por persona, por visita o por
              periodo, siempre que lo informe de manera previa y clara.
            </li>
            <li>
              Las recompensas no son acumulables con otras promociones salvo que el comercio lo
              autorice expresamente.
            </li>
          </ul>
        </section>

        <section id="qr" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            5. Códigos QR y antifraude
          </h2>
          <p className="mt-3">
            Los comercios generan códigos QR dinámicos con vigencia corta y uso único. Un sello solo
            se registra cuando el cliente escanea el código vigente desde su cuenta. Las capturas de
            pantalla, códigos vencidos o reutilizados no son válidos.
          </p>
          <p className="mt-3">
            Queda prohibido manipular el proceso de sellado, usar ubicaciones o dispositivos
            falsos, automatizar escaneos, suplantar a otro cliente o comercio, o intentar eludir los
            controles técnicos. Fielito puede auditar transacciones y suspender cuentas cuando
            detecte patrones anómalos, sin perjuicio de las acciones legales que correspondan.
          </p>
        </section>

        <section id="planes" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            6. Planes, pagos y facturación
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-slate-900">Plan Gratis:</strong> incluye hasta 50 clientes
              registrados por comercio, tarjetas ilimitadas, QR dinámico y métricas básicas. Fielito
              puede ajustar los límites con aviso previo.
            </li>
            <li>
              <strong className="text-slate-900">Plan Pro:</strong> tiene un precio de referencia de
              USD $14.99 mensuales, con clientes ilimitados, métricas avanzadas y exportación de
              datos. El cobro se procesa mediante Stripe en modo de prueba durante el MVP.
            </li>
            <li>
              En la versión MVP, el flujo de pago es una simulación: no se realiza ningún cargo real
              y no se solicita ni almacena información sensible de tarjetas. En producción, los
              pagos serán procesados por Stripe bajo sus propios términos.
            </li>
            <li>
              La suscripción Pro se renueva automáticamente hasta que la canceles desde el panel.
              La cancelación impide renovaciones futuras; no genera reembolsos por periodos ya
              transcurridos, salvo obligación legal.
            </li>
            <li>
              Los precios no incluyen impuestos aplicables, los cuales serán agregados cuando
              corresponda.
            </li>
          </ul>
        </section>

        <section id="uso" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">7. Uso aceptable</h2>
          <p className="mt-3">Al usar Fielito te comprometes a no:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Publicar información falsa, engañosa o que induzca a error sobre recompensas.</li>
            <li>Ofrecer productos o servicios ilícitos, peligrosos o prohibidos por la ley.</li>
            <li>Infringir derechos de propiedad intelectual de terceros.</li>
            <li>Interferir con la seguridad, disponibilidad o integridad de la Plataforma.</li>
            <li>Recopilar datos de clientes sin base legal o para fines distintos a la lealtad.</li>
            <li>Usar la Plataforma para spam, discriminación o prácticas desleales.</li>
          </ul>
        </section>

        <section id="propiedad" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            8. Propiedad intelectual
          </h2>
          <p className="mt-3">
            La marca Fielito, el software, el diseño, los textos y los elementos gráficos de la
            Plataforma son propiedad de Fielito SV, S.A. de C.V. o de sus licenciantes. Se te otorga
            una licencia limitada, revocable y no exclusiva para usar la Plataforma conforme a estos
            Términos.
          </p>
          <p className="mt-3">
            El comercio conserva la titularidad de su marca, logotipos y contenido, y autoriza a
            Fielito a mostrarlos dentro de la app y del mapa de promociones mientras mantenga su
            cuenta activa.
          </p>
        </section>

        <section id="responsabilidad" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            9. Disponibilidad y responsabilidad
          </h2>
          <p className="mt-3">
            Trabajamos para mantener la Plataforma disponible, pero no garantizamos un servicio
            ininterrumpido ni libre de errores. Pueden existir mantenimientos programados, fallas de
            conectividad o causas de fuerza mayor.
          </p>
          <p className="mt-3">
            En la máxima medida permitida por la ley, Fielito no responde por daños indirectos,
            lucro cesante, pérdida de datos o perjuicios derivados de: (i) la conducta del comercio
            afiliado; (ii) la negativa del comercio a entregar una recompensa; (iii) el uso indebido
            de la cuenta por parte del usuario; o (iv) fallas de servicios de terceros.
          </p>
          <p className="mt-3">
            Nada en estos Términos limita derechos irrenunciables del consumidor reconocidos por la
            Ley de Protección al Consumidor de El Salvador.
          </p>
        </section>

        <section id="terminacion" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            10. Suspensión y terminación
          </h2>
          <p className="mt-3">
            Podemos suspender o cancelar cuentas de forma temporal o definitiva si detectamos fraude
            de sellos, incumplimiento de estos Términos, riesgo para otros usuarios o requerimiento
            de autoridad competente. Cuando sea razonable, notificaremos la medida y el motivo.
          </p>
          <p className="mt-3">
            El usuario puede cerrar su cuenta en cualquier momento. La terminación no extingue las
            obligaciones pendientes, incluidas las de pago ya devengadas o las responsabilidades por
            daños causados.
          </p>
        </section>

        <section id="ley" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            11. Ley aplicable y contacto
          </h2>
          <p className="mt-3">
            Estos Términos se rigen por las leyes de la República de El Salvador. Cualquier
            controversia se someterá a los tribunales competentes de San Salvador, sin perjuicio de
            los mecanismos de resolución alternativa disponibles.
          </p>
          <p className="mt-3">
            Para consultas, reclamos o notificaciones legales escríbenos a{" "}
            <a href="mailto:legal@fielito.sv" className="font-semibold text-indigo-600 underline">
              legal@fielito.sv
            </a>
            . Responderemos en un plazo máximo de 10 días hábiles.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Scale className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900">¿Necesitas más detalle?</p>
              <p className="text-[11px] text-slate-500">
                Revisa cómo tratamos tus datos en la Política de privacidad.
              </p>
            </div>
            <Link
              href="/legal/privacidad"
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Ver privacidad
            </Link>
          </div>
        </section>
      </div>

      <p className="mt-10 rounded-2xl bg-slate-100 p-4 text-[11px] leading-relaxed text-slate-500">
        <strong className="text-slate-700">Aviso:</strong> este documento es una base legal para el
        MVP de Fielito y debe ser revisado por un abogado salvadoreño antes de su lanzamiento
        comercial. Los datos de la sociedad son ilustrativos.
      </p>
    </article>
  );
}
