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
 *
 * Each branch is kept as its control points rather than as a path string, so
 * leaves can be placed on the curve and turned to face along it. A leaf sitting
 * near a line instead of growing out of it is the difference between a garden
 * and a diagram.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Cubic {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

export function cubicPath({ p0, p1, p2, p3 }: Cubic): string {
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
}

export function cubicPoint({ p0, p1, p2, p3 }: Cubic, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

/** Direction of travel along the curve at t, in degrees. */
export function cubicAngle({ p0, p1, p2, p3 }: Cubic, t: number): number {
  const u = 1 - t;
  const dx =
    3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy =
    3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

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
function anchor(to: Point, size: number): Point {
  return { x: to.x, y: to.y + size * 0.26 };
}

export function thenApproach(
  to: { x: number; y: number; size: number },
  seed = 0,
): Cubic {
  const { reach, drop, bow } = thenShape(seed);
  const end = anchor(to, to.size);
  const from = { x: end.x - reach, y: end.y + drop };
  /* Climbs, hesitates, then arrives — the line is never in a hurry. */
  return {
    p0: from,
    p1: { x: from.x + reach * 0.1, y: from.y - drop * 0.62 },
    p2: { x: end.x - reach * 0.74, y: end.y - bow },
    p3: end,
  };
}

export function nowApproach(
  to: { x: number; y: number; size: number },
  seed = 0,
): Cubic {
  const { reach, drop } = nowShape(seed);
  const end = anchor(to, to.size);
  const from = { x: end.x + reach, y: end.y + drop };
  /* One long, shallow bend. Measured, but never a right angle. */
  const control = { x: end.x + reach * 0.52, y: end.y + drop * 0.12 };
  return { p0: from, p1: control, p2: control, p3: end };
}
