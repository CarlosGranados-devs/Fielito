import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronRight,
  Coffee,
  Gift,
  Lock,
  MapPin,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Wallet,
  Zap,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { PhonePreview } from "@/components/landing/phone-preview";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_META } from "@/lib/types";

const storeFeatures = [
  {
    icon: QrCode,
    title: "QR anti-fraude",
    description:
      "Cada código cambia cada 60 segundos y es de un solo uso. Nadie puede reutilizar capturas de pantalla.",
  },
  {
    icon: Wallet,
    title: "Billetera digital",
    description:
      "Tus clientes ven todas sus tarjetas en un solo lugar, con el estilo limpio de Apple Wallet.",
  },
  {
    icon: MapPin,
    title: "Mapa de promos",
    description:
      "Aparece en el mapa para que clientes cercanos descubran tu local y tu recompensa del día.",
  },
  {
    icon: BarChart3,
    title: "Métricas que importan",
    description:
      "Clientes activos, sellos emitidos, premios canjeados y días de mayor tráfico en tiempo real.",
  },
  {
    icon: Smartphone,
    title: "PWA sin descargas",
    description:
      "Tus clientes la agregan a su pantalla de inicio desde Safari o Chrome. Sin tiendas de apps.",
  },
  {
    icon: ShieldCheck,
    title: "Reglas claras",
    description:
      "Tú defines cuántos sellos y qué premio. Fielito valida cada escaneo del lado del servidor.",
  },
];

const steps = [
  {
    step: "01",
    icon: Store,
    title: "El comercio muestra su QR",
    description:
      "Desde el dashboard, un clic genera un código único que rota cada minuto. Se muestra en la caja o tablet del local.",
    for: "Comercio",
  },
  {
    step: "02",
    icon: ScanLine,
    title: "El cliente escanea",
    description:
      "Con la cámara del celular, sin apps ni formularios. El sello se suma al instante con una animación.",
    for: "Cliente",
  },
  {
    step: "03",
    icon: Gift,
    title: "El premio se disfruta",
    description:
      "Al completar los sellos, la tarjeta se marca como lista. El cliente reclama y empieza una nueva vuelta.",
    for: "Ambos",
  },
];

const testimonials = [
  {
    quote:
      "Antes usábamos tarjetas de cartón y se perdían. Ahora el 70% de mis clientes regresa antes de la semana.",
    name: "Rosa Mejía",
    business: "Pupusería El Buen Gusto",
    avatar: "👩🏽‍🍳",
    metric: "+34% visitas",
  },
  {
    quote:
      "El QR cambia cada minuto, así que ya no me preocupa que alguien se pase una foto del código de la caja.",
    name: "Óscar Pineda",
    business: "Car Wash El Brillo",
    avatar: "🧑🏽‍🔧",
    metric: "0 fraudes",
  },
  {
    quote:
      "Lo configuré en 10 minutos un domingo. Mis clientes solo lo agregan a la pantalla de inicio y listo.",
    name: "Tere Cruz",
    business: "Panadería Doña Tere",
    avatar: "👩🏻‍🍳",
    metric: "10 min setup",
  },
];

const faqs = [
  {
    question: "¿Cuánto cuesta Fielito?",
    answer:
      "Puedes empezar completamente gratis hasta 50 clientes registrados. El Plan Pro cuesta $14.99/mes e incluye clientes ilimitados, métricas avanzadas, campañas y soporte prioritario. Sin contratos ni cargos ocultos.",
  },
  {
    question: "¿Mis clientes tienen que descargar una app?",
    answer:
      "No. Fielito es una PWA (Progressive Web App). Tus clientes la abren desde el navegador y la agregan a su pantalla de inicio con dos toques, tanto en iPhone como en Android.",
  },
  {
    question: "¿Cómo evitan que alguien se robe los sellos?",
    answer:
      "El comercio genera un token firmado que cambia cada 60 segundos y solo puede canjearse una vez. El servidor valida la firma, la expiración y el uso antes de sumar el sello. Una captura de pantalla del QR no sirve.",
  },
  {
    question: "¿Fielito entrega los premios?",
    answer:
      "No. Fielito únicamente registra los puntos y valida los escaneos. El comercio afiliado es el único responsable de honrar y entregar las recompensas prometidas a sus clientes.",
  },
  {
    question: "¿Puedo usar mi punto de venta actual?",
    answer:
      "Sí. Fielito funciona en cualquier laptop, tablet o celular con navegador. Solo necesitas mostrar el QR en tu caja y mantener tus procesos actuales.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-cream">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-200/40 via-amber-100/20 to-transparent blur-3xl" />
            <div className="absolute inset-0 grid-dots opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          </div>

          <div className="container grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-20">
            <div className="animate-fade-up">
              <Badge className="border border-amber-200 bg-white/80 px-3 py-1.5 text-amber-800 shadow-sm">
                <span className="text-sm">🇸🇻</span> Hecho en El Salvador · PWA instalable
              </Badge>

              <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.1rem]">
                Tus clientes vuelven.
                <br />
                <span className="relative inline-block text-amber-500">
                  Tú vendes más.
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-amber-300"
                    viewBox="0 0 200 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 9C48 3 140 2 197 6"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                La tarjeta de sellos digital para cafeterías, pupuserías y car washes de El
                Salvador. Sin papel, sin apps que descargar y sin fricción. Solo escanea, acumula
                y premia.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <Link href="/register?role=merchant">
                    Soy comercio, quiero empezar
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <Link href="/register?role=customer">
                    <MapPin /> Buscar promos cerca
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex -space-x-2">
                  {["👩🏽", "🧑🏽", "👨🏽‍🦱", "👩🏻"].map((emoji) => (
                    <span
                      key={emoji}
                      className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-sm ring-2 ring-cream"
                    >
                      {emoji}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-slate-900">4.9</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    +120 negocios salvadoreños ya fidelizan con Fielito
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:150ms]">
              <PhonePreview />
            </div>
          </div>

          <div className="container pb-14">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["120+", "negocios activos"],
                ["48,500", "sellos emitidos"],
                ["68%", "de clientes regresan"],
                ["0", "apps que descargar"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200/80 bg-white/70 px-5 py-4 backdrop-blur"
                >
                  <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categorías */}
        <section id="producto" className="border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="indigo">Para negocios locales</Badge>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                Si tu negocio vive de clientes que regresan, Fielito es para ti
              </h2>
              <p className="mt-3 text-slate-600">
                Diseñado con dueños de negocios salvadoreños, no en una oficina lejana.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {Object.entries(CATEGORY_META).map(([key, meta], index) => (
                <div
                  key={key}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-cream p-6 transition hover:-translate-y-1 hover:shadow-lifted"
                >
                  <div className="absolute -right-6 -top-6 grid h-28 w-28 place-items-center rounded-full bg-white text-5xl shadow-sm transition group-hover:scale-110">
                    <span aria-hidden>{meta.emoji}</span>
                  </div>
                  <div className="relative">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                      0{index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{meta.label}</h3>
                    <p className="mt-1 max-w-[15rem] text-sm text-slate-600">{meta.hint}</p>
                    <div className="mt-5 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      {key === "cafe" && <Coffee className="h-3.5 w-3.5 text-amber-500" />}
                      {key === "comida" && <Gift className="h-3.5 w-3.5 text-rose-500" />}
                      {key === "servicios" && <Zap className="h-3.5 w-3.5 text-indigo-500" />}
                      Tarjetas de 5 a 12 sellos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="py-20 sm:py-24">
          <div className="container">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <Badge variant="outline" className="bg-white">
                  Cómo funciona
                </Badge>
                <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  Tres pasos. Cero fricción.
                </h2>
                <p className="mt-3 text-slate-600">
                  Del primer escaneo al premio, todo ocurre en segundos. Tu equipo no aprende nada
                  nuevo y tus clientes no descargan nada.
                </p>
              </div>
              <Button asChild variant="ghost" className="justify-start px-0 text-indigo-600 md:justify-end">
                <Link href="/register?role=merchant">
                  Ver el panel por dentro <ChevronRight />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.step}
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-4xl font-bold text-slate-100">
                      {step.step}
                    </span>
                  </div>
                  <Badge className="mt-5" variant={index === 1 ? "indigo" : "default"}>
                    {step.for}
                  </Badge>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  {index < steps.length - 1 && (
                    <ChevronRight className="absolute -right-2 top-1/2 hidden h-6 w-6 text-slate-300 lg:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 rounded-3xl bg-slate-900 p-6 text-white sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <Badge variant="pro">
                  <Lock className="h-3 w-3" /> Seguridad primero
                </Badge>
                <h3 className="mt-3 text-2xl font-semibold">
                  Un QR firmado, de un solo uso, que cambia cada minuto.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  El servidor valida la firma HMAC, la expiración y el uso único del token antes de
                  tocar la tarjeta. En el MVP usamos tokens firmados y nonces; en producción, cada
                  nonce se persiste en PostgreSQL con RLS.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["🔐", "Token firmado", "HMAC-SHA256"],
                  ["⏱️", "60 segundos", "Rotación automática"],
                  ["1️⃣", "Un solo uso", "Nonce anti-replay"],
                ].map(([emoji, title, subtitle]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <p className="text-xl">{emoji}</p>
                    <p className="mt-2 text-sm font-semibold">{title}</p>
                    <p className="text-xs text-white/60">{subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-slate-200 bg-white py-20 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline">Todo incluido</Badge>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                Menos tarjetas perdidas. Más clientes fieles.
              </h2>
              <p className="mt-3 text-slate-600">
                Una herramienta simple para el negocio, una experiencia bonita para el cliente.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {storeFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-200 bg-cream/70 p-6 transition hover:border-amber-200 hover:bg-white hover:shadow-soft"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-amber-600 shadow-sm ring-1 ring-slate-100 transition group-hover:bg-amber-500 group-hover:text-white">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="py-20 sm:py-24">
          <div className="container">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <Badge variant="indigo">Historias reales (simuladas para el MVP)</Badge>
                <h2 className="mt-4 max-w-xl text-3xl font-bold text-slate-900 sm:text-4xl">
                  Dueños que dejaron el cartón atrás
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                <BadgeCheck className="h-5 w-5 text-emerald-500" />
                <span className="font-medium text-slate-700">
                  Promedio: <strong className="text-slate-900">+27% en visitas recurrentes</strong>
                </span>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-[15px] leading-relaxed text-slate-700">
                      “{testimonial.quote}”
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-lg">
                      {testimonial.avatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">{testimonial.business}</p>
                    </div>
                    <Badge variant="success">{testimonial.metric}</Badge>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Panel */}
        <section className="bg-slate-950 py-20 text-white sm:py-24">
          <div className="container grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="pro">Panel del comercio</Badge>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Todo lo que necesitas saber, en una pantalla.
              </h2>
              <p className="mt-3 max-w-lg text-white/70">
                Genera el QR de la caja, revisa los sellos del día y descubre a tus clientes más
                fieles. Desde tu laptop, tablet o celular.
              </p>

              <ul className="mt-7 space-y-4">
                {[
                  ["Código QR dinámico en un clic", "Siempre listo para escanear en tu mostrador."],
                  ["Métricas del día y la semana", "Sin hojas de cálculo ni cuadernos."],
                  ["Clientes frecuentes y premios pendientes", "Para saludarlos por su nombre."],
                  ["Planes claros", "Gratis hasta 50 clientes, Pro sin límites por $14.99/mes."],
                ].map(([title, description]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-400">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-sm text-white/60">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Button asChild variant="amber" size="lg" className="mt-8">
                <Link href="/register?role=merchant">
                  Crear mi cuenta gratis <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-[10px] text-slate-400 ring-1 ring-slate-200">
                    app.fielito.sv/dashboard
                  </span>
                </div>
                <div className="grid gap-3 bg-cream p-4 sm:grid-cols-3">
                  {[
                    ["Clientes", "8", "+2 esta semana"],
                    ["Sellos hoy", "7", "vs. 5 ayer"],
                    ["Premios", "4", "3 pendientes"],
                  ].map(([label, value, hint]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                      <p className="text-[10px] text-emerald-600">{hint}</p>
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 bg-cream px-4 pb-4 sm:grid-cols-[1.4fr_1fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">Sellos de la semana</p>
                      <BarChart3 className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="mt-4 flex h-24 items-end gap-2">
                      {[38, 58, 44, 76, 60, 92, 70].map((height, index) => (
                        <div key={index} className="flex-1">
                          <div
                            className={`w-full rounded-t-md ${
                              index === 5 ? "bg-amber-500" : "bg-amber-200"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                      {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
                        <span key={index}>{day}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-4 text-amber-950">
                    <div>
                      <QrCode className="h-8 w-8" />
                      <p className="mt-2 text-xs font-bold">QR de sello</p>
                      <p className="text-[10px] text-amber-950/70">Se renueva cada 60 s</p>
                    </div>
                    <div className="mt-3 rounded-lg bg-white/85 px-2 py-1.5 text-center text-[10px] font-bold">
                      Mostrar código
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="planes" className="py-20 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="bg-white">
                Planes
              </Badge>
              <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                Empieza gratis. Crece cuando quieras.
              </h2>
              <p className="mt-3 text-slate-600">
                Sin tarjeta para probar. Sin contratos. Cancela cuando quieras.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Gratis</p>
                  <Badge variant="muted">Para empezar</Badge>
                </div>
                <p className="mt-4 font-display text-5xl font-bold text-slate-900">
                  $0<span className="text-base font-medium text-slate-400">/mes</span>
                </p>
                <p className="mt-2 text-sm text-slate-500">Perfecto para probar la lealtad digital.</p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {[
                    "Hasta 50 clientes registrados",
                    "Tarjetas de sellos ilimitadas",
                    "QR dinámico anti-fraude",
                    "Mapa de promos",
                    "Métricas básicas del día",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="lg" className="mt-7 w-full">
                  <Link href="/register?role=merchant">Crear cuenta gratis</Link>
                </Button>
              </div>

              <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-600 bg-slate-950 p-7 text-white shadow-lifted">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-2xl" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-wide text-indigo-300">Pro</p>
                  <Badge variant="pro">
                    <Sparkles className="h-3 w-3" /> Recomendado
                  </Badge>
                </div>
                <p className="mt-4 font-display text-5xl font-bold">
                  $14.99<span className="text-base font-medium text-white/50">/mes</span>
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Todo lo que necesitas para crecer sin límites.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  {[
                    "Clientes ilimitados",
                    "Métricas avanzadas y cohortes",
                    "Premios pendientes y alertas",
                    "Exportar clientes a CSV",
                    "Soporte prioritario por WhatsApp",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="amber" size="lg" className="mt-7 w-full">
                  <Link href="/register?role=merchant&plan=pro">
                    Empezar con Pro <ArrowRight />
                  </Link>
                </Button>
                <p className="mt-3 text-center text-[11px] text-white/40">
                  Pago simulado en modo de prueba (Stripe Test Mode)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-slate-200 bg-white py-20 sm:py-24">
          <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="outline">Preguntas frecuentes</Badge>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">
                Lo que suelen preguntarnos
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                ¿Tienes otra duda? Escríbenos a{" "}
                <a href="mailto:hola@fielito.sv" className="font-semibold text-indigo-600">
                  hola@fielito.sv
                </a>{" "}
                y te respondemos el mismo día.
              </p>
            </div>

            <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-cream/60 px-5">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200 transition group-open:rotate-45 group-open:bg-amber-500 group-open:text-white">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 px-6 py-14 text-center shadow-glow sm:px-14">
              <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1.5px,transparent_1px)] [background-size:22px_22px]" />
              <div className="relative mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-950/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                  <Zap className="h-3.5 w-3.5" /> Empieza hoy, es gratis
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold text-amber-950 sm:text-5xl">
                  Tu próximo cliente fiel ya está en la fila.
                </h2>
                <p className="mt-4 text-amber-950/70">
                  Crea tu tarjeta de sellos en menos de 10 minutos. Sin tarjeta de crédito.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild size="xl" variant="dark">
                    <Link href="/register?role=merchant">
                      Crear mi cuenta de comercio <ArrowRight />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="xl"
                    variant="outline"
                    className="border-amber-950/15 bg-white/80 text-amber-950 hover:bg-white"
                  >
                    <Link href="/register?role=customer">Soy cliente, quiero mi billetera</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
