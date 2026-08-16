"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { BookSpread, PageHead } from "@/components/book/BookSpread";
import { Bud } from "@/components/botanical/Bud";
import {
  GardenCanvas,
  type PlacedFlower,
} from "@/components/garden/GardenCanvas";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { gardenProgress } from "@/lib/garden-stage";
import { BLOSSOMS } from "@/lib/garden-tree";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf, loneLeaves, yearsBetween } from "@/lib/types";

/**
 * The garden.
 *
 * One spread: her page on the left, yours on the right, and the thing the two
 * of you are growing coming up through the fold between them. Nothing about
 * today's question is a panel — it stands at the foot of the book, where you
 * would find a note left in the gutter.
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
  const params = useSearchParams();
  const { state, active, status, viewerHasAnswered, partnerHasAnswered } =
    useGarden();

  const pair = state.pair;
  const flowers = useMemo<PlacedFlower[]>(() => {
    /* Newest discovery takes the crown of the tree. */
    const found = [...flowersOf(state)].reverse();
    return found
      .slice(0, BLOSSOMS.length)
      .map((conversation, index) => ({ conversation, index }));
  }, [state]);

  const leaves = useMemo(() => loneLeaves(state), [state]);
  const progress = useMemo(() => gardenProgress(state), [state]);
  const justBloomed = params.get("bloomed") ?? undefined;
  const years = yearsBetween(pair);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookSpread
        across={
          <GardenCanvas
            pair={pair}
            progress={progress}
            flowers={flowers}
            leaves={leaves}
            justBloomedId={justBloomed}
            onOpenFlower={(conversation) =>
              router.push(`/memory/${conversation.id}`)
            }
          />
        }
        left={
          <div className="pointer-events-none relative z-20 flex flex-1 flex-col gap-10 p-8 md:p-14">
            <PageHead side="then" eyebrow="Then" name={pair.then.name} />

            {/* Her page. What is on it is never shown before yours is. */}
            {partnerHasAnswered ? (
              <div className="flex max-w-[30ch] flex-col gap-4">
                <p
                  className="font-serif text-[19px] italic leading-relaxed text-then-ink md:text-[22px]"
                  style={{ textShadow: "0 0 10px #e8ddc8, 0 0 22px #e8ddc8, 0 0 38px #e8ddc8" }}
                >
                  {pair.then.name} has left a story here.
                </p>
                <Bud width={30} />
                <p
                  className="text-[13px] leading-relaxed text-then-faded"
                  style={{ textShadow: "0 0 10px #e8ddc8, 0 0 24px #e8ddc8" }}
                >
                  {viewerHasAnswered
                    ? "You can open them together."
                    : "It stays closed until yours is beside it."}
                </p>
              </div>
            ) : (
              <p className="max-w-[28ch] font-serif text-[19px] italic leading-relaxed text-then-faded md:text-[21px]">
                Her page is still waiting.
              </p>
            )}
          </div>
        }
        right={
          <div className="pointer-events-none relative z-20 flex flex-1 flex-col items-end gap-10 p-8 text-right md:p-14">
            <PageHead
              side="now"
              eyebrow="Now"
              name={pair.now.name}
              className="items-end"
            />

            {viewerHasAnswered ? (
              <p
                className="max-w-[30ch] text-[17px] leading-relaxed text-now-slate md:text-[19px]"
                style={{ textShadow: "0 0 10px #f7f4ec, 0 0 22px #f7f4ec, 0 0 38px #f7f4ec" }}
              >
                Your story is on this page.
              </p>
            ) : (
              <div className="flex max-w-[30ch] flex-col items-end gap-4">
                <p
                  className="text-[17px] leading-relaxed text-now-charcoal md:text-[19px]"
                  style={{ textShadow: "0 0 10px #f7f4ec, 0 0 22px #f7f4ec, 0 0 38px #f7f4ec" }}
                >
                  Your page is still waiting.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/today")}
                  className="pointer-events-auto text-[15px] font-medium text-bloom-green underline-offset-8 transition-colors hover:text-then-sage hover:underline"
                >
                  Tell your story →
                </button>
              </div>
            )}
          </div>
        }
        atTheFold={
          <div className="flex flex-col items-center gap-3 px-6 pb-8 text-center md:pb-10">
            {progress.stage === "dormant" ? (
              <>
                <p
                  className="font-serif text-[19px] italic text-then-faded md:text-[22px]"
                  style={{ textShadow: "0 0 18px #f7f4ec" }}
                >
                  Every garden begins with a story.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/today")}
                  className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-sage hover:underline"
                >
                  Plant your first story →
                </button>
              </>
            ) : status === "ready" ? (
              <>
                <p
                  className="font-serif text-[21px] italic text-then-ink md:text-[24px]"
                  style={{ textShadow: "0 0 18px #f7f4ec, 0 0 32px #f7f4ec" }}
                >
                  Two stories are ready.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(`/reveal/${active.id}`)}
                  className="text-[15px] font-semibold text-bloom-rose underline-offset-8 transition-colors hover:underline"
                >
                  Open them together →
                </button>
              </>
            ) : (
              <p
                className="max-w-[34ch] text-[12px] uppercase tracking-[0.22em] text-then-faded"
                style={{ textShadow: "0 0 16px #f7f4ec" }}
              >
                {pair.then.name} &amp; {pair.now.name} · {years} years between you
              </p>
            )}
          </div>
        }
      />

      <MobileNavSpacer />
    </div>
  );
}
