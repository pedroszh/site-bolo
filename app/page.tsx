"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { PointerContext, spring } from "@/lib/parallax";
import { ThemeContext, paletteVars } from "@/lib/theme";
import { themes, THEME_INTERVAL } from "@/data/themes";
import BackgroundGlow from "@/components/BackgroundGlow";
import ThemeWord from "@/components/ThemeWord";
import FloatingPieces from "@/components/FloatingPieces";
import HeroCake from "@/components/HeroCake";
import CakeCopy from "@/components/CakeCopy";
import DustMotes from "@/components/DustMotes";
import ScrollHint from "@/components/ScrollHint";
import ScrollReveal from "@/components/ScrollReveal";
import MenuSection from "@/components/MenuSection";

export default function Home() {
  const reduced = useReducedMotion() ?? false;

  /*
    Rodízio de sabores. Guardar o anterior junto com o atual é o que
    permite o wipe: a cor que sai continua desenhada por baixo enquanto a
    que entra atravessa a tela.
  */
  const [slide, setSlide] = useState({ current: 0, previous: 0 });
  const go = useCallback((next: number) => {
    setSlide((s) =>
      s.current === next ? s : { current: next, previous: s.current },
    );
  }, []);

  // Um clique no seletor reinicia a contagem: ninguém quer escolher um
  // bolo e vê-lo trocar meio segundo depois.
  const [restart, setRestart] = useState(0);
  const goManual = useCallback(
    (next: number) => {
      go(next);
      setRestart((n) => n + 1);
    },
    [go],
  );

  const currentRef = useRef(slide.current);
  currentRef.current = slide.current;

  useEffect(() => {
    if (themes.length < 2) return;
    const id = setInterval(
      () => go((currentRef.current + 1) % themes.length),
      THEME_INTERVAL,
    );
    return () => clearInterval(id);
  }, [go, restart]);

  const themeValue = useMemo(
    () => ({
      theme: themes[slide.current],
      previous: themes[slide.previous],
      index: slide.current,
      go: goManual,
    }),
    [slide, goManual],
  );

  /*
    A cena do hero é movida pela rolagem de verdade.

    A pista abaixo tem 200vh e o hero é `sticky` dentro dela: enquanto os
    primeiros 100vh passam, o hero fica preso na tela e `scrollYProgress`
    vai de 0 a 1 — o bolo desce e estaciona, o texto da segunda cena sobe.
    Terminado o curso, a rolagem segue para o cardápio sem sobressalto.

    Antes isto era feito sequestrando o evento `wheel`. Com a página tendo
    conteúdo abaixo, rolagem de mentira atrapalharia: esta versão respeita
    o gesto do navegador, funciona no toque sem código extra e não briga
    com a barra de rolagem.
  */
  const heroTrack = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroTrack,
    offset: ["start start", "end end"],
  });
  const scroll = useSpring(scrollYProgress, spring);

  // Posição bruta do mouse, normalizada de -1 a 1 nos dois eixos.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // A mesma spring alimenta a página inteira: mesma inércia em tudo.
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  useEffect(() => {
    if (reduced) return;

    // Telas de toque não têm cursor: o parallax de mouse só pesaria à toa.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    // O ponteiro dispara em rajadas; ler uma vez por quadro basta.
    const flush = () => {
      frame = 0;
      rawX.set(nextX);
      rawY.set(nextY);
    };

    const onMove = (e: PointerEvent) => {
      nextX = (e.clientX / window.innerWidth) * 2 - 1;
      nextY = (e.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    // Ao sair da janela a cena volta devagar ao repouso.
    const onLeave = () => {
      nextX = 0;
      nextY = 0;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [rawX, rawY, reduced]);

  // O texto é a camada mais "presa" da cena: só 6px de resposta ao mouse.
  const textX = useTransform(x, [-1, 1], reduced ? [0, 0] : [6, -6]);
  const pointerTextY = useTransform(y, [-1, 1], reduced ? [0, 0] : [6, -6]);
  // Ao rolar ele sobe e sai de cena, deixando o bolo sozinho.
  const scrollTextY = useTransform(scroll, [0, 1], [0, -110]);
  const textY = useTransform(
    [pointerTextY, scrollTextY],
    ([a, b]: number[]) => a + b,
  );
  const textOpacity = useTransform(scroll, [0, 0.75], [1, 0]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <PointerContext.Provider value={{ x, y, scroll, reduced }}>
        <main>
          {/* A pista da cena: 200vh de rolagem para 100vh de hero preso */}
          <div ref={heroTrack} className="relative h-[200dvh]">
            <section
              className="sticky top-0 h-[100dvh] w-full overflow-hidden"
              style={{
                ...paletteVars(themeValue.theme),
                backgroundColor: themeValue.theme.palette.bgTo,
              }}
            >
              <BackgroundGlow />
              <ThemeWord />

              {/* Cada peça carrega seu próprio z-index (`depth`), então
                  algumas ficam atrás do bolo e outras cruzam na frente. */}
              <FloatingPieces />

              <HeroCake />
              <DustMotes />

              {/* ── Cabeçalho ──────────────────────────────────────── */}
              <motion.header
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.1 }}
                className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-[5vw] py-5 transition-colors duration-700 lg:py-8"
                style={{ color: "var(--ink)" }}
              >
                <a
                  href="#"
                  className="font-display text-[19px] font-bold tracking-[0.02em]"
                >
                  Doce&nbsp;Memória
                  <span
                    className="transition-colors duration-700"
                    style={{ color: "var(--accent)" }}
                  >
                    .
                  </span>
                </a>

                <nav className="hidden items-center gap-9 text-[13px] uppercase tracking-[0.16em] md:flex">
                  <a
                    href="#cardapio"
                    className="opacity-55 transition-opacity duration-500 hover:opacity-100"
                  >
                    Cardápio
                  </a>
                  {["Encomendas", "Ateliê"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="opacity-55 transition-opacity duration-500 hover:opacity-100"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </motion.header>

              {/* ── Coluna de texto, à direita do bolo ─────────────── */}
              {/* A camada de fora obedece à rolagem; a de dentro faz a
                  entrada. Juntas na mesma, brigariam pela opacidade. */}
              <motion.section
                style={{ x: textX, y: textY, opacity: textOpacity }}
                className="absolute left-[6vw] right-[6vw] top-[max(80px,11vh)] z-30 lg:left-auto lg:right-[5vw] lg:top-1/2 lg:w-[min(42vw,540px)] lg:-translate-y-1/2"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...spring, delay: 0.25 }}
                >
                  <CakeCopy />
                </motion.div>
              </motion.section>

              <ScrollReveal />
              <ScrollHint />

              {/* Grão de filme por cima de tudo: tira o "liso digital" */}
              <div
                aria-hidden
                className="grain-overlay pointer-events-none absolute inset-0 z-50 opacity-[0.045]"
              />
            </section>
          </div>

          <MenuSection />
        </main>
      </PointerContext.Provider>
    </ThemeContext.Provider>
  );
}
