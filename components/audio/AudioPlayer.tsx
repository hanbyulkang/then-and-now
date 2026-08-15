"use client";

import { useEffect, useRef, useState } from "react";
import type { Memory, Side } from "@/lib/types";
import { Waveform } from "./Waveform";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * The original recording, always offered before the transcript.
 *
 * A real file plays when one exists (anything the viewer just recorded). The
 * seeded demo memories have no audio file, so playback runs on a clock instead
 * — the transcript beneath is the substance either way.
 */
export function AudioPlayer({
  memory,
  side,
  label,
  compact = false,
}: {
  memory: Memory;
  side: Side;
  label?: string;
  /** The archive shows a single quiet line rather than a player panel. */
  compact?: boolean;
}) {
  const src = memory.localAudioUrl;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const duration = memory.durationSec || 1;
  const ink = side === "then" ? "#40382f" : "#2d302f";

  useEffect(() => {
    if (!playing) return;

    if (src && audioRef.current) {
      const el = audioRef.current;
      el.play().catch(() => setPlaying(false));
      const onTime = () => setElapsed(el.currentTime);
      const onEnd = () => {
        setPlaying(false);
        setElapsed(0);
      };
      el.addEventListener("timeupdate", onTime);
      el.addEventListener("ended", onEnd);
      return () => {
        el.removeEventListener("timeupdate", onTime);
        el.removeEventListener("ended", onEnd);
        el.pause();
      };
    }

    const started = Date.now() - elapsed * 1000;
    const timer = window.setInterval(() => {
      const next = (Date.now() - started) / 1000;
      if (next >= duration) {
        setPlaying(false);
        setElapsed(0);
      } else {
        setElapsed(next);
      }
    }, 120);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, src, duration]);

  const player = (
    <>
      {src ? <audio ref={audioRef} src={src} preload="metadata" /> : null}

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={
          playing
            ? "Pause"
            : label ?? `Play the original recording (${formatTime(duration)})`
        }
        className={`flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 ${
          compact ? "size-7" : "size-[40px]"
        }`}
        style={{ background: ink }}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <rect x="2" y="1" width="3.5" height="12" rx="1" fill="#fff" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="#fff" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M3.5 1.6 12 7 3.5 12.4Z" fill="#fff" />
          </svg>
        )}
      </button>
    </>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {player}
        <span className="text-[12px] text-now-slate">
          {playing
            ? `Playing · ${formatTime(elapsed)}`
            : "Play original audio recording"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-[12px] p-4 ${
        side === "then" ? "bg-white/25" : "bg-white/45"
      }`}
    >
      {player}

      <Waveform
        seed={memory.id}
        color={ink}
        progress={playing || elapsed > 0 ? elapsed / duration : 0}
        className="flex-1"
      />

      <span
        className="shrink-0 text-[13px] tabular-nums"
        style={{ color: ink }}
      >
        {formatTime(playing || elapsed > 0 ? elapsed : duration)}
      </span>
    </div>
  );
}
