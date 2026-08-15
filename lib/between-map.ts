import type { Cubic, Point } from "./garden-layout";

/**
 * The map under the garden.
 *
 * Between Us is the same relationship seen from below: every theme they share
 * hanging off a root that runs back to one place. The vines wander on their way
 * out, because a root system does — a straight line between two nodes would
 * turn this into a graph, which is the one thing it must never look like.
 */

export const MAP = { width: 1440, height: 560 } as const;

/** Where every vine comes back to. */
export const TAPROOT: Point = { x: 720, y: 548 };

export interface ThemeSlot {
  at: Point;
  size: number;
  /** How far the vine wanders on its way there. */
  sway: number;
}

export const THEME_SLOTS: ThemeSlot[] = [
  { at: { x: 720, y: 128 }, size: 112, sway: 44 },
  { at: { x: 430, y: 196 }, size: 98, sway: -70 },
  { at: { x: 1006, y: 188 }, size: 96, sway: 66 },
  { at: { x: 232, y: 320 }, size: 84, sway: -92 },
  { at: { x: 1206, y: 308 }, size: 82, sway: 88 },
  { at: { x: 566, y: 336 }, size: 80, sway: -48 },
  { at: { x: 880, y: 344 }, size: 78, sway: 52 },
];

/** The vine out to one theme, wandering as it goes. */
export function vine(slot: ThemeSlot): Cubic {
  const dx = slot.at.x - TAPROOT.x;
  const dy = slot.at.y - TAPROOT.y;
  return {
    p0: TAPROOT,
    p1: { x: TAPROOT.x + dx * 0.1 + slot.sway, y: TAPROOT.y + dy * 0.42 },
    p2: { x: TAPROOT.x + dx * 0.72 - slot.sway * 0.7, y: TAPROOT.y + dy * 0.82 },
    p3: slot.at,
  };
}
