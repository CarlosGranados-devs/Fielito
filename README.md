# Fielito ☕

**Lealtad digital para negocios locales de El Salvador.** Fielito es una PWA B2B2C de tarjetas de sellos: los comercios crean su programa en minutos y sus clientes acumulan sellos escaneando un QR dinámico, sin instalar nada desde una tienda de apps.

> **Estado:** MVP funcional. La app corre en **modo demo** con `localStorage` y cero configuración. El esquema de Supabase, las políticas RLS y los clientes de servidor ya están incluidos para conectar el backend real.

---

## ✨ Lo que incluye

### Comercio
- Registro e inicio de sesión con rol de comercio (Google / enlace mágico simulados en demo).
- Onboarding en 3 pasos: datos del negocio, ubicación en mapa Leaflet y configuración de la tarjeta con vista previa en vivo.
- Dashboard con QR dinámico firmado (HMAC-SHA256, 60 s, un solo uso), métricas del día, gráfico semanal, clientes frecuentes y actividad reciente.
- Gestión de clientes, detalle de visitas y exportación CSV (solo Plan Pro).
- Recompensas listas para canjear y canjes históricos.
- Planes: Gratis hasta 50 clientes y Pro USD $14.99/mes con **checkout simulado** (funciona con datos de tarjeta vacíos o inventados).
- Ajustes de negocio, tarjeta, cuenta, modo demo y legal.

### Cliente
- Billetera estilo Apple Wallet con todas sus tarjetas y progreso de sellos.
- Escáner de cámara (`html5-qrcode`), entrada manual de token y flujo demo.
- Sello con confeti, canje de premios y tarjeta que vuelve a cero.
- Mapa de promociones con Leaflet, filtros, búsqueda, geolocalización y distancia.
- Perfil con logros, instalación PWA, cambio al panel de comercio y cierre de sesión.

### Plataforma
- Next.js 15 (App Router) + React 19 + TypeScript.
- Tailwind CSS 3.4, componentes estilo shadcn/ui, Lucide Icons.
- PWA instalable en iOS/Android con manifest, iconos y service worker.
- Legal de El Salvador: términos y privacidad con la cláusula obligatoria de responsabilidad del comercio.
- Supabase: esquema SQL completo con RLS, triggers, límites de plan y RPC atómicas.

---

## 🚀 Inicio rápido (modo demo)

Requisitos: **Node.js 20+** y npm.

```bash
git clone https://github.com/CarlosGranados-devs/Fielito.git
cd Fielito
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Accesos demo

| Rol | Cómo entrar | Persona |
| --- | --- | --- |
| Comercio | Login → “Comercio demo” | Café La Esquina (Carlos Granados) |
| Cliente | Login → “Cliente demo” | María López |

También puedes usar cualquier correo y una contraseña de 6+ caracteres. En modo demo no se valida contra un backend.

### Flujo completo para probar

1. Entra como **comercio demo**.
2. En el dashboard, toca **Mostrar código QR**.
3. Usa **Probar escaneo (demo)** o copia el enlace del QR.
4. El cliente escanea, recibe un sello con confeti y la tarjeta avanza.
5. Completa la tarjeta, entra a **Premios** y canjea la recompensa.
6. Vuelve al panel con **Vista cliente → perfil → Ir al panel de comercio**.
7. Prueba **Plan y facturación → Mejorar a Pro** con cualquier dato de tarjeta.

> Todos los datos de la demo viven en `localStorage` bajo `fielito:state:v1`. Puedes reiniciarla desde **Ajustes → Modo demostración → Reiniciar demo**.

---

## 🧱 Stack y estructura

```
app/
  (merchant)/dashboard/        Panel del comercio (resumen, clientes, recompensas, planes, ajustes)
  (customer)/                  Billetera, mapa, escáner, premios, perfil
  onboarding/                  Wizard de alta del comercio
  login/ register/             Autenticación (demo)
  legal/terminos/              Términos de uso
  legal/privacidad/            Política de privacidad
  api/qr/token/                Emite token QR firmado
  api/qr/redeem/               Verifica firma, expiración y nonce
components/
  brand/                       Logo y tarjeta estilo wallet
  merchant/ customer/          Shells, navegación y diálogos
  map/                         Leaflet (carga dinámica, sin SSR)
  ui/                          Primitivas shadcn-like
lib/
  store.tsx                    Estado global demo + acciones
  seed.ts                      Datos de ejemplo
  selectors.ts                 Métricas y consultas derivadas
  qr-token.ts                  Firma HMAC y anti-replay en memoria
  supabase/                    Clientes browser/server/service-role
supabase/
  schema.sql                   Tablas, RLS, triggers, RPC y vistas
```

### Scripts

```bash
npm run dev        # desarrollo con Turbopack
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck  # TypeScript sin emitir
npm run icons      # regenerar iconos PWA
```

---

## 🔐 QR antifraude

1. El comercio autenticado solicita un token a `POST /api/qr/token` con `{ businessId }`.
2. El servidor crea un payload `{ v, b, n, iat, exp }` (nonce aleatorio, expiración de 60 s) y lo firma con HMAC-SHA256 usando `QR_SIGNING_SECRET`.
3. El cliente escanea el QR y envía el token a `POST /api/qr/redeem`.
4. El servidor verifica la firma con comparación de tiempo constante, la expiración y consume el nonce una sola vez.
5. En producción, tras verificar el token, se llama a la RPC `redeem_scan_token(business_id, nonce)` con Supabase Auth. La función bloquea el nonce con `FOR UPDATE`, valida caducidad y uso único, y suma el sello de forma atómica.

El store demo mantiene los nonces en memoria del servidor. La versión Supabase usa la tabla `scan_nonces` (server-only, sin grants para `anon`/`authenticated`).

---

## 🗄️ Conectar Supabase (producción)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql).
3. En **Authentication → Providers**, activa **Email** (magic link) y **Google** si lo deseas.
4. En **Authentication → URL Configuration**, agrega `http://localhost:3000` y tu dominio de producción.
5. Copia `.env.example` a `.env.local` y completa:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   QR_SIGNING_SECRET=...
   ```

6. Configura el webhook de Stripe hacia `/api/stripe/webhook` y usa `service_role` para actualizar el plan.

### Modelo de datos

| Tabla | Propósito |
| --- | --- |
| `profiles` | Perfil 1—1 con `auth.users`; rol `merchant` o `customer`. |
| `businesses` | Comercio, ubicación, configuración de tarjeta y plan. |
| `loyalty_cards` | Progreso único por cliente/comercio. |
| `transactions` | Libro inmutable de sellos y canjes. |
| `scan_nonces` | Nonces de QR de un solo uso (solo servidor). |

### Seguridad (RLS)

- **Cliente:** solo ve sus tarjetas, transacciones y perfil.
- **Comercio:** solo ve sus clientes, tarjetas, transacciones y métricas.
- **Negocios:** lectura pública de locales activos para el mapa; escritura solo del dueño.
- **Sellos y canjes:** sin `INSERT`/`UPDATE` directo; se ejecutan con `join_business()`, `redeem_scan_token()` y `claim_reward()` (`security definer`).
- **Plan y Stripe:** protegidos por trigger; solo `service_role`/`postgres` pueden modificarlos.
- **Plan Gratis:** trigger que bloquea el registro del cliente número 51.

### RPC disponibles

```sql
select * from public.join_business('uuid-del-comercio');
select * from public.create_scan_nonce('uuid-del-comercio', 60);
select * from public.redeem_scan_token('uuid-del-comercio', 'nonce');
select * from public.claim_reward('uuid-de-la-tarjeta');
```

---

## 💳 Stripe en modo test

El MVP simula el checkout: el botón **Generar pago** acepta datos vacíos o inventados y activa Pro al instante. No se realiza ningún cargo.

Para la integración real:

1. Crea un producto recurrente de **USD $14.99/mes** en Stripe.
2. Configura `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID` y `STRIPE_WEBHOOK_SECRET`.
3. Usa Stripe Checkout en modo `subscription` y el CLI para probar webhooks:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Actualiza `businesses.plan` desde el webhook con `service_role`, nunca desde el navegador.

Tarjetas de prueba: `4242 4242 4242 4242`, cualquier fecha futura y CVC de 3 dígitos.

---

## 📱 PWA

- Manifest en `app/manifest.ts`, service worker en `public/sw.js`.
- Instalable desde Safari (iPhone: Compartir → Agregar a pantalla de inicio) y Chrome (Instalar app).
- El registro del service worker solo se activa en producción (`NODE_ENV === "production"`).
- Iconos generados con `npm run icons` en `public/icons`.

---

## ☁️ Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Agrega las variables de `.env.example` en **Settings → Environment Variables**.
3. Despliega. El build usa `npm run build`.
4. Actualiza `NEXT_PUBLIC_APP_URL` y las Redirect URLs de Supabase con el dominio final.

---

## ⚖️ Legal

Fielito actúa únicamente como plataforma de registro de puntos. El comercio afiliado es el único responsable de honrar y entregar las recompensas prometidas. Nos reservamos el derecho de suspender cuentas por fraude de sellos.

Los documentos en `/legal/terminos` y `/legal/privacidad` son una base para el MVP y deben ser revisados por un abogado salvadoreño antes del lanzamiento comercial. Los datos societarios son ilustrativos.

---

## 🗺️ Roadmap sugerido

- Migrar `lib/store.tsx` a consultas de Supabase + Server Actions.
- Auth real con Google OAuth y magic link.
- Checkout real de Stripe y portal de facturación.
- Notificaciones push de “te falta 1 sello”.
- Analítica de cohortes y retención para Pro.
- Panel de administración de Fielito y moderación de comercios.

---

Hecho con cariño para los negocios de barrio de El Salvador. 🇸🇻
