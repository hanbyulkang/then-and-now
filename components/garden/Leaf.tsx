/**
 * The two leaves, placed inside an SVG scene.
 *
 * Both are drawn artwork rather than primitives: THEN's leaf has a wandering
 * inked contour and real veining, NOW's is the same leaf ruled into flat
 * facets. Sizing here is by width — each keeps its own drawn proportions so a
 * leaf never stretches.
 */

const THEN = { src: "/assets/botanical/then/leaf.svg", ratio: 587 / 659 };
const NOW = { src: "/assets/botanical/now/leaf.svg", ratio: 712 / 290 };

interface LeafProps {
  /** Centre of the leaf, in scene coordinates. */
  x: number;
  y: number;
  width: number;
  rotation?: number;
  opacity?: number;
}

function Leaf({
  spec,
  x,
  y,
  width,
  rotation = 0,
  opacity = 1,
}: LeafProps & { spec: typeof THEN }) {
  const height = width * spec.ratio;
  return (
    <image
      href={spec.src}
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      opacity={opacity}
      transform={`rotate(${rotation} ${x} ${y})`}
      style={{ transition: "opacity 300ms ease" }}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

export function ThenLeaf(props: LeafProps) {
  return <Leaf spec={THEN} {...props} />;
}

export function NowLeaf(props: LeafProps) {
  return <Leaf spec={NOW} {...props} />;
}
