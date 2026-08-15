import { type Cubic, type Point } from "./garden-layout";

/**
 * The tree.
 *
 * One trunk out of the shared ground, forking into two canopies: the left
 * drawn in THEN's hand, the right in NOW's. Everything the two of them have
 * discovered together hangs on it as a flower, and it is the same tree every
 * time you come back.
 *
 * This is the whole product in one object. Two people, one thing growing, and
 * the flowers are the only part that neither of them made alone.
 */

export const TREE_BASE: Point = { x: 720, y: 712 };
/** Where the trunk divides. Above this line the tree has two hands. */
export const CROWN: Point = { x: 720, y: 318 };

export const TRUNK: Cubic = {
  p0: TREE_BASE,
  p1: { x: 756, y: 614 },
  p2: { x: 684, y: 452 },
  p3: CROWN,
};

export interface Limb {
  curve: Cubic;
  hand: "then" | "now";
  /** Base width of the limb where it leaves the crown. */
  weight: number;
}

function limb(
  hand: "then" | "now",
  bend: Point,
  tip: Point,
  weight: number,
): Limb {
  return {
    hand,
    weight,
    curve: {
      p0: CROWN,
      p1: { x: CROWN.x + (bend.x - CROWN.x) * 0.4, y: CROWN.y - 54 },
      p2: bend,
      p3: tip,
    },
  };
}

/**
 * Four boughs, not a thicket.
 *
 * An earlier version grew one limb per discovery, which turned the crown into a
 * tangle the moment the garden had anything in it. A tree in blossom does not
 * work that way: a few boughs carry many flowers each, and it is the clusters
 * along a bough that make it read as blossom rather than as decoration.
 *
 * Two boughs in each hand, interleaved at the crown so the canopies overlap in
 * the middle instead of splitting the tree down its centre line.
 */
export const LIMBS: Limb[] = [
  limb("then", { x: 606, y: 208 }, { x: 532, y: 78 }, 18),
  limb("now", { x: 838, y: 202 }, { x: 922, y: 70 }, 16),
  limb("then", { x: 524, y: 236 }, { x: 348, y: 132 }, 14),
  limb("now", { x: 922, y: 228 }, { x: 1104, y: 124 }, 13),
];

export interface Blossom {
  /** Which limb it hangs on. */
  limb: number;
  /** How far along that limb. */
  t: number;
  size: number;
}

/**
 * Where blossoms open, newest first — so the most recent discovery takes the
 * crown of the tree and the older ones sit further out along their bough.
 * Several to a bough, which is what a tree in blossom actually looks like.
 */
export const BLOSSOMS: Blossom[] = [
  { limb: 0, t: 0.96, size: 84 },
  { limb: 1, t: 0.96, size: 72 },
  { limb: 0, t: 0.62, size: 58 },
  { limb: 3, t: 0.95, size: 56 },
  { limb: 2, t: 0.95, size: 54 },
  { limb: 1, t: 0.6, size: 48 },
  { limb: 3, t: 0.58, size: 44 },
  { limb: 2, t: 0.56, size: 44 },
];

/** Where the unopened question hangs: low and central, under the canopy. */
export const BUD_ON_TREE = { limb: 0, t: 0.34 };
