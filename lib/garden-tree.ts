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
export const CROWN: Point = { x: 720, y: 400 };

export const TRUNK: Cubic = {
  p0: TREE_BASE,
  p1: { x: 752, y: 636 },
  p2: { x: 690, y: 512 },
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
      p1: { x: CROWN.x + (bend.x - CROWN.x) * 0.45, y: CROWN.y - 38 },
      p2: bend,
      p3: tip,
    },
  };
}

/**
 * The canopy: a rounded crown rather than a spread of horizontal arms, which
 * read as wires. Ordered from the centre outward, alternating hands so the two
 * canopies interleave instead of splitting the tree down the middle.
 */
export const LIMBS: Limb[] = [
  limb("then", { x: 678, y: 286 }, { x: 692, y: 150 }, 13),
  limb("now", { x: 776, y: 278 }, { x: 800, y: 142 }, 11),
  limb("then", { x: 604, y: 306 }, { x: 546, y: 178 }, 10),
  limb("now", { x: 848, y: 300 }, { x: 916, y: 176 }, 9),
  limb("then", { x: 566, y: 344 }, { x: 468, y: 246 }, 9),
  limb("now", { x: 882, y: 340 }, { x: 986, y: 244 }, 8),
  limb("then", { x: 558, y: 378 }, { x: 424, y: 332 }, 7),
  limb("now", { x: 890, y: 376 }, { x: 1024, y: 328 }, 6),
];

export interface Blossom {
  /** Which limb it hangs on. */
  limb: number;
  /** How far along that limb. */
  t: number;
  size: number;
}

/**
 * Where blossoms open, newest first. They cluster toward the middle of the
 * canopy, where the two hands overlap, and thin out toward the tips.
 */
export const BLOSSOMS: Blossom[] = [
  { limb: 0, t: 0.95, size: 74 },
  { limb: 3, t: 0.94, size: 60 },
  { limb: 2, t: 0.95, size: 58 },
  { limb: 5, t: 0.94, size: 52 },
  { limb: 4, t: 0.95, size: 50 },
  { limb: 1, t: 0.96, size: 46 },
  { limb: 7, t: 0.95, size: 44 },
  { limb: 6, t: 0.95, size: 42 },
];

/** Where the unopened question hangs: low and central, under the canopy. */
export const BUD_ON_TREE = { limb: 0, t: 0.42 };
