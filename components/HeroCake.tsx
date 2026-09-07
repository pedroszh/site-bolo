"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { usePointer } from "@/lib/parallax";
import { useTheme } from "@/lib/theme";
import { optimized } from "@/lib/assets";

/**
 * A posição do bolo vive em variáveis CSS (`--cake-x`, `--cake-y`,
 * `--cake-w`) definidas em `globals.css`, então cada breakpoint
 * reposiciona a composição inteira de uma vez.
 *
 * Ao girar a roda ele não some pelo rodapé: caminha até `--cake-travel-*`,
 * encolhendo no caminho, e estaciona centralizado embaixo do texto que
 * sobe. A conta é feita em CSS a partir de `--p` — o progresso da roda,
 * escrito direto na variável pelo Framer Motion — então o destino de cada
 * breakpoint mora junto das outras medidas da composição.
 *
 * Todos os bolos são recortes com canal alpha: entram direto, sem máscara.
 * Eles se alinham pela base — como bolos numa mesma bancada — então trocar
 * de sabor não faz a cena "pular", mesmo com fotos de proporções
 * diferentes.
 */
export default function HeroCake() {
  const { x, y, scroll, reduced } = usePointer();
  const { theme } = useTheme();

  const pointerX = useTransform(x, [-1, 1], reduced ? [0, 0] : [18, -18]);
  const pointerY = useTransform(y, [-1, 1], reduced ? [0, 0] : [14, -14]);

  const glowX = useTransform(x, [-1, 1], reduced ? [0, 0] : [22, -22]);
  const shadowX = useTransform(x, [-1, 1], reduced ? [0, 0] : [12, -12]);
  // Parado mais longe, o bolo projeta uma sombra um pouco mais fraca.
  const shadowOpacity = useTransform(scroll, [0, 1], [1, 0.75]);
  // O halo encolhe junto com o bolo e vira um disco claro se mantiver a
  // mesma força — então ele cede enquanto o bolo caminha.
  const glowOpacity = useTransform(scroll, [0, 1], [0.55, 0.26]);

  // O progresso da roda vira variável CSS; `.cake-travel` faz a conta.
  const travel = { "--p": scroll } as unknown as React.CSSProperties;

  return (
    <>
      {/* Luz quente concentrada atrás do bolo — viaja junto com ele */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[5]"
        style={{
          left: "var(--cake-x)",
          top: "calc(var(--cake-y) - 8%)",
          translate: "-50% -50%",
          x: glowX,
          width: "var(--cake-glow)",
          height: "var(--cake-glow)",
        }}
      >
        <motion.div
          className="cake-travel absolute inset-0 transition-[background] duration-1000"
          style={{
            ...travel,
            background:
              "radial-gradient(circle at 50% 50%, var(--glow) 0%, rgba(0,0,0,0) 62%)",
            opacity: glowOpacity,
          }}
        />
      </motion.div>

      {/* O bolo e a sombra que ele projeta no tampo */}
      <motion.div
        className="pointer-events-none absolute z-20"
        style={{
          left: "var(--cake-x)",
          top: "var(--cake-y)",
          translate: "-50% -50%",
          x: pointerX,
          y: pointerY,
          width: "var(--cake-w)",
          // Altura fixa da caixa: os bolos se alinham pela base dela.
          height: "calc(var(--cake-w) * 0.92)",
        }}
      >
        <motion.div className="cake-travel absolute inset-0" style={travel}>
          {/*
            Sombra no tampo. Fica presa à base da caixa, então segue o bolo
            em qualquer breakpoint — e encolhe junto com ele na viagem, sem
            precisar de uma segunda conta.
          */}
          <motion.div
            aria-hidden
            className="absolute bottom-[-4%] left-1/2 h-[15%] w-[104%] -translate-x-1/2"
            style={{ x: shadowX, opacity: shadowOpacity }}
          >
            <div
              className="anim absolute inset-0 [animation-name:cake-shadow]"
              style={{ "--dur": "5.5s" } as React.CSSProperties}
            >
              <div
                className="absolute inset-0 transition-[background] duration-1000"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, var(--shadow) 0%, rgba(0,0,0,0) 74%)",
                }}
              />
              {/* Núcleo de contato: a parte que toca a madeira */}
              <div
                className="absolute left-1/2 top-1/2 h-[46%] w-[52%] -translate-x-1/2 -translate-y-1/2 transition-[background] duration-1000"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, var(--shadow) 0%, rgba(0,0,0,0) 76%)",
                }}
              />
            </div>
          </motion.div>

          {/*
            Duas camadas: o invólucro cuida da troca de sabor (entra e sai
            pelo Framer Motion) e a <img> só flutua, em CSS. Separadas
            porque as duas escrevem em `transform` — juntas, brigariam.
          */}
          <AnimatePresence initial={false}>
            <motion.div
              key={theme.id}
              className="absolute bottom-0 left-1/2"
              style={{
                width: `${theme.cakeScale * 100}%`,
                marginLeft: `${theme.cakeScale * -50}%`,
              }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -14 }}
              transition={{ type: "spring", duration: 1, bounce: 0.2 }}
            >
              <img
                src={optimized(theme.cake)}
                alt={`${theme.copy.name}, bolo artesanal finalizado à mão`}
                draggable={false}
                fetchPriority="high"
                className="anim block h-auto w-full select-none [animation-name:cake-float]"
                style={
                  {
                    "--dur": "5.5s",
                    /*
                      Só um contato curto para destacar a borda: a sombra
                      grande é o gradiente acima, muito mais barato de
                      rasterizar que um drop-shadow de raio alto.
                    */
                    filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.28))",
                  } as React.CSSProperties
                }
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
