"use client";

/**
 * A conversation that has not opened yet (spec §11: Bud).
 *
 * It breathes while it waits and warms once both stories are in — the only
 * thing about it that ever changes, because the waiting is the point.
 */

const RATIO = 559 / 466;

export function Bud({
  width = 40,
  /** Both stories are in: the bud is about to open. */
  ready = false,
  breathing = true,
  className = "",
}: {
  width?: number;
  ready?: boolean;
  breathing?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative block ${breathing ? "animate-breathe" : ""} ${className}`}
      style={{ width, height: width * RATIO }}
      aria-hidden
    >
      {ready ? (
        <span
          className="absolute rounded-full"
          style={{
            inset: `-${width * 0.34}px`,
            background: "#b88379",
            opacity: 0.18,
            filter: `blur(${width * 0.28}px)`,
          }}
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/botanical/shared/bud.svg"
        alt=""
        className="relative block size-full"
        style={{
          filter: ready ? "saturate(1.25) brightness(1.06)" : undefined,
          transition: "filter 900ms ease",
        }}
      />
    </span>
  );
}
