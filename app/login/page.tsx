import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "./login-form";
import type { Role } from "@/lib/types";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Entra a tu cuenta de Fielito para sumar sellos o administrar tu negocio.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const initialRole: Role = params.role === "merchant" ? "merchant" : "customer";

  return (
    <AuthShell mode="login">
      <LoginForm initialRole={initialRole} redirectTo={params.redirect} />
    </AuthShell>
  );
}
