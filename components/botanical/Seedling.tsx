"use client";

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
      <ellipse
        cx="20"
        cy="10"
        rx="12"
        ry="6"
        fill="#7c876a"
        transform="rotate(-15 20 10)"
        style={{
          opacity: growth > 0.85 ? 1 : 0,
          transition: "opacity 600ms ease 1.4s",
        }}
      />
      {/* Lower leaf, smaller, on the other side. */}
      <ellipse
        cx="42"
        cy={height * 0.42}
        rx="8"
        ry="4"
        fill="#7c876a"
        transform={`rotate(35 42 ${height * 0.42})`}
        style={{
          opacity: growth > 0.5 ? 1 : 0,
          transition: "opacity 600ms ease 900ms",
        }}
      />
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
      <rect
        x="6"
        y="4"
        width="12"
        height="12"
        rx="6"
        fill="#9aaa94"
        style={{
          opacity: growth > 0.85 ? 1 : 0,
          transition: "opacity 600ms ease 1.4s",
        }}
      />
      <rect
        x="8"
        y={height - 8}
        width="8"
        height="8"
        rx="4"
        fill="#9aaa94"
        style={{
          opacity: growth > 0.2 ? 1 : 0,
          transition: "opacity 600ms ease 300ms",
        }}
      />
    </svg>
  );
}
