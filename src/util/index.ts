export function classNames(
  ...classes: (string | undefined | null | boolean)[]
): string {
  return classes.filter(Boolean).join(' ');
}
export function get_card_cols (col: number, container_width: number): number {
  if (container_width == 0) return col;
  if (container_width < 400) return 1;
  if (container_width < 800 && col > 2) return 2;
  if (container_width < 1100 && col > 3) return 3;
  return col;
}