import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Cookie,
  Database,
  FileLock2,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { LegalNotice } from "@/components/legal-notice";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Fielito recopila, usa, comparte y protege los datos personales de comercios y clientes en El Salvador.",
};

const sections = [
  { id: "responsable", title: "1. Responsable del tratamiento" },
  { id: "datos", title: "2. Datos que recopilamos" },
  { id: "finalidades", title: "3. Para qué los usamos" },
  { id: "base", title: "4. Base legal" },
  { id: "cookies", title: "5. Cookies y almacenamiento local" },
  { id: "compartir", title: "6. Con quién compartimos" },
  { id: "conservacion", title: "7. Conservación" },
  { id: "derechos", title: "8. Tus derechos" },
  { id: "seguridad", title: "9. Seguridad" },
  { id: "menores", title: "10. Menores de edad" },
  { id: "cambios", title: "11. Cambios y contacto" },
];

export default function PrivacyPage() {
  return (
    <article className="animate-fade-up">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
          <Lock className="h-3 w-3" /> Privacidad
        </span>
        <span className="text-[11px] text-slate-400">
          Última actualización: 11 de noviembre de 2026
        </span>
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        Política de privacidad
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
        En Fielito tratamos tus datos personales con transparencia y solo para hacer funcionar tu
        programa de lealtad. Aquí explicamos qué recopilamos, por qué, con quién lo compartimos y
        cómo puedes ejercer tus derechos.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "No vendemos datos", text: "Tu información no se comercializa." },
          { icon: Database, title: "Datos mínimos", text: "Solo lo necesario para la lealtad." },
          { icon: FileLock2, title: "RLS y cifrado", text: "Acceso separado por comercio y cliente." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-3.5">
            <item.icon className="h-4 w-4 text-emerald-600" />
            <p className="mt-2 text-xs font-semibold text-slate-900">{item.title}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.text}</p>
          </div>
        ))}
      </div>

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
        <section id="responsable" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            1. Responsable del tratamiento
          </h2>
          <p className="mt-3">
            El responsable del tratamiento es <strong>Fielito SV, S.A. de C.V.</strong>, con
            domicilio en San Salvador, El Salvador. Para asuntos de privacidad puedes escribir a{" "}
            <a href="mailto:privacidad@fielito.sv" className="font-semibold text-indigo-600 underline">
              privacidad@fielito.sv
            </a>
            .
          </p>
          <div className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs text-indigo-900">
            <p className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
              <span>
                <strong>Dos roles:</strong> para los datos de tu cuenta y el uso de la app, Fielito
                actúa como responsable. Para los datos de sellos y recompensas de los clientes de un
                comercio, Fielito actúa como encargado del tratamiento y el comercio es el
                responsable. El comercio decide qué recompensa ofrece y cómo la entrega.
              </span>
            </p>
          </div>
        </section>

        <section id="datos" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            2. Datos que recopilamos
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Datos de cuenta",
                items: [
                  "Nombre completo y correo electrónico",
                  "Teléfono (opcional) y avatar",
                  "Rol: comercio o cliente",
                  "Método de acceso: Google OAuth o enlace mágico",
                ],
              },
              {
                title: "Datos del comercio",
                items: [
                  "Nombre, categoría, dirección y teléfono",
                  "Ubicación (latitud y longitud) del local",
                  "Configuración de la tarjeta y recompensas",
                  "Plan contratado y estado de facturación",
                ],
              },
              {
                title: "Datos de lealtad",
                items: [
                  "Tarjetas, sellos acumulados y premios canjeados",
                  "Fecha y hora de cada escaneo",
                  "Comercio donde se registró el sello",
                ],
              },
              {
                title: "Datos técnicos",
                items: [
                  "Tipo de dispositivo y navegador",
                  "Dirección IP y registros de seguridad",
                  "Geolocalización aproximada, solo con tu permiso",
                  "Preferencias guardadas en tu navegador",
                ],
              },
            ].map((group) => (
              <div key={group.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-900">{group.title}</p>
                <ul className="mt-2 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-slate-500">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            No recopilamos datos sensibles como salud, biometría, origen étnico, religión u opiniones
            políticas. Tampoco almacenamos números completos de tarjetas: en producción, los pagos
            son procesados directamente por Stripe.
          </p>
        </section>

        <section id="finalidades" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            3. Para qué los usamos
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Crear y administrar tu cuenta y autenticarte de forma segura.</li>
            <li>Registrar sellos, completar tarjetas y validar canjes de recompensas.</li>
            <li>Mostrar comercios y promociones en el mapa según tu ubicación.</li>
            <li>Calcular métricas agregadas para el comercio (clientes, sellos, canjes).</li>
            <li>Procesar planes y pagos, emitir comprobantes y gestionar cobros.</li>
            <li>Prevenir fraude de sellos y proteger la integridad de la Plataforma.</li>
            <li>Responder consultas, reclamos y solicitudes de soporte.</li>
            <li>Cumplir obligaciones legales y requerimientos de autoridad competente.</li>
            <li>
              Enviar comunicaciones operativas y, con tu consentimiento, novedades o promociones.
              Puedes darte de baja en cualquier momento.
            </li>
          </ul>
        </section>

        <section id="base" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">4. Base legal</h2>
          <p className="mt-3">
            Tratamos tus datos con base en: (i) la ejecución del contrato o de la relación de
            lealtad; (ii) tu consentimiento, especialmente para geolocalización y comunicaciones
            comerciales; (iii) nuestro interés legítimo en prevenir fraude y mejorar el servicio; y
            (iv) el cumplimiento de obligaciones legales.
          </p>
          <p className="mt-3">
            Cuando el tratamiento se base en tu consentimiento, puedes retirarlo en cualquier
            momento sin que ello afecte la licitud del tratamiento previo.
          </p>
        </section>

        <section id="cookies" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            5. Cookies y almacenamiento local
          </h2>
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs">
            <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <div>
              <p>
                Usamos almacenamiento local del navegador para mantener tu sesión y tus preferencias.
                En la versión demo, toda la información se guarda en tu dispositivo bajo la clave{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
                  fielito:state:v1
                </code>{" "}
                y no se envía a nuestros servidores.
              </p>
              <p className="mt-2 text-slate-500">
                En producción usaremos cookies estrictamente necesarias para la sesión de Supabase y
                para recordar preferencias. No usamos cookies publicitarias de terceros en el MVP.
                Puedes borrar el almacenamiento local desde la configuración de tu navegador; ten en
                cuenta que perderás el estado de la demo.
              </p>
            </div>
          </div>
        </section>

        <section id="compartir" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            6. Con quién compartimos
          </h2>
          <p className="mt-3">
            No vendemos ni alquilamos tus datos. Los compartimos únicamente con proveedores que nos
            ayudan a operar el servicio, bajo obligaciones de confidencialidad y seguridad:
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Proveedor</th>
                  <th className="px-4 py-2.5 font-semibold">Finalidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Supabase", "Base de datos, autenticación y políticas de acceso (RLS)."],
                  ["Stripe", "Procesamiento de pagos y suscripciones del Plan Pro."],
                  ["Vercel", "Alojamiento y entrega de la aplicación web."],
                  ["Google", "Inicio de sesión con OAuth, si eliges esa opción."],
                  ["OpenStreetMap / CARTO", "Mapas de promociones y ubicación del comercio."],
                  ["Comercio afiliado", "Datos necesarios para validar sellos y entregar recompensas."],
                ].map(([provider, purpose]) => (
                  <tr key={provider}>
                    <td className="px-4 py-2.5 font-semibold text-slate-700">{provider}</td>
                    <td className="px-4 py-2.5 text-slate-500">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Algunos proveedores pueden almacenar datos fuera de El Salvador. En esos casos exigimos
            medidas contractuales y técnicas de protección equivalentes a las previstas por la
            legislación salvadoreña aplicable.
          </p>
        </section>

        <section id="conservacion" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">7. Conservación</h2>
          <p className="mt-3">
            Conservamos los datos mientras tu cuenta esté activa y durante el tiempo necesario para
            cumplir las finalidades descritas. Después los eliminamos o anonimizamos, salvo que la ley
            exija conservarlos por más tiempo (por ejemplo, obligaciones contables o fiscales).
          </p>
          <p className="mt-3">
            Los registros de escaneos y canjes se conservan hasta 24 meses para prevenir fraude y
            atender disputas. Las métricas que muestra el comercio son agregadas y no identifican
            individualmente a los clientes, salvo en la vista de clientes del propio comercio.
          </p>
        </section>

        <section id="derechos" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">8. Tus derechos</h2>
          <p className="mt-3">
            Puedes ejercer los derechos de acceso, rectificación, cancelación, oposición,
            portabilidad y limitación del tratamiento escribiendo a{" "}
            <a href="mailto:privacidad@fielito.sv" className="font-semibold text-indigo-600 underline">
              privacidad@fielito.sv
            </a>
            . Incluye tu nombre, correo asociado y una descripción clara de tu solicitud.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Responderemos en un plazo máximo de 10 días hábiles.</li>
            <li>
              Podemos pedirte verificar tu identidad para evitar que terceros accedan a tus datos.
            </li>
            <li>
              Si tu solicitud se refiere a sellos o recompensas de un comercio, la canalizaremos con
              ese comercio, que es el responsable de la recompensa.
            </li>
            <li>
              Si consideras que no atendimos correctamente tu solicitud, puedes acudir a la autoridad
              competente en materia de protección de datos de El Salvador.
            </li>
          </ul>
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-xs">
            <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <p>
              También puedes actualizar tu nombre, correo, teléfono y avatar directamente desde la
              sección <strong>Perfil</strong> de la app. Para eliminar tu cuenta, escríbenos y
              procesaremos la baja junto con la eliminación de tus datos personales.
            </p>
          </div>
        </section>

        <section id="seguridad" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">9. Seguridad</h2>
          <p className="mt-3">
            Aplicamos medidas técnicas y organizativas razonables: cifrado TLS en tránsito, control
            de acceso basado en roles, políticas de seguridad a nivel de fila (RLS) en la base de
            datos, tokens QR firmados con vigencia corta y registro de eventos. Ningún sistema es
            100% infalible, pero trabajamos para detectar y contener incidentes.
          </p>
          <p className="mt-3">
            Si ocurre una brecha que afecte tus derechos, te notificaremos sin demora indebida y
            adoptaremos las medidas de mitigación necesarias.
          </p>
        </section>

        <section id="menores" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">10. Menores de edad</h2>
          <p className="mt-3">
            Fielito está dirigido a personas mayores de 18 años. No recopilamos conscientemente datos
            de menores. Si detectamos una cuenta de un menor sin autorización de su representante
            legal, la desactivaremos y eliminaremos los datos correspondientes.
          </p>
        </section>

        <section id="cambios" className="scroll-mt-24">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            11. Cambios y contacto
          </h2>
          <p className="mt-3">
            Podemos actualizar esta Política para reflejar cambios legales o de producto. Publicaremos
            la versión vigente con su fecha de actualización y, si el cambio es sustancial, te
            avisaremos por correo o dentro de la app.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Mail className="h-4 w-4 text-indigo-500" /> Contacto de privacidad
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
              Fielito SV, S.A. de C.V. · San Salvador, El Salvador
              <br />
              <a href="mailto:privacidad@fielito.sv" className="font-semibold text-indigo-600 underline">
                privacidad@fielito.sv
              </a>{" "}
              ·{" "}
              <a href="mailto:hola@fielito.sv" className="font-semibold text-indigo-600 underline">
                hola@fielito.sv
              </a>
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">Términos de uso</p>
          <p className="text-[11px] text-slate-500">
            Conoce las reglas del programa de sellos y las responsabilidades de cada parte.
          </p>
        </div>
        <Link
          href="/legal/terminos"
          className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          Ver términos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <p className="mt-8 rounded-2xl bg-slate-100 p-4 text-[11px] leading-relaxed text-slate-500">
        <strong className="text-slate-700">Aviso:</strong> esta política es una base para el MVP de
        Fielito y debe ser revisada por un abogado salvadoreño antes de su lanzamiento comercial. Los
        datos de la sociedad son ilustrativos.
      </p>
    </article>
  );
}
