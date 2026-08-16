import type { Cubic, Point } from "./garden-layout";

/**
 * The plate.
 *
 * Between Us is one botanical drawing across the whole open book: everything
 * the two of them turned out to share, growing on vines that all run back into
 * the binding. The vines wander on their way out, because a real one does — a
 * straight line between two nodes would turn this into a graph, which is the
 * one thing it must never look like.
 */

/** Spread coordinates. Everything here is drawn across both pages. */
export const MAP = { width: 1440, height: 900 } as const;

/** Where every vine comes back to: the foot of the binding. */
export const TAPROOT: Point = { x: 720, y: 884 };

export interface ThemeSlot {
  at: Point;
  size: number;
  /** How far the vine wanders on its way there. */
  sway: number;
}

/* The first thing they found stands highest and nearest the fold; the rest
   spread out over both pages, leaving the outer corners clear for the words. */
export const THEME_SLOTS: ThemeSlot[] = [
  { at: { x: 720, y: 268 }, size: 120, sway: 42 },
  { at: { x: 452, y: 348 }, size: 102, sway: -78 },
  { at: { x: 996, y: 336 }, size: 100, sway: 74 },
  { at: { x: 302, y: 512 }, size: 88, sway: -104 },
  { at: { x: 1152, y: 494 }, size: 88, sway: 100 },
  { at: { x: 566, y: 556 }, size: 84, sway: -50 },
  { at: { x: 884, y: 570 }, size: 82, sway: 54 },
];

/** Where the one that hasn't opened yet sits — low, right on the fold. */
export const BUD_SLOT: Point = { x: 720, y: 706 };

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
