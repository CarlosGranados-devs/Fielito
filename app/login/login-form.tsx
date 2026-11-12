"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LegalNotice } from "@/components/legal-notice";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LoginForm({
  initialRole = "customer",
  redirectTo,
}: {
  initialRole?: Role;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { signIn, signInDemo } = useApp();
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);

  function destination(forRole: Role, hasBusiness?: boolean) {
    if (forRole === "merchant") return hasBusiness ? "/dashboard" : "/onboarding";
    if (redirectTo?.startsWith("/wallet") || redirectTo?.startsWith("/mapa") || redirectTo?.startsWith("/escanear") || redirectTo?.startsWith("/perfil")) {
      return redirectTo;
    }
    return "/wallet";
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Escribe tu correo electrónico");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const result = signIn({ email, role });
      toast.success(
        role === "merchant" ? "¡Bienvenido de vuelta!" : "¡Hola de nuevo! Tu billetera te espera.",
      );
      router.push(destination(role, result.hasBusiness));
      setLoading(false);
    }, 550);
  }

  function handleDemo(demoRole: Role) {
    signInDemo(demoRole);
    toast.success(
      demoRole === "merchant"
        ? "Sesión demo: Café La Esquina"
        : "Sesión demo: María López",
    );
    router.push(demoRole === "merchant" ? "/dashboard" : "/wallet");
  }

  function handleGoogle() {
    signInDemo(role);
    toast.success("Google OAuth simulado en modo demo", {
      description:
        role === "merchant"
          ? "Entraste como Café La Esquina. En producción se usa Supabase Auth."
          : "Entraste como María López. En producción se usa Supabase Auth.",
    });
    router.push(role === "merchant" ? "/dashboard" : "/wallet");
  }

  function handleMagicLink() {
    if (!email.trim()) {
      toast.error("Escribe tu correo para enviarte el enlace");
      return;
    }
    setMagicLoading(true);
    window.setTimeout(() => {
      const result = signIn({ email, role });
      toast.success("Enlace mágico verificado (demo)", {
        description: "En producción, Supabase envía un correo con un enlace de un solo uso.",
      });
      router.push(destination(role, result.hasBusiness));
      setMagicLoading(false);
    }, 700);
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
          {role === "merchant" ? "Portal de comercios" : "Tu billetera de lealtad"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">
          Bienvenido de vuelta
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Entra para {role === "merchant" ? "ver tus métricas y generar tu QR" : "seguir sumando sellos"}.
        </p>
      </div>

      <Tabs value={role} onValueChange={(value) => setRole(value as Role)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer" className="gap-2">
            <ShoppingBag className="h-3.5 w-3.5" /> Cliente
          </TabsTrigger>
          <TabsTrigger value="merchant" className="gap-2">
            <Building2 className="h-3.5 w-3.5" /> Comercio
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              className="pl-10"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <button
              type="button"
              onClick={() =>
                toast.info("En producción, Supabase enviará un correo para restablecer tu contraseña.")
              }
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              ¿La olvidaste?
            </button>
          </div>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pl-10 pr-11"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Demo: usa cualquier correo y una contraseña de 6+ caracteres.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Entrar <ArrowRight />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          o continúa con
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" variant="outline" onClick={handleGoogle} className="w-full">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleMagicLink}
          disabled={magicLoading}
          className="w-full"
        >
          {magicLoading ? <Loader2 className="animate-spin" /> : <Mail />}
          Enlace mágico
        </Button>
      </div>

      <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-3">
        <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Acceso rápido a la demo
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleDemo("merchant")}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-amber-300 hover:bg-amber-50",
            )}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-100 text-base">
              ☕
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-900">Comercio demo</span>
              <span className="block truncate text-[10px] text-slate-500">Café La Esquina</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleDemo("customer")}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-100 text-base">
              👩🏽
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-900">Cliente demo</span>
              <span className="block truncate text-[10px] text-slate-500">María López</span>
            </span>
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
          Regístrate gratis
        </Link>
      </p>

      <LegalNotice compact className="mt-6" />
    </div>
  );
}
