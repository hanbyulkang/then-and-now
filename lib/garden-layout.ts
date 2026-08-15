/**
 * Deterministic garden composition.
 *
 * The garden is drawn from curated slots rather than a force-directed layout:
 * a physics simulation would settle differently on every load, and a garden
 * that rearranges itself does not read as a place. These positions were laid
 * out so the composition holds at one flower and at eight.
 *
 * Coordinates live in a 1440 × 720 canvas that scales to the viewport.
 */

export const CANVAS = { width: 1440, height: 720 } as const;

/** Where each side's history grows from. THEN on the left, NOW on the right. */
export const THEN_ORIGIN = { x: 168, y: 706 } as const;
export const NOW_ORIGIN = { x: 1276, y: 706 } as const;

/**
 * The lower middle belongs to today's question. Nothing is planted there, so
 * the card never lands on top of a flower.
 */
export const QUESTION_ZONE = { x0: 470, x1: 970, y0: 390 } as const;

export interface FlowerSlot {
  x: number;
  y: number;
  size: number;
}

/**
 * Filled newest-first, so the most recent discovery holds the centre. Later
 * slots drift outward — deeper conversations grow away from the ground they
 * started on, and the arrangement stays asymmetric on purpose.
 */
export const FLOWER_SLOTS: FlowerSlot[] = [
  { x: 726, y: 222, size: 92 },
  { x: 466, y: 168, size: 66 },
  { x: 982, y: 196, size: 64 },
  { x: 296, y: 330, size: 58 },
  { x: 1148, y: 316, size: 56 },
  { x: 636, y: 96, size: 50 },
  { x: 1246, y: 158, size: 46 },
  { x: 178, y: 178, size: 44 },
];

/** Where a lone memory sits: close to whoever told it, never in the middle. */
export function leafSlot(side: "then" | "now", index: number) {
  const spread = [
    { dx: 96, dy: -108 },
    { dx: 172, dy: -216 },
    { dx: 58, dy: -252 },
    { dx: 222, dy: -96 },
  ][index % 4];

  const origin = side === "then" ? THEN_ORIGIN : NOW_ORIGIN;
  const direction = side === "then" ? 1 : -1;
  return {
    x: origin.x + spread.dx * direction,
    y: origin.y + spread.dy,
  };
}

/**
 * Each flower keeps the two short branches it grew from, one in each hand.
 *
 * They are approaches, not wires: tracing every flower all the way back to a
 * corner would turn the garden into a dependency diagram, which is exactly the
 * look the design rules out. The long histories live in the root systems at the
 * bottom instead.
 */
/** Per-flower variation, so no two pairs of branches read as a repeated motif. */
function thenShape(seed: number) {
  return {
    reach: 104 + ((seed * 47) % 74),
    drop: 74 + ((seed * 31) % 62),
    bow: 18 + ((seed * 23) % 34),
  };
}

function nowShape(seed: number) {
  return {
    reach: 128 + ((seed * 37) % 88),
    drop: 52 + ((seed * 19) % 54),
  };
}

/** Where a branch meets the flower: its lower edge, not its middle. */
function anchor(to: { x: number; y: number }, size: number) {
  return { x: to.x, y: to.y + size * 0.26 };
}

export function thenApproach(
  to: { x: number; y: number; size: number },
  seed = 0,
): string {
  const { reach, drop, bow } = thenShape(seed);
  const end = anchor(to, to.size);
  const from = { x: end.x - reach, y: end.y + drop };
  /* Climbs, hesitates, then arrives — the line is never in a hurry. */
  return [
    `M ${from.x} ${from.y}`,
    `C ${from.x + reach * 0.1} ${from.y - drop * 0.62},`,
    `${end.x - reach * 0.74} ${end.y - bow},`,
    `${end.x} ${end.y}`,
  ].join(" ");
}

export function nowApproach(
  to: { x: number; y: number; size: number },
  seed = 0,
): string {
  const { reach, drop } = nowShape(seed);
  const end = anchor(to, to.size);
  const from = { x: end.x + reach, y: end.y + drop };
  /* One long, shallow bend. Measured, but never a right angle. */
  return `M ${from.x} ${from.y} Q ${end.x + reach * 0.52} ${end.y + drop * 0.12}, ${end.x} ${end.y}`;
}

/** A leaf part-way along THEN's branch. */
export function thenLeaf(
  to: { x: number; y: number; size: number },
  seed = 0,
) {
  const { reach, drop } = thenShape(seed);
  const end = anchor(to, to.size);
  return {
    x: end.x - reach * 0.58,
    y: end.y + drop * 0.2,
    rotation: -34 + ((seed * 53) % 78),
    size: 10 + ((seed % 3) * 4),
  };
}

/** A node part-way along NOW's branch. */
export function nowNode(to: { x: number; y: number; size: number }, seed = 0) {
  const { reach, drop } = nowShape(seed);
  const end = anchor(to, to.size);
  return {
    x: end.x + reach * 0.62,
    y: end.y + drop * 0.42,
    rotation: 12 + ((seed * 29) % 44),
    size: 8 + ((seed % 2) * 4),
  };
}
