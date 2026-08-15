/**
 * Every plant in the garden, and where it attaches.
 *
 * All of it is finished drawn artwork, in one of two hands. THEN is inked with
 * a heavy uneven contour, filled solid, veined — an old botanical plate. NOW is
 * a lighter, simpler hand: one calm thin contour sitting exactly on the edge of
 * a pale fill, with far fewer marks. Two people drawing the same garden, both
 * of them finishing what they started.
 *
 * What matters here is the anchor. A leaf joins a branch at its stalk, not at
 * its middle, and a plant stands on its base. Placing these by their centre —
 * which is what an ordinary image does — is what made the first attempt look
 * like leaves scattered near a line rather than growing out of it.
 */

export interface Specimen {
  src: string;
  w: number;
  h: number;
  /** Where it attaches, in 0–1 of its own box. */
  anchor: { x: number; y: number };
  /** Distance from the anchor to the far tip, in its own units. */
  reach: number;
  /** Which way it points when unrotated, in degrees. 0 is east, -90 is up. */
  facing: number;
}

const upright = (
  src: string,
  w: number,
  h: number,
): Specimen => ({
  src,
  w,
  h,
  anchor: { x: 0.5, y: 1 },
  reach: h,
  facing: -90,
});

/* Leaves. THEN's stalk sits bottom-right with the blade sweeping up and left;
   NOW's rises straight from a point at its base. */
export const THEN_LEAF: Specimen = {
  src: "/assets/botanical/then/leaf.svg",
  w: 659,
  h: 587,
  anchor: { x: 0.93, y: 0.93 },
  reach: 810,
  facing: -152,
};

export const NOW_LEAF: Specimen = {
  src: "/assets/botanical/now/leaf.svg",
  w: 972,
  h: 1199,
  /* Its stalk curls out of the bottom-left corner. */
  anchor: { x: 0.14, y: 0.98 },
  reach: 1210,
  facing: -68,
};

export const THEN_PETAL: Specimen = upright(
  "/assets/botanical/then/petal.svg",
  574,
  972,
);

export const NOW_PETAL: Specimen = upright(
  "/assets/botanical/now/petal.svg",
  873,
  1225,
);

/** Ground planting — the things that make it a garden rather than a diagram. */
export const GROUND = {
  thenGrass: upright("/assets/botanical/then/grass.svg", 336, 509),
  thenFern: upright("/assets/botanical/then/fern.svg", 301, 703),
  thenSprig: upright("/assets/botanical/then/sprig.svg", 237, 571),
  thenPods: upright("/assets/botanical/then/pods.svg", 257, 693),
  nowGrass: upright("/assets/botanical/now/grass.svg", 547, 733),
  nowSprig: upright("/assets/botanical/now/sprig.svg", 525, 809),
  nowPods: upright("/assets/botanical/now/pods.svg", 337, 796),
} satisfies Record<string, Specimen>;

export interface PlacedProps {
  /** Where the specimen attaches, in scene coordinates. */
  x: number;
  y: number;
  /** How far it should reach from that point. */
  length: number;
  /** Direction it should point, in degrees. 0 is east, -90 is straight up. */
  angle?: number;
  opacity?: number;
  /** Mirror it, so a row of the same drawing does not repeat. */
  flip?: boolean;
}

export function Botanical({
  spec,
  x,
  y,
  length,
  angle = -90,
  opacity = 1,
  flip = false,
}: PlacedProps & { spec: Specimen }) {
  const scale = length / spec.reach;
  const w = spec.w * scale;
  const h = spec.h * scale;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle - spec.facing})${
        flip ? " scale(-1 1)" : ""
      }`}
      opacity={opacity}
      style={{ transition: "opacity 300ms ease" }}
    >
      <image
        href={spec.src}
        x={-w * spec.anchor.x}
        y={-h * spec.anchor.y}
        width={w}
        height={h}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
}

export function ThenLeaf(props: PlacedProps) {
  return <Botanical spec={THEN_LEAF} {...props} />;
}

export function NowLeaf(props: PlacedProps) {
  return <Botanical spec={NOW_LEAF} {...props} />;
}
