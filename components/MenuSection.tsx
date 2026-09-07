import { menu } from "@/data/menu";

/**
 * O cardápio, logo abaixo do hero.
 *
 * Paleta própria e fixa — definida em `.menu-section`, em `globals.css` —
 * de propósito: o hero troca de cor a cada seis segundos, e uma lista de
 * preços piscando junto seria cansativa de ler. O corte de cor entre as
 * duas seções também marca que aqui começa outro assunto.
 *
 * Sem foto: quem carrega a seção é a tipografia. O nome do bolo puxa a
 * linha, o pontilhado leva o olho até o preço — do jeito que cardápio
 * impresso faz há um século.
 *
 * É um Server Component: nada aqui precisa de estado ou de animação.
 */
export default function MenuSection() {
  return (
    <section
      id="cardapio"
      className="menu-section relative z-10"
      style={{ backgroundColor: "var(--menu-bg)", color: "var(--menu-ink)" }}
    >
      <div className="mx-auto max-w-[1180px] px-[6vw] py-[clamp(72px,11vh,132px)] lg:px-[5vw]">
        {/* ── Abertura ─────────────────────────────────────────────── */}
        <header className="max-w-[62ch]">
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
        </header>

        {/* ── Os grupos ────────────────────────────────────────────── */}
        <div className="mt-[clamp(48px,7vh,80px)] grid gap-[clamp(44px,6vh,72px)] lg:grid-cols-2 lg:gap-x-[7vw]">
          {menu.groups.map((group) => (
            <div key={group.title}>
              <div
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
              </div>

              <ul>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="border-b py-6"
                    style={{ borderColor: "var(--menu-line)" }}
                  >
                    {/* Nome, pontilhado e preço na mesma linha de base */}
                    <div className="flex items-baseline gap-3">
                      <h4
                        className="font-display font-bold"
                        style={{
                          fontSize: "clamp(19px, 1.6vw, 23px)",
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
                      <span className="text-[15px] tabular-nums">
                        {item.price}
                      </span>
                    </div>

                    <p
                      className="mt-2.5 max-w-[46ch] font-light leading-[1.7]"
                      style={{
                        color: "var(--menu-ink-soft)",
                        fontSize: "clamp(14px, 1vw, 15px)",
                      }}
                    >
                      {item.description}
                    </p>

                    <p
                      className="mt-3 text-[12px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--menu-accent)" }}
                    >
                      {item.serves}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Fecho ────────────────────────────────────────────────── */}
        <div className="mt-[clamp(44px,6vh,72px)] flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="max-w-[42ch] font-light leading-[1.7]"
            style={{
              color: "var(--menu-ink-soft)",
              fontSize: "clamp(14px, 1vw, 15px)",
            }}
          >
            {menu.note}
          </p>

          <a
            href="#orcamento"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full px-7 py-3.5 text-[13px] font-medium uppercase tracking-[0.12em] transition-transform duration-500 hover:-translate-y-[3px] focus-visible:outline-none focus-visible:ring-2 sm:self-auto"
            style={{
              backgroundColor: "var(--menu-ink)",
              color: "var(--menu-bg)",
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
          </a>
        </div>
      </div>
    </section>
  );
}
