"use client";

import { AnimatePresence, motion } from "framer-motion";
import { spring } from "@/lib/parallax";
import { useTheme } from "@/lib/theme";
import CTAButtons from "@/components/CTAButtons";
import ThemeDots from "@/components/ThemeDots";

/**
 * A coluna da direita: o texto que fala do bolo em cena.
 *
 * Tudo que é do sabor troca junto, em cascata de cima para baixo — o
 * mesmo gesto do wipe, só que na vertical. O que não muda (os botões e o
 * seletor de sabores) fica fora da troca, para não piscar a cada seis
 * segundos.
 */
export default function CakeCopy() {
  const { theme } = useTheme();

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
    out: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };
  const rise = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: spring },
    out: { opacity: 0, y: -14, transition: { duration: 0.3 } },
  };

  return (
    /*
      Grid de duas linhas com a primeira em altura mínima: enquanto um
      sabor sai e o outro entra, os botões abaixo não sobem nem descem.
    */
    <div
      className="grid"
      style={{ gridTemplateRows: "minmax(var(--copy-min-h), auto) auto" }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={theme.id}
          variants={stagger}
          initial="hidden"
          animate="show"
          exit="out"
          style={{ gridArea: "1 / 1" }}
        >
          <motion.p
            variants={rise}
            className="text-[13px] font-light uppercase tracking-[0.26em] transition-colors duration-700"
            style={{ color: "var(--accent)" }}
          >
            {theme.copy.eyebrow}
          </motion.p>

          <motion.h1
            variants={rise}
            className="mt-5 font-display font-black transition-colors duration-700"
            style={{
              color: "var(--ink)",
              fontSize: "var(--h1-size)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            {theme.copy.name}
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-[44ch] border-l pl-5 font-light leading-[1.75] transition-colors duration-700"
            style={{
              color: "var(--ink-soft)",
              borderColor: "var(--line)",
              fontSize: "clamp(15px, 1.15vw, 17px)",
            }}
          >
            {theme.copy.description}
          </motion.p>

          <motion.ul
            variants={rise}
            className="mt-7 hidden flex-wrap gap-2.5 sm:flex"
          >
            {theme.copy.specs.map((spec) => (
              <li
                key={spec}
                className="rounded-full border px-3.5 py-1.5 text-[12px] uppercase tracking-[0.14em] transition-colors duration-700"
                style={{ color: "var(--ink-soft)", borderColor: "var(--line)" }}
              >
                {spec}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </AnimatePresence>

      {/* Fora da troca: continuam firmes enquanto o sabor gira */}
      <div style={{ gridArea: "2 / 1" }} className="mt-9 lg:mt-11">
        <CTAButtons />
        <ThemeDots />
      </div>
    </div>
  );
}
