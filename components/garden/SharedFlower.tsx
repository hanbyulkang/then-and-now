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

      {/* THEN — petals that lean. Proportions follow the drawn flower in the
          design file, where the rose reads as two overlapping strokes rather
          than one mass. */}
      {full ? (
        <ellipse
          cx={33.9}
          cy={17.5}
          rx={10.7}
          ry={15.5}
          transform={`rotate(${petalTilt} 33.9 17.5)`}
          fill="#a77d75"
          style={{ opacity: bloom, transition: "opacity 700ms ease" }}
        />
      ) : null}
      <ellipse
        cx={full ? 25.6 : 31.4}
        cy={full ? 25.6 : 23.6}
        rx={full ? 9.6 : petalRx}
        ry={full ? 14.3 : petalRy}
        transform={`rotate(${full ? petalTilt + 60 : petalTilt} ${full ? 25.6 : 31.4} ${full ? 25.6 : 23.6})`}
        fill="#a77d75"
        style={{
          opacity: bloom,
          transition: "opacity 700ms ease 90ms",
        }}
      />

      {/* NOW — forms with corners, even when they are soft. */}
      <rect
        x={full ? 23.9 : 22}
        y={full ? 27.6 : 22}
        width={full ? 16.2 : 20}
        height={full ? 16.2 : 20}
        rx={full ? 2.6 : 4}
        transform={`rotate(${full ? panelTilt + 35 : panelTilt} 32 ${full ? 35.7 : 32})`}
        fill="#9aaa94"
        stroke={full ? "#c5a768" : undefined}
        strokeWidth={full ? 0.5 : undefined}
        style={{
          opacity: bloom,
          transition: "opacity 700ms ease 180ms",
        }}
      />
      {full ? (
        <rect
          x={22.9}
          y={19.2}
          width={13.9}
          height={13.9}
          rx={1.7}
          transform={`rotate(${panelTilt} 29.8 26.1)`}
          fill="#9aaa94"
          stroke="#c5a768"
          strokeWidth="0.5"
          style={{ opacity: bloom, transition: "opacity 700ms ease 260ms" }}
        />
      ) : null}

      {/* Where the two meet. */}
      {full ? (
        <circle
          cx={c}
          cy={c}
          r={5.4}
          fill="#c5a768"
          stroke="#fff"
          strokeWidth={0.72}
        />
      ) : null}
      <circle cx={c} cy={c} r={full ? 2.4 : 6} fill="#40382f" />
    </svg>
  );
}
