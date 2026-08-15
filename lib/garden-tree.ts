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
export const CROWN: Point = { x: 720, y: 372 };

/** The trunk leans out and settles back — no tree grows up a plumb line. */
export const TRUNK: Cubic = {
  p0: TREE_BASE,
  p1: { x: 788, y: 604 },
  p2: { x: 646, y: 430 },
  p3: CROWN,
};

export interface Limb {
  curve: Cubic;
  hand: "then" | "now";
  /** Base width of the limb where it leaves the crown. */
  weight: number;
}

/**
 * Four boughs, not a thicket.
 *
 * An earlier version grew one limb per discovery, which turned the crown into a
 * tangle the moment the garden had anything in it. A tree in blossom does not
 * work that way: a few boughs carry many flowers each, and it is the clusters
 * along a bough that make it read as blossom rather than as decoration.
 *
 * Each is written out as its own curve rather than generated from a bend point.
 * A bough that leaves the crown, swings out and only then turns up has a shape;
 * one interpolated toward a target is a straight run with a kink at the end.
 *
 * Two boughs in each hand, interleaved at the crown so the canopies overlap in
 * the middle instead of splitting the tree down its centre line. The bark is
 * the same on all of them — a tree has one bark, and which hand drew what is
 * carried by the leaves.
 */
export const LIMBS: Limb[] = [
  {
    hand: "then",
    weight: 20,
    curve: {
      p0: CROWN,
      p1: { x: 704, y: 300 },
      p2: { x: 588, y: 284 },
      p3: { x: 526, y: 168 },
    },
  },
  {
    hand: "now",
    weight: 17,
    curve: {
      p0: CROWN,
      p1: { x: 742, y: 294 },
      p2: { x: 858, y: 276 },
      p3: { x: 924, y: 160 },
    },
  },
  {
    hand: "then",
    weight: 15,
    curve: {
      p0: CROWN,
      p1: { x: 650, y: 352 },
      p2: { x: 502, y: 356 },
      p3: { x: 338, y: 226 },
    },
  },
  {
    hand: "now",
    weight: 14,
    curve: {
      p0: CROWN,
      p1: { x: 794, y: 348 },
      p2: { x: 944, y: 350 },
      p3: { x: 1110, y: 218 },
    },
  },
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

/**
 * Twigs that run off the top of the frame.
 *
 * A canopy that stops politely inside its box reads as an illustration placed
 * on a page. These carry on past the edge, so the page is a window onto
 * something larger rather than a container holding all of it.
 */
export const OUTRUNNERS: Cubic[] = [
  {
    p0: { x: 562, y: 216 },
    p1: { x: 520, y: 132 },
    p2: { x: 458, y: 56 },
    p3: { x: 402, y: -92 },
  },
  {
    p0: { x: 884, y: 208 },
    p1: { x: 930, y: 124 },
    p2: { x: 1000, y: 48 },
    p3: { x: 1060, y: -96 },
  },
  {
    p0: { x: 702, y: 176 },
    p1: { x: 690, y: 100 },
    p2: { x: 710, y: 34 },
    p3: { x: 694, y: -110 },
  },
];

/** Where the unopened question hangs: low and central, under the canopy. */
export const BUD_ON_TREE = { limb: 0, t: 0.34 };
