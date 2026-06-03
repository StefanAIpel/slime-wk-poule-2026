import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthLinkBridge } from "@/components/auth-link-bridge";
import { InAppHint } from "@/components/in-app-hint";
import { PwaRegister } from "@/components/pwa-register";
import { QuickMenu } from "@/components/quick-menu";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatusBar } from "@/components/status-bar";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

// Plus Jakarta Sans: vriendelijk maar volwassener en beter leesbaar dan Poppins.
const appFont = Plus_Jakarta_Sans({
  variable: "--font-app",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const description =
  "Gratis Nederlandse WK 2026-poule. Eén keer invullen, maak een poule met vrienden en familie en zie wie er wint. Jouw data privé.";

const appIcon = "/icons/slimescore-app-icon-v2-512.png";
const appleTouchIcon = "/icons/slimescore-apple-touch-icon-v2-180.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Slime Score · Gratis WK 2026-poule",
    template: "%s · Slime Score",
  },
  description,
  keywords: [
    "WK 2026 poule",
    "WK poule",
    "voetbalpoule",
    "WK voorspellen",
    "gratis WK poule",
    "wereldkampioenschap 2026",
    "poule maken",
    "Slime Score",
  ],
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
    title: "Slime Score · Gratis WK 2026-poule",
    description,
    images: [{ url: appIcon, width: 512, height: 512, alt: "Slime Score app icon" }],
  },
  twitter: {
    card: "summary",
    title: "Slime Score · Gratis WK 2026-poule",
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

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${appIcon}`,
    image: `${SITE_URL}${appIcon}`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "GameApplication",
    operatingSystem: "Web, iOS, Android",
    inLanguage: "nl-NL",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon-512.png` },
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={appFont.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <div className="stadium-bg" />
        <PwaRegister />
        <AuthLinkBridge />
        <StatusBar />
        <SiteHeader />
        <InAppHint />
        <QuickMenu />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
