"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Field } from "@/components/garden/Field";
import { Garden as GardenPlot } from "@/components/garden/Garden";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { LeafButton, Panel, PanelLabel } from "@/components/ui/Panel";
import { useGarden } from "@/lib/state/garden-provider";
import { yearsBetween } from "@/lib/types";

/**
 * The garden.
 *
 * One painted field running the whole width — warm where her life is, cooling
 * into sage where yours is, and no line drawn between them anywhere.
 * Everything growing out of it is something the two of you have said. Today's
 * question stands in it as a small note laid on the grass, kept low enough that
 * the garden still reads behind it.
 */
export default function GardenPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-canvas" />}>
      <Garden />
    </Suspense>
  );
}

function Garden() {
  const router = useRouter();
  const { state, active, status, viewerHasAnswered, partnerHasAnswered } =
    useGarden();

  const pair = state.pair;
  const [asking, setAsking] = useState(false);
  const years = yearsBetween(pair);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <p className="flex items-baseline justify-center gap-3 bg-canvas pb-5 pt-6 text-center">
        <span className="font-serif text-[19px] text-then-ink md:text-[21px]">
          {pair.then.name} &amp; {pair.now.name}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-then-faded">
          · {years} years between you
        </span>
      </p>

      <Field className="min-h-[520px]">
        <div className="absolute inset-0">
          <GardenPlot
            state={state}
            questionAnswered={viewerHasAnswered}
            onOpenBloom={(id) => router.push(`/memory/${id}`)}
            onOpenQuestion={
              status !== "revealed" ? () => setAsking((v) => !v) : undefined
            }
          />
        </div>

        {/* Today's question, standing in the garden it belongs to. */}
        {status !== "revealed" ? (
          <div className="relative z-20 flex flex-1 items-center px-6 md:px-[8%]">
            <Panel className="w-full max-w-[300px]">
              <PanelLabel>Today&apos;s question</PanelLabel>
              <p className="mt-3 font-serif text-[19px] leading-snug text-then-ink md:text-[21px]">
                {active.question.text}
              </p>

              {status === "ready" ? (
                <>
                  <p className="mt-4 text-[12px] leading-relaxed text-then-faded">
                    Both stories are ready.
                  </p>
                  <LeafButton
                    className="mt-4"
                    onClick={() => router.push(`/reveal/${active.id}`)}
                  >
                    Reveal together →
                  </LeafButton>
                </>
              ) : viewerHasAnswered ? (
                <p className="mt-4 text-[12px] leading-relaxed text-then-faded">
                  You answered
                  <br />· Waiting for {pair.then.name}
                </p>
              ) : (
                <>
                  <p className="mt-4 text-[12px] leading-relaxed text-then-faded">
                    {partnerHasAnswered
                      ? `${pair.then.name} answered`
                      : "Nobody has answered yet"}
                    <br />· Waiting for you
                  </p>
                  <LeafButton
                    className="mt-4"
                    onClick={() => router.push("/today")}
                  >
                    Answer
                  </LeafButton>
                </>
              )}
            </Panel>
          </div>
        ) : null}

        {/* What the bud holds, when you go to the bud rather than to the note. */}
        {asking ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center px-6">
            <p
              className="max-w-[42ch] text-center font-serif text-[19px] italic leading-snug text-then-ink md:text-[22px]"
              style={{ textShadow: "0 0 18px #faf7f0, 0 0 34px #faf7f0" }}
            >
              &ldquo;{active.question.text}&rdquo;
            </p>
          </div>
        ) : null}
      </Field>

      <MobileNavSpacer />
    </div>
  );
}
