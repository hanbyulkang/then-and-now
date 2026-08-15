"use client";

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

      <ellipse cx={w * 0.42} cy={-h * 0.5} rx={14} ry={6.4} fill="#7c876a" transform={`rotate(-22 ${w * 0.42} ${-h * 0.5})`} />
      <ellipse cx={w * 0.74} cy={-h * 0.62} rx={11} ry={5.2} fill="#7c876a" transform={`rotate(18 ${w * 0.74} ${-h * 0.62})`} />
      <ellipse cx={-w * 0.34} cy={-h * 0.79} rx={12} ry={5.6} fill="#7c876a" transform={`rotate(-46 ${-w * 0.34} ${-h * 0.79})`} />
      <ellipse cx={w * 0.12} cy={-h * 0.88} rx={13} ry={6} fill="#7c876a" transform={`rotate(-8 ${w * 0.12} ${-h * 0.88})`} />
      <ellipse cx={-w * 0.06} cy={-h * 0.2} rx={10} ry={4.6} fill="#7c876a" transform={`rotate(34 ${-w * 0.06} ${-h * 0.2})`} />
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

      <rect x={-6} y={-h * 0.88 - 6} width={12} height={12} rx={6} fill="#9aaa94" />
      <rect x={-w * 0.6 - 5} y={-h * 0.58 - 5} width={10} height={10} rx={4} fill="#9aaa94" transform={`rotate(45 ${-w * 0.6} ${-h * 0.58})`} />
      <rect x={w * 0.42 - 5} y={-h * 0.84 - 5} width={10} height={10} rx={4} fill="#9aaa94" transform={`rotate(15 ${w * 0.42} ${-h * 0.84})`} />
      <rect x={-4} y={-h * 0.26 - 4} width={8} height={8} rx={3} fill="#9aaa94" />
    </g>
  );
}
