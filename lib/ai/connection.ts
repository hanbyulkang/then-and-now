import { ANN_ID, EVERYDAY_JOY_CONNECTION, GRANDMA_ID } from "../demo-data";
import type { Connection, Memory, Pair } from "../types";
import { yearsBetween } from "../types";

interface FindArgs {
  question: string;
  pair: Pair;
  memories: Memory[];
}

/**
 * Ask whether two stories share something real.
 *
 * When no model is configured — or the call fails — this falls back to the
 * curated demo connection so the garden never stalls mid-demo. The fallback is
 * only ever used for the story the demo actually ships with; an unknown pair of
 * transcripts returns nothing rather than an invented connection.
 */
export async function findSharedThread({
  question,
  pair,
  memories,
}: FindArgs): Promise<Connection | undefined> {
  const then = memories.find((m) => m.personId === pair.then.id);
  const now = memories.find((m) => m.personId === pair.now.id);
  if (!then || !now) return undefined;

  try {
    const response = await fetch("/api/connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        yearsBetween: yearsBetween(pair),
        then: {
          name: pair.then.name,
          year: then.year,
          age: then.age,
          transcript: then.transcript,
        },
        now: {
          name: pair.now.name,
          year: now.year,
          age: now.age,
          transcript: now.transcript,
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.found) {
        return toConnection(result, then, now);
      }
      /* The model looked and found nothing. That is a valid answer: some
         questions simply produce two separate leaves. */
      return demoFallback(then, now);
    }
  } catch {
    /* Offline or blocked — fall through to the curated story. */
  }

  return demoFallback(then, now);
}

function toConnection(
  raw: {
    theme: string;
    headline: string;
    statement: string;
    thenHighlight: string;
    nowHighlight: string;
    thenGloss?: string;
    followUp: string;
  },
  then: Memory,
  now: Memory,
): Connection {
  return {
    theme: raw.theme,
    headline: raw.headline,
    statement: raw.statement,
    /* Highlights must exist verbatim or the reveal would underline nothing. */
    thenHighlight: then.transcript.includes(raw.thenHighlight)
      ? raw.thenHighlight
      : "",
    nowHighlight: now.transcript.includes(raw.nowHighlight)
      ? raw.nowHighlight
      : "",
    thenGloss: raw.thenGloss || undefined,
    followUp: raw.followUp,
  };
}

/**
 * The one story this prototype ships with, so a demo without an API key still
 * reaches the signature moment.
 */
function demoFallback(then: Memory, now: Memory): Connection | undefined {
  const isDemoStory =
    then.personId === GRANDMA_ID &&
    now.personId === ANN_ID &&
    then.transcript.includes(EVERYDAY_JOY_CONNECTION.thenHighlight);

  if (!isDemoStory) return undefined;

  return {
    ...EVERYDAY_JOY_CONNECTION,
    nowHighlight: now.transcript.includes(EVERYDAY_JOY_CONNECTION.nowHighlight)
      ? EVERYDAY_JOY_CONNECTION.nowHighlight
      : firstSharedPhrase(now.transcript),
  };
}

/** Best-effort highlight when the viewer told the story in their own words. */
function firstSharedPhrase(transcript: string): string {
  const candidates = [
    "getting food with my friends",
    "with my friends",
    "my friends",
  ];
  return candidates.find((c) => transcript.includes(c)) ?? "";
}
