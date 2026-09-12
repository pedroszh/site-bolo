import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Sem estado e sem servidor: o arquivo é gerado uma vez, no build.
 * É o que a exportação estática exige.
 */
export const dynamic = "force-static";


/**
 * Gera o /robots.txt.
 *
 * Diz aos buscadores que podem ler o site inteiro e onde fica o mapa
 * dele. É o primeiro arquivo que o Google procura ao chegar num
 * endereço novo.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
