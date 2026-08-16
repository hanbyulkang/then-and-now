"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaperSpread } from "@/components/garden/Field";
import { HeardBefore } from "@/components/reveal/HeardBefore";
import { Meeting } from "@/components/reveal/Meeting";
import { reached, useReveal } from "@/components/reveal/sequence";
import { BudMark } from "@/components/garden/Botanical";
import { FlowerMark } from "@/components/garden/Flower";
import { StorySide } from "@/components/story/StorySide";
import { TornDefs } from "@/components/story/TornPrint";
import { Navigation } from "@/components/nav/Navigation";
import { LeafButton, Panel, PanelLabel } from "@/components/ui/Panel";
import { seedOf } from "@/lib/botany";
import { useGarden } from "@/lib/state/garden-provider";
import type { Connection } from "@/lib/types";

/**
 * Two stories, opened together.
 *
 * Her page and yours, and between them — for the first few seconds — one closed
 * bud and nothing else, because the words have to land before anything comments
 * on them. Then two stems come up out of the pages and meet, and the flower
 * that opens is half of each of them.
 *
 * Afterwards there is one question, and it is not whether you liked it.
 */
export default function RevealPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { state, findConnection, markSeen, markHeard, askFollowUp } =
    useGarden();

  const pair = state.pair;
  const conversation = state.conversations.find((c) => c.id === id);
  const [connection, setConnection] = useState<Connection | undefined>(
    conversation?.connection,
  );
  const [looked, setLooked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    findConnection(id).then((found) => {
      if (cancelled) return;
      setConnection(found);
      setLooked(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const beat = useReveal(looked);

  useEffect(() => {
    if (reached(beat, "asked")) markSeen(id);
  }, [beat, id, markSeen]);

  if (!conversation) {
    return (
      <div className="flex min-h-dvh flex-col bg-canvas">
        <Navigation />
      <TornDefs />
        <main className="flex flex-1 items-center justify-center p-8">
          <p className="font-memory text-[20px] italic text-then-faded">
            This page is still waiting for its first story.
          </p>
        </main>
      </div>
    );
  }

  const thenMemory = conversation.memories[pair.then.id];
  const nowMemory = conversation.memories[pair.now.id];
  const done = reached(beat, "asked") || (looked && !connection);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <p className="sr-only" aria-live="polite">
        {reached(beat, "words") && connection
          ? `${connection.headline} ${connection.statement}`
          : "Both stories are open."}
      </p>

      <PaperSpread className="min-h-[560px]">
        {connection ? (
          <Meeting
            beat={beat}
            seed={seedOf(id)}
            theme={connection.theme}
            headline={connection.headline}
            statement={connection.statement}
          />
        ) : null}

        <div className="relative z-20 grid flex-1 grid-cols-1 items-center gap-10 px-6 pb-4 pt-10 md:grid-cols-[1fr_minmax(280px,32%)_1fr] md:gap-4 md:px-[4%]">
          {thenMemory ? (
            <StorySide
              person={pair.then}
              memory={thenMemory}
              highlight={connection?.thenHighlight}
              highlightActive={reached(beat, "catchThen")}
              gloss={reached(beat, "catchThen") ? connection?.thenGloss : undefined}
            />
          ) : (
            <span aria-hidden />
          )}

          {/* On a phone the meeting happens between the two stories rather
              than across the whole page: the same bud, the same flower, the
              same words, standing in the gap where the two of them meet. */}
          <div className="flex flex-col items-center gap-3 py-2 text-center md:hidden">
            {connection && reached(beat, "bloom") ? (
              <>
                <FlowerMark size={168} seed={seedOf(id)} />
                <p className="font-serif text-[14px] italic text-bloom-gold">
                  {connection.theme}
                </p>
                <p className="font-serif text-[20px] italic leading-snug text-then-ink">
                  {connection.headline}
                  <br />
                  {connection.statement}
                </p>
              </>
            ) : (
              <span className="flex size-[84px] items-center justify-center rounded-full border border-bloom-gold/40 bg-[#fbf8f1] shadow-[0_8px_24px_rgba(64,56,47,0.08)]">
                <svg width="42" height="52" viewBox="-21 -48 42 52" aria-hidden>
                  <BudMark x={0} y={0} length={46} />
                </svg>
              </span>
            )}
          </div>

          <span className="max-md:hidden" aria-hidden />

          {nowMemory ? (
            <StorySide
              person={pair.now}
              memory={nowMemory}
              align="right"
              highlight={connection?.nowHighlight}
              highlightActive={reached(beat, "catchNow")}
            />
          ) : (
            <span aria-hidden />
          )}
        </div>

        {/* What this opened, and the one question worth asking after it. */}
        {done ? (
          <div className="relative z-20 flex justify-center px-6 pb-8">
            <Panel className="animate-rise-in flex w-full max-w-[360px] flex-col items-center gap-3 text-center">
              {thenMemory ? (
                <HeardBefore
                  name={pair.then.name}
                  answer={thenMemory.heardBefore}
                  onAnswer={(value) => markHeard(thenMemory.id, value)}
                />
              ) : null}

              {connection ? (
                <>
                  <PanelLabel>A conversation waiting to bloom</PanelLabel>
                  <p className="font-serif text-[17px] italic leading-snug text-then-ink md:text-[19px]">
                    {connection.followUp}
                  </p>
                  <LeafButton
                    onClick={() => {
                      askFollowUp(id);
                      router.push("/garden");
                    }}
                  >
                    Ask {pair.then.name} →
                  </LeafButton>
                </>
              ) : (
                <LeafButton
                  onClick={() => {
                    markSeen(id);
                    router.push("/garden");
                  }}
                >
                  Back to the garden
                </LeafButton>
              )}
            </Panel>
          </div>
        ) : null}
      </PaperSpread>
    </div>
  );
}
