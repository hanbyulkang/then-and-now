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

export interface FlowerSlot {
  x: number;
  y: number;
  size: number;
}

/**
 * Filled newest-first, so the most recent discovery holds the crown of the
 * composition. Nothing is planted in the lower middle: that band belongs to
 * today's question, and a flower behind the card would simply be lost.
 */
export const FLOWER_SLOTS: FlowerSlot[] = [
  { x: 726, y: 116, size: 88 },
  { x: 438, y: 200, size: 66 },
  { x: 1008, y: 190, size: 64 },
  { x: 246, y: 340, size: 58 },
  { x: 1198, y: 330, size: 56 },
  { x: 330, y: 128, size: 50 },
  { x: 1120, y: 108, size: 46 },
  { x: 1330, y: 220, size: 44 },
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

/*
 * Each flower keeps the two short branches it grew from, one in each hand.
 *
 * They are approaches, not wires: tracing every flower all the way back to a
 * corner would turn the garden into a dependency diagram, which is exactly the
 * look the design rules out. The long histories live in the root systems at the
 * bottom instead. The shapes vary per flower so no two pairs read as a repeated
 * motif.
 */
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
