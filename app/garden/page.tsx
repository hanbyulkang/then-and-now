"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { AnswerOverlay } from "@/components/answer/AnswerOverlay";
import { GardenCanvas, type PlacedFlower } from "@/components/garden/GardenCanvas";
import { QuestionBud } from "@/components/garden/QuestionBud";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { gardenLine, gardenProgress } from "@/lib/garden-stage";
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
  const progress = useMemo(() => gardenProgress(state), [state]);
  const justBloomed = params.get("bloomed") ?? undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <header className="flex shrink-0 flex-col items-start px-5 pt-5 text-left md:items-center md:px-6 md:pt-6 md:text-center">
        <h1 className="font-serif text-[28px] text-then-ink md:text-[36px]">
          {pair.then.name} &amp; {pair.now.name}
        </h1>
        <p className="text-[13px] text-then-faded md:text-[14px]">
          {gardenLine(yearsBetween(pair), progress)}
        </p>
      </header>

      <GardenCanvas
        pair={pair}
        progress={progress}
        flowers={flowers}
        leaves={leaves}
        justBloomedId={justBloomed}
        onOpenFlower={(conversation) => router.push(`/memory/${conversation.id}`)}
      >
        {progress.stage === "dormant" ? (
          <p className="absolute inset-x-0 top-[10%] px-8 text-center font-serif text-[19px] italic text-then-faded md:text-[22px]">
            Every garden begins with a story.
          </p>
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
