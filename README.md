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
npm run build
```

## Adicionar um bolo novo

1. Jogue o PNG recortado (com canal alpha) em `public/`, com nome
   começando em `bolo-` — é assim que o otimizador sabe que é bolo e o
   manda para 1100 px em vez do tamanho de enfeite.
2. Jogue os enfeites do sabor em `public/` também, com qualquer nome.
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
  apara a margem transparente, redimensiona e grava WebP em `public/opt`
  (roda sozinho antes de `dev` e `build`). Os 8,7 MB de PNG viram ~1 MB.
  Se trocar uma imagem, reinicie o dev — ele regera só o que mudou.
- **Nada de `backdrop-blur`, `mix-blend-mode` ou `drop-shadow` de raio
  alto** em elemento animado: são os filtros que forçam o navegador a
  redesenhar a cada quadro. As sombras grandes são gradientes.
- O parallax lê o ponteiro **uma vez por quadro** (`requestAnimationFrame`)
  e é desligado por completo em telas de toque, que não têm cursor.

## Cardápio

Uma seção comum, abaixo do hero — sem foto por enquanto, com a tipografia
carregando: o nome do bolo puxa a linha, o pontilhado leva o olho até o
preço, do jeito que cardápio impresso faz há um século. Duas colunas no
desktop, uma no celular.

É um Server Component: nada ali precisa de estado nem de animação.

A paleta é **fixa** (`.menu-section`, em `app/globals.css`) e de propósito:
o hero troca de cor a cada seis segundos, e uma lista de preços piscando
junto seria cansativa de ler. O corte de cor entre as duas seções também
marca que ali começa outro assunto.

> **Os preços em `data/menu.ts` são de exemplo.** Troque pelos reais antes
> de publicar.

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
