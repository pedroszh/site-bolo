"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { usePointer } from "@/lib/parallax";
import { useTheme } from "@/lib/theme";

/** Mesma curva e mesmo tempo do wipe do fundo. */
const WIPE = [0.76, 0, 0.24, 1] as const;

/**
 * O nome do sabor, gigante, atrás do bolo.
 *
 * A palavra que chega é revelada da esquerda para a direita enquanto a que
 * sai é consumida na mesma direção — as duas varrem juntas com a cor do
 * fundo, então a troca parece um único gesto e não três coisas piscando.
 *
 * As duas ficam na mesma célula de um grid: sempre centradas no bolo, sem
 * depender do comprimento de cada palavra.
 */
export default function ThemeWord() {
  const { x, scroll, reduced } = usePointer();
  const { theme } = useTheme();

  const wordX = useTransform(x, [-1, 1], reduced ? [0, 0] : [8, -8]);
  const wordY = useTransform(scroll, [0, 1], [0, -46]);
  // A palavra é da primeira cena. Assim que a roda anda ela sai inteira:
  // atrás do texto revelado, duas tipografias grandes no mesmo espaço
  // atrapalham a leitura.
  const wordFade = useTransform(scroll, [0.05, 0.35], [1, 0]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[4] overflow-hidden"
    >
      <motion.div
        className="absolute grid place-items-center"
        style={{
          left: "var(--cake-x)",
          top: "calc(var(--cake-y) - 10%)",
          translate: "-50% -50%",
          x: wordX,
          y: wordY,
          opacity: wordFade,
        }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={theme.id}
            className="select-none whitespace-nowrap font-display font-black uppercase leading-none"
            style={{
              gridArea: "1 / 1",
              color: "var(--word)",
              fontSize: "var(--word-size)",
              letterSpacing: "-0.01em",
            }}
            initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
            transition={{ duration: reduced ? 0.001 : 1.15, ease: WIPE }}
          >
            {theme.word}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
