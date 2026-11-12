import { RequireRole } from "@/components/require-role";
import { MerchantShell } from "@/components/merchant/merchant-shell";

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole role="merchant">
      <MerchantShell>{children}</MerchantShell>
    </RequireRole>
  );
}
