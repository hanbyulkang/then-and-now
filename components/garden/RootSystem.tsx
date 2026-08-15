"use client";

import { NowLeaf, ThenLeaf } from "./Leaf";

/**
 * A person's accumulated history, growing out of their corner of the ground
 * (spec §11: Root). It thickens as they tell more stories — the garden should
 * show how much someone has given it without ever counting out loud.
 *
 * THEN's root is drawn: uneven strokes, leaves that sit at careless angles.
 * NOW's is drafted: thin lines, small square joints, everything deliberate.
 */

export function ThenRoot({
  x,
  y,
  memories,
}: {
  x: number;
  y: number;
  memories: number;
}) {
  const scale = Math.min(1, 0.5 + memories * 0.12);
  const h = 250 * scale;
  const w = 210 * scale;

  return (
    <g transform={`translate(${x} ${y})`} opacity={0.72}>
      {/* Main trunk, leaning as it climbs. */}
      <path
        d={`M 0 0 C ${w * 0.1} ${-h * 0.32}, ${-w * 0.14} ${-h * 0.56}, ${w * 0.12} ${-h * 0.86}`}
        stroke="#40382f"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      {/* Two limbs, at different heights and different lengths. */}
      <path
        d={`M ${w * 0.02} ${-h * 0.4} C ${w * 0.34} ${-h * 0.5}, ${w * 0.52} ${-h * 0.44}, ${w * 0.74} ${-h * 0.62}`}
        stroke="#40382f"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${-w * 0.04} ${-h * 0.62} C ${-w * 0.3} ${-h * 0.72}, ${-w * 0.36} ${-h * 0.84}, ${-w * 0.52} ${-h * 0.92}`}
        stroke="#40382f"
        strokeWidth={1.2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaves sit at careless angles, the way they do on a real stem. */}
      <ThenLeaf x={w * 0.42} y={-h * 0.5} width={34} rotation={-22} />
      <ThenLeaf x={w * 0.74} y={-h * 0.62} width={27} rotation={18} />
      <ThenLeaf x={-w * 0.34} y={-h * 0.79} width={30} rotation={-46} />
      <ThenLeaf x={w * 0.12} y={-h * 0.88} width={32} rotation={-8} />
      <ThenLeaf x={-w * 0.06} y={-h * 0.2} width={25} rotation={34} />
    </g>
  );
}

export function NowRoot({
  x,
  y,
  memories,
}: {
  x: number;
  y: number;
  memories: number;
}) {
  const scale = Math.min(1, 0.5 + memories * 0.12);
  const h = 250 * scale;
  const w = 210 * scale;

  return (
    <g transform={`translate(${x} ${y})`} opacity={0.62}>
      <path
        d={`M 0 0 L 0 ${-h * 0.88}`}
        stroke="#2d302f"
        strokeWidth={1}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M 0 ${-h * 0.44} Q ${-w * 0.16} ${-h * 0.52}, ${-w * 0.6} ${-h * 0.58}`}
        stroke="#2d302f"
        strokeWidth={0.9}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M 0 ${-h * 0.7} Q ${w * 0.14} ${-h * 0.78}, ${w * 0.42} ${-h * 0.84}`}
        stroke="#2d302f"
        strokeWidth={0.9}
        strokeLinecap="round"
        fill="none"
      />

      {/* The same leaf, ruled flat — NOW keeps its own hand. */}
      <NowLeaf x={0} y={-h * 0.88} width={14} rotation={0} />
      <NowLeaf x={-w * 0.6} y={-h * 0.58} width={12} rotation={-52} />
      <NowLeaf x={w * 0.42} y={-h * 0.84} width={12} rotation={38} />
      <NowLeaf x={0} y={-h * 0.26} width={10} rotation={12} />
    </g>
  );
}
