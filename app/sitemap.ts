import type { MetadataRoute } from "next";
import { site } from "@/data/site";

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
