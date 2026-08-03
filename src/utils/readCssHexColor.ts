export type CssCustomProperty = `--${string}`;

const HEX_COLOR_PATTERN = /^#([\da-f]{6})$/i;

export function readCssHexColor(property: CssCustomProperty): number {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
  const match = HEX_COLOR_PATTERN.exec(value);

  if (!match) {
    throw new Error(
      `La propiedad CSS ${property} debe contener un color hexadecimal de seis dígitos.`,
    );
  }

  return Number.parseInt(match[1], 16);
}
