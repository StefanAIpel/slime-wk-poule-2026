import { Megaphone } from "lucide-react";

/** Admin-mededeling bovenaan een pagina (zie /admin → Mededelingen). Rendert niets zonder tekst. */
export function SiteMessageBanner({ body }: { body: string | null }) {
  if (!body) return null;
  return (
    <div className="site-message-banner" role="status">
      <Megaphone aria-hidden="true" className="size-5 shrink-0" />
      <p>{body}</p>
    </div>
  );
}
