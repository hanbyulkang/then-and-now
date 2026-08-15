import type { GardenState } from "./types";
import { flowersOf } from "./types";

/**
 * How far the garden has come.
 *
 * The whole relationship starts enclosed in one seed. It does not open because
 * enough things have been filed into it — it opens when the two of them turn
 * out to share something, which is the only event in this product that has ever
 * meant anything. Counting stories moves the shell; only a discovery breaks it.
 */
export type Stage =
  /** Nothing said yet. The seed is closed, and two traces sleep inside it. */
  | "dormant"
  /** Someone has spoken. A hairline crack, and one leaf finding the light. */
  | "stirring"
  /** Stories are accumulating. Roots and stems escape the shell. */
  | "opening"
  /** They found something they share. The shell gives way and a tree rises. */
  | "grown";

export interface GardenProgress {
  stage: Stage;
  stories: number;
  discoveries: number;
  /** 0–1. How far the shell has come apart. */
  opened: number;
}

export function gardenProgress(state: GardenState): GardenProgress {
  const stories = state.conversations.reduce(
    (total, c) => total + Object.keys(c.memories).length,
    0,
  );
  const discoveries = flowersOf(state).length;

  const stage: Stage =
    discoveries > 0
      ? "grown"
      : stories >= 3
        ? "opening"
        : stories >= 1
          ? "stirring"
          : "dormant";

  const opened =
    stage === "grown"
      ? 1
      : stage === "opening"
        ? 0.52
        : stage === "stirring"
          ? 0.2
          : 0;

  return { stage, stories, discoveries, opened };
}

/** "52 years apart · 18 stories · 7 things discovered together" */
export function gardenLine(
  years: number,
  { stories, discoveries }: GardenProgress,
): string {
  const parts = [`${years} years apart`];
  if (stories > 0) {
    parts.push(`${stories} ${stories === 1 ? "story" : "stories"}`);
  }
  if (discoveries > 0) {
    parts.push(
      `${discoveries} ${discoveries === 1 ? "thing" : "things"} discovered together`,
    );
  }
  return parts.join(" · ");
}
