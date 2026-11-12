import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function requirePublicEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Cliente para Server Components, Route Handlers y Server Actions.
 * Respeta la sesión del usuario mediante cookies y, por lo tanto, las políticas RLS.
 *
 * En Next.js 15 `cookies()` es asíncrono: hay que hacer `await createServerClient()`.
 */
export async function createServerSupabaseClient() {
  const { supabaseUrl: url, supabaseAnonKey: key } = requirePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // En Server Components no se pueden escribir cookies.
          // El middleware o un Route Handler se encargan de refrescar la sesión.
        }
      },
    },
  });
}

/**
 * Cliente administrativo con service_role. Omite RLS.
 *
 * Úsalo únicamente en el servidor para:
 *   · validar y consumir nonces de QR,
 *   · procesar webhooks de Stripe,
 *   · tareas administrativas y de mantenimiento.
 *
 * NUNCA lo importes desde un Client Component ni expongas la clave.
 */
export function createServiceRoleClient() {
  const url = supabaseUrl;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL para el cliente administrativo.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
