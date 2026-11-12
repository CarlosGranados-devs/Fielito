"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Gift,
  LogOut,
  MapPin,
  Phone,
  Sparkles,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { LoyaltyCard } from "@/components/brand/loyalty-card";
import { LocationPickerDynamic } from "@/components/map/location-picker-dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import {
  BRAND_COLORS,
  BRAND_SOLIDS,
  CATEGORY_META,
  type BrandColor,
  type BusinessCategory,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Tu negocio", hint: "Cómo te conocen tus clientes" },
  { title: "Ubicación", hint: "Para aparecer en el mapa" },
  { title: "Tu tarjeta", hint: "Sellos y recompensa" },
];

const emojis = ["☕", "🫓", "🍔", "🥐", "🍣", "💈", "🚙", "✨", "🛍️", "🌸", "🍕", "🧋"];

const stampOptions = [4, 5, 6, 8, 10, 12];

const quickPlaces = [
  { label: "Centro de San Salvador", lat: 13.6989, lng: -89.1914 },
  { label: "Colonia Escalón", lat: 13.7089, lng: -89.2428 },
  { label: "Zona Rosa", lat: 13.716, lng: -89.2101 },
  { label: "Santa Tecla", lat: 13.6769, lng: -89.2797 },
];

const categoryDefaults: Record<BusinessCategory, { emoji: string; reward: string; color: BrandColor }> = {
  cafe: { emoji: "☕", reward: "Un café americano gratis", color: "amber" },
  comida: { emoji: "🫓", reward: "Una pupusa revuelta gratis", color: "rose" },
  servicios: { emoji: "✨", reward: "Un servicio de cortesía", color: "indigo" },
};

export default function OnboardingPage() {
  const router = useRouter();
  const {
    hydrated,
    session,
    profile,
    business,
    completeOnboarding,
    signOut,
  } = useApp();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState(business?.name ?? "");
  const [category, setCategory] = useState<BusinessCategory>(business?.category ?? "cafe");
  const [address, setAddress] = useState(business?.address ?? "");
  const [phone, setPhone] = useState(business?.phone ?? profile?.phone ?? "");
  const [logoEmoji, setLogoEmoji] = useState(business?.logoEmoji ?? "☕");
  const [brandColor, setBrandColor] = useState<BrandColor>(business?.brandColor ?? "amber");
  const [latitude, setLatitude] = useState(business?.latitude ?? 13.6989);
  const [longitude, setLongitude] = useState(business?.longitude ?? -89.1914);
  const [requiredStamps, setRequiredStamps] = useState(business?.requiredStamps ?? 5);
  const [rewardDescription, setRewardDescription] = useState(
    business?.rewardDescription ?? "Un café americano gratis",
  );

  const isEditing = Boolean(business);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace("/login?redirect=%2Fonboarding");
      return;
    }
    if (profile?.role === "customer") {
      router.replace("/wallet");
    }
  }, [hydrated, session, profile, router]);

  const canContinue = useMemo(() => {
    if (step === 0) return businessName.trim().length >= 2 && address.trim().length >= 5;
    if (step === 1) {
      return (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180
      );
    }
    return rewardDescription.trim().length >= 3 && requiredStamps >= 3;
  }, [step, businessName, address, latitude, longitude, rewardDescription, requiredStamps]);

  function pickCategory(next: BusinessCategory) {
    const previousDefault = categoryDefaults[category];
    setCategory(next);
    if (logoEmoji === previousDefault.emoji) setLogoEmoji(categoryDefaults[next].emoji);
    if (rewardDescription === previousDefault.reward) {
      setRewardDescription(categoryDefaults[next].reward);
    }
    if (brandColor === previousDefault.color) setBrandColor(categoryDefaults[next].color);
  }

  function next() {
    if (!canContinue) {
      toast.error("Completa los datos para continuar");
      return;
    }
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  function finish() {
    if (!canContinue) {
      toast.error("Revisa la configuración de tu tarjeta");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      completeOnboarding({
        businessName: businessName.trim(),
        category,
        address: address.trim(),
        phone: phone.trim(),
        latitude,
        longitude,
        requiredStamps,
        rewardDescription: rewardDescription.trim(),
        logoEmoji,
        brandColor,
      });

      let wantsPro = false;
      try {
        wantsPro = window.localStorage.getItem("fielito:plan-intent") === "pro";
      } catch {
        // ignore
      }

      toast.success(isEditing ? "Negocio actualizado" : "¡Tu negocio está listo!", {
        description: wantsPro
          ? "Ahora activa tu Plan Pro con el pago de prueba."
          : "Genera tu primer código QR y empieza a sellar tarjetas.",
      });

      if (wantsPro && business?.plan !== "pro") {
        router.push("/dashboard/planes?checkout=pro");
      } else {
        router.push("/dashboard");
      }
      setSaving(false);
    }, 700);
  }

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  if (!hydrated || !session || !profile || profile.role !== "merchant") {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-amber-100/60 via-cream to-transparent" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-slate-900">{profile.fullName}</p>
            <p className="text-[11px] text-slate-500">{profile.email}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:text-rose-600"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-2 sm:px-6">
        <div className="max-w-2xl">
          <Badge variant="outline" className="gap-1.5 bg-white">
            <Sparkles className="h-3 w-3 text-amber-500" />
            {isEditing ? "Editar configuración" : "Paso final para empezar"}
          </Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            {isEditing ? "Actualiza tu negocio" : "Configuremos tu tarjeta de sellos"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            En menos de 2 minutos tus clientes podrán sumar sellos desde el celular. Sin papel, sin
            apps que instalar.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-6">
            <ol className="mb-6 grid grid-cols-3 gap-2">
              {steps.map((item, index) => {
                const active = index === step;
                const done = index < step;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => {
                        if (index <= step || canContinue) setStep(index);
                      }}
                      className={cn(
                        "flex w-full flex-col gap-1 rounded-2xl border p-2.5 text-left transition sm:flex-row sm:items-center sm:gap-2.5",
                        active
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                          done
                            ? "bg-emerald-500 text-white"
                            : active
                              ? "bg-amber-500 text-amber-950"
                              : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-slate-900">
                          {item.title}
                        </span>
                        <span className="hidden truncate text-[10px] text-slate-500 sm:block">
                          {item.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            {step === 0 && (
              <div className="animate-fade-up space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nombre del negocio</Label>
                  <div className="relative">
                    <Store className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="businessName"
                      className="pl-10"
                      placeholder="Café La Esquina"
                      value={businessName}
                      onChange={(event) => setBusinessName(event.target.value)}
                      maxLength={60}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(Object.keys(CATEGORY_META) as BusinessCategory[]).map((key) => {
                      const meta = CATEGORY_META[key];
                      const active = category === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => pickCategory(key)}
                          className={cn(
                            "rounded-2xl border p-3 text-left transition",
                            active
                              ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
                              : "border-slate-200 bg-white hover:border-slate-300",
                          )}
                        >
                          <span className="text-xl">{meta.emoji}</span>
                          <span className="mt-1 block text-sm font-semibold text-slate-900">
                            {meta.label}
                          </span>
                          <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">
                            {meta.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección del local</Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="address"
                      className="pl-10"
                      placeholder="Calle La Reforma #225, San Salvador"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      maxLength={120}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Aparecerá en el mapa de promociones junto a tu pin.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Teléfono / WhatsApp <span className="font-normal text-slate-400">(opcional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      placeholder="+503 7000 0000"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      maxLength={25}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-up space-y-4">
                <div className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5 text-[11px] text-indigo-800">
                  <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
                  Toca el mapa o arrastra el pin para ubicar tu local con exactitud.
                </div>

                <div className="h-[300px] overflow-hidden rounded-2xl border border-slate-200">
                  <LocationPickerDynamic
                    latitude={latitude}
                    longitude={longitude}
                    onChange={(lat, lng) => {
                      setLatitude(Number(lat.toFixed(6)));
                      setLongitude(Number(lng.toFixed(6)));
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickPlaces.map((place) => (
                    <button
                      key={place.label}
                      type="button"
                      onClick={() => {
                        setLatitude(place.lat);
                        setLongitude(place.lng);
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                        latitude === place.lat && longitude === place.lng
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                      )}
                    >
                      {place.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={latitude}
                      onChange={(event) => setLatitude(Number(event.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={longitude}
                      onChange={(event) => setLongitude(Number(event.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-up space-y-6">
                <div className="space-y-2">
                  <Label>Ícono del negocio</Label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setLogoEmoji(emoji)}
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-xl border text-xl transition",
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
                  <Label>Color de tu tarjeta</Label>
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

                <div className="space-y-2">
                  <Label>Sellos para completar la tarjeta</Label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {stampOptions.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setRequiredStamps(count)}
                        className={cn(
                          "rounded-xl border py-2.5 text-sm font-bold transition",
                          requiredStamps === count
                            ? "border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-200"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                        )}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Recomendado: 5–8 sellos para cafés y 8–12 para servicios.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward">¿Qué gana el cliente al completar la tarjeta?</Label>
                  <div className="relative">
                    <Gift className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="reward"
                      className="pl-10"
                      placeholder="Un café americano gratis"
                      value={rewardDescription}
                      onChange={(event) => setRewardDescription(event.target.value)}
                      maxLength={80}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sé específico: tus clientes verán este texto en su billetera.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => (step === 0 ? router.push("/dashboard") : setStep((v) => v - 1))}
                disabled={saving}
              >
                <ArrowLeft />
                {step === 0 ? "Cancelar" : "Atrás"}
              </Button>

              {step < steps.length - 1 ? (
                <Button type="button" variant="amber" onClick={next} disabled={!canContinue}>
                  Continuar <ArrowRight />
                </Button>
              ) : (
                <Button type="button" variant="amber" onClick={finish} loading={saving}>
                  {isEditing ? "Guardar cambios" : "Crear mi tarjeta"} <Sparkles />
                </Button>
              )}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Vista previa
                </p>
                <Badge variant="muted">Wallet</Badge>
              </div>
              <LoyaltyCard
                businessName={businessName.trim() || "Tu negocio"}
                rewardDescription={rewardDescription.trim() || "Tu recompensa aquí"}
                currentStamps={requiredStamps > 3 ? 3 : 2}
                requiredStamps={requiredStamps}
                brandColor={brandColor}
                logoEmoji={logoEmoji}
                customerName={profile.fullName.split(" ")[0]}
              />
              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
                Así verán tus clientes su tarjeta en la app. Podrás cambiar todo esto después.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Building2 className="h-4 w-4" />
                </span>
                <p className="text-xs font-semibold text-slate-900">Incluido en el plan Gratis</p>
              </div>
              <ul className="mt-3 space-y-2">
                {[
                  "Hasta 50 clientes registrados",
                  "QR dinámico anti-fraude",
                  "Mapa de promociones",
                  "Métricas del día",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/legal/terminos"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Leer términos de uso <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <p className="px-2 text-[10px] leading-relaxed text-slate-400">
              Fielito actúa únicamente como plataforma de registro de puntos. El comercio afiliado es
              el único responsable de honrar y entregar las recompensas prometidas.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
