"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { usePointer } from "@/lib/parallax";
import { useTheme } from "@/lib/theme";
import type { CakeTheme } from "@/types/theme";

/** Curva do wipe: sai rápido, chega macio. */
const WIPE = [0.76, 0, 0.24, 1] as const;
const WIPE_DURATION = 1.15;

/** Uma camada de fundo completa: gradiente, luz lateral, madeira e vinheta. */
function Scene({ theme }: { theme: CakeTheme }) {
  const p = theme.palette;
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(158deg, ${p.bgFrom} 0%, ${p.bgFrom} 22%, ${p.bgTo} 100%)`,
        }}
      />

      {/* Luz quente entrando pela esquerda alta, do lado do bolo */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(80% 65% at 12% 6%, ${p.glow} 0%, rgba(0,0,0,0) 62%)`,
          opacity: 0.5,
        }}
      />

      {/* Tampo: a composição toda apoia aqui */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30vh]"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, ${p.ground} 88%)`,
          opacity: p.groundStrength,
        }}
      />

      {/* Vinheta: fecha os cantos e segura o olho no centro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(118% 96% at 34% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.16) 76%, rgba(0,0,0,0.34) 100%)",
        }}
      />
    </>
  );
}

/**
 * Ambiente da cena.
 *
 * Duas camadas empilhadas: embaixo o sabor que está saindo, em cima o que
 * chega — este entra com um wipe da esquerda para a direita, do jeito que
 * a referência faz. Quando o wipe termina a camada de baixo já não
 * aparece, e a próxima troca recomeça o ciclo.
 *
 * É também a camada mais lenta do parallax (±3px): o fundo quase não se
 * move, o que faz o bolo parecer mais próximo do que realmente está.
 */
export default function BackgroundGlow() {
  const { x, y, scroll, reduced } = usePointer();
  const { theme, previous } = useTheme();

  const bgX = useTransform(x, [-1, 1], reduced ? [0, 0] : [3, -3]);
  const bgY = useTransform(y, [-1, 1], reduced ? [0, 0] : [3, -3]);
  // Na roda o ambiente também cede um pouco, mas bem menos que o bolo.
  const sink = useTransform(scroll, [0, 1], [0, 22]);
  const baseY = useTransform([bgY, sink], ([a, b]: number[]) => a + b);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{ x: bgX, y: baseY }}
    >
      <div className="absolute -inset-8">
        {/* Sabor que sai — fica parado, só é coberto */}
        <Scene theme={previous} />

        {/* Sabor que entra */}
        <AnimatePresence initial={false}>
          <motion.div
            key={theme.id}
            className="absolute inset-0"
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{
              duration: reduced ? 0.001 : WIPE_DURATION,
              ease: WIPE,
            }}
          >
            <Scene theme={theme} />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
