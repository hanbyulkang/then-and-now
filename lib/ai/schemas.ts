import { z } from "zod";

/**
 * What we ask a model for. Note what is *not* here: no confidence scores, no
 * similarity values, no rewritten prose. The model's only job is to notice
 * something two people already said, and to name it briefly.
 */

export const connectionSchema = z.object({
  found: z
    .boolean()
    .describe(
      "True only if there is a genuine shared thread. If the two stories are simply about the same topic, that is not enough — say false.",
    ),
  theme: z
    .string()
    .describe(
      'Two or three words naming the flower, title case. e.g. "Everyday Joy", "Leaving Home".',
    ),
  headline: z
    .string()
    .describe(
      'A short factual line about the distance between them, ending in a period. e.g. "52 years apart." or "Different cities."',
    ),
  statement: z
    .string()
    .describe(
      'A short line about what is shared, ending in a period. e.g. "Same kind of happiness." Never longer than six words.',
    ),
  thenHighlight: z
    .string()
    .describe(
      "An exact, verbatim substring copied from the older person's transcript. Must appear in it character for character.",
    ),
  nowHighlight: z
    .string()
    .describe(
      "An exact, verbatim substring copied from the younger person's transcript. Must appear in it character for character.",
    ),
  thenGloss: z
    .string()
    .describe(
      "If thenHighlight is not in English, a short parenthetical English gloss. Otherwise an empty string.",
    ),
  followUp: z
    .string()
    .describe(
      "One question this discovery opens up, addressed to the older person. It must reference something specific they actually said.",
    ),
});

export type ConnectionResult = z.infer<typeof connectionSchema>;

export const extractionSchema = z.object({
  people: z.array(z.string()),
  places: z.array(z.string()),
  times: z.array(z.string()).describe('Time references, e.g. "age 12", "1974".'),
  topics: z.array(z.string()),
  objects: z.array(z.string()),
  emotions: z.array(z.string()),
  unexplored: z
    .array(z.string())
    .describe(
      "Things mentioned but not opened up — the threads worth asking about next.",
    ),
});

export type ExtractionResult = z.infer<typeof extractionSchema>;

export const followUpSchema = z.object({
  candidates: z
    .array(
      z.object({
        question: z.string(),
        opens: z
          .string()
          .describe("The unexplored thread this question would open."),
      }),
    )
    .describe("Exactly three candidates."),
  chosen: z
    .number()
    .int()
    .describe("Index of the candidate that opens the newest thread."),
});
