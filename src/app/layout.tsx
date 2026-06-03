import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { AuthLinkBridge } from "@/components/auth-link-bridge";
import { PwaRegister } from "@/components/pwa-register";
import { QuickMenu } from "@/components/quick-menu";
import { SiteFooter } from "@/components/site-footer";
import { StatusBar } from "@/components/status-bar";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "GameApplication",
  operatingSystem: "Web, iOS, Android",
  inLanguage: "nl-NL",
  description,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={poppins.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <div className="stadium-bg" />
        <PwaRegister />
        <AuthLinkBridge />
        <StatusBar />
        <QuickMenu />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
