/**
 * Two hands, one garden.
 *
 * Nothing here is one flower asset repeated. A plant that grew out of her story
 * is painted the way an old botanical plate is: warm, veined, the pigment
 * uneven and gone faded. A plant that grew out of hers is the same watercolour
 * in a calmer contemporary hand — simpler petals, cooler wash, almost no
 * ornament.
 *
 * Where the two of them turn out to have lived the same thing, the flower that
 * opens is neither: one half of it is hers and the other half is hers, joined
 * at a single centre. Which two halves, and how they sit, comes from the
 * discovery itself, so no two of them are the same flower.
 */

import type { Side } from "./types";

export interface Specimen {
  src: string;
  w: number;
  h: number;
}

const at = (name: string, w: number, h: number): Specimen => ({
  src: `/assets/garden/${name}.webp`,
  w,
  h,
});

/** Blooms, in her hand. */
export const THEN_BLOOMS: Specimen[] = [
  at("then-bloom-a", 629, 640),
  at("then-bloom-b", 638, 640),
];

/** And in hers. */
export const NOW_BLOOMS: Specimen[] = [
  at("now-bloom-a", 635, 640),
  at("now-bloom-b", 640, 637),
];

export const THEN_LEAF = at("then-leaf", 185, 440);
export const NOW_LEAF = at("now-leaf", 292, 440);
export const BUD = at("bud", 125, 202);
export const SEEDLING = at("seedling", 403, 360);

export const BLOOMS: Record<Side, Specimen[]> = {
  then: THEN_BLOOMS,
  now: NOW_BLOOMS,
};

export const LEAF: Record<Side, Specimen> = {
  then: THEN_LEAF,
  now: NOW_LEAF,
};

export interface Recipe {
  then: Specimen;
  now: Specimen;
  /** How far the whole flower leans. */
  tilt: number;
  /** Slight difference in size between the two halves, as real ones have. */
  thenScale: number;
  nowScale: number;
  /** The eye where the two halves meet. */
  eye: string;
}

const EYES = ["#c9a35e", "#c08a6e", "#a8794f", "#b8925c"];

/** Stable per-discovery variation, so a flower is always the same flower. */
export function recipe(seed: number): Recipe {
  const n = Math.abs(Math.round(seed));
  return {
    then: THEN_BLOOMS[n % THEN_BLOOMS.length],
    now: NOW_BLOOMS[(n >> 3) % NOW_BLOOMS.length],
    tilt: -22 + ((n * 13) % 45),
    thenScale: 0.96 + ((n * 5) % 12) / 100,
    nowScale: 0.94 + ((n * 7) % 14) / 100,
    eye: EYES[(n * 3) % EYES.length],
  };
}

/** A hash small enough to read and stable enough to lay a garden out with. */
export function seedOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}
