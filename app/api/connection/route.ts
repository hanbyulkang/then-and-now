import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { HOUSE_RULES, hasModelAccess, model } from "@/lib/ai/model";
import { connectionSchema } from "@/lib/ai/schemas";

export const maxDuration = 60;

interface Body {
  question: string;
  then: { name: string; year: number; age: number; transcript: string };
  now: { name: string; year: number; age: number; transcript: string };
  yearsBetween: number;
}

/**
 * Looks for something two people already share. Returns 503 when no model is
 * configured so the client can fall back without treating it as an error.
 */
export async function POST(request: Request) {
  if (!hasModelAccess()) {
    return NextResponse.json(
      { reason: "no-model-configured" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as Body;

  try {
    const { output } = await generateText({
      model: model(),
      output: Output.object({ schema: connectionSchema }),
      system: HOUSE_RULES,
      prompt: `Two people answered the same question, ${body.yearsBetween} years apart.

QUESTION
${body.question}

${body.then.name.toUpperCase()} — ${body.then.year}, age ${body.then.age}
"${body.then.transcript}"

${body.now.name.toUpperCase()} — ${body.now.year}, age ${body.now.age}
"${body.now.transcript}"

Read both. Is there something real they share — not the same subject, but the same
feeling, the same shape of an experience, the same small human habit?

If there is, name it in two or three words, write one line about the distance
between them and one line about what is the same, and copy the exact phrase from
each transcript where you saw it. Copy those phrases character for character; do
not paraphrase or shorten them.

Then write one question for ${body.then.name} that this discovery opens up, about
something specific they mentioned.`,
    });

    if (!output.found) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json(output);
  } catch (error) {
    console.error("[connection]", error);
    return NextResponse.json({ reason: "model-error" }, { status: 502 });
  }
}
