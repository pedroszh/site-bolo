"use client";

import { useMemo } from "react";
import { seededRandom, usePointer } from "@/lib/parallax";

const COUNT = 14;

/**
 * Poeira suspensa na luz — cacau no sabor chocolate, açúcar no morango.
 * Quase invisível de propósito: o efeito é perceber que o ar tem alguma
 * coisa, não ver as partículas.
 *
 * Tudo em CSS: catorze elementos animando no compositor, zero trabalho por
 * quadro no JavaScript. As posições vêm de um PRNG com semente fixa, então
 * servidor e cliente geram exatamente a mesma poeira.
 */
export default function DustMotes() {
  const { reduced } = usePointer();

  const motes = useMemo(() => {
    const rand = seededRandom(20260906);
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      x: 2 + rand() * 62, // concentradas do lado do bolo
      y: rand() * 92,
      size: 1.4 + rand() * 2.4,
      opacity: 0.12 + rand() * 0.2,
      drift: -(16 + rand() * 34),
      sway: -10 + rand() * 20,
      duration: 9 + rand() * 11,
      delay: rand() * 9,
    }));
  }, []);

  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[28]">
      {motes.map((m) => (
        <span
          key={m.id}
          className="anim absolute rounded-full [animation-name:speck-drift]"
          style={
            {
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.size,
              height: m.size,
              "--o": m.opacity,
              "--drift": `${m.drift}px`,
              "--sway": `${m.sway}px`,
              "--dur": `${m.duration}s`,
              "--delay": `${m.delay}s`,
              opacity: m.opacity,
              backgroundColor: "var(--dust)",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
