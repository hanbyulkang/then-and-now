"use client";

/**
 * The shared flower.
 *
 * Its two halves are quotations: the rose petals are drawn in THEN's hand
 * (organic, tilted, soft-edged) and the sage panels in NOW's (geometric,
 * measured). Neither side owns the result — that is the whole idea. A flower is
 * only ever rendered where a real connection was found.
 *
 * At larger sizes it opens into the fuller form, with a second petal and a
 * second panel; small ones in the garden keep the simpler silhouette so a row
 * of them stays legible.
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
  const full = size >= 120;
  const c = 32;
  const id = `fl${variant}${full ? "f" : "s"}`;

  /* Deterministic tilts — a row of identical flowers would read as a chart. */
  const petalTilt = -46 + ((variant * 37) % 62);
  const panelTilt = 10 + ((variant * 23) % 34);
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
      <defs>
        <filter
          id={`${id}-glow`}
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
        >
          <feGaussianBlur stdDeviation={full ? 4 : 2} />
        </filter>
      </defs>

      <circle
        cx={c}
        cy={c}
        r={glow ? 26 : 22}
        fill="#b88379"
        fillOpacity={glow ? 0.26 * bloom : 0.11}
        filter={`url(#${id}-glow)`}
      >
        {glow ? (
          <animate
            attributeName="r"
            values="24;28;24"
            dur="6s"
            repeatCount="indefinite"
          />
        ) : null}
      </circle>

      {/* THEN — petals that lean. */}
      {full ? (
        <ellipse
          cx={36}
          cy={20}
          rx={12}
          ry={17}
          transform={`rotate(${petalTilt - 34} 36 20)`}
          fill="#a77d75"
          style={{ opacity: bloom, transition: "opacity 700ms ease" }}
        />
      ) : null}
      <ellipse
        cx={full ? 27 : 31.4}
        cy={full ? 27 : 23.6}
        rx={petalRx}
        ry={petalRy}
        transform={`rotate(${petalTilt} ${full ? 27 : 31.4} ${full ? 27 : 23.6})`}
        fill="#a77d75"
        style={{
          opacity: bloom,
          transition: "opacity 700ms ease 90ms",
        }}
      />

      {/* NOW — forms with corners, even when they are soft. */}
      <rect
        x={22}
        y={22}
        width={20}
        height={20}
        rx={4}
        transform={`rotate(${panelTilt} 32 32)`}
        fill="#9aaa94"
        stroke={full ? "#c5a768" : undefined}
        strokeWidth={full ? 0.6 : undefined}
        style={{
          opacity: bloom,
          transition: "opacity 700ms ease 180ms",
        }}
      />
      {full ? (
        <rect
          x={26}
          y={18}
          width={16}
          height={16}
          rx={2.6}
          transform={`rotate(${panelTilt + 32} 34 26)`}
          fill="#9aaa94"
          stroke="#c5a768"
          strokeWidth="0.6"
          style={{ opacity: bloom, transition: "opacity 700ms ease 260ms" }}
        />
      ) : null}

      {/* Where the two meet. */}
      {full ? (
        <circle
          cx={c}
          cy={c}
          r={8.4}
          fill="#c5a768"
          stroke="#fff"
          strokeWidth={1.1}
        />
      ) : null}
      <circle cx={c} cy={c} r={full ? 3.8 : 6} fill="#40382f" />
    </svg>
  );
}
