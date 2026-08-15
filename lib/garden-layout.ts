/**
 * The geometry the garden is drawn with.
 *
 * Curves are kept as their control points rather than as path strings, so
 * leaves can be placed on a limb and turned to face along it, and so a stem can
 * be given real weight. Where things actually sit lives in `garden-tree.ts`.
 *
 * Coordinates live in a 1440 × 720 canvas that scales to the viewport.
 */

export const CANVAS = { width: 1440, height: 720 } as const;

/** Where each side's history grows from. THEN on the left, NOW on the right. */

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

/**
 * A stem drawn as a filled shape rather than a stroke.
 *
 * A constant-width stroke is what makes a branch read as wire. A real stem is
 * thick where it leaves the ground and fine at its tip, so this walks the curve,
 * offsets each side by a width that tapers along it, and closes the outline.
 */
export function taperedStem(
  curve: Cubic,
  baseWidth: number,
  tipWidth = 0.5,
  steps = 26,
): string {
  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const at = cubicPoint(curve, t);
    const heading = (cubicAngle(curve, t) * Math.PI) / 180;
    /* Taper on a curve rather than a straight line: stems thin out fast near
       the tip and hold their weight low down. */
    const half = (baseWidth + (tipWidth - baseWidth) * Math.pow(t, 0.7)) / 2;
    const nx = -Math.sin(heading) * half;
    const ny = Math.cos(heading) * half;
    left.push({ x: at.x + nx, y: at.y + ny });
    right.push({ x: at.x - nx, y: at.y - ny });
  }

  const forward = left.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  const back = right.reverse().map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`);
  return `${forward.join(" ")} ${back.join(" ")} Z`;
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

/** The ground the whole garden stands on. */
/** The ground the whole garden stands on. */
export const GROUND_Y = 708;
