import type { CakeTheme } from "@/types/theme";

/**
 * Os sabores do hero, na ordem em que entram.
 *
 * A identidade é a mesma nos três — luxo de confeitaria, com o creme claro
 * sempre fazendo o contraste. O que muda é a temperatura: o morango é claro
 * e fresco, o pistache é herbáceo e fechado, o chocolate é quente.
 *
 * A ordem alterna o campo claro com os escuros, então cada wipe de cor
 * troca de fato o clima da tela em vez de escorregar de um tom para um
 * vizinho.
 *
 * Para acrescentar um bolo, copie um bloco, troque a foto, os enfeites,
 * a paleta e o texto. Nada mais precisa mudar.
 */
export const themes: CakeTheme[] = [
  {
    id: "morango",
    word: "Morango",
    cake: "/bolo-morango.png",
    cakeScale: 1,
    // 0 = o punhado com respingo, 1 = um morango só. Alternar entre os dois
    // quebra a repetição de ver a mesma foto em doze lugares.
    pieces: ["/morango.png", "/moranguinho.png"],
    palette: {
      // O rosé domina o campo; o chantilly entra como luz, no canto alto.
      bgFrom: "#F0CDD1",
      bgTo: "#DDA3AB",
      glow: "rgba(255,255,255,0.9)",
      ground: "#6A4741",
      groundStrength: 0.3,

      ink: "#8E3145",
      inkSoft: "rgba(142,49,69,0.8)",
      line: "rgba(183,62,86,0.28)",
      accent: "#B73E56",

      /*
        A palavra gigante muda de lado conforme o campo: aqui ela é o
        vermelho premium rebaixado, porque branco sobre rosé claro — e
        atrás de um bolo de chantilly branco — simplesmente some.
      */
      word: "rgba(183,62,86,0.3)",
      shadow: "rgba(142,49,69,0.34)",
      dust: "rgba(216,107,126,0.5)",
      pieceFilter: "saturate(1.06) contrast(1.03)",

      buttonBg: "#B73E56",
      buttonInk: "#F8F4EF",
    },
    copy: {
      eyebrow: "Colhido esta semana",
      name: "Chantilly com morango fresco",
      description:
        "Pão de ló aerado, chantilly batido na hora e morango da serra cortado só na montagem. Doçura baixa de propósito — quem manda aqui é a fruta.",
      specs: ["Morango da serra", "Chantilly do dia", "Serve 12 fatias"],
    },
  },
  {
    id: "pistache",
    word: "Pistache",
    cake: "/bolo-pistache.png",
    // Esta foto é mais larga e mais baixa que as outras: um empurrãozinho
    // para o bolo ocupar a mesma altura em cena.
    cakeScale: 1.05,
    pieces: ["/pistache2.png", "/pistache1.png"],
    palette: {
      bgFrom: "#4F5E2D",
      bgTo: "#303A20",
      // Luz de creme, não de folha: verde iluminando verde vira aquário.
      glow: "rgba(244,232,201,0.45)",
      ground: "#79502F",
      groundStrength: 0.5,

      ink: "#F4E8C9",
      inkSoft: "rgba(244,232,201,0.68)",
      line: "rgba(143,168,90,0.45)",
      accent: "#B7C98A",

      word: "rgba(244,232,201,0.18)",
      shadow: "rgba(20,26,13,0.6)",
      dust: "rgba(244,232,201,0.5)",
      pieceFilter: "brightness(0.82) saturate(1.12) contrast(1.06)",

      buttonBg: "#F4E8C9",
      buttonInk: "#303A20",
    },
    copy: {
      eyebrow: "Pistache siciliano",
      name: "Mousse de pistache e baunilha",
      description:
        "Castanha torrada e moída no dia, mousse leve de baunilha e um fio de pasta pura de pistache na base. O que fecha o doce é o sal da própria castanha.",
      specs: ["Pistache siciliano", "Torrado no dia", "Serve 14 fatias"],
    },
  },
  {
    id: "chocolate",
    word: "Chocolate",
    cake: "/foto-bolo.png",
    cakeScale: 1,
    pieces: ["/barra-chocolate.png", "/pedacos-chocolate.png"],
    palette: {
      bgFrom: "#6A4741",
      bgTo: "#2A1A16",
      glow: "rgba(255,214,170,0.5)",
      ground: "#1F1310",
      groundStrength: 0.6,

      ink: "#F8F4EF",
      inkSoft: "rgba(248,244,239,0.66)",
      line: "rgba(235,194,198,0.3)",
      accent: "#EBC2C6",

      word: "rgba(248,244,239,0.2)",
      shadow: "rgba(0,0,0,0.6)",
      dust: "rgba(248,244,239,0.55)",
      pieceFilter: "brightness(0.72) saturate(1.18) contrast(1.08)",

      buttonBg: "#F8F4EF",
      buttonInk: "#2A1A16",
    },
    copy: {
      eyebrow: "Cacau de origem única",
      name: "Trufado de chocolate 70%",
      description:
        "Quatro camadas de massa úmida, ganache meio amarga descansada por 24 horas e lascas quebradas à mão. Sai da geladeira uma hora antes de servir.",
      specs: ["Cacau 70%", "Ganache de 24h", "Serve 15 fatias"],
    },
  },
];

/** Quanto tempo cada bolo fica em cena, em milissegundos. */
export const THEME_INTERVAL = 6000;
