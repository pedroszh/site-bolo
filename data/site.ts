/**
 * Os dados do negócio.
 *
 * ESTE É O ÚNICO ARQUIVO QUE VOCÊ TROCA PARA CADA CLIENTE NOVO.
 *
 * Daqui saem o título que aparece na aba e no Google, a descrição da
 * busca, a prévia do link no WhatsApp, o sitemap, o robots.txt, o botão
 * de orçamento e os dados estruturados que o Google usa para mostrar
 * endereço, horário e telefone ao lado do resultado.
 *
 * Tudo que está marcado com TROCAR é de exemplo.
 */
export const site = {
  /** TROCAR — nome comercial, do jeito que o cliente escreve */
  name: "Doce Memória",
  /** TROCAR — razão social, se houver. Se não, repita o nome */
  legalName: "Doce Memória Confeitaria",
  /** TROCAR — três ou quatro palavras que dizem o que o negócio é */
  tagline: "Confeitaria artesanal",

  /**
   * TROCAR — descrição da busca do Google e da prévia no WhatsApp.
   * Entre 120 e 160 caracteres. Escreva pensando em alguém procurando:
   * diga o que vende, onde fica e o diferencial.
   */
  description:
    "Bolos artesanais sob encomenda em São Paulo. Massa do dia, chocolate de origem e fruta da estação. Encomendas com três dias de antecedência.",

  /**
   * TROCAR — endereço final do site, com https e sem barra no fim.
   * Enquanto estiver errado, o sitemap e o canonical apontam para o
   * lugar errado e o Google não indexa direito.
   */
  url: "https://doce-memoria.com.br",

  /**
   * Código de verificação do Google Search Console.
   *
   * Em search.google.com/search-console → Adicionar propriedade →
   * Prefixo do URL → verificação por "Tag HTML". O Google mostra algo
   * como <meta name="google-site-verification" content="AbC123..." />.
   * Cole aqui SÓ o conteúdo do content, publique o site e clique em
   * Verificar. Deixe vazio enquanto não tiver.
   */
  googleVerification: "",

  /** TROCAR — telefone no formato internacional */
  phone: "+55 11 90000-0000",
  /**
   * TROCAR — WhatsApp só com números: país + DDD + número.
   * É o destino do botão "Fazer orçamento".
   */
  whatsapp: "5511900000000",
  /** Mensagem que já vem escrita quando o cliente abre o WhatsApp */
  whatsappMessage: "Olá! Vim pelo site e queria fazer um orçamento de bolo.",
  /** TROCAR — deixe vazio se não houver */
  email: "",

  /** TROCAR — o endereço real. É o que vai para o Google Maps */
  address: {
    street: "Rua Exemplo, 123",
    district: "Vila Exemplo",
    city: "São Paulo",
    state: "SP",
    postalCode: "01000-000",
    country: "BR",
  },

  /**
   * TROCAR — horário de funcionamento.
   * Os dias usam o nome em inglês porque é o formato que o Google lê.
   * Segunda=Monday, Terça=Tuesday, Quarta=Wednesday, Quinta=Thursday,
   * Sexta=Friday, Sábado=Saturday, Domingo=Sunday.
   */
  hours: [
    {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    { days: ["Saturday"], opens: "09:00", closes: "16:00" },
  ],

  /** Faixa de preço: R$ é barato, R$$$$ é caro. Aparece no Maps */
  priceRange: "R$$",

  /** TROCAR — deixe vazio o que o cliente não tiver */
  social: {
    instagram: "",
    facebook: "",
  },

  /**
   * Link do Perfil da Empresa no Google (o do Maps).
   *
   * Depois que o cliente criar e verificar o perfil, copie aqui o link
   * curto — ele liga o site ao Maps e ajuda o Google a entender que os
   * dois são o mesmo negócio.
   */
  mapsUrl: "",
};

/** Monta o link do WhatsApp já com a mensagem pronta. */
export function whatsappLink(): string {
  const texto = encodeURIComponent(site.whatsappMessage);
  return `https://wa.me/${site.whatsapp}?text=${texto}`;
}
