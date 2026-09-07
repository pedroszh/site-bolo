"use client";

import { motion, useTransform } from "framer-motion";
import { usePointer } from "@/lib/parallax";

/**
 * Convite discreto para girar a roda — some assim que o gesto acontece,
 * e volta sozinho quando a cena volta ao repouso.
 */
export default function ScrollHint() {
  const { scroll } = usePointer();
  const opacity = useTransform(scroll, [0, 0.18], [1, 0]);

  return (
    /*
      Duas camadas de propósito: a de fora obedece à roda, a de dentro faz
      a entrada. Numa só, a animação de entrada e o `useTransform` brigam
      pela mesma opacidade — e quem rolasse nos primeiros segundos via a
      dica reaparecer depois de já ter sumido.
    */
    <motion.div
      // Fica embaixo do bolo, não no meio da tela: é ele que a roda move.
      style={{ opacity, left: "var(--cake-x)" }}
      className="pointer-events-none absolute bottom-7 z-40 hidden -translate-x-1/2 lg:block"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="flex flex-col items-center gap-2.5"
      >
        <span
          className="text-[11px] uppercase tracking-[0.28em] opacity-40 transition-colors duration-700"
          style={{ color: "var(--ink)" }}
        >
          Role
        </span>
        <span
          className="relative flex h-9 w-[22px] items-start justify-center rounded-full border transition-colors duration-700"
          style={{ borderColor: "var(--line)" }}
        >
          <span
            className="anim mt-[6px] h-[5px] w-[2px] rounded-full transition-colors duration-700 [animation-name:hint-drop]"
            style={
              {
                "--dur": "2.2s",
                backgroundColor: "var(--accent)",
              } as React.CSSProperties
            }
          />
        </span>
      </motion.div>
    </motion.div>
  );
}
