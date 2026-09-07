export type MenuItem = {
  name: string;
  description: string;
  serves: string;
  price: string;
  /**
   * Foto do bolo, um PNG recortado em `/public` — o mesmo formato dos
   * bolos do hero, e o otimizador já cuida dela.
   *
   * Enquanto não existir, o quadro mostra um painel na cor do sabor. O
   * espaço é o mesmo nos dois casos: quando a foto chegar, ela entra sem
   * mexer em nada do layout.
   */
  image?: string;
  /** Cor do sabor. Pinta o painel vazio e o realce do card no hover. */
  tint: string;
};

/**
 * O cardápio.
 *
 * Para publicar uma foto: gere o PNG recortado, jogue em `public/` e
 * escreva o caminho em `image`. Nada mais precisa mudar.
 *
 * Os preços são de exemplo — troque pelos reais antes de publicar.
 */
export const menu = {
  eyebrow: "Cardápio",
  title: "O que sai do forno esta semana",
  intro:
    "Assamos por encomenda, em quantidade pequena. A lista muda com a estação e com o que o produtor tem de bom — o que está aqui hoje é o que dá para entregar nesta semana.",
  groups: [
    {
      title: "Assinatura",
      note: "Sempre disponíveis",
      items: [
        {
          name: "Trufado de chocolate 70%",
          description:
            "Quatro camadas de massa úmida, ganache meio amarga descansada por 24 horas e lascas quebradas à mão.",
          serves: "15 fatias",
          price: "R$ 240",
          image: "/foto-bolo.png",
          tint: "#7A4B33",
        },
        {
          name: "Chantilly com morango fresco",
          description:
            "Pão de ló aerado, chantilly batido na hora e morango da serra cortado só na montagem.",
          serves: "12 fatias",
          price: "R$ 210",
          image: "/bolo-morango.png",
          tint: "#D9868F",
        },
        {
          name: "Mousse de pistache e baunilha",
          description:
            "Pistache siciliano torrado e moído no dia, com um fio de pasta pura na base.",
          serves: "14 fatias",
          price: "R$ 280",
          image: "/bolo-pistache.png",
          tint: "#8FA85A",
        },
      ] satisfies MenuItem[],
    },
    {
      title: "Da estação",
      note: "Enquanto durar a fruta",
      items: [
        {
          name: "Limão siciliano com merengue",
          description:
            "Creme cítrico de acidez firme e merengue maçaricado na hora da entrega.",
          serves: "12 fatias",
          price: "R$ 195",
          tint: "#D9B45A",
        },
        {
          name: "Nozes com doce de leite",
          description:
            "Doce de leite de tacho, nozes caramelizadas e uma pitada de flor de sal.",
          serves: "14 fatias",
          price: "R$ 230",
          tint: "#B07B45",
        },
        {
          name: "Red velvet com cream cheese",
          description:
            "Massa aveludada de cacau e recheio de cream cheese pouco doce, do jeito clássico.",
          serves: "12 fatias",
          price: "R$ 215",
          tint: "#A93B4A",
        },
      ] satisfies MenuItem[],
    },
  ],
  note: "Encomendas com três dias de antecedência. Tamanhos maiores e sabores fora da lista sob consulta.",
};
