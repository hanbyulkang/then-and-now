"use client";

import { useEffect, useState } from "react";

/**
 * The pacing of the reveal.
 *
 * The first beat is silence: both stories sit there with nothing drawn between
 * them, because the human words have to land before anything comments on them.
 * Everything after that is one continuous movement — a phrase on each side
 * catches, two stems grow toward the binding, they meet, and a flower opens.
 */
export const BEATS = [
  "stories",
  "catchThen",
  "catchNow",
  "growing",
  "meeting",
  "bloom",
  "name",
  "words",
  "asked",
] as const;

export type Beat = (typeof BEATS)[number];

const AT: Record<Beat, number> = {
  stories: 0,
  catchThen: 2800,
  catchNow: 3600,
  growing: 4400,
  meeting: 6200,
  bloom: 6800,
  name: 7600,
  words: 8400,
  asked: 9600,
};

export function reached(beat: Beat, target: Beat): boolean {
  return BEATS.indexOf(beat) >= BEATS.indexOf(target);
}

export function useReveal(enabled: boolean) {
  const [beat, setBeat] = useState<Beat>("stories");

  useEffect(() => {
    if (!enabled) return;
    /* Reduced motion still tells the whole story — it just stops moving. */
    const quick = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = BEATS.slice(1).map((name, i) =>
      window.setTimeout(() => setBeat(name), quick ? 200 * (i + 1) : AT[name]),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [enabled]);

  return beat;
}
