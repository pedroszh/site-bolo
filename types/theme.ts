/**
 * Um sabor do hero.
 *
 * Cada tema carrega tudo que muda quando o bolo troca: a foto, os enfeites
 * que flutuam, a paleta inteira da tela e o texto que fala daquele bolo.
 * Adicionar um sabor novo é acrescentar um objeto em `data/themes.ts` —
 * nenhum componente precisa saber quantos existem.
 */
export type CakeTheme = {
  /** identificador estável, usado como key nas transições */
  id: string;
  /** nome curto, exibido gigante atrás do bolo e nos seletores */
  word: string;

  /** PNG recortado do bolo, em `/public` */
  cake: string;
  /**
   * Ajuste fino de tamanho, já que cada foto enquadra o bolo de um jeito.
   * 1 = a largura cheia definida por `--cake-w`.
   */
  cakeScale: number;

  /** Enfeites que flutuam nesse sabor. Os slots de `data/pieces.ts`
   *  se revezam entre essas imagens. */
  pieces: string[];

  palette: {
    /** fundo: gradiente do topo ao rodapé */
    bgFrom: string;
    bgTo: string;
    /** luz quente atrás do bolo (rgba) */
    glow: string;
    /** madeira / chão da composição */
    ground: string;
    /** o quanto a madeira pesa no rodapé (0–1) — o sabor claro pede menos */
    groundStrength: number;

    /** texto principal */
    ink: string;
    /** texto de apoio (rgba) */
    inkSoft: string;
    /** filetes, bordas, divisores (rgba) */
    line: string;
    /** cor de destaque: itálico do título, pontos, ícones */
    accent: string;

    /** palavra gigante atrás do bolo (rgba) */
    word: string;
    /** sombra do bolo no chão (rgba) */
    shadow: string;
    /** poeira suspensa na luz (rgba) */
    dust: string;
    /**
     * Correção de cor dos enfeites. Os PNGs foram fotografados em fundo
     * claro; cada sabor precisa de um acerto diferente para as peças
     * pertencerem à mesma luz do bolo.
     */
    pieceFilter: string;

    /** botão primário */
    buttonBg: string;
    buttonInk: string;
  };

  copy: {
    /** linha curta acima do nome */
    eyebrow: string;
    /** nome do bolo */
    name: string;
    /** dois ou três períodos sobre o bolo */
    description: string;
    /** fichas técnicas curtas */
    specs: string[];
  };
};
