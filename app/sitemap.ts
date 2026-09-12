import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Sem estado e sem servidor: o arquivo é gerado uma vez, no build.
 * É o que a exportação estática exige.
 */
export const dynamic = "force-static";


/**
 * Gera o /sitemap.xml — a lista de páginas que o Google deve indexar.
 *
 * Hoje o site é uma página só. Quando houver outras, acrescente aqui:
 * é este arquivo que você envia no Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
