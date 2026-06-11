"use client";

import { useRef, useState } from "react";

/** Ruimere WhatsApp-achtige set: voetbal + reacties + familiepoule-plagerij. */
const WK_EMOJIS = [
  "😀", "😂", "🤣", "😊", "😍", "🤩", "🥳", "😎", "🤪", "😅", "😭", "😬",
  "👍", "👏", "🙌", "💪", "🙏", "🤞", "👀", "💚", "🧡", "❤️", "🔥", "✨",
  "⚽", "🏆", "🥇", "🥈", "🥉", "🎯", "🥅", "📣", "🚀", "⭐", "🐐", "💥",
  "🇳🇱", "🍊", "🇧🇪", "🇩🇪", "🇪🇸", "🇵🇹", "🇫🇷", "🇧🇷", "🇦🇷", "🇲🇽", "🇺🇸", "🇨🇦",
  "🍻", "🍕", "🌮", "🎉", "🎊", "🤝", "🙈", "🫣", "😈", "🤯", "🥶", "🫶",
];

const MAX_LENGTH = 500;
const MIN_LENGTH = 10;

/**
 * Tekstvak voor het prikbord met een WhatsApp-achtig emoji-popover. De emoji
 * wordt op de cursorpositie ingevoegd; het veld blijft een gewoon uncontrolled
 * form-field met name="body", zodat de bestaande server-action blijft werken.
 */
export function PoolBoardComposer({ placeholder, addLabel }: { placeholder: string; addLabel: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);

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
      <div className="pool-emoji-toolbar">
        <button
          type="button"
          className="pool-emoji-trigger"
          onClick={() => setOpen((current) => !current)}
          aria-label={addLabel}
          aria-expanded={open}
        >
          <span aria-hidden="true">😀</span>
          <span>{addLabel}</span>
        </button>
        {open ? (
          <div className="pool-emoji-popover" role="dialog" aria-label={addLabel}>
            <div className="pool-emoji-popover-head">
              <span>Emoji</span>
              <button type="button" className="pool-emoji-close" onClick={() => setOpen(false)} aria-label="Emoji sluiten">
                ×
              </button>
            </div>
            <div className="pool-emoji-grid" role="group" aria-label={addLabel}>
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
        ) : null}
      </div>
    </div>
  );
}
