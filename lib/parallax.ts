"use client";

import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

/**
 * Spring única de toda a página. Todo movimento reativo — mouse e scroll —
 * passa por aqui, então o site inteiro tem a mesma "física".
 */
export const spring = {
  type: "spring",
  duration: 1.2,
  bounce: 0.24,
} as const;

export type PointerContextValue = {
  /** posição horizontal do mouse, normalizada de -1 (esquerda) a 1 (direita) */
  x: MotionValue<number>;
  /** posição vertical do mouse, normalizada de -1 (topo) a 1 (base) */
  y: MotionValue<number>;
  /**
   * Progresso da cena do hero, de 0 (repouso) a 1 (fim).
   *
   * Vem da rolagem real da página: o hero é `sticky` dentro de uma pista
   * de 200vh, e este valor é o quanto dessa pista já passou.
   */
  scroll: MotionValue<number>;
  /** true quando o usuário pediu menos movimento no sistema */
  reduced: boolean;
};

export const PointerContext = createContext<PointerContextValue | null>(null);

export function usePointer(): PointerContextValue {
  const ctx = useContext(PointerContext);
  if (!ctx) {
    throw new Error("usePointer precisa estar dentro de <PointerContext>.");
  }
  return ctx;
}

/**
 * PRNG determinístico (mulberry32). Usado para partículas de cacau:
 * garante o mesmo resultado no servidor e no cliente, sem hydration mismatch.
 */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
