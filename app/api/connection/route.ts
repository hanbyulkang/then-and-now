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

Read both. Is there something real they share — the same feeling, the same need,
the same shape of an experience, the same small human habit?

Two people who answered the same question honestly usually do share something,
even when the surface details have nothing in common: different food, different
city, different decade, same feeling underneath. Say so when that is the case.

What counts is a feeling, a need, or a relationship — not an activity and not a
personality trait. "They were both patient." "They both did slow, careful work."
"They were both young." Those are true of almost anyone, and a flower built on
one is a lie the family will see through. Two stories standing side by side with
nothing between them is a perfectly good outcome here; say so plainly.

If there is: name the feeling in two or three words, write one line about the
distance between them and one line about what is the same, and copy the exact
phrase from each transcript where you saw it, character for character.

The two lines are read one after the other, alone on screen, by someone who has
just finished reading both stories. They already know what was said. So do not
restate it. "52 years apart. / Same kind of happiness." is right.
"52 years apart. / Both enjoyed eating with friends after school." is wrong —
it explains what the reader just read, which makes the moment smaller.

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
