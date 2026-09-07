/**
 * O cardápio.
 *
 * Sem foto por enquanto — quem carrega a seção é a tipografia. Os preços
 * são de exemplo: troque pelos reais antes de publicar.
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
        },
        {
          name: "Chantilly com morango fresco",
          description:
            "Pão de ló aerado, chantilly batido na hora e morango da serra cortado só na montagem.",
          serves: "12 fatias",
          price: "R$ 210",
        },
        {
          name: "Mousse de pistache e baunilha",
          description:
            "Pistache siciliano torrado e moído no dia, com um fio de pasta pura na base.",
          serves: "14 fatias",
          price: "R$ 280",
        },
      ],
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
        },
        {
          name: "Nozes com doce de leite",
          description:
            "Doce de leite de tacho, nozes caramelizadas e uma pitada de flor de sal.",
          serves: "14 fatias",
          price: "R$ 230",
        },
        {
          name: "Red velvet com cream cheese",
          description:
            "Massa aveludada de cacau e recheio de cream cheese pouco doce, do jeito clássico.",
          serves: "12 fatias",
          price: "R$ 215",
        },
      ],
    },
  ],
  note: "Encomendas com três dias de antecedência. Tamanhos maiores e sabores fora da lista sob consulta.",
};
