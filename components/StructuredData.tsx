import { site } from "@/data/site";

/**
 * Dados estruturados (JSON-LD) do negócio.
 *
 * É um bloco invisível que o Google lê para entender que o site é de uma
 * confeitaria de verdade, com endereço, telefone e horário — e não um
 * texto solto. É o que permite ao Google mostrar essas informações ao
 * lado do resultado da busca e ligar o site ao perfil do Maps.
 *
 * Não aparece na tela. Tudo sai de `data/site.ts`.
 */
export default function StructuredData() {
  const dados = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: site.name,
    legalName: site.legalName || undefined,
    description: site.description,
    url: site.url,
    telephone: site.phone || undefined,
    email: site.email || undefined,
    priceRange: site.priceRange,
    image: `${site.url}/opt/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours.map((faixa) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: faixa.days,
      opens: faixa.opens,
      closes: faixa.closes,
    })),
    // `sameAs` é como o Google liga o site às outras páginas do mesmo
    // negócio. Entradas vazias sairiam como lixo, então são filtradas.
    sameAs: [site.social.instagram, site.social.facebook, site.mapsUrl].filter(
      Boolean,
    ),
  };

  return (
    <script
      type="application/ld+json"
      // O conteúdo é montado aqui a partir de `data/site.ts`, não vem de
      // fora — é a forma padrão de publicar JSON-LD no Next.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
