"use client";

import { useRef } from "react";

/** WK-/voetbalthema-emoji's om snel in een prikbordbericht te prikken. */
const WK_EMOJIS = ["⚽", "🏆", "🥅", "🔥", "🎉", "🥳", "💪", "🤞", "😅", "😎", "🐐", "🧡", "🍊", "🇳🇱", "⭐", "📣"];

const MAX_LENGTH = 500;
const MIN_LENGTH = 10;

/**
 * Tekstvak voor het prikbord met een rij WK-emoji's eronder. De emoji wordt op de
 * cursorpositie ingevoegd; het veld blijft een gewoon (uncontrolled) form-field met
 * name="body", zodat de bestaande server-action en native validatie blijven werken.
 */
export function PoolBoardComposer({ placeholder, addLabel }: { placeholder: string; addLabel: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insertEmoji(emoji: string) {
    const textarea = ref.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const next = textarea.value.slice(0, start) + emoji + textarea.value.slice(end);
    if (next.length > MAX_LENGTH) return;
    textarea.value = next;
    const caret = start + emoji.length;
    textarea.focus();
    textarea.setSelectionRange(caret, caret);
  }

  return (
    <div className="pool-board-composer">
      <textarea
        ref={ref}
        className="field min-h-20 pool-board-textarea"
        name="body"
        minLength={MIN_LENGTH}
        maxLength={MAX_LENGTH}
        required
        placeholder={placeholder}
      />
      <div className="pool-emoji-row" role="group" aria-label={addLabel}>
        {WK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="pool-emoji-btn"
            onClick={() => insertEmoji(emoji)}
            aria-label={`${addLabel}: ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
