"use client";

import { motion } from "framer-motion";
import { menu, type MenuItem } from "@/data/menu";
import { optimized } from "@/lib/assets";
import { whatsappLink } from "@/data/site";

/** Sobe e aparece. Usado no cabeçalho e em cada card. */
const rise = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, duration: 0.9, bounce: 0.18 },
  },
};

/** Entra quando o bloco encosta na tela, e só na primeira vez. */
const onView = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-12%" },
};

/**
 * O quadro da foto.
 *
 * Sem foto ele não fica vazio: mostra um painel na cor do sabor, com a
 * mesma proporção que a imagem vai ocupar. É espaço reservado que já
 * trabalha pela composição — e quando a foto chegar, ela entra no lugar
 * exato, sem mexer no layout.
 */
function Frame({ item }: { item: MenuItem }) {
  return (
    <div
      className="relative aspect-[5/4] overflow-hidden rounded-[14px]"
      style={{
        background: `radial-gradient(120% 100% at 50% 18%, ${item.tint} 0%, color-mix(in srgb, ${item.tint} 55%, #1c110e) 58%, color-mix(in srgb, ${item.tint} 22%, #1c110e) 100%)`,
      }}
    >
      {item.image ? (
        <img
          src={optimized(item.image)}
          alt={item.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain p-[8%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{ filter: "drop-shadow(0 14px 20px rgba(0,0,0,0.42))" }}
        />
      ) : (
        <span
          className="absolute bottom-3.5 left-4 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Foto em breve
        </span>
      )}

      {/* Grão por cima do painel: tira o "liso digital" da cor chapada */}
      <span
        aria-hidden
        className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.07]"
      />
      {/* Fio de luz na borda, para o quadro não ficar recortado demais */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[14px]"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)" }}
      />
    </div>
  );
}

function Card({ item }: { item: MenuItem }) {
  return (
    <motion.li variants={rise} className="group">
      <Frame item={item} />

      {/* Nome, pontilhado e preço na mesma linha de base */}
      <div className="mt-5 flex items-baseline gap-3">
        <h4
          className="font-display font-bold transition-colors duration-500"
          style={{
            fontSize: "clamp(18px, 1.4vw, 21px)",
            letterSpacing: "-0.01em",
          }}
        >
          {item.name}
        </h4>
        <span
          aria-hidden
          className="mb-[3px] flex-1 border-b border-dotted"
          style={{ borderColor: "var(--menu-line)" }}
        />
        <span
          className="text-[15px] tabular-nums transition-colors duration-500"
          style={{ color: "var(--menu-accent)" }}
        >
          {item.price}
        </span>
      </div>

      <p
        className="mt-2.5 font-light leading-[1.7]"
        style={{
          color: "var(--menu-ink-soft)",
          fontSize: "clamp(13px, 0.95vw, 14px)",
        }}
      >
        {item.description}
      </p>

      <p
        className="mt-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-500"
        style={{ color: "var(--menu-ink-soft)" }}
      >
        {item.serves}
      </p>
    </motion.li>
  );
}

/**
 * O cardápio, logo abaixo do hero.
 *
 * Paleta própria e fixa — definida em `.menu-section`, em `globals.css` —
 * de propósito: o hero troca de cor a cada seis segundos, e uma lista de
 * preços piscando junto seria cansativa de ler.
 *
 * O campo é escuro e quente porque é onde as fotos de bolo vão morar:
 * recorte com fundo claro perde o contorno, com fundo escuro ele salta.
 * Quem dá cor à seção são os próprios sabores, um por quadro.
 */
export default function MenuSection() {
  return (
    <section
      id="cardapio"
      className="menu-section relative z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(168deg, var(--menu-bg-from) 0%, var(--menu-bg-to) 62%, var(--menu-bg-from) 100%)",
        color: "var(--menu-ink)",
      }}
    >
      {/* Luz quente entrando pelo alto, do mesmo lado que no hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(70% 100% at 18% 0%, rgba(224,180,114,0.16) 0%, rgba(0,0,0,0) 68%)",
        }}
      />
      <div
        aria-hidden
        className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.05]"
      />

      <div className="relative mx-auto max-w-[1180px] px-[6vw] py-[clamp(72px,11vh,132px)] lg:px-[5vw]">
        {/* ── Abertura ─────────────────────────────────────────────── */}
        <motion.header {...onView} variants={rise} className="max-w-[62ch]">
          <p
            className="text-[13px] font-light uppercase tracking-[0.26em]"
            style={{ color: "var(--menu-accent)" }}
          >
            {menu.eyebrow}
          </p>

          <h2
            className="mt-5 font-display font-black"
            style={{
              fontSize: "clamp(30px, 4vw, 56px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
            }}
          >
            {menu.title}
          </h2>

          <p
            className="mt-6 max-w-[52ch] font-light leading-[1.75]"
            style={{
              color: "var(--menu-ink-soft)",
              fontSize: "clamp(15px, 1.15vw, 17px)",
            }}
          >
            {menu.intro}
          </p>
        </motion.header>

        {/* ── Os grupos ────────────────────────────────────────────── */}
        {menu.groups.map((group) => (
          <div key={group.title} className="mt-[clamp(52px,7vh,84px)]">
            <motion.div
              {...onView}
              variants={rise}
              className="flex items-baseline justify-between border-b pb-3"
              style={{ borderColor: "var(--menu-line)" }}
            >
              <h3 className="text-[13px] uppercase tracking-[0.2em]">
                {group.title}
              </h3>
              <span
                className="text-[12px] font-light uppercase tracking-[0.14em]"
                style={{ color: "var(--menu-ink-soft)" }}
              >
                {group.note}
              </span>
            </motion.div>

            {/* Cada card entra um pouco depois do anterior, da esquerda
                para a direita — a mesma direção do wipe no hero. */}
            <motion.ul
              {...onView}
              variants={{ show: { transition: { staggerChildren: 0.09 } } }}
              className="mt-9 grid gap-x-[clamp(20px,2.6vw,38px)] gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {group.items.map((item) => (
                <Card key={item.name} item={item} />
              ))}
            </motion.ul>
          </div>
        ))}

        {/* ── Fecho ────────────────────────────────────────────────── */}
        <motion.div
          {...onView}
          variants={rise}
          className="mt-[clamp(48px,7vh,84px)] flex flex-col gap-7 border-t pt-9 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--menu-line)" }}
        >
          <p
            className="max-w-[42ch] font-light leading-[1.7]"
            style={{
              color: "var(--menu-ink-soft)",
              fontSize: "clamp(14px, 1vw, 15px)",
            }}
          >
            {menu.note}
          </p>

          <motion.a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3 }}
            whileTap={{ y: -1, scale: 0.985 }}
            transition={{ type: "spring", duration: 0.9, bounce: 0.24 }}
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.8)] sm:self-auto"
            style={{
              backgroundColor: "var(--menu-ink)",
              color: "var(--menu-bg-to)",
            }}
          >
            Fazer orçamento
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-[14px] w-[14px] transition-transform duration-500 ease-out group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
