"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit-knop die zichzelf uitschakelt terwijl de server-action loopt.
 * Voorkomt dubbel/snel posten en geeft een verwerkingsindicatie.
 * Met `confirmText` vraagt de knop eerst om bevestiging vóór de submit —
 * voor acties met effect op iedereen (zoals admin-herberekenen).
 */
export function PendingButton({
  children,
  className = "button-primary",
  pendingText = "Bezig…",
  confirmText,
}: {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
  confirmText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      aria-busy={pending}
      onClick={confirmText ? (event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      } : undefined}
    >
      {pending ? pendingText : children}
    </button>
  );
}
