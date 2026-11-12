import { RequireRole } from "@/components/require-role";
import { CustomerShell } from "@/components/customer/customer-shell";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="customer">
      <CustomerShell>{children}</CustomerShell>
    </RequireRole>
  );
}
