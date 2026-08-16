import type { Cubic } from "./garden-layout";
import type { GardenState, Memory, Side } from "./types";
import { conversationStatus, personById } from "./types";

/**
 * How the garden grows.
 *
 * No level here, no score, no bar. The garden is made of what the two of them
 * have actually said: one plant for every story, one flower for everything they
 * turned out to share, one bud for every question still waiting. It gets fuller
 * because there is more of it, and that is the only way anyone is ever told how
 * far the two of them have come.
 *
 * The shared flowers stand in an arch across the whole book rather than in a
 * column up the binding — the first one they found highest and nearest the
 * middle, the rest fanning out and dropping away to either side. Each is fed by
 * two stems that come up out of the ground on opposite pages and meet under it.
 */

export const SCENE_WIDTH = 1440;
export const FOLD = SCENE_WIDTH / 2;

export interface Plant {
  id: string;
  side: Side;
  x: number;
  stem: Cubic;
  leaves: { t: number; size: number; flip: boolean }[];
  /** A story that was new to the other one opens, rather than just leafing. */
  flower?: { size: number; seed: number };
  /** A conversation that carried on: the stem divides. */
  branch?: Cubic;
  seed: number;
}

export interface Bloom {
  id: string;
  x: number;
  y: number;
  size: number;
  seed: number;
  theme: string;
  /** The two stems that came up to meet under it. */
  thenStem: Cubic;
  nowStem: Cubic;
}

export interface Sprout {
  id: string;
  x: number;
  y: number;
  stem: Cubic;
}

export interface Scene {
  height: number;
  ground: number;
  plants: Plant[];
  blooms: Bloom[];
  waiting?: Sprout;
  /** How full it is, 0–1. Never shown as a number; it only sets scale. */
  fullness: number;
  storyCount: number;
  discoveryCount: number;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Where the nth shared flower stands, fanning out from the middle. */
const FAN = [0, -0.19, 0.2, -0.34, 0.35, -0.11, 0.13, -0.45, 0.46];

export function growGarden(state: GardenState, height = 900): Scene {
  const { pair } = state;
  const GROUND = height - 58;

  const stemOf = (x: number, h: number, lean: number, wobble: number): Cubic => ({
    p0: { x, y: GROUND },
    p1: { x: x + wobble, y: GROUND - h * 0.34 },
    p2: { x: x + lean * 0.6 - wobble * 0.5, y: GROUND - h * 0.72 },
    p3: { x: x + lean, y: GROUND - h },
  });

  const stories: { memory: Memory; side: Side; conversationId: string }[] = [];
  for (const c of state.conversations) {
    for (const memory of Object.values(c.memories)) {
      stories.push({
        memory,
        side: personById(pair, memory.personId).side,
        conversationId: c.id,
      });
    }
  }
  stories.sort((a, b) => a.memory.createdAt.localeCompare(b.memory.createdAt));

  const total = stories.length;
  const fullness = Math.min(1, total / 20);

  /* Everything the two of them share, standing in an arch across the book. */
  const found = state.conversations.filter((c) => c.seen && c.connection);
  const crown = GROUND - (300 + fullness * 140);
  const blooms: Bloom[] = found.map((c, i) => {
    const seed = hash(c.id);
    const across = FAN[i % FAN.length];
    const x = FOLD + across * SCENE_WIDTH * 0.92;
    /* The arch: highest in the middle, dropping away to either side. */
    const y = crown + Math.abs(across) * 290 + (seed % 24);
    const size = 126 - Math.abs(across) * 84 - (seed % 8);

    /* Two stems, one out of each page, meeting under the flower. */
    const spread = 118 + (seed % 86);
    const rise = GROUND - y;
    return {
      id: c.id,
      x,
      y,
      size,
      seed,
      theme: c.connection?.theme ?? "",
      thenStem: {
        p0: { x: x - spread, y: GROUND },
        p1: { x: x - spread * 0.95, y: y + rise * 0.56 },
        p2: { x: x - spread * 0.42, y: y + rise * 0.17 },
        p3: { x: x - size * 0.15, y: y + size * 0.12 },
      },
      nowStem: {
        p0: { x: x + spread * 0.84, y: GROUND },
        p1: { x: x + spread * 0.8, y: y + rise * 0.58 },
        p2: { x: x + spread * 0.36, y: y + rise * 0.19 },
        p3: { x: x + size * 0.15, y: y + size * 0.16 },
      },
    };
  });

  /* One plant per story, on its teller's page. They fill in around the
     flowering stems rather than competing with them, so they stay low. */
  const perSide: Record<Side, number> = { then: 0, now: 0 };
  const plants: Plant[] = stories.map(({ memory, side, conversationId }) => {
    const i = perSide[side];
    perSide[side] += 1;
    const seed = hash(memory.id);

    const dir = side === "then" ? -1 : 1;
    const gap = Math.max(78, 176 - total * 3.6);
    const x = Math.min(
      SCENE_WIDTH - 64,
      Math.max(64, FOLD + dir * (104 + i * gap + (seed % 30))),
    );

    const age = total <= 1 ? 0.4 : 0.5 + (1 - i / Math.max(1, total)) * 0.5;
    const tall = (110 + fullness * 130) * age + (seed % 30);
    const lean = (seed % 2 ? -dir : dir) * (8 + (seed % 26));

    const leafCount =
      total <= 1 ? 0 : total <= 3 ? 2 : Math.min(5, 2 + Math.floor(total / 4));

    const conversation = state.conversations.find((c) => c.id === conversationId);
    const newToTheOther = memory.heardBefore === "never";
    const carriedOn = Boolean(conversation?.question.parentConversationId);

    return {
      id: memory.id,
      side,
      x,
      seed,
      stem: stemOf(x, tall, lean, dir * (10 + (seed % 18))),
      leaves: Array.from({ length: leafCount }, (_, j) => ({
        t: 0.24 + j * (0.64 / Math.max(1, leafCount)),
        size: 38 - j * 4 + (seed % 8),
        flip: (seed + j) % 2 === 0,
      })),
      flower: newToTheOther ? { size: 52 + (seed % 16), seed } : undefined,
      branch: carriedOn
        ? {
            p0: { x: x + lean * 0.5, y: GROUND - tall * 0.5 },
            p1: { x: x + lean * 0.5 + dir * 34, y: GROUND - tall * 0.68 },
            p2: { x: x + lean * 0.5 + dir * 48, y: GROUND - tall * 0.88 },
            p3: { x: x + lean * 0.5 + dir * 54, y: GROUND - tall * 1.08 },
          }
        : undefined,
    };
  });

  /* The question nobody has answered stands on the binding. */
  const active = state.conversations.find(
    (c) => c.id === state.activeConversationId,
  );
  const open = active && conversationStatus(active, pair) !== "revealed";
  const waitingHeight = 140 + fullness * 90;
  const waiting: Sprout | undefined =
    active && open
      ? {
          id: active.id,
          x: FOLD,
          y: GROUND - waitingHeight,
          stem: stemOf(FOLD, waitingHeight, 0, 14),
        }
      : undefined;

  return {
    height,
    ground: GROUND,
    plants,
    blooms,
    waiting,
    fullness,
    storyCount: total,
    discoveryCount: found.length,
  };
}
