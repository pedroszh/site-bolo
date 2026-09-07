import type { ScatterPiece } from "@/types/piece";

/**
 * A coreografia dos enfeites — vale para todos os sabores.
 *
 * O bolo mora à esquerda e o texto à direita, então as peças ocupam a
 * metade esquerda, as faixas de topo e rodapé, e deixam livre o miolo da
 * direita (x acima de ~55% entre 20% e 80% de altura).
 *
 * Não existe peça de frente por cima do corpo do bolo (x entre 12% e 46%,
 * y entre 20% e 80%). Havia uma, e sobre o bolo claro de morango ela não
 * lia como bokeh: parecia uma mancha dentro da massa.
 *
 * No retrato o bolo fica centrado e bem mais largo, então duas peças que
 * aqui passam ao lado dele caem em cima da massa: elas levam
 * `portraitHidden`.
 *
 * Referência rápida:
 *  - depth  <  20  → atrás do bolo
 *  - depth === 20  → o bolo
 *  - depth  >  20  → passa na frente, sempre desfocado (vira bokeh)
 *
 * Durações e delays são fixos, e não sorteados em runtime, de propósito:
 * o resultado é idêntico no servidor e no cliente, sem hydration mismatch,
 * e continua fácil de ajustar peça por peça.
 */
export const pieces: ScatterPiece[] = [
  // ── Fundo: emolduram o bolo, macias e desfocadas ────────────────────────
  {
    image: 0,
    x: 37,
    y: 9,
    width: 210,
    rotate: 16,
    flip: false,
    blur: 3,
    depth: 8,
    duration: 6.2,
    delay: 0,
    opacity: 0.72,
  },
  {
    image: 1,
    x: 16,
    y: 7,
    width: 230,
    rotate: -12,
    flip: true,
    blur: 4,
    depth: 6,
    duration: 5.1,
    delay: 1.6,
    opacity: 0.5,
  },
  {
    image: 1,
    x: 50,
    y: 15,
    width: 185,
    rotate: -30,
    flip: false,
    blur: 5,
    depth: 7,
    duration: 3.9,
    delay: 2.2,
    opacity: 0.38,
  },

  // ── Camada média: nítidas, ainda atrás do bolo ──────────────────────────
  {
    image: 0,
    x: 5,
    y: 27,
    width: 175,
    rotate: -22,
    flip: true,
    blur: 2,
    depth: 12,
    duration: 6.8,
    delay: 0.2,
    opacity: 0.82,
  },
  {
    image: 1,
    x: 2,
    y: 60,
    width: 205,
    rotate: 20,
    flip: false,
    blur: 3,
    depth: 10,
    duration: 4.8,
    delay: 0.7,
    opacity: 0.62,
  },
  {
    image: 0,
    x: 11,
    y: 82,
    width: 165,
    rotate: -8,
    flip: true,
    blur: 1,
    depth: 16,
    duration: 5.4,
    delay: 1.3,
    opacity: 0.9,
  },
  {
    image: 1,
    x: 9,
    y: 43,
    width: 125,
    rotate: -40,
    flip: true,
    blur: 1,
    depth: 14,
    duration: 3.6,
    delay: 3.1,
    opacity: 0.85,
  },

  // ── Frente: cruzam o bolo e o rodapé, desfocadas, criando profundidade ──
  {
    image: 1,
    x: 41,
    y: 88,
    width: 240,
    rotate: 14,
    flip: false,
    blur: 2,
    depth: 24,
    duration: 4.1,
    delay: 0.4,
    opacity: 0.68,
    portraitHidden: true,
  },
  {
    image: 0,
    x: 26,
    y: 101,
    width: 250,
    rotate: -6,
    flip: false,
    blur: 5,
    depth: 26,
    duration: 5.9,
    delay: 1.8,
    opacity: 0.5,
  },
  {
    image: 0,
    x: 53,
    y: 97,
    width: 195,
    rotate: 24,
    flip: true,
    blur: 4,
    depth: 22,
    duration: 4.3,
    delay: 2.6,
    opacity: 0.46,
    portraitHidden: true,
  },
  {
    image: 1,
    x: 74,
    y: 104,
    width: 230,
    rotate: -22,
    flip: false,
    blur: 6,
    depth: 27,
    duration: 6.5,
    delay: 1.1,
    opacity: 0.3,
  },
];
