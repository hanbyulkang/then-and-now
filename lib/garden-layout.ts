/**
 * Deterministic garden composition.
 *
 * The garden is drawn from curated slots rather than a force-directed layout:
 * a physics simulation would settle differently on every load, and a garden
 * that rearranges itself does not read as a place. These positions were laid
 * out so the composition holds at one flower and at seven.
 *
 * Coordinates live in a 1440 × 720 canvas that scales to the viewport.
 */

export const CANVAS = { width: 1440, height: 720 } as const;

/** Where each side's history grows from. THEN on the left, NOW on the right. */
export const THEN_ORIGIN = { x: 96, y: 686 } as const;
export const NOW_ORIGIN = { x: 1344, y: 686 } as const;

export interface FlowerSlot {
  x: number;
  y: number;
  size: number;
}

/**
 * Filled newest-first, so the most recent discovery holds the centre. Later
 * slots drift outward and upward — deeper conversations grow away from the
 * ground they started on.
 */
export const FLOWER_SLOTS: FlowerSlot[] = [
  { x: 730, y: 300, size: 84 },
  { x: 528, y: 208, size: 64 },
  { x: 918, y: 232, size: 64 },
  { x: 432, y: 404, size: 56 },
  { x: 988, y: 386, size: 56 },
  { x: 648, y: 132, size: 52 },
  { x: 1108, y: 528, size: 48 },
  { x: 268, y: 268, size: 46 },
];

/** Where a lone memory sits: close to whoever told it. */
export function leafSlot(side: "then" | "now", index: number) {
  const spread = [
    { dx: 118, dy: -152 },
    { dx: 196, dy: -252 },
    { dx: 74, dy: -292 },
    { dx: 262, dy: -128 },
  ][index % 4];

  const origin = side === "then" ? THEN_ORIGIN : NOW_ORIGIN;
  const direction = side === "then" ? 1 : -1;
  return {
    x: origin.x + spread.dx * direction,
    y: origin.y + spread.dy,
  };
}

/**
 * A stem from one side's ground up to a flower.
 *
 * THEN wanders: its control points pull sideways so the line never reads as
 * engineered. NOW takes a cleaner, flatter arc. Both are cubic Béziers — no
 * straight connector lines, which would turn the garden into a graph.
 */
export function stemPath(
  side: "then" | "now",
  to: { x: number; y: number },
  seed = 0,
): string {
  const from = side === "then" ? THEN_ORIGIN : NOW_ORIGIN;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const wander = side === "then" ? 46 + ((seed * 29) % 70) : 14;
  const lean = side === "then" ? -1 : 1;

  const c1x = from.x + dx * 0.12 + wander * lean;
  const c1y = from.y + dy * 0.42;
  const c2x = from.x + dx * 0.66 - wander * 0.5 * lean;
  const c2y = from.y + dy * 0.86;

  return `M ${from.x} ${from.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

/** Small leaves scattered along a stem, positioned along the curve. */
export function leavesAlong(
  side: "then" | "now",
  to: { x: number; y: number },
  seed = 0,
) {
  const from = side === "then" ? THEN_ORIGIN : NOW_ORIGIN;
  const count = side === "then" ? 2 : 2;
  return Array.from({ length: count }, (_, i) => {
    const t = 0.34 + i * 0.28;
    return {
      x: from.x + (to.x - from.x) * t + (side === "then" ? -18 : 14),
      y: from.y + (to.y - from.y) * t,
      rotation: side === "then" ? -30 + ((seed + i) * 41) % 70 : 15 + ((seed + i) * 25) % 50,
      size: side === "then" ? 12 + ((seed + i) % 3) * 4 : 12 + ((seed + i) % 2) * 4,
    };
  });
}
