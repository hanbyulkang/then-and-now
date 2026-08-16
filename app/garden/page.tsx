"use client";

import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { BookSpread, PageHead } from "@/components/book/BookSpread";
import { Garden as GardenPlot } from "@/components/garden/Garden";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { yearsBetween } from "@/lib/types";

/**
 * The garden.
 *
 * One spread — her page, your page, and the thing the two of you are growing
 * coming up through the fold between them. Nothing about today's question is a
 * panel over the top of it: the question is a bud standing in the garden, and
 * you open it by going to it.
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
  const storyCount = state.conversations.reduce(
    (n, c) => n + Object.keys(c.memories).length,
    0,
  );
  const years = yearsBetween(pair);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <p className="flex items-baseline justify-center gap-3 bg-canvas pb-4 pt-6 text-center">
        <span className="font-serif text-[18px] text-then-ink md:text-[20px]">
          {pair.now.name} &amp; {pair.then.name}
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-then-faded">
          · {years} years between you
        </span>
      </p>

      <BookSpread
        className="min-h-[560px]"
        across={
          <GardenPlot
            state={state}
            questionAnswered={viewerHasAnswered}
            onOpenBloom={(id) => router.push(`/memory/${id}`)}
            onOpenQuestion={() => setAsking((v) => !v)}
          />
        }
        left={
          <div className="pointer-events-none relative z-20 flex flex-1 flex-col p-8 md:p-12">
            <PageHead side="then" eyebrow="Then" name={pair.then.name} />
          </div>
        }
        right={
          <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-end p-8 text-right md:p-12">
            <PageHead
              side="now"
              eyebrow="Now"
              name={pair.now.name}
              className="items-end"
            />
          </div>
        }
        atTheFold={
          /* What the bud is holding, opened where it stands. */
          asking ? (
            <div className="max-w-[46ch] px-6 pb-8 text-center md:pb-12">
              <p
                className="text-[11px] uppercase tracking-[0.28em] text-then-faded"
                style={{ textShadow: "0 0 14px #f2ece0" }}
              >
                Today&apos;s question
              </p>
              <p
                className="mt-3 font-serif text-[21px] italic leading-snug text-then-ink md:text-[26px]"
                style={{ textShadow: "0 0 18px #f2ece0, 0 0 34px #f2ece0" }}
              >
                &ldquo;{active.question.text}&rdquo;
              </p>

              {status === "ready" ? (
                <>
                  <p
                    className="mt-4 text-[14px] text-then-faded"
                    style={{ textShadow: "0 0 14px #f2ece0" }}
                  >
                    Two stories are ready.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push(`/reveal/${active.id}`)}
                    className="mt-1 text-[15px] font-semibold text-bloom-rose underline-offset-8 hover:underline"
                  >
                    Open them together →
                  </button>
                </>
              ) : viewerHasAnswered ? (
                <p
                  className="mt-4 text-[14px] text-then-faded"
                  style={{ textShadow: "0 0 14px #f2ece0" }}
                >
                  Your story is here. {pair.then.name}&apos;s is still coming.
                </p>
              ) : (
                <>
                  {partnerHasAnswered ? (
                    <p
                      className="mt-4 text-[14px] leading-relaxed text-then-faded"
                      style={{ textShadow: "0 0 14px #f2ece0" }}
                    >
                      {pair.then.name} has left a story here.
                      <br />
                      Yours is still waiting.
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => router.push("/today")}
                    className="mt-2 text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
                  >
                    Tell your story →
                  </button>
                </>
              )}
            </div>
          ) : storyCount === 0 ? (
            <div className="px-6 pb-8 text-center md:pb-12">
              <p
                className="font-serif text-[19px] italic text-then-faded md:text-[22px]"
                style={{ textShadow: "0 0 18px #f2ece0" }}
              >
                Every garden begins with a story.
              </p>
            </div>
          ) : null
        }
      />

      <MobileNavSpacer />
    </div>
  );
}
