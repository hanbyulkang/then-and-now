"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { AnswerOverlay } from "@/components/answer/AnswerOverlay";
import {
  GeometricSeedling,
  OrganicSeedling,
} from "@/components/botanical/Seedling";
import { GardenCanvas, type PlacedFlower } from "@/components/garden/GardenCanvas";
import { QuestionBud } from "@/components/garden/QuestionBud";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { BLOSSOMS } from "@/lib/garden-tree";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf, loneLeaves, yearsBetween } from "@/lib/types";

/**
 * 05 / 10 — The Garden.
 *
 * There is no dashboard in this product: the garden is home, and everything
 * else is reached from it.
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
  const {
    state,
    active,
    status,
    viewerHasAnswered,
    partnerHasAnswered,
    addMemory,
  } = useGarden();
  const [answering, setAnswering] = useState(false);

  const pair = state.pair;
  const flowers = useMemo<PlacedFlower[]>(() => {
    /* Newest discovery takes the crown of the tree, so the garden reads as
       growing rather than as a list. */
    const found = [...flowersOf(state)].reverse();
    return found.slice(0, BLOSSOMS.length).map((conversation, index) => ({
      conversation,
      index,
    }));
  }, [state]);

  const leaves = useMemo(() => loneLeaves(state), [state]);
  const young = flowers.length === 0;
  const justBloomed = params.get("bloomed") ?? undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <header className="flex shrink-0 flex-col items-start px-5 pt-5 text-left md:items-center md:px-6 md:pt-6 md:text-center">
        <h1 className="font-serif text-[28px] text-then-ink md:text-[36px]">
          {pair.then.name} &amp; {pair.now.name}
        </h1>
        <p className="text-[13px] uppercase tracking-wide text-then-faded md:text-[14px]">
          {yearsBetween(pair)} years between you
          {flowers.length > 0
            ? ` • ${flowers.length} shared ${flowers.length === 1 ? "story" : "stories"}`
            : null}
        </p>
      </header>

      <GardenCanvas
        pair={pair}
        flowers={flowers}
        leaves={leaves}
        justBloomedId={justBloomed}
        onOpenFlower={(conversation) => router.push(`/memory/${conversation.id}`)}
      >
        {/* A garden with nothing in it yet names its two seedlings, so the
            emptiness reads as a beginning rather than as a missing state. */}
        {young ? (
          <>
            <figure className="absolute bottom-[6%] left-[4%] hidden w-[280px] flex-col items-start gap-4 md:flex">
              <figcaption className="flex flex-col gap-2">
                <span className="font-serif text-[22px] italic text-then-ink">
                  {pair.then.name}&apos;s seedling
                </span>
                <span className="text-[12px] text-then-faded">
                  Originated in {pair.then.city}, 1974
                </span>
              </figcaption>
              <OrganicSeedling height={170} />
            </figure>

            <figure className="absolute bottom-[6%] right-[4%] hidden w-[280px] flex-col items-end gap-4 md:flex">
              <figcaption className="flex flex-col items-end gap-2">
                <span className="text-[18px] font-medium text-now-charcoal">
                  {pair.now.name}&apos;s seedling
                </span>
                <span className="text-[12px] text-now-slate">
                  {pair.now.city}, 2026
                </span>
              </figcaption>
              <GeometricSeedling height={170} />
            </figure>
          </>
        ) : null}

        <div className="absolute inset-x-0 bottom-[3%] flex justify-center px-5">
          <QuestionBud
            question={active.question}
            pair={pair}
            status={status}
            viewerAnswered={viewerHasAnswered}
            partnerAnswered={partnerHasAnswered}
            onAnswer={() => setAnswering(true)}
            onReveal={() => router.push(`/reveal/${active.id}`)}
          />
        </div>
      </GardenCanvas>

      <MobileNavSpacer />

      {answering ? (
        <AnswerOverlay
          question={active.question}
          pair={pair}
          onClose={() => setAnswering(false)}
          onSaved={(memory) => {
            addMemory(active.id, { ...memory, conversationId: active.id });
            window.setTimeout(() => setAnswering(false), 2200);
          }}
        />
      ) : null}
    </div>
  );
}
