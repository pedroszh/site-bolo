"use client";

import { motion } from "framer-motion";
import { themes } from "@/data/themes";
import { useTheme } from "@/lib/theme";

/**
 * Seletor de sabores. O rodízio já anda sozinho a cada seis segundos —
 * isto é para quem quiser voltar e olhar de novo.
 */
export default function ThemeDots() {
  const { index, go } = useTheme();

  return (
    <div // Com quatro ou mais sabores a fila não cabe numa linha só.
      className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-8">
      {themes.map((theme, i) => {
        const active = i === index;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Ver o bolo de ${theme.word}`}
            aria-current={active}
            className="group flex items-center gap-2.5 text-[12px] uppercase tracking-[0.18em] transition-opacity duration-500"
            style={{ color: "var(--ink)", opacity: active ? 0.9 : 0.4 }}
          >
            <span
              className="relative block h-[7px] w-[7px] rounded-full transition-colors duration-500"
              style={{ backgroundColor: active ? "var(--accent)" : "var(--line)" }}
            >
              {active && (
                <motion.span
                  layoutId="theme-dot-ring"
                  className="absolute -inset-[5px] rounded-full border"
                  style={{ borderColor: "var(--accent)" }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                />
              )}
            </span>
            {theme.word}
          </button>
        );
      })}
    </div>
  );
}
