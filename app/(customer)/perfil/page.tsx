"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Download,
  Gift,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Share,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Stamp,
  Store,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { LegalNotice } from "@/components/legal-notice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCustomerCards } from "@/lib/selectors";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const avatarOptions = ["👩🏽", "👨🏽", "🧑🏽", "👩🏻", "🧔🏽", "👩🏽‍🦱", "🙂", "🦊"];

export default function ProfilePage() {
  const router = useRouter();
  const { state, profile, signOut, signInDemo, updateProfile } = useApp();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [avatarEmoji, setAvatarEmoji] = useState(profile?.avatarEmoji ?? "👩🏽");

  const [installOpen, setInstallOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const cards = useMemo(
    () => (profile ? getCustomerCards(state, profile.id) : []),
    [state, profile],
  );

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    setIsStandalone(media.matches);

    function handlePrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  if (!profile) return null;

  const totalStamps = cards.reduce((sum, item) => sum + item.card.currentStamps, 0);
  const totalRedeemed = cards.reduce((sum, item) => sum + item.card.rewardsRedeemed, 0);
  const ready = cards.filter((item) => item.card.isCompleted).length;

  function startEditing() {
    setFullName(profile!.fullName);
    setPhone(profile!.phone ?? "");
    setEmail(profile!.email);
    setAvatarEmoji(profile!.avatarEmoji ?? "🙂");
    setEditing(true);
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
      phone: phone.trim() || undefined,
      avatarEmoji,
    });
    toast.success("Perfil actualizado");
    setEditing(false);
  }

  async function install() {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        toast.success("¡Fielito instalada!", {
          description: "Ya puedes abrir tu billetera desde la pantalla de inicio.",
        });
      }
      setInstallPrompt(null);
      return;
    }
    setInstallOpen(true);
  }

  function switchToMerchant() {
    signInDemo("merchant");
    toast.success("Ahora eres Café La Esquina (demo)", {
      description: "Genera tu QR y prueba el flujo de sellado.",
    });
    router.push("/dashboard");
  }

  function handleSignOut() {
    signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Mi cuenta</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">Perfil</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tus datos, tus logros y los ajustes de tu billetera.
        </p>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-lifted sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/20 backdrop-blur">
              {profile.avatarEmoji ?? "👩🏽"}
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-xl font-semibold">{profile.fullName}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-white/60">
                <Mail className="h-3 w-3 shrink-0" /> {profile.email}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/50">
                <CalendarDays className="h-3 w-3" /> Miembro desde {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="gap-1 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30">
              <Sparkles className="h-3 w-3" /> Miembro Fiel
            </Badge>
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-3 ring-1 ring-white/10">
          {[
            { label: "Tarjetas", value: cards.length, icon: Wallet },
            { label: "Sellos activos", value: totalStamps, icon: Stamp },
            { label: "Premios canjeados", value: totalRedeemed, icon: Gift },
          ].map((item) => (
            <div key={item.label} className="px-3 text-center">
              <item.icon className="mx-auto h-4 w-4 text-amber-400" />
              <p className="mt-1 font-display text-xl font-bold leading-none">{item.value}</p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-white/50">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {ready > 0 && (
        <Link
          href="/premios"
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-4 transition hover:border-amber-300"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-amber-950">
            <Gift className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {ready === 1 ? "Tienes 1 premio listo" : `Tienes ${ready} premios listos`}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              Reclámalos en {ready === 1 ? "el local" : "los locales"} y vuelve a empezar tu tarjeta.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-amber-600" />
        </Link>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <Smartphone className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Instala Fielito</h3>
              <p className="text-[11px] text-slate-500">Tu billetera, siempre a la mano.</p>
            </div>
          </div>

          {isStandalone ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-[11px] font-medium text-emerald-700">
              <Check className="h-4 w-4" /> Ya tienes Fielito instalada en este dispositivo.
            </div>
          ) : (
            <>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Agrégala a tu pantalla de inicio y ábrela como cualquier app. Funciona en iPhone y
                Android, sin pasar por la tienda.
              </p>
              <Button variant="outline" className="mt-3 w-full" onClick={install}>
                <Download /> Agregar a inicio
              </Button>
            </>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Store className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Modo demostración</h3>
              <p className="text-[11px] text-slate-500">Prueba el otro lado de Fielito.</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            ¿Tienes un negocio? Entra al panel de Café La Esquina para generar tu QR y ver las
            métricas del comercio.
          </p>
          <Button variant="dark" className="mt-3 w-full" onClick={switchToMerchant}>
            <Store /> Ir al panel de comercio
          </Button>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <BadgeCheck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Datos personales</h3>
              <p className="text-[11px] text-slate-500">Solo los usamos para tu cuenta.</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={startEditing}>
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Button>
        </div>

        <dl className="mt-4 divide-y divide-slate-100">
          {[
            { label: "Nombre", value: profile.fullName },
            { label: "Correo", value: profile.email },
            { label: "Teléfono", value: profile.phone ?? "No registrado" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {item.label}
              </dt>
              <dd className="truncate text-xs font-medium text-slate-700">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          <MapPin className="h-3 w-3" /> Fielito
        </p>
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {[
            { href: "/legal/terminos", label: "Términos de uso" },
            { href: "/legal/privacidad", label: "Política de privacidad" },
            { href: "/mapa", label: "Mapa de promociones" },
            { href: "/premios", label: "Mis premios" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-xl px-2 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              {item.label}
              <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
            </Link>
          ))}
        </div>
        <Button variant="outline" className="mt-3 w-full" onClick={handleSignOut}>
          <LogOut /> Cerrar sesión
        </Button>
      </section>

      <LegalNotice />

      <p className="pb-2 text-center text-[10px] text-slate-400">
        Fielito SV, S.A. de C.V. · San Salvador, El Salvador
      </p>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar mis datos</DialogTitle>
            <DialogDescription>
              Actualiza tu información de contacto. Tu correo identifica tu billetera.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveProfile} className="space-y-4">
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
                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200"
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

            <div className="space-y-2">
              <Label htmlFor="profile-name">Nombre completo</Label>
              <Input
                id="profile-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                maxLength={70}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Correo electrónico</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Teléfono</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="profile-phone"
                  type="tel"
                  className="pl-10"
                  placeholder="+503 7000 0000"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  maxLength={25}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="amber">
                <Check /> Guardar cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={installOpen} onOpenChange={setInstallOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agrega Fielito a tu inicio</DialogTitle>
            <DialogDescription>
              En iPhone y Android se instala desde el navegador, sin tiendas de apps.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 p-3.5">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <Share className="h-4 w-4 text-indigo-500" /> En iPhone (Safari)
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-[11px] leading-relaxed text-slate-500">
                <li>Abre Fielito en Safari.</li>
                <li>Toca el botón Compartir (el cuadro con la flecha).</li>
                <li>Elige “Agregar a pantalla de inicio” y confirma.</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 p-3.5">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <Smartphone className="h-4 w-4 text-emerald-500" /> En Android (Chrome)
              </p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-[11px] leading-relaxed text-slate-500">
                <li>Abre Fielito en Chrome.</li>
                <li>Toca el menú de tres puntos.</li>
                <li>Elige “Instalar app” o “Agregar a pantalla principal”.</li>
              </ol>
            </div>
            <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] text-amber-800">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              En la versión demo, la instalación funciona cuando la app corre en HTTPS o en
              localhost.
            </p>
          </div>

          <Button variant="dark" className="w-full" onClick={() => setInstallOpen(false)}>
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
