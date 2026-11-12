"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Indica si el proyecto tiene configurado Supabase.
 * La app funciona en modo demo (localStorage) cuando esto es `false`.
 */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Cliente de Supabase para Client Components.
 *
 * Uso típico:
 *   const supabase = createClient();
 *   const { data } = await supabase.from("businesses").select("*");
 *
 * Lanza un error explícito si faltan las variables de entorno para evitar
 * peticiones silenciosas a un backend inexistente.
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local.",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
