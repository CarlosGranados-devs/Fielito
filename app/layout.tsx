import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://fielito.sv"),
  title: {
    default: "Fielito — Lealtad digital para negocios locales",
    template: "%s · Fielito",
  },
  description:
    "Fielito es la app de tarjetas de sellos digitales para cafeterías, pupuserías y car washes de El Salvador. Tus clientes regresan, tú vendes más. Sin papel, sin fricción.",
  applicationName: "Fielito",
  keywords: [
    "lealtad",
    "tarjetas de sellos",
    "El Salvador",
    "cafeterías",
    "pupuserías",
    "PWA",
    "programa de fidelización",
  ],
  authors: [{ name: "Fielito" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fielito",
  },
  openGraph: {
    title: "Fielito — Lealtad digital para negocios locales",
    description:
      "Sellos digitales, premios reales y clientes que vuelven. La billetera de lealtad para El Salvador.",
    type: "website",
    locale: "es_SV",
    siteName: "Fielito",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh bg-cream font-sans text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
