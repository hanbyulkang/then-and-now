import { createAnthropic } from "@ai-sdk/anthropic";

/**
 * The AI boundary. Everything that needs a model goes through here, so a
 * missing key is a single, well-understood condition rather than a crash
 * scattered across route handlers.
 */

export const AI_MODEL_ID = process.env.AI_MODEL ?? "claude-sonnet-5";

export function hasModelAccess(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function model() {
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  return anthropic(AI_MODEL_ID);
}

/**
 * The house style for every generated line in this product. Kept in one place
 * because the tone is a product decision, not a per-prompt one.
 */
export const HOUSE_RULES = `You work behind a product called Then & Now, where two people from
different generations answer the same question and then read each other's answers.

Rules you never break:
- You do not rewrite, polish, summarise, or improve anyone's words. The original transcript is the story.
- You never judge whose life was better, harder, or more meaningful.
- You never claim an emotion you cannot point to in what someone actually said.
- Your own writing is short. Two lines at most, six words each. Long explanatory sentences are wrong here.
- You never use the words: AI, semantic, analysis, insight, match, similarity, confidence, detected, generated.
- If the two answers are merely about the same subject but do not share anything real, you say so plainly instead of inventing a connection.`;
