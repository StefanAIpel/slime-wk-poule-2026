/** Gedeelde poll-typen + percentage-helper (puur, dus los te unit-testen). */

export type PollChoice = "a" | "b" | "c";

export type LivePoll = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string | null;
};

export type PollCounts = { a: number; b: number; c: number };

/** Stemmen → percentages (afgerond) + totaal. */
export function pollPercentages(counts: PollCounts) {
  const total = counts.a + counts.b + counts.c;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  return { total, a: pct(counts.a), b: pct(counts.b), c: pct(counts.c) };
}

/** Geldige keuze, rekening houdend met een optionele derde optie. */
export function isValidChoice(value: unknown, hasOptionC: boolean): value is PollChoice {
  return value === "a" || value === "b" || (hasOptionC && value === "c");
}
