import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthLinkBridge } from "@/components/auth-link-bridge";
import { PwaRegister } from "@/components/pwa-register";
import { QuickMenu } from "@/components/quick-menu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slime Score 2026",
  description: "Nederlandstalige WK 2026 voetbalpoule met e-mail login, subpoules en overzichtelijke voorspellingen.",
  applicationName: "Slime Score",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Slime Score",
  },
  manifest: "/manifest.webmanifest",
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
