import type { Metadata } from "next";
import { LiveSubsiteNav } from "@/components/live-subsite-nav";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";

export const metadata: Metadata = {
  title: "SlimeScore Live — WK 2026 uitslagen & schema",
  description: "Live WK 2026-wedstrijden, laatste uitslagen en het volledige speelschema. Klik een wedstrijd voor opstellingen en statistieken.",
  robots: { index: false },
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="live-subsite">
      <LiveSubsiteNav />
      <main className="page-shell live-subsite-main">{children}</main>
      <footer className="live-subsite-footer">
        <p className="live-subsite-footer-title">Ook leuk</p>
        <SlimeSoccerBanner includeWk includeVolley={false} fullWidth />
      </footer>
    </div>
  );
}
