"use client";

import { motion, useTransform } from "framer-motion";
import { usePointer } from "@/lib/parallax";
import { reveal } from "@/data/reveal";

/** Um dos três itens. Componente próprio porque cada um tem a sua
 *  faixa de entrada — e hook não mora dentro de `map`. */
function RevealItem({
  item,
  index,
}: {
  item: (typeof reveal.items)[number];
  index: number;
}) {
  const { scroll } = usePointer();
  // Cada item chega um pouco depois do anterior, acompanhando o avanço da
  // roda em vez de aparecer tudo de uma vez.
  const opacity = useTransform(
    scroll,
    [0.34 + index * 0.08, 0.62 + index * 0.08],
    [0, 1],
  );

  return (
    <motion.li
      style={{ opacity, borderColor: "var(--line)" }}
      className="border-t pt-4 transition-colors duration-700"
    >
      <h3
        className="text-[13px] uppercase tracking-[0.16em] transition-colors duration-700"
        style={{ color: "var(--ink)" }}
      >
        {item.title}
      </h3>
      <p
        className="short-hide mt-2.5 max-w-[34ch] font-light leading-[1.7] transition-colors duration-700"
        style={{
          color: "var(--ink-soft)",
          fontSize: "clamp(13px, 1vw, 15px)",
        }}
      >
        {item.text}
      </p>
    </motion.li>
  );
}

/**
 * A segunda cena, revelada pela roda.
 *
 * Enquanto o bolo desce e a coluna do sabor sai, este bloco sobe do
 * rodapé — um cruza com o outro, e o gesto de rolar tem para onde ir. Os
 * três itens entram em cascata da esquerda para a direita, na mesma
 * direção do wipe de cor.
 *
 * Só recebe clique depois de aparecer: antes disso é `pointer-events-none`,
 * para não roubar o cursor dos botões do hero.
 */
export default function ScrollReveal() {
  const { x, y, scroll, reduced } = usePointer();

  const enterY = useTransform(scroll, [0.15, 1], [130, 0]);
  const opacity = useTransform(scroll, [0.3, 0.85], [0, 1]);
  const clickable = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));

  const pointerX = useTransform(x, [-1, 1], reduced ? [0, 0] : [6, -6]);
  const pointerY = useTransform(y, [-1, 1], reduced ? [0, 0] : [6, -6]);
  const totalY = useTransform(
    [pointerY, enterY],
    ([a, b]: number[]) => a + b,
  );

  return (
    <motion.section
      aria-hidden={false}
      style={{
        x: pointerX,
        y: totalY,
        opacity,
        pointerEvents: clickable,
      }}
      /*
        Centrado na vertical, na mesma altura do bolo estacionado à
        esquerda. No retrato o texto ocupa o topo e o bolo, pequeno, para
        embaixo dele.
      */
      className="absolute inset-x-[6vw] top-[max(80px,11vh)] z-30 lg:left-[38%] lg:right-[5vw] lg:top-1/2 lg:-translate-y-1/2"
    >
      <p
        className="text-[13px] font-light uppercase tracking-[0.26em] transition-colors duration-700"
        style={{ color: "var(--accent)" }}
      >
        {reveal.eyebrow}
      </p>

      <h2
        className="mt-5 max-w-[20ch] font-display font-black transition-colors duration-700"
        style={{
          color: "var(--ink)",
          fontSize: "var(--h1-size)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
        }}
      >
        {reveal.lead}
      </h2>

      <ul className="mt-9 grid gap-6 sm:grid-cols-3 sm:gap-7">
        {reveal.items.map((item, i) => (
          <RevealItem key={item.title} item={item} index={i} />
        ))}
      </ul>
    </motion.section>
  );
}
