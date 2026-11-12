"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";

export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { hydrated, session, profile } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (profile && profile.role !== role) {
      router.replace(profile.role === "merchant" ? "/dashboard" : "/wallet");
    }
  }, [hydrated, session, profile, role, router, pathname]);

  if (!hydrated || !session || !profile || profile.role !== role) {
    return <AppSplash />;
  }

  return <>{children}</>;
}

export function AppSplash() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-cream">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500" />
      </div>
    </div>
  );
}
