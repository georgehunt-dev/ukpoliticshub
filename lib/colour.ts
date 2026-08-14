/**
 * Party colours are set by the parties, not by us, and one of them —
 * Restore Britain's #051D3F — is almost black. On the dark photographic
 * panels that colour disappears entirely, so we lighten it just enough to
 * read while keeping the hue recognisably theirs.
 */

function parse(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Relative luminance, 0 (black) to 1 (white). */
export function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Mixes a colour toward white by `amount` (0–1). */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = parse(hex);
  const mix = (v: number) => Math.round(v + (255 - v) * amount);
  return `#${[mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The version of a party colour safe to use against a dark background.
 * Colours that already read clearly are returned untouched.
 */
export function onDark(hex: string): string {
  const l = luminance(hex);
  if (l >= 0.14) return hex;
  // The darker the original, the more we lift it.
  return lighten(hex, l < 0.03 ? 0.62 : 0.45);
}

/** Mixes a colour toward near-black ink by `amount` (0–1). */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = parse(hex);
  // Toward the site's ink, not pure black, so the band stays in the palette.
  const target = [15, 31, 56];
  const mix = (v: number, t: number) => Math.round(v + (t - v) * amount);
  return `#${[mix(r, target[0]), mix(g, target[1]), mix(b, target[2])]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * A party-tinted dark field for the page header.
 *
 * The six brand colours run from near-black navy (Restore, #051D3F) to bright
 * amber (Lib Dem, #FAA61A). Using them as flat backgrounds would give one
 * party an unreadable band and another a garish one, so each is mixed heavily
 * toward ink: the hue stays recognisably theirs, the contrast stays constant.
 */
export function bandColour(hex: string): string {
  const l = luminance(hex);
  // Lighter brand colours need mixing further down to reach the same depth.
  const amount = l > 0.35 ? 0.86 : l > 0.15 ? 0.82 : 0.7;
  return darken(hex, amount);
}
