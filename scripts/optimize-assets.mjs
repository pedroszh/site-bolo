/**
 * Prepara os PNGs de /public para a web.
 *
 * Os originais são grandes demais para um hero: a foto do bolo chega a 2,4 MB,
 * e o navegador precisa decodificar isso antes do primeiro quadro. O script
 * apara a margem transparente, redimensiona e grava um WebP em /public/opt.
 *
 * Roda sozinho antes de `npm run dev` e `npm run build`. Trocou a imagem?
 * É só reiniciar o dev — ele regera só o que mudou.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = "public";
const OUT = path.join(PUBLIC, "opt");

/**
 * Largura máxima de saída.
 *
 * Bolo é o assunto da tela e precisa de pixel; enfeite aparece pequeno e
 * quase sempre desfocado. A regra vai pelo nome do arquivo — qualquer
 * `bolo-*.png` novo já entra na resolução certa, sem ninguém lembrar de
 * mexer aqui.
 */
const CAKE_MAX_WIDTH = 1100;
const PROP_MAX_WIDTH = 520;

function maxWidthFor(name) {
  return name.includes("bolo") ? CAKE_MAX_WIDTH : PROP_MAX_WIDTH;
}

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(PUBLIC)).filter((f) => f.endsWith(".png"));
  let built = 0;

  for (const file of files) {
    const name = path.basename(file, ".png");
    const src = path.join(PUBLIC, file);
    const dest = path.join(OUT, `${name}.webp`);

    if ((await mtime(dest)) > (await mtime(src))) continue;

    const image = sharp(src).trim({ threshold: 1 });
    const { width } = await sharp(src).metadata();
    const max = maxWidthFor(name);

    const out = await image
      .resize({ width: Math.min(max, width), withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer({ resolveWithObject: true });

    await writeFile(dest, out.data);

    const before = (await stat(src)).size;
    console.log(
      `  ${file} → opt/${name}.webp  ` +
        `${out.info.width}×${out.info.height}  ` +
        `${(before / 1024).toFixed(0)}kB → ${(out.data.length / 1024).toFixed(0)}kB`,
    );
    built += 1;
  }

  console.log(built ? `assets: ${built} otimizado(s)` : "assets: em dia");
}

main().catch((err) => {
  console.error("assets: falhou —", err.message);
  process.exit(1);
});
