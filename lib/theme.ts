"use client";

import { createContext, useContext } from "react";
import type { CakeTheme } from "@/types/theme";

export type ThemeContextValue = {
  /** sabor em cena */
  theme: CakeTheme;
  /** sabor que está saindo — o wipe de cor entra por cima dele */
  previous: CakeTheme;
  /** índice do sabor em cena, para os seletores */
  index: number;
  /** troca de sabor na mão; reinicia o rodízio */
  go: (index: number) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme precisa estar dentro de <ThemeContext>.");
  }
  return ctx;
}

/**
 * A paleta do tema vira variáveis CSS no elemento raiz da cena.
 *
 * Assim qualquer filho lê `var(--ink)` e, com `transition-colors`, a
 * mudança de sabor atravessa suave: a substituição do `var()` é
 * instantânea, mas a transição do valor calculado não é.
 */
export function paletteVars(theme: CakeTheme): React.CSSProperties {
  const p = theme.palette;
  return {
    "--bg-from": p.bgFrom,
    "--bg-to": p.bgTo,
    "--glow": p.glow,
    "--ground": p.ground,
    "--ink": p.ink,
    "--ink-soft": p.inkSoft,
    "--line": p.line,
    "--accent": p.accent,
    "--word": p.word,
    "--shadow": p.shadow,
    "--dust": p.dust,
    "--btn-bg": p.buttonBg,
    "--btn-ink": p.buttonInk,
  } as React.CSSProperties;
}
