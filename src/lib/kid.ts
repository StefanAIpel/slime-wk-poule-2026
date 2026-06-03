/**
 * Kind-accounts loggen in met alleen een code (geen eigen e-mail). De code wordt
 * omgezet naar een vast, niet-bestaand e-mailadres; de code dient als wachtwoord.
 * Houd codes privé — wie de code heeft, kan inloggen.
 */
export function kidEmail(code: string) {
  return `kid-${code.trim().toLowerCase()}@kids.slimescore.com`;
}
