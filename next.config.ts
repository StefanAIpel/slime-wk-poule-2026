import type { NextConfig } from "next";

// Content-Security-Policy als defense-in-depth. Voorlopig REPORT-ONLY: de browser
// rapporteert overtredingen (console) maar blokkeert niets, zodat we niets stukmaken
// voor gebruikers. Na een observatieperiode kan dit omgezet worden naar de
// afdwingende "Content-Security-Policy"-header. 'unsafe-inline' op script-src is nodig
// voor Next's inline runtime + de statische JSON-LD; img/connect staan https: toe voor
// Supabase (auth/realtime/storage). frame-src laat alleen onze eigen game-subdomeinen toe.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https://soccer.slimescore.com https://volley.slimescore.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/soccer",
        destination: "https://soccer.slimescore.com",
        permanent: true,
      },
      {
        source: "/soccer/:path*",
        destination: "https://soccer.slimescore.com/:path*",
        permanent: true,
      },
      {
        source: "/volley",
        destination: "https://volley.slimescore.com",
        permanent: true,
      },
      {
        source: "/volley/:path*",
        destination: "https://volley.slimescore.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
