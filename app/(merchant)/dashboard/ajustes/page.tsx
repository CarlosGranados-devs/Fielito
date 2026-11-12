"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  ExternalLink,
  FlaskConical,
  Gift,
  LogOut,
  MapPin,
  Palette,
  RefreshCw,
  Save,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { LoyaltyCard } from "@/components/brand/loyalty-card";
import { LegalNotice } from "@/components/legal-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { useApp } from "@/lib/store";
import {
  BRAND_COLORS,
  BRAND_SOLIDS,
  CATEGORY_META,
  type BrandColor,
  type BusinessCategory,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const emojis = ["☕", "🫓", "🍔", "🥐", "🍣", "💈", "🚙", "✨", "🛍️", "🌸", "🍕", "🧋"];
const stampOptions = [4, 5, 6, 8, 10, 12];
const avatarOptions = ["👨🏽‍💼", "👩🏽‍💼", "🧑🏽‍💻", "🏪", "☕", "✨", "🙂", "🦊"];

export default function SettingsPage() {
  const router = useRouter();
  const {
    business,
    profile,
    signOut,
    signInDemo,
    updateBusiness,
    updateProfile,
    resetDemo,
  } = useApp();

  const [businessName, setBusinessName] = useState(business?.name ?? "");
  const [category, setCategory] = useState<BusinessCategory>(business?.category ?? "cafe");
  const [address, setAddress] = useState(business?.address ?? "");
  const [phone, setPhone] = useState(business?.phone ?? "");
  const [latitude, setLatitude] = useState(business?.latitude ?? 13.6989);
  const [longitude, setLongitude] = useState(business?.longitude ?? -89.1914);

  const [requiredStamps, setRequiredStamps] = useState(business?.requiredStamps ?? 5);
  const [rewardDescription, setRewardDescription] = useState(
    business?.rewardDescription ?? "",
  );
  const [logoEmoji, setLogoEmoji] = useState(business?.logoEmoji ?? "☕");
  const [brandColor, setBrandColor] = useState<BrandColor>(business?.brandColor ?? "amber");

  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [personalPhone, setPersonalPhone] = useState(profile?.phone ?? "");
  const [avatarEmoji, setAvatarEmoji] = useState(profile?.avatarEmoji ?? "🏪");

  const [resetOpen, setResetOpen] = useState(false);

  if (!business || !profile) return null;

  function saveBusiness(event: React.FormEvent) {
    event.preventDefault();
    if (businessName.trim().length < 2) {
      toast.error("El nombre del negocio es muy corto");
      return;
    }
    if (address.trim().length < 5) {
      toast.error("Escribe una dirección válida");
      return;
    }
    updateBusiness(business!.id, {
      name: businessName.trim(),
      category,
      address: address.trim(),
      phone: phone.trim() || undefined,
      latitude,
      longitude,
    });
    toast.success("Datos del negocio guardados");
  }

  function saveCard(event: React.FormEvent) {
    event.preventDefault();
    if (rewardDescription.trim().length < 3) {
      toast.error("Describe la recompensa que entregarás");
      return;
    }
    updateBusiness(business!.id, {
      requiredStamps,
      rewardDescription: rewardDescription.trim(),
      logoEmoji,
      brandColor,
    });
    toast.success("Tarjeta actualizada", {
      description: "Los cambios se reflejan de inmediato en la billetera de tus clientes.",
    });
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    if (fullName.trim().length < 3) {
      toast.error("Escribe tu nombre completo");
      return;
    }
    if (!email.includes("@")) {
      toast.error("Escribe un correo válido");
      return;
    }
    updateProfile({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: personalPhone.trim() || undefined,
      avatarEmoji,
    });
    toast.success("Perfil actualizado");
  }

  function previewAsCustomer() {
    signInDemo("customer");
    toast.success("Ahora eres María López (demo)", {
      description: "Vuelve al panel desde el perfil para seguir administrando tu negocio.",
    });
    router.push("/wallet");
  }

  function confirmReset() {
    resetDemo();
    setResetOpen(false);
    toast.success("Demo restaurada", {
      description: "Los datos de ejemplo volvieron a su estado inicial. Inicia sesión de nuevo.",
    });
    router.push("/login");
  }

  function handleSignOut() {
    signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">Ajustes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra tu negocio, tu tarjeta de sellos y tu cuenta.
          </p>
        </div>
        <Badge variant={business.plan === "pro" ? "pro" : "muted"} className="w-fit gap-1.5">
          {business.plan === "pro" ? (
            <>
              <Sparkles className="h-3 w-3" /> Plan Pro
            </>
          ) : (
            <>
              <Store className="h-3 w-3" /> Plan Gratis
            </>
          )}
        </Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Store className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Información del negocio
                </h3>
                <p className="text-xs text-slate-500">
                  Es lo que tus clientes ven en el mapa y en su billetera.
                </p>
              </div>
            </div>

            <form onSubmit={saveBusiness} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">Nombre del negocio</Label>
                  <Input
                    id="settings-name"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    maxLength={60}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-category">Categoría</Label>
                  <SelectNative
                    id="settings-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as BusinessCategory)}
                  >
                    {(Object.keys(CATEGORY_META) as BusinessCategory[]).map((key) => (
                      <option key={key} value={key}>
                        {CATEGORY_META[key].emoji} {CATEGORY_META[key].label}
                      </option>
                    ))}
                  </SelectNative>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-address">Dirección</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="settings-address"
                    className="pl-10"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    maxLength={120}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="settings-phone">Teléfono</Label>
                  <Input
                    id="settings-phone"
                    type="tel"
                    placeholder="+503 7000 0000"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={25}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-lat">Latitud</Label>
                  <Input
                    id="settings-lat"
                    type="number"
                    step="0.000001"
                    value={latitude}
                    onChange={(event) => setLatitude(Number(event.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-lng">Longitud</Label>
                  <Input
                    id="settings-lng"
                    type="number"
                    step="0.000001"
                    value={longitude}
                    onChange={(event) => setLongitude(Number(event.target.value))}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" /> Ajustar ubicación en el mapa
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <Button type="submit" variant="dark">
                  <Save /> Guardar negocio
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Gift className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Tarjeta de sellos
                </h3>
                <p className="text-xs text-slate-500">
                  Define cuántos sellos se necesitan y qué recompensa entregas.
                </p>
              </div>
            </div>

            <form onSubmit={saveCard} className="mt-5 space-y-5">
              <div className="space-y-2">
                <Label>Ícono del negocio</Label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setLogoEmoji(emoji)}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl border text-lg transition",
                        logoEmoji === emoji
                          ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      )}
                      aria-label={`Ícono ${emoji}`}
                      aria-pressed={logoEmoji === emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color de la tarjeta</Label>
                <div className="flex flex-wrap gap-2">
                  {BRAND_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBrandColor(color)}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-full ring-2 ring-offset-2 transition",
                        brandColor === color
                          ? "ring-slate-900"
                          : "ring-transparent hover:ring-slate-200",
                      )}
                      style={{ backgroundColor: BRAND_SOLIDS[color] }}
                      aria-label={`Color ${color}`}
                      aria-pressed={brandColor === color}
                    >
                      {brandColor === color && (
                        <Check className="h-4 w-4 text-white drop-shadow" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div className="space-y-2">
                  <Label htmlFor="settings-stamps">Sellos requeridos</Label>
                  <SelectNative
                    id="settings-stamps"
                    value={requiredStamps}
                    onChange={(event) => setRequiredStamps(Number(event.target.value))}
                  >
                    {stampOptions.map((count) => (
                      <option key={count} value={count}>
                        {count} sellos
                      </option>
                    ))}
                  </SelectNative>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-reward">Recompensa</Label>
                  <Input
                    id="settings-reward"
                    value={rewardDescription}
                    onChange={(event) => setRewardDescription(event.target.value)}
                    maxLength={80}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <Palette className="h-3 w-3" /> Vista previa
                </p>
                <LoyaltyCard
                  businessName={businessName || business.name}
                  rewardDescription={rewardDescription || "Tu recompensa aquí"}
                  currentStamps={Math.min(3, requiredStamps)}
                  requiredStamps={requiredStamps}
                  brandColor={brandColor}
                  logoEmoji={logoEmoji}
                />
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <Button type="submit" variant="dark">
                  <Save /> Guardar tarjeta
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">Tu cuenta</h3>
                <p className="text-xs text-slate-500">
                  Datos de la persona responsable del programa de lealtad.
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatarEmoji(emoji)}
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-full border text-lg transition",
                        avatarEmoji === emoji
                          ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      )}
                      aria-label={`Avatar ${emoji}`}
                      aria-pressed={avatarEmoji === emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="settings-fullname">Nombre completo</Label>
                  <Input
                    id="settings-fullname"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    maxLength={70}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-email">Correo electrónico</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-personal-phone">
                  Teléfono personal <span className="font-normal text-slate-400">(opcional)</span>
                </Label>
                <Input
                  id="settings-personal-phone"
                  type="tel"
                  placeholder="+503 7000 0000"
                  value={personalPhone}
                  onChange={(event) => setPersonalPhone(event.target.value)}
                  maxLength={25}
                />
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <Button type="submit" variant="dark">
                  <Save /> Guardar cuenta
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <FlaskConical className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  Modo demostración
                </h3>
                <p className="text-xs text-slate-500">
                  Prueba el flujo completo de cliente sin cerrar tu sesión de comercio.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={previewAsCustomer}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Smartphone className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">Vista cliente</span>
                  <span className="block text-[11px] text-slate-500">
                    Entra como María López y escanea tu QR.
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition hover:border-rose-200 hover:bg-rose-50/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600">
                  <RefreshCw className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">Reiniciar demo</span>
                  <span className="block text-[11px] text-slate-500">
                    Restaura clientes, sellos y planes de ejemplo.
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <p className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Esta versión guarda todo en el navegador (localStorage). Al conectar Supabase, los
              datos vivirán en tu base de datos con RLS.
            </p>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Tu plan
              </p>
              <Badge variant={business.plan === "pro" ? "pro" : "muted"}>
                {business.plan === "pro" ? "Pro" : "Gratis"}
              </Badge>
            </div>
            <p className="mt-3 font-display text-xl font-semibold text-slate-900">
              {business.plan === "pro" ? "Pro · $14.99/mes" : "Gratis · hasta 50 clientes"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {business.plan === "pro"
                ? "Clientes ilimitados, métricas avanzadas y exportación CSV."
                : "Ideal para validar tu programa de lealtad sin costo."}
            </p>
            <Button asChild variant={business.plan === "pro" ? "outline" : "amber"} className="mt-4 w-full">
              <Link href="/dashboard/planes">
                <CreditCard />
                {business.plan === "pro" ? "Gestionar plan" : "Mejorar a Pro"}
              </Link>
            </Button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              <BadgeCheck className="h-3 w-3" /> Cuenta verificada
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Tu negocio está activo en el mapa de Fielito. Comparte tu QR para que tus clientes
              empiecen a sumar sellos hoy.
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-base shadow-sm">
                {business.logoEmoji}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-900">{business.name}</p>
                <p className="truncate text-[10px] text-slate-500">{business.address}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Legal y soporte
            </p>
            <div className="mt-2 space-y-1">
              {[
                { href: "/legal/terminos", label: "Términos de uso" },
                { href: "/legal/privacidad", label: "Política de privacidad" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-1 py-2 text-xs font-medium text-slate-600 transition hover:text-slate-900"
                >
                  {item.label}
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>
              ))}
              <a
                href="mailto:hola@fielito.sv"
                className="flex items-center justify-between rounded-lg px-1 py-2 text-xs font-medium text-slate-600 transition hover:text-slate-900"
              >
                hola@fielito.sv
                <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
              </a>
            </div>
            <Button variant="outline" className="mt-3 w-full" onClick={handleSignOut}>
              <LogOut /> Cerrar sesión
            </Button>
          </div>

          <LegalNotice />
        </aside>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>¿Reiniciar la demo?</DialogTitle>
            <DialogDescription>
              Se borrarán los cambios que hiciste en este navegador y volverán los datos de
              ejemplo: Café La Esquina, María López y sus tarjetas. Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmReset}>
              <RefreshCw /> Sí, reiniciar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
