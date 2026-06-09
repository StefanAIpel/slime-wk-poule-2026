"use client";

import { useFormStatus } from "react-dom";

/**
 * PendingButton-variant die eerst om bevestiging vraagt vóór de server-action
 * wordt gesubmit. Voor admin-acties met effect op iedereen (zoals herberekenen).
 */
export function ConfirmPendingButton({
  children,
  confirmText,
  className = "button-secondary",
  pendingText = "Bezig…",
}: {
  children: React.ReactNode;
  confirmText: string;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      aria-busy={pending}
      onClick={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
