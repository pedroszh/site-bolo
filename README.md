# Doce Memória — hero de confeitaria artesanal

Hero de tela cheia (100vh, sem scroll) em **Next.js 16 (App Router)** +
**TypeScript** + **Tailwind CSS v4** + **Framer Motion**.

O bolo fica à esquerda, o texto que fala dele à direita, e a cena inteira —
bolo, enfeites, paleta, palavra gigante e texto — troca de sabor a cada
6 segundos, com um wipe de cor atravessando a tela.

Três sabores em cena hoje: **morango** (rosé claro), **pistache** (verde
oliva) e **chocolate** (marrom quente). A ordem alterna o campo claro com
os escuros, então cada troca muda de fato o clima da tela.

Abaixo do hero vem o **cardápio**, com paleta fixa — ele não entra no
rodízio de cores.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a pasta out/, pronta para publicar
```

O site é **100% estático**: o build produz HTML, CSS, JS e imagens
prontos em `out/`. Não há servidor, banco nem função rodando — dá para
publicar em qualquer lugar que sirva arquivo (Netlify, Cloudflare Pages,
GitHub Pages) e é praticamente impossível de cair.

## Publicar na Netlify

1. **app.netlify.com** → Add new site → Import an existing project
2. Conecte o GitHub e escolha o repositório
3. **Não mexa em nada** — o `netlify.toml` já traz comando, pasta de
   saída, versão do Node e cabeçalhos
4. Deploy

Cada `git push` no `main` republica sozinho.

## Adicionar um bolo novo

1. Jogue o PNG recortado (com canal alpha) em **`assets-src/`**, com nome
   começando em `bolo-` — é assim que o otimizador sabe que é bolo e o
   manda para 1100 px em vez do tamanho de enfeite.
2. Jogue os enfeites do sabor em `assets-src/` também, com qualquer nome.
3. Copie um bloco em [`data/themes.ts`](data/themes.ts), troque a foto, os
   enfeites, a paleta e o texto.

Só isso. O rodízio, os seletores, o wipe e a coreografia dos enfeites já
contam quantos sabores existem. O WebP otimizado é gerado sozinho no
próximo `npm run dev`.

Cada tema aceita **dois enfeites** (`pieces`): os slots de `data/pieces.ts`
se revezam entre eles, o que evita a sensação de ver a mesma foto em doze
lugares. Um só também funciona.

`cakeScale` é o ajuste fino de tamanho, para quando uma foto enquadra o
bolo mais apertado que as outras — o pistache usa 1.05 porque é mais largo
e mais baixo que os demais.

## Onde mexer

| Quero mudar… | Arquivo |
| --- | --- |
| Sabores: foto, paleta, enfeites, texto | `data/themes.ts` |
| Tempo entre as trocas | `THEME_INTERVAL`, em `data/themes.ts` |
| Onde cada enfeite fica e com quanto desfoque | `data/pieces.ts` |
| Posição e tamanho do bolo em cada tela | as variáveis `--cake-*` em `app/globals.css` |
| Fundo, luz, madeira, vinheta, o wipe | `components/BackgroundGlow.tsx` |
| Palavra gigante atrás do bolo | `components/ThemeWord.tsx` + `--word-size` |
| Coluna de texto da direita | `components/CakeCopy.tsx` |
| Texto que a rolagem revela | `data/reveal.ts` |
| Itens, preços e textos do cardápio | `data/menu.ts` |
| Cores do cardápio | `.menu-section` em `app/globals.css` |
| Botões | `components/CTAButtons.tsx` |

## Como a troca de sabor funciona

`app/page.tsx` guarda o sabor atual **e o anterior**. É esse par que
permite o wipe: a cor que sai continua desenhada por baixo enquanto a que
entra atravessa a tela da esquerda para a direita (`clip-path`, curva
`[0.76, 0, 0.24, 1]`, 1,15s). Três coisas varrem juntas nesse mesmo tempo:

- o fundo, camada sobre camada;
- a palavra gigante — a que chega é revelada, a que sai é consumida, na
  mesma direção;
- os enfeites, com um atraso proporcional ao `x` de cada um, então a troca
  percorre a tela em vez de todo mundo piscar junto.

A paleta do sabor entra como variáveis CSS no `<main>` (`lib/theme.ts`).
Quem consome usa `var(--ink)`, `var(--accent)` e companhia com
`transition-colors`: a substituição do `var()` é instantânea, mas a
transição do valor calculado não é — por isso texto e botões atravessam a
troca sem piscar.

## Movimento

Uma única spring alimenta a página inteira (`lib/parallax.ts`):

```ts
const spring = { type: "spring", duration: 1.2, bounce: 0.24 };
```

O mouse vira duas `MotionValue` normalizadas de `-1` a `1`, suavizadas por
`useSpring` e distribuídas por contexto. Cada camada escolhe sua amplitude
— é isso que cria a profundidade:

| Camada | Resposta ao mouse |
| --- | --- |
| Fundo e madeira | ±3 px |
| Texto | ±6 px |
| Palavra gigante | ±8 px |
| Enfeites | ±11 a ±30 px, proporcional ao `depth` |
| Bolo | ±18 px |
| Halo de luz | ±26 px |

### O hero é preso, e a rolagem move a cena

O hero é `sticky` dentro de uma pista de 200vh: enquanto os primeiros
100vh passam, ele fica preso na tela e `useScroll` devolve um progresso de
0 a 1. Terminado o curso, a rolagem segue para o cardápio sem sobressalto.

| O progresso vai de 0 a 1 e… | |
| --- | --- |
| o bolo | caminha até `--cake-travel-*`, encolhe para ~42% e **estaciona** centrado na faixa livre à esquerda do texto |
| os enfeites | descem proporcional ao `depth` — os da frente muito mais |
| a coluna do sabor | sobe 110 px e some |
| a palavra gigante | sobe e recua para 30% |
| o texto de `data/reveal.ts` | sobe do rodapé e entra, item por item |

Um cruza com o outro: enquanto o bolo desce, o texto sobe. Rolar de volta
traz tudo ao mesmo lugar, pela mesma spring.

Antes disto o hero sequestrava o evento `wheel` e a página não rolava. Com
conteúdo abaixo, rolagem de mentira atrapalharia: a versão atual respeita o
gesto do navegador, funciona no toque sem código extra e não briga com a
barra de rolagem.

O destino do bolo é relativo e mora em `app/globals.css`, junto das outras
medidas: `--cake-x` + `--cake-travel-x` é onde ele para. O progresso da roda
entra como a variável `--p` e a classe `.cake-travel` faz a conta em CSS —
por isso cada breakpoint tem seu próprio ponto de descanso sem uma linha de
JavaScript a mais.

Tudo respeita `prefers-reduced-motion`.

## Performance

O hero tem umas 30 coisas se mexendo ao mesmo tempo, então vale saber onde
está o custo:

- **As animações de repouso são CSS**, não JavaScript. Bolo, enfeites e
  poeira usam `@keyframes` em `app/globals.css` e rodam no compositor —
  zero trabalho por quadro. O Framer Motion cuida só do que precisa de
  estado: parallax, roda, entrada e troca de sabor.
- **As imagens passam por um otimizador.** `scripts/optimize-assets.mjs`
  lê os PNGs originais de `assets-src/`, apara a margem transparente,
  redimensiona e grava WebP em `public/opt` (roda sozinho antes de `dev` e
  `build`). Se trocar uma imagem, reinicie o dev — ele regera só o que
  mudou.
- **Os originais moram fora de `public/` de propósito.** Tudo que está em
  `public/` vai inteiro para o site publicado, e ninguém precisa baixar
  19 MB de PNG quando o site só usa os WebP. Com os originais fora, o
  site publicado caiu de 20 MB para 3 MB.
- **Nada de `backdrop-blur`, `mix-blend-mode` ou `drop-shadow` de raio
  alto** em elemento animado: são os filtros que forçam o navegador a
  redesenhar a cada quadro. As sombras grandes são gradientes.
- O parallax lê o ponteiro **uma vez por quadro** (`requestAnimationFrame`)
  e é desligado por completo em telas de toque, que não têm cursor.

## Cardápio

Seis bolos em cards de três colunas (duas no tablet, uma no celular). Cada
card tem um **quadro de foto** no topo, o nome puxando a linha, o
pontilhado levando o olho até o preço e a porção embaixo.

### Publicar a foto de um bolo

1. Gere o PNG recortado (com canal alpha) e jogue em `assets-src/`.
2. Escreva o caminho no campo `image` do item, em `data/menu.ts`.

Só isso. O otimizador converte para WebP sozinho e o quadro já está no
tamanho certo — a foto entra sem mexer no layout.

**Enquanto a foto não existe, o quadro não fica vazio:** ele mostra um
painel na cor do sabor (`tint`), com grão por cima e a mesma proporção que
a imagem vai ocupar. É espaço reservado que já trabalha pela composição.

### Cores e movimento

A paleta é **fixa** (`.menu-section`, em `app/globals.css`) e de propósito:
o hero troca de cor a cada seis segundos, e uma lista de preços piscando
junto seria cansativa de ler.

O campo é escuro e quente porque é onde as fotos vão morar — recorte sobre
fundo claro perde o contorno, sobre fundo escuro ele salta. Quem dá cor à
seção são os próprios sabores, um por quadro.

Cabeçalho, grupos e cards entram quando encostam na tela
(`whileInView`, uma vez só), com os cards em cascata da esquerda para a
direita — a mesma direção do wipe do hero. No hover, a foto cresce 4%.

> **Os preços em `data/menu.ts` são de exemplo.** Troque pelos reais antes
> de publicar.

## Preparar o site para um cliente

Tudo que é do negócio mora em **[`data/site.ts`](data/site.ts)** — nome,
descrição, endereço, telefone, WhatsApp, horário. É o único arquivo que
muda de um cliente para outro. Dali saem:

- o título da aba e o que aparece no Google
- a descrição do resultado da busca
- a prévia do link no WhatsApp (imagem, título e texto)
- o destino do botão "Fazer orçamento"
- o `sitemap.xml` e o `robots.txt`
- os dados estruturados que o Google usa para mostrar endereço, horário e
  telefone ao lado do resultado

### Passo a passo do lançamento

1. **Preencher `data/site.ts`.** Tudo marcado com TROCAR. O campo `url`
   precisa ser o endereço final, senão o sitemap aponta para o lugar
   errado e o Google não indexa.
2. **Trocar o conteúdo:** sabores em `data/themes.ts`, cardápio em
   `data/menu.ts`, textos da segunda cena em `data/reveal.ts`.
3. **Publicar** (Netlify, Cloudflare Pages ou Vercel Pro — o plano grátis
   da Vercel é só para uso pessoal, não serve para site de cliente).
4. **Search Console:** search.google.com/search-console → Adicionar
   propriedade → Prefixo do URL → verificação por Tag HTML. Copie só o
   conteúdo do `content` para `googleVerification`, publique de novo e
   clique em Verificar.
5. **Enviar o sitemap** no Search Console: `sitemap.xml`.
6. **Solicitar indexação** em Inspeção de URL.
7. **Perfil da Empresa no Google** (o do Maps) — o dono do negócio cria
   com a conta dele e passa o link para o campo `mapsUrl`.

Indexar leva de dias a semanas. Posicionar bem em busca concorrida leva
meses. Prometer "primeira página do Google" é criar cliente insatisfeito.

### Conferir se ficou certo

- prévia do WhatsApp: developers.facebook.com/tools/debug
- dados estruturados: search.google.com/test/rich-results
- desempenho e acessibilidade: PageSpeed Insights

## Sobre os assets

- **Os bolos precisam ser PNG recortado, com canal alpha.** É o caso de
  `foto-bolo.png` e `bolo-morango.png`. (A primeira versão de
  `foto-bolo.png` era uma foto retangular sem alpha e precisava de uma
  máscara elíptica para disfarçar a moldura; com recorte de verdade isso
  saiu do código.)
- O otimizador decide a largura pelo nome: arquivo com `bolo` no nome vai
  para 1100 px, o resto para 520 px, já que enfeite aparece pequeno e quase
  sempre desfocado. Um bolo novo entra na resolução certa sozinho.
- **`/leaf.png` e `/grain.png` nunca existiram.** O grão de filme é
  `feTurbulence` inline em `.grain-overlay`. A folhagem em SVG que existia
  antes saiu: virava um borrão escuro sobre o fundo claro do morango, e os
  enfeites já fazem o enquadramento.
- Os enfeites levam correção de cor por sabor (`pieceFilter`, em
  `data/themes.ts`): os PNGs foram fotografados em fundo claro e precisam
  de acertos diferentes para pertencerem à luz de cada cena.
