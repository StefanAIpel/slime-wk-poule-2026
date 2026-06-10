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

const appIcon = "/icons/slimescore-app-icon-v2-512.png";
const appleTouchIcon = "/icons/slimescore-apple-touch-icon-v2-180.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SlimeScore · Gratis WK 2026-poule",
    template: "%s · SlimeScore",
  },
  description,
  applicationName: SITE_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: appIcon, sizes: "512x512", type: "image/png" },
      { url: "/icons/slimescore-app-icon-v2-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: appleTouchIcon, sizes: "180x180", type: "image/png" }],
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
    title: "SlimeScore · Gratis WK 2026-poule",
    description,
    images: [{ url: appIcon, width: 512, height: 512, alt: "SlimeScore app icon" }],
  },
  twitter: {
    card: "summary",
    title: "SlimeScore · Gratis WK 2026-poule",
    description,
    images: [appIcon],
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
