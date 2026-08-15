"use client";

/**
 * The shared flower.
 *
 * Its two halves are quotations: the rose ellipse is drawn in THEN's hand
 * (organic, tilted, soft-edged) and the sage square in NOW's (geometric,
 * measured). Neither side owns the result — that is the whole idea. A flower is
 * only ever rendered where a real connection was found.
 */
export function SharedFlower({
  size = 64,
  /** Stable per-flower variation so the same memory always looks the same. */
  variant = 0,
  bloom = 1,
  glow = false,
}: {
  size?: number;
  variant?: number;
  bloom?: number;
  glow?: boolean;
}) {
  const s = size / 64;
  const c = 32;

  /* Deterministic tilts — a row of identical flowers would read as a chart. */
  const petalTilt = -45 + ((variant * 37) % 60);
  const squareTilt = 10 + ((variant * 23) % 35);
  const petalRx = 10 + (variant % 3);
  const petalRy = 16 + (variant % 4);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className="overflow-visible"
      aria-hidden
      style={{
        transform: `scale(${bloom})`,
        transformOrigin: "center",
        transition: "transform 1200ms var(--ease-settle)",
      }}
    >
      {glow ? (
        <circle cx={c} cy={c} r={24} fill="#b88379" fillOpacity={0.25 * bloom}>
          <animate
            attributeName="r"
            values="22;26;22"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
      ) : (
        <circle cx={c} cy={c} r={22} fill="#b88379" fillOpacity={0.1} />
      )}

      {/* THEN — a petal that leans. */}
      <ellipse
        cx={31.4}
        cy={23.6}
        rx={petalRx}
        ry={petalRy}
        transform={`rotate(${petalTilt} 31.4 23.6)`}
        fill="#a77d75"
        style={{
          opacity: bloom,
          transition: "opacity 700ms ease",
        }}
      />

      {/* NOW — a form with corners, even when it is soft. */}
      <rect
        x={22}
        y={22}
        width={20}
        height={20}
        rx={4}
        transform={`rotate(${squareTilt} 32 32)`}
        fill="#9aaa94"
        style={{
          opacity: bloom,
          transition: "opacity 700ms ease 180ms",
        }}
      />

      {/* Where the two meet. */}
      {size >= 72 ? (
        <circle
          cx={c}
          cy={c}
          r={9}
          fill="#c5a768"
          stroke="#fff"
          strokeWidth={1.6 / s}
        />
      ) : null}
      <circle cx={c} cy={c} r={size >= 72 ? 4.4 : 6} fill="#40382f" />
    </svg>
  );
}
