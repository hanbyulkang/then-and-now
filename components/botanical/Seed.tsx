"use client";

/**
 * A seed with a root that only appears when the viewer reaches for the button
 * above it (spec §8). Nothing has been planted yet, so the root is a promise
 * rather than a state.
 */
export function Seed({ rooting }: { rooting: boolean }) {
  return (
    <svg
      width="14"
      height="46"
      viewBox="0 0 14 46"
      fill="none"
      aria-hidden
      className="overflow-visible"
    >
      <path
        d="M7 18c0 6-2.6 8.5-3.6 12.4C2.5 34 3.4 38 7 42"
        stroke="#c5a768"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: rooting ? 0 : 1,
          transition: "stroke-dashoffset 1.6s var(--ease-organic)",
          opacity: 0.75,
        }}
      />
      <path
        d="M7 22c1.4 4.2 3.8 5.6 5 9.4"
        stroke="#c5a768"
        strokeWidth="0.85"
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: rooting ? 0 : 1,
          transition: "stroke-dashoffset 1.3s var(--ease-organic) 260ms",
          opacity: 0.55,
        }}
      />
      <ellipse
        cx="7"
        cy="9"
        rx="6"
        ry="9"
        fill="#c5a768"
        className={rooting ? undefined : "animate-seed-pulse"}
        style={{ transformOrigin: "7px 9px" }}
      />
    </svg>
  );
}
