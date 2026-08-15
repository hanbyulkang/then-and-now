"use client";

import {
  Botanical,
  GROUND,
  NowLeaf,
  ThenLeaf,
} from "./Leaf";

/**
 * A person's accumulated history, growing out of their corner of the ground
 * (spec §11: Root). It thickens as they tell more stories — the garden should
 * show how much someone has given it without ever counting out loud.
 *
 * Both are plants: a trunk that leans, limbs that leave it at a real fork, and
 * leaves attached at those forks rather than floating beside them. The
 * difference between the two is the hand they are drawn in, not the geometry —
 * an upright stem with shapes pinned to it reads as an antenna, not a shrub.
 */

interface RootProps {
  x: number;
  y: number;
  memories: number;
}

export function ThenRoot({ x, y, memories }: RootProps) {
  const scale = Math.min(1, 0.55 + memories * 0.11);
  const h = 260 * scale;
  const w = 200 * scale;

  /* Where each limb leaves the trunk, and where it ends. */
  const forks = [
    { at: { x: w * 0.03, y: -h * 0.38 }, to: { x: w * 0.68, y: -h * 0.6 }, lean: -24 },
    { at: { x: -w * 0.02, y: -h * 0.62 }, to: { x: -w * 0.5, y: -h * 0.88 }, lean: -150 },
    { at: { x: w * 0.06, y: -h * 0.76 }, to: { x: w * 0.42, y: -h * 0.95 }, lean: -30 },
  ];

  return (
    <g transform={`translate(${x} ${y})`} opacity={0.85}>
      {/* Trunk — it leans, thinks better of it, and carries on. */}
      <path
        d={`M 0 0 C ${w * 0.11} ${-h * 0.3}, ${-w * 0.13} ${-h * 0.55}, ${w * 0.1} ${-h * 0.86}`}
        stroke="#40382f"
        strokeWidth={2.2 * scale + 0.6}
        strokeLinecap="round"
        fill="none"
      />

      {forks.map((fork, i) => (
        <g key={i}>
          <path
            d={`M ${fork.at.x} ${fork.at.y} Q ${(fork.at.x + fork.to.x) / 2} ${fork.at.y - h * 0.06}, ${fork.to.x} ${fork.to.y}`}
            stroke="#40382f"
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaves at the fork, along the limb, and at its tip. */}
          {[0, 0.36, 0.68, 1].map((t, j) => (
            <ThenLeaf
              key={t}
              x={fork.at.x + (fork.to.x - fork.at.x) * t}
              y={fork.at.y + (fork.to.y - fork.at.y) * t - h * 0.05 * t * (1 - t) * 4}
              length={24 + j * 3 + i * 2}
              angle={fork.lean + (j % 2 ? 38 : -30)}
              flip={(i + j) % 2 === 1}
            />
          ))}
        </g>
      ))}
      <ThenLeaf x={w * 0.1} y={-h * 0.86} length={32} angle={-104} />
      <ThenLeaf x={w * 0.05} y={-h * 0.22} length={26} angle={-16} flip />
      <ThenLeaf x={-w * 0.02} y={-h * 0.5} length={28} angle={-166} />

      {/* Planting around the base, so the trunk stands in something. */}
      <Botanical spec={GROUND.thenGrass} x={-w * 0.34} y={4} length={46 * scale + 22} />
      <Botanical spec={GROUND.thenGrass} x={w * 0.3} y={2} length={38 * scale + 18} flip />
      <Botanical spec={GROUND.thenFern} x={-w * 0.62} y={6} length={62 * scale + 26} />
      <Botanical spec={GROUND.thenSprig} x={w * 0.62} y={5} length={52 * scale + 22} />
      <Botanical spec={GROUND.thenPods} x={w * 0.95} y={8} length={44 * scale + 18} flip />
    </g>
  );
}

export function NowRoot({ x, y, memories }: RootProps) {
  const scale = Math.min(1, 0.55 + memories * 0.11);
  const h = 260 * scale;
  const w = 200 * scale;

  const forks = [
    { at: { x: -w * 0.02, y: -h * 0.42 }, to: { x: -w * 0.62, y: -h * 0.62 }, lean: -156 },
    { at: { x: w * 0.03, y: -h * 0.66 }, to: { x: w * 0.5, y: -h * 0.86 }, lean: -26 },
  ];

  return (
    <g transform={`translate(${x} ${y})`} opacity={0.8}>
      <path
        d={`M 0 0 C ${-w * 0.07} ${-h * 0.32}, ${w * 0.09} ${-h * 0.58}, ${-w * 0.05} ${-h * 0.88}`}
        stroke="#747c79"
        strokeWidth={1.6 * scale + 0.4}
        strokeLinecap="round"
        fill="none"
      />

      {forks.map((fork, i) => (
        <g key={i}>
          <path
            d={`M ${fork.at.x} ${fork.at.y} Q ${(fork.at.x + fork.to.x) / 2} ${fork.at.y - h * 0.05}, ${fork.to.x} ${fork.to.y}`}
            stroke="#747c79"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
          {[0, 0.34, 0.66, 1].map((t, j) => (
            <NowLeaf
              key={t}
              x={fork.at.x + (fork.to.x - fork.at.x) * t}
              y={fork.at.y + (fork.to.y - fork.at.y) * t - h * 0.04 * t * (1 - t) * 4}
              length={20 + j * 3 + i * 2}
              angle={fork.lean + (j % 2 ? 34 : -28)}
              flip={(i + j) % 2 === 0}
            />
          ))}
        </g>
      ))}
      <NowLeaf x={-w * 0.05} y={-h * 0.88} length={28} angle={-78} />
      <NowLeaf x={-w * 0.02} y={-h * 0.24} length={22} angle={-18} />
      <NowLeaf x={w * 0.03} y={-h * 0.54} length={24} angle={-160} flip />

      <Botanical spec={GROUND.nowGrass} x={w * 0.32} y={3} length={42 * scale + 20} />
      <Botanical spec={GROUND.nowSprig} x={-w * 0.4} y={5} length={54 * scale + 22} flip />
      <Botanical spec={GROUND.nowPods} x={w * 0.68} y={6} length={44 * scale + 18} />
    </g>
  );
}
