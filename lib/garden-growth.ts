import type { Cubic } from "./garden-layout";
import type { GardenState, Memory, Side } from "./types";
import { conversationStatus, personById } from "./types";

/**
 * How the garden grows.
 *
 * There is no level here, no score and no bar. The garden is simply made of
 * what the two of them have actually said: one plant for every story, one
 * flower for everything they turned out to share, one bud for every question
 * still waiting. It gets fuller because there is more of it, and that is the
 * only way anyone is ever told how far the two of them have come.
 *
 * Her plants come up on her page and hers on hers. As it fills, the ones
 * furthest along start leaning over the binding into the other's page, until
 * the line down the middle of the book is the only thing still keeping them
 * apart.
 */

/**
 * The garden is drawn in units 1440 wide. How tall it is follows the shape of
 * the book on screen, so the drawing is never stretched to fit — a stretched
 * flower is an oval, and an oval is not a drawing anybody made.
 */
export const SCENE_WIDTH = 1440;
export const FOLD = SCENE_WIDTH / 2;

export interface Plant {
  id: string;
  side: Side;
  /** Where it comes out of the ground. */
  x: number;
  stem: Cubic;
  /** Its own memories, as leaves along the stem. */
  leaves: { t: number; size: number; flip: boolean }[];
  /** A story that was new to the other one opens instead of just leafing. */
  flower?: { size: number; seed: number };
  /** A question asked off this story and not yet answered. */
  bud?: { t: number };
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
  /** The two stems that grew toward each other to get here. */
  thenStem: Cubic;
  nowStem: Cubic;
}

export interface Sprout {
  /** Today's question, standing where the next story will come up. */
  id: string;
  x: number;
  y: number;
  stem: Cubic;
}

export interface Scene {
  /** Height of the drawing, in the same units as its width. */
  height: number;
  /** Where everything stands. */
  ground: number;
  /** 0 closed, 1 fully open and lying split at the foot of the binding. */
  seedOpen: number;
  plants: Plant[];
  blooms: Bloom[];
  /** The unanswered question, if there is one. */
  waiting?: Sprout;
  /** How full it is, 0–1. Nothing is ever labelled with this; it sets scale. */
  fullness: number;
  storyCount: number;
  discoveryCount: number;
}

/** Deterministic per-id jitter, so a garden looks the same every time. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function growGarden(state: GardenState, height = 900): Scene {
  const { pair } = state;
  const GROUND = height - 64;

  const stemOf = (x: number, h: number, lean: number, wobble: number): Cubic => ({
    p0: { x, y: GROUND },
    p1: { x: x + wobble, y: GROUND - h * 0.36 },
    p2: { x: x + lean * 0.55 - wobble * 0.6, y: GROUND - h * 0.72 },
    p3: { x: x + lean, y: GROUND - h },
  });

  /* Every story anyone has told, oldest first. */
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

  /* One plant per story. The first ones stand near the binding and later ones
     spread outward, so the garden fills from the middle of the book. */
  const perSide: Record<Side, number> = { then: 0, now: 0 };
  const plants: Plant[] = stories.map(({ memory, side, conversationId }) => {
    const i = perSide[side];
    perSide[side] += 1;
    const seed = hash(memory.id);

    const dir = side === "then" ? -1 : 1;
    const gap = Math.max(74, 168 - total * 3.4);
    /* Kept inside the page: a plant half off the edge reads as a mistake. */
    const x = Math.min(
      SCENE_WIDTH - 70,
      Math.max(70, FOLD + dir * (128 + i * gap + (seed % 26))),
    );

    /* Older plants are taller — they have had longer to grow. */
    const age = total <= 1 ? 0.34 : 0.44 + (1 - i / Math.max(1, total)) * 0.56;
    const tall = (120 + fullness * 180) * age + (seed % 34);

    /* Once the garden is full the outermost plants lean back over the fold. */
    const crossing = total >= 10 && i < 2;
    const lean = crossing
      ? -dir * (60 + (seed % 70))
      : (seed % 2 ? -dir : dir) * (6 + (seed % 30));

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
      stem: stemOf(x, tall, lean, dir * (14 + (seed % 22))),
      leaves: Array.from({ length: leafCount }, (_, j) => ({
        t: 0.26 + j * (0.62 / Math.max(1, leafCount)),
        size: 48 - j * 5 + (seed % 9),
        flip: (seed + j) % 2 === 0,
      })),
      flower: newToTheOther
        ? { size: 44 + (seed % 14), seed }
        : undefined,
      branch: carriedOn
        ? {
            p0: { x: x + lean * 0.5, y: GROUND - tall * 0.55 },
            p1: { x: x + lean * 0.5 + dir * 40, y: GROUND - tall * 0.72 },
            p2: { x: x + lean * 0.5 + dir * 56, y: GROUND - tall * 0.9 },
            p3: { x: x + lean * 0.5 + dir * 62, y: GROUND - tall * 1.06 },
          }
        : undefined,
    };
  });

  /* Everything the two of them turned out to share opens on the binding, and
     the two stems that reach it come in from either page. */
  const found = state.conversations.filter((c) => c.seen && c.connection);
  const blooms: Bloom[] = found.map((c, i) => {
    const seed = hash(c.id);
    const y = GROUND - 210 - i * 152 - (seed % 18);
    const size = 124 - i * 10;
    const reach = 150 + (seed % 60);
    return {
      id: c.id,
      x: FOLD + (i % 2 === 0 ? -6 : 8),
      y,
      size,
      seed,
      theme: c.connection?.theme ?? "",
      thenStem: {
        p0: { x: FOLD - reach, y: GROUND - 40 },
        p1: { x: FOLD - reach * 0.86, y: y + 170 },
        p2: { x: FOLD - reach * 0.34, y: y + 54 },
        p3: { x: FOLD - size * 0.24, y: y + 8 },
      },
      nowStem: {
        p0: { x: FOLD + reach, y: GROUND - 40 },
        p1: { x: FOLD + reach * 0.86, y: y + 176 },
        p2: { x: FOLD + reach * 0.34, y: y + 58 },
        p3: { x: FOLD + size * 0.24, y: y + 12 },
      },
    };
  });

  /* The question nobody has answered yet stands on the binding as a bud. */
  const active = state.conversations.find(
    (c) => c.id === state.activeConversationId,
  );
  const open = active && conversationStatus(active, pair) !== "revealed";
  const waiting: Sprout | undefined =
    active && open
      ? {
          id: active.id,
          x: FOLD,
          y: GROUND - (150 + fullness * 120),
          stem: stemOf(FOLD, 150 + fullness * 120, 0, 16),
        }
      : undefined;

  return {
    height,
    ground: GROUND,
    seedOpen: total === 0 ? 0 : total === 1 ? 0.55 : 1,
    plants,
    blooms,
    waiting,
    fullness,
    storyCount: total,
    discoveryCount: found.length,
  };
}
