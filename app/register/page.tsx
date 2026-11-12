import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "./register-form";
import type { Role } from "@/lib/types";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea tu cuenta de comercio o tu billetera de lealtad Fielito en menos de dos minutos.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const initialRole: Role = params.role === "customer" ? "customer" : "merchant";

  return (
    <AuthShell mode="register">
      <RegisterForm initialRole={initialRole} plan={params.plan} />
    </AuthShell>
  );
}
