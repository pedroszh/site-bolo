"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { usePointer } from "@/lib/parallax";
import { useTheme } from "@/lib/theme";
import { optimized } from "@/lib/assets";
import { pieces } from "@/data/pieces";
import type { ScatterPiece } from "@/types/piece";

/** Largura de referência do design. As peças escalam a partir daí. */
const DESIGN_WIDTH = 1440;

/**
 * Um enfeite suspenso no ar.
 *
 * Três responsabilidades, três camadas — nenhuma sobrescreve a outra:
 *   1. invólucro — posição no palco, parallax do mouse e resposta à roda,
 *      proporcionais à profundidade (Framer Motion);
 *   2. troca de sabor — o chocolate sai, o morango entra (AnimatePresence);
 *   3. a <img> — flutuação infinita (±14px, ±8°) em CSS, no compositor,
 *      com duração e delay próprios.
 *
 * Nada de animar posição num loop de JavaScript: são doze peças na tela.
 */
function Piece({ piece }: { piece: ScatterPiece }) {
  const { x, y, scroll, reduced } = usePointer();
  const { theme } = useTheme();

  // Quanto mais na frente a peça está, mais ela reage.
  const strength = reduced ? 0 : 6 + piece.depth * 0.9;
  const px = useTransform(x, [-1, 1], [strength, -strength]);
  const py = useTransform(y, [-1, 1], [strength * 0.6, -strength * 0.6]);

  // Na roda, as peças da frente descem bem mais que as do fundo.
  const scrollY = useTransform(scroll, [0, 1], [0, 40 + piece.depth * 6]);
  const totalY = useTransform([py, scrollY], ([a, b]: number[]) => a + b);

  // Peça desfocada é bokeh: não precisa de sombra própria, e drop-shadow
  // sobre conteúdo já borrado é dos filtros mais caros que existem.
  const shadow =
    piece.blur <= 2 ? " drop-shadow(0 10px 14px rgba(0,0,0,0.28))" : "";

  const src = theme.pieces[piece.image % theme.pieces.length];
  const minWidth = piece.width * 0.52;
  const vwWidth = (piece.width / DESIGN_WIDTH) * 100;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute${piece.portraitHidden ? " hidden lg:block" : ""}`}
      style={{
        left: `${piece.x}%`,
        top: `${piece.y}%`,
        zIndex: piece.depth,
        width: `clamp(${minWidth}px, ${vwWidth.toFixed(2)}vw, ${piece.width}px)`,
        translate: "-50% -50%",
        x: px,
        y: totalY,
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={theme.id}
          className="absolute inset-x-0 top-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: piece.opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0.86 }}
          transition={{
            type: "spring",
            duration: 1.1,
            bounce: 0.22,
            // A troca varre a tela junto com o wipe do fundo, da esquerda
            // para a direita, em vez de todas as peças piscarem juntas.
            delay: (piece.x / 100) * 0.35,
          }}
        >
          <img
            src={optimized(src)}
            alt=""
            draggable={false}
            decoding="async"
            className="anim block h-auto w-full select-none [animation-name:piece-float]"
            style={
              {
                "--rot": `${piece.rotate}deg`,
                "--dur": `${piece.duration}s`,
                "--delay": `${piece.delay}s`,
                scale: piece.flip ? "-1 1" : undefined,
                filter: `blur(${piece.blur}px) ${theme.palette.pieceFilter}${shadow}`,
              } as React.CSSProperties
            }
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function FloatingPieces() {
  return (
    <>
      {pieces.map((piece, i) => (
        <Piece key={i} piece={piece} />
      ))}
    </>
  );
}
