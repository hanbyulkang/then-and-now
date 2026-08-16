"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { BudMark } from "@/components/garden/Botanical";
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

      <Field className="min-h-[560px] md:min-h-[520px]">
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

        {/* When both are in, the garden stops and says so in the middle of it. */}
        {status === "ready" ? (
          <div className="pointer-events-none relative z-20 flex flex-1 items-center justify-center px-6">
            <Panel className="pointer-events-auto flex w-full max-w-[280px] flex-col items-center gap-4 py-8 text-center">
              <svg width="56" height="66" viewBox="-28 -62 56 66" aria-hidden>
                <BudMark x={0} y={0} length={58} />
              </svg>
              <p className="font-serif text-[19px] text-then-ink md:text-[21px]">
                Both stories are ready.
              </p>
              <LeafButton onClick={() => router.push(`/reveal/${active.id}`)}>
                Reveal together →
              </LeafButton>
            </Panel>
          </div>
        ) : status !== "revealed" ? (
          <div className="pointer-events-none relative z-20 flex flex-1 items-start px-5 pt-5 md:items-center md:px-[8%] md:pt-0">
            <Panel className="pointer-events-auto w-full max-w-[300px]">
              <PanelLabel>Today&apos;s question</PanelLabel>
              <p className="mt-3 font-serif text-[19px] leading-snug text-then-ink md:text-[21px]">
                {active.question.text}
              </p>

              {viewerHasAnswered ? (
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
