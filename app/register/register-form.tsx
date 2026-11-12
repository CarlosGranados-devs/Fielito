"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LegalNotice } from "@/components/legal-notice";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";

export function RegisterForm({
  initialRole = "merchant",
  plan,
}: {
  initialRole?: Role;
  plan?: string;
}) {
  const router = useRouter();
  const { register, signInDemo } = useApp();
  const [role, setRole] = useState<Role>(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPro = plan === "pro" && role === "merchant";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (fullName.trim().length < 3) {
      toast.error("Escribe tu nombre completo");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Escribe un correo válido");
      return;
    }
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (!accepted) {
      toast.error("Debes aceptar los términos y la política de privacidad");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      register({ fullName: fullName.trim(), email, role, phone: phone || undefined });
      if (isPro) {
        try {
          window.localStorage.setItem("fielito:plan-intent", "pro");
        } catch {
          // ignore
        }
      }
      toast.success(
        role === "merchant" ? "¡Cuenta creada! Configuremos tu negocio." : "¡Bienvenida a Fielito!",
        {
          description:
            role === "merchant"
              ? "Siguiente paso: nombre de tu local, ubicación y tarjeta de sellos."
              : "Tu billetera está lista. Escanea tu primer sello.",
        },
      );
      router.push(role === "merchant" ? "/onboarding" : "/wallet");
      setLoading(false);
    }, 600);
  }

  function handleDemo(demoRole: Role) {
    signInDemo(demoRole);
    toast.success("Sesión demo iniciada");
    router.push(demoRole === "merchant" ? "/dashboard" : "/wallet");
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
          {role === "merchant" ? "Únete como comercio" : "Crea tu billetera"}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">
          {role === "merchant" ? "Haz que vuelvan por más" : "Suma sellos desde hoy"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {role === "merchant"
            ? "Gratis hasta 50 clientes. Sin tarjeta de crédito."
            : "Todas tus tarjetas de lealtad en un solo lugar."}
        </p>
      </div>

      {isPro && (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            Elegiste el <strong>Plan Pro</strong>. Primero crea tu cuenta y configura tu tarjeta;
            el pago simulado de <strong>$14.99/mes</strong> lo completas al final.
          </p>
        </div>
      )}

      <Tabs value={role} onValueChange={(value) => setRole(value as Role)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="merchant" className="gap-2">
            <Building2 className="h-3.5 w-3.5" /> Soy comercio
          </TabsTrigger>
          <TabsTrigger value="customer" className="gap-2">
            <ShoppingBag className="h-3.5 w-3.5" /> Soy cliente
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            {role === "merchant" ? "Nombre del responsable" : "Nombre completo"}
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="fullName"
              placeholder={role === "merchant" ? "Carlos Granados" : "María López"}
              className="pl-10"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Correo electrónico</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="register-email"
              type="email"
              placeholder="tu@correo.com"
              className="pl-10"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="font-normal text-slate-400">(opcional)</span>
            </Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+503 7000 0000"
                className="pl-10"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Contraseña</Label>
            <div className="relative">
              <Input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                className="pr-11"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
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
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-600"
          />
          <span>
            Acepto los{" "}
            <Link href="/legal/terminos" target="_blank" className="font-semibold text-indigo-600 underline">
              Términos de uso
            </Link>{" "}
            y la{" "}
            <Link href="/legal/privacidad" target="_blank" className="font-semibold text-indigo-600 underline">
              Política de privacidad
            </Link>
            . Entiendo que Fielito solo registra puntos y que el comercio es responsable de las
            recompensas.
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {role === "merchant" ? "Crear cuenta de comercio" : "Crear mi billetera"}
          <ArrowRight />
        </Button>

        <Button type="button" variant="outline" className="w-full" onClick={() => handleDemo(role)}>
          <Check className="text-emerald-500" />
          Probar con la cuenta demo
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] text-slate-400">o</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          signInDemo(role);
          toast.success("Google OAuth simulado en modo demo");
          router.push(role === "merchant" ? "/onboarding" : "/wallet");
        }}
      >
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
        Registrarme con Google
      </Button>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>

      <LegalNotice compact className="mt-5" />
    </div>
  );
}
