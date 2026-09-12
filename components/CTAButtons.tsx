"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/parallax";
import { whatsappLink } from "@/data/site";

/**
 * O par de chamadas para ação.
 *
 * Primário: cor cheia do sabor, com um brilho quente que atravessa no
 * hover. Secundário: só o contorno. Ambos sobem 3px — o mesmo gesto, em
 * dois pesos diferentes — e as cores atravessam a troca de sabor pela
 * transição, sem piscar.
 */
export default function CTAButtons() {
  return (
    <div className="flex flex-wrap items-center gap-3 lg:gap-4">
      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -3 }}
        whileTap={{ y: -1, scale: 0.985 }}
        transition={spring}
        className="cta-pill group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] transition-colors duration-700 focus-visible:outline-none focus-visible:ring-2"
        style={{
          backgroundColor: "var(--btn-bg)",
          color: "var(--btn-ink)",
        }}
      >
        <span className="relative z-10">Fazer orçamento</span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="relative z-10 h-[14px] w-[14px] transition-transform duration-500 ease-out group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>

        {/* Brilho que atravessa a superfície */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:[animation:sheen_0.9s_ease-out]"
        />
      </motion.a>

      <motion.a
        href="#cardapio"
        whileHover={{ y: -3 }}
        whileTap={{ y: -1, scale: 0.985 }}
        transition={spring}
        className="cta-pill inline-flex items-center rounded-full border px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors duration-700 hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] focus-visible:outline-none focus-visible:ring-2"
        style={{ color: "var(--ink)", borderColor: "var(--line)" }}
      >
        Ver cardápio
      </motion.a>
    </div>
  );
}
