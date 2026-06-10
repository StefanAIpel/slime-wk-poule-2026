import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies, headers } from "next/headers";
import { AuthLinkBridge } from "@/components/auth-link-bridge";
import { InAppHint } from "@/components/in-app-hint";
import { LocalePreferenceSync } from "@/components/locale-preference-sync";
import { PwaRegister } from "@/components/pwa-register";
import { QuickMenu } from "@/components/quick-menu";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatusBar } from "@/components/status-bar";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { LOCALE_COOKIE, isSupportedLocale } from "@/lib/i18n";
import "./globals.css";

// Plus Jakarta Sans: vriendelijk maar volwassener en beter leesbaar dan Poppins.
const appFont = Plus_Jakarta_Sans({
  variable: "--font-app",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const description =
  "Gratis WK 2026-poule voor Nederland en België. Voorspel wedstrijden, maak een poule met vrienden of collega's en volg de ranglijst live.";
const englishDescription =
  "Free World Cup 2026 prediction pool for international fans. Create a football pool for friends, family or colleagues and follow live rankings.";

const appIcon = "/icons/slimescore-app-icon-v4-512.png";
const appleTouchIcon = "/icons/slimescore-apple-touch-icon-v4-180.png";
// Vierkant app-icon voor gedeelde links: duidelijker in WhatsApp/Telegram dan de brede banner.
const ogImage = appIcon;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SlimeScore · Gratis WK 2026-poule",
    template: "%s · SlimeScore",
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
    "Oranje WK 2026",
    "Nederland WK poule",
    "België WK poule",
    "World Cup 2026 pool",
    "free World Cup pool",
    "FIFA World Cup 2026 predictions",
    "football pool",
    "soccer pool",
    "office football pool",
    "USA Canada Mexico 2026",
    "SlimeScore",
    "SlimeScore",
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
      { url: "/icons/slimescore-app-icon-v4-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: appleTouchIcon, sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
    languages: {
      nl: SITE_URL,
      en: `${SITE_URL}/en`,
      "x-default": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    alternateLocale: ["en_GB", "en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SlimeScore · Gratis WK 2026-poule",
    description,
    images: [{ url: ogImage, width: 512, height: 512, alt: "SlimeScore app icon" }],
  },
  twitter: {
    card: "summary",
    title: "SlimeScore · Gratis WK 2026-poule",
    description,
    images: [ogImage],
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
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["SlimeScore", "World Cup 2026 pool", "WK 2026 poule"],
    url: SITE_URL,
    inLanguage: ["nl-NL", "en"],
    keywords: "World Cup 2026 pool, free World Cup pool, WK 2026 poule, voetbalpoule, football pool, soccer pool",
    description: englishDescription,
    potentialAction: {
      "@type": "RegisterAction",
      target: `${SITE_URL}/en#login`,
      name: "Join a free World Cup 2026 pool",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "GameApplication",
    operatingSystem: "Web, iOS, Android",
    inLanguage: ["nl-NL", "en"],
    description,
    alternateName: ["Free World Cup 2026 prediction pool", "Gratis WK 2026-poule"],
    keywords: "World Cup 2026, football predictions, soccer pool, office pool, WK poule, Oranje, Netherlands, Belgium, USA, Canada, Mexico",
    areaServed: ["NL", "BE", "US", "CA", "MX", "GB", "Global"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}${appIcon}` },
  },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const htmlLang = isSupportedLocale(cookieLocale) ? cookieLocale : "nl";

  // De live-subsite (live.slimescore.com / live.slimescore.app) heeft eigen chrome; verberg hier de
  // hoofd-navigatie/footer. De header wordt door de middleware gezet.
  const isLiveSurface = (await headers()).get("x-slimescore-surface") === "live";

  return (
    <html lang={htmlLang} className={appFont.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <div className="stadium-bg" />
        <PwaRegister />
        {isLiveSurface ? null : (
          <>
            <LocalePreferenceSync />
            <AuthLinkBridge />
            <StatusBar />
            <SiteHeader />
            <QuickMenu />
            <InAppHint />
          </>
        )}
        {children}
        {isLiveSurface ? null : <SiteFooter locale={htmlLang} />}
        {/* FOUC-vangnet: als de stylesheet niet laadt (bv. vlak na een deploy die
            de oude CSS-hash verving), is #css-probe niet 'display:none' en herladen
            we de pagina één keer, zodat niemand een kale pagina ziet. */}
        <span id="css-probe" aria-hidden="true" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){function c(){try{var p=document.getElementById("css-probe");if(!p)return;if(getComputedStyle(p).display==="none"){sessionStorage.removeItem("ss_css_retry");return;}if(!sessionStorage.getItem("ss_css_retry")){sessionStorage.setItem("ss_css_retry","1");location.reload();}}catch(e){}}if(document.readyState==="complete"){requestAnimationFrame(c);}else{window.addEventListener("load",function(){requestAnimationFrame(c);});}})();',
          }}
        />
      </body>
    </html>
  );
}
