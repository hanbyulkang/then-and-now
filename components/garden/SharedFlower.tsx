"use client";

/**
 * The shared flower.
 *
 * Its two halves are quotations. The left petals are drawn by hand — a soft
 * rose form with a contour that wanders. The right petals are the same petal
 * redrawn as flat, ruled geometry in sage. Neither side owns the result, which
 * is the whole idea, and a flower is only ever rendered where a real connection
 * was found.
 *
 * The petals are drawn artwork; the fan, the variation and the bloom belong to
 * the code, so every flower is the same specimen arranged a little differently.
 */

const THEN_PETAL = "/assets/botanical/then/petal.svg";
const NOW_PETAL = "/assets/botanical/now/petal.svg";

/** Aspect of each source drawing, so a petal never distorts. */
const THEN_RATIO = 574 / 972;
const NOW_RATIO = 443 / 953;

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
  /* Deterministic tilt — a row of identical flowers would read as a chart. */
  const lean = -8 + ((variant * 37) % 17);
  const spread = 38 + ((variant * 13) % 9);

  const petalH = size * 0.46;
  const centre = Math.max(5, size * 0.15);

  const thenAngles = [-spread, -spread * 2.05, -spread * 3.1];
  const nowAngles = [spread, spread * 2.05, spread * 3.1];

  return (
    <span
      className="relative block"
      style={{
        width: size,
        height: size,
        transform: `scale(${bloom}) rotate(${lean}deg)`,
        transformOrigin: "center",
        transition: "transform 1200ms var(--ease-settle)",
      }}
      aria-hidden
    >
      {/* The warmth the flower sits in — light on the page, never a disc. */}
      <span
        className="absolute rounded-full"
        style={{
          inset: `-${size * (glow ? 0.14 : 0.06)}px`,
          background: "#b88379",
          opacity: (glow ? 0.13 : 0.07) * bloom,
          filter: `blur(${size * 0.26}px)`,
        }}
      />

      {[...thenAngles, ...nowAngles].map((angle, i) => {
        const isThen = i < thenAngles.length;
        const ratio = isThen ? THEN_RATIO : NOW_RATIO;
        return (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            src={isThen ? THEN_PETAL : NOW_PETAL}
            alt=""
            style={{
              position: "absolute",
              left: "50%",
              bottom: "50%",
              width: petalH * ratio,
              height: petalH,
              transformOrigin: "50% 100%",
              transform: `translateX(-50%) rotate(${angle}deg)`,
              opacity: bloom,
              transition: `opacity 700ms ease ${i * 60}ms`,
            }}
          />
        );
      })}

      {/* Where the two hands meet. */}
      <span
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: centre,
          height: centre,
          marginLeft: -centre / 2,
          marginTop: -centre / 2,
          background: "#c5a768",
          boxShadow: `0 0 0 ${Math.max(1, size * 0.018)}px #f7f4ec`,
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          left: "50%",
          top: "50%",
          width: centre * 0.44,
          height: centre * 0.44,
          marginLeft: (-centre * 0.44) / 2,
          marginTop: (-centre * 0.44) / 2,
          background: "#40382f",
        }}
      />
    </span>
  );
}
