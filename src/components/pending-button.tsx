"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit-knop die zichzelf uitschakelt terwijl de server-action loopt.
 * Voorkomt dubbel/snel posten en geeft een verwerkingsindicatie.
 */
export function PendingButton({
  children,
  className = "button-primary",
  pendingText = "Bezig…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </button>
  );
}
