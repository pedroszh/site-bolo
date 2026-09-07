/**
 * Os PNGs de `/public` são os originais, pesados demais para um hero.
 * `scripts/optimize-assets.mjs` gera um WebP aparado e redimensionado em
 * `/public/opt` (roda sozinho antes de `dev` e `build`), e é isso que a
 * página carrega — 2,7 MB de PNG viram ~365 kB.
 *
 * Os dados continuam falando em `.png`: quem edita `data/chocolates.ts` não
 * precisa saber que existe um pipeline no meio.
 */
export function optimized(src: string): string {
  return `/opt/${src.replace(/^\//, "").replace(/\.png$/, ".webp")}`;
}
