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

/**
 * A imagem de compartilhamento — a prévia que aparece quando alguém
 * manda o link do site no WhatsApp, no Instagram ou no Facebook.
 *
 * Para uma confeitaria isso pesa: o link circula em grupo de família e
 * de bairro, e sem prévia ele vira um retângulo cinza. Aqui o bolo entra
 * sobre o mesmo campo escuro e quente do cardápio.
 *
 * Troque `source` se quiser outro bolo na prévia.
 */
const OG = { source: "bolo-morango.png", width: 1200, height: 630 };

async function buildOgImage() {
  const src = path.join(PUBLIC, OG.source);
  const dest = path.join(OUT, "og.jpg");

  try {
    await stat(src);
  } catch {
    console.log(`  aviso: ${OG.source} não existe — prévia não gerada`);
    return false;
  }
  if ((await mtime(dest)) > (await mtime(src))) return false;

  const bolo = await sharp(src)
    .trim({ threshold: 1 })
    .resize({ height: Math.round(OG.height * 0.84), fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  const fundo = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG.width}" height="${OG.height}">
      <defs>
        <linearGradient id="campo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4a2f28"/>
          <stop offset="58%" stop-color="#2a1a16"/>
          <stop offset="100%" stop-color="#1c110e"/>
        </linearGradient>
        <radialGradient id="luz" cx="0.2" cy="0.08" r="0.85">
          <stop offset="0%" stop-color="#e0b472" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#e0b472" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#campo)"/>
      <rect width="100%" height="100%" fill="url(#luz)"/>
    </svg>`,
  );

  const out = await sharp(fundo)
    .composite([
      {
        input: bolo.data,
        left: Math.round((OG.width - bolo.info.width) / 2),
        top: Math.round((OG.height - bolo.info.height) / 2),
      },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  await writeFile(dest, out);
  console.log(
    `  ${OG.source} → opt/og.jpg  ${OG.width}×${OG.height}  ` +
      `prévia de compartilhamento  ${(out.length / 1024).toFixed(0)}kB`,
  );
  return true;
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

  if (await buildOgImage()) built += 1;

  console.log(built ? `assets: ${built} otimizado(s)` : "assets: em dia");
}

main().catch((err) => {
  console.error("assets: falhou —", err.message);
  process.exit(1);
});
