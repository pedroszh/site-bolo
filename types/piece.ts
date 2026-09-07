/**
 * Um enfeite flutuando na composição — barra de chocolate, morango, o que
 * o sabor da vez pedir.
 *
 * O slot guarda só a coreografia: onde fica, de que tamanho, com quanto
 * desfoque e em que profundidade. A imagem vem do tema ativo, por
 * `image` (índice dentro de `theme.pieces`, com volta ao início). É o que
 * permite trocar chocolate por morango sem redesenhar a cena.
 *
 * Coordenadas em % do palco, para o layout escalar junto com a tela.
 * `depth` é z-index e multiplicador do parallax ao mesmo tempo: quanto
 * mais alto, mais na frente e mais reativo ao mouse e à roda.
 */
export type ScatterPiece = {
  /** qual imagem do tema usar (índice, com módulo) */
  image: number;
  /** posição horizontal, em % da largura do palco */
  x: number;
  /** posição vertical, em % da altura do palco */
  y: number;
  /** largura em px (referência para tela de 1440px, escala com vw) */
  width: number;
  /** rotação de repouso, em graus */
  rotate: number;
  /** espelha na horizontal — quebra a repetição quando o tema tem
   *  uma imagem só */
  flip: boolean;
  /** desfoque em px (0–6) — profundidade de campo */
  blur: number;
  /** z-index. O bolo está em 20: acima disso o enfeite passa na frente */
  depth: number;
  /** duração do ciclo de flutuação, em segundos (3.5–6.8) */
  duration: number;
  /** atraso inicial, em segundos — mantém as peças fora de sincronia */
  delay: number;
  /** opacidade de repouso */
  opacity: number;
  /**
   * Some no retrato.
   *
   * Em pé o bolo fica centrado e muito mais largo — ocupa de ~20% a ~80%
   * da tela — então peças de frente que no desktop passam ao lado dele
   * acabam em cima da massa. Estas somem em telas estreitas.
   */
  portraitHidden?: boolean;
};
