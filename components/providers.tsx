"use client";

import { Toaster } from "sonner";
import { AppStoreProvider } from "@/lib/store";
import { PwaRegister } from "@/components/pwa-register";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          className: "font-sans",
          style: { borderRadius: "14px" },
        }}
      />
      <PwaRegister />
    </AppStoreProvider>
  );
}
