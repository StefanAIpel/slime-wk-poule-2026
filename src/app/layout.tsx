import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthLinkBridge } from "@/components/auth-link-bridge";
import { PwaRegister } from "@/components/pwa-register";
import { QuickMenu } from "@/components/quick-menu";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Gratis Nederlandse WK 2026-poule. Eén keer invullen, maak een poule met vrienden en familie en zie wie er wint. Jouw data privé.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Slime Score · Gratis WK 2026-poule",
    template: "%s · Slime Score",
  },
  description,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Slime Score · Gratis WK 2026-poule",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Slime Score — gratis WK 2026-poule" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slime Score · Gratis WK 2026-poule",
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ff7a00",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="stadium-bg" />
        <PwaRegister />
        <AuthLinkBridge />
        <QuickMenu />
        {children}
      </body>
    </html>
  );
}
