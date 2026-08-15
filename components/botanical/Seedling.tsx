"use client";

import { NowLeaf, ThenLeaf } from "@/components/garden/Leaf";

/**
 * A person's root — everything they have told so far grows from here.
 *
 * The two seedlings are drawn in different hands on purpose: THEN leans and
 * wanders, NOW is measured. That difference is the product's whole thesis, so
 * it lives in the geometry rather than in a colour swap.
 */

export function OrganicSeedling({
  height = 180,
  growth = 1,
  className = "",
}: {
  height?: number;
  /** 0–1. How far the stem has grown in. */
  growth?: number;
  className?: string;
}) {
  const w = 64;

  return (
    <svg
      width={w}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      fill="none"
      className={`overflow-visible ${className}`}
      aria-hidden
    >
      {/* A stem that never quite goes straight up. */}
      <path
        d={`M32 ${height} C 30 ${height * 0.72}, 36 ${height * 0.55}, 31 ${height * 0.33} S 30 ${height * 0.14}, 32 4`}
        stroke="#40382f"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1 - growth,
          transition: "stroke-dashoffset 2.2s var(--ease-organic)",
        }}
      />
      {/* Upper leaf, tipped back the way a real one settles. */}
      <g
        style={{
          opacity: growth > 0.85 ? 1 : 0,
          transition: "opacity 600ms ease 1.4s",
        }}
      >
        <ThenLeaf x={20} y={10} width={34} rotation={-15} />
      </g>
      {/* Lower leaf, smaller, on the other side. */}
      <g
        style={{
          opacity: growth > 0.5 ? 1 : 0,
          transition: "opacity 600ms ease 900ms",
        }}
      >
        <ThenLeaf x={44} y={height * 0.42} width={24} rotation={35} />
      </g>
    </svg>
  );
}

export function GeometricSeedling({
  height = 180,
  growth = 1,
  className = "",
}: {
  height?: number;
  growth?: number;
  className?: string;
}) {
  const w = 24;

  return (
    <svg
      width={w}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      fill="none"
      className={`overflow-visible ${className}`}
      aria-hidden
    >
      <line
        x1="12"
        y1={height - 4}
        x2="12"
        y2="10"
        stroke="#9aaa94"
        strokeWidth="1"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1 - growth,
          transition: "stroke-dashoffset 2.2s var(--ease-settle)",
        }}
      />
      <g
        style={{
          opacity: growth > 0.85 ? 1 : 0,
          transition: "opacity 600ms ease 1.4s",
        }}
      >
        <NowLeaf x={12} y={9} width={14} rotation={0} />
      </g>
      <g
        style={{
          opacity: growth > 0.2 ? 1 : 0,
          transition: "opacity 600ms ease 300ms",
        }}
      >
        <NowLeaf x={12} y={height - 6} width={10} rotation={18} />
      </g>
    </svg>
  );
}
