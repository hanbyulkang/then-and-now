"use client";

/**
 * A voice, drawn. Bars are derived from the memory id so the same story always
 * looks the same — a waveform that reshuffles on every render reads as
 * decoration rather than as a recording.
 */

function hashed(seed: string, count: number, min: number, max: number) {
  let h = 2166136261;
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    h ^= seed.charCodeAt(i % seed.length) + i * 31;
    h = Math.imul(h, 16777619) >>> 0;
    bars.push(min + (h % 1000) / 1000 * (max - min));
  }
  return bars;
}

export function Waveform({
  seed,
  bars = 11,
  color,
  progress = 0,
  live = false,
  height = 64,
  className = "",
}: {
  seed: string;
  bars?: number;
  /** CSS colour for the bars. */
  color: string;
  /** 0–1. Bars past this point sit back. */
  progress?: number;
  /** Recording: bars move. */
  live?: boolean;
  height?: number;
  className?: string;
}) {
  const heights = hashed(seed, bars, height * 0.12, height * 0.88);

  return (
    <div
      className={`flex items-center gap-[4px] ${className}`}
      style={{ height }}
      aria-hidden
    >
      {heights.map((h, i) => {
        const played = progress > 0 && i / bars <= progress;
        return (
          <span
            key={i}
            className="w-[3px] shrink-0 rounded-[2px]"
            style={{
              height: h,
              background: color,
              opacity: live ? 1 : played ? 1 : progress > 0 ? 0.28 : 0.85,
              transformOrigin: "center",
              animation: live
                ? `wave-bar ${620 + (i % 5) * 130}ms ease-in-out ${i * 55}ms infinite`
                : undefined,
              transition: "opacity 160ms linear",
            }}
          />
        );
      })}
    </div>
  );
}
