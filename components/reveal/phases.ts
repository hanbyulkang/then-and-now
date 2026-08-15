"use client";

import { useEffect, useState } from "react";

/**
 * The pacing of the reveal.
 *
 * The first beat is silence: both stories sit on screen with nothing drawn
 * between them, because the human words have to land before anything comments
 * on them (spec §16). Everything after that is the bloom, timed to the 4–6
 * seconds the design calls for.
 */
export const PHASES = [
  "stories",
  "highlightThen",
  "highlightNow",
  "branches",
  "meet",
  "bloom",
  "headline",
  "statement",
  "theme",
  "followUpBud",
  "followUp",
] as const;

export type RevealPhase = (typeof PHASES)[number];

/** Milliseconds from the start of the reveal. */
const SCHEDULE: Record<RevealPhase, number> = {
  stories: 0,
  highlightThen: 2600,
  highlightNow: 3300,
  branches: 3900,
  meet: 5400,
  bloom: 5800,
  headline: 6500,
  statement: 7300,
  theme: 7900,
  followUpBud: 8500,
  followUp: 9000,
};

export function atLeast(phase: RevealPhase, target: RevealPhase): boolean {
  return PHASES.indexOf(phase) >= PHASES.indexOf(target);
}

export function useRevealSequence(enabled: boolean) {
  const [phase, setPhase] = useState<RevealPhase>("stories");

  useEffect(() => {
    if (!enabled) return;

    /* Reduced motion still tells the whole story — it just stops moving. */
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timers = PHASES.slice(1).map((name, index) =>
      window.setTimeout(
        () => setPhase(name),
        reduced ? 220 * (index + 1) : SCHEDULE[name],
      ),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [enabled]);

  /** Lets an impatient viewer jump to the end without breaking the order. */
  const skipToEnd = () => setPhase("followUp");

  return { phase, skipToEnd };
}
