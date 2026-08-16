"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookSpread } from "@/components/book/BookSpread";
import { FoldBloom } from "@/components/reveal/FoldBloom";
import { FollowUpBar } from "@/components/reveal/FollowUpBar";
import { StoryPage } from "@/components/reveal/StoryPage";
import { atLeast, useRevealSequence } from "@/components/reveal/phases";
import { Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import type { Connection } from "@/lib/types";
import { yearsBetween } from "@/lib/types";

/**
 * Reveal.
 *
 * The book is open at the page where the two of them wrote about the same day.
 * Hers on the left, hers on the right, and for the first few seconds nothing in
 * between — the human words have to land before anything comments on them.
 * Then two stems come up out of the pages, cross over the fold, and a flower
 * opens where they meet.
 */
export default function RevealPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { state, findConnection, markSeen, askFollowUp } = useGarden();

  const pair = state.pair;
  const conversation = state.conversations.find((c) => c.id === id);

  const [connection, setConnection] = useState<Connection | undefined>(
    conversation?.connection,
  );
  const [looked, setLooked] = useState(false);
  const [translated, setTranslated] = useState<Record<string, boolean>>({});

  /* Ask whether these two stories share anything before the sequence starts,
     so the stems never grow toward an empty middle. */
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

  const { phase } = useRevealSequence(Boolean(connection));

  useEffect(() => {
    if (atLeast(phase, "followUp")) markSeen(id);
  }, [phase, id, markSeen]);

  if (!conversation) {
    return (
      <div className="flex min-h-dvh flex-col bg-canvas">
        <Navigation />
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

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <p className="sr-only" aria-live="polite">
        {atLeast(phase, "statement") && connection
          ? `${connection.headline} ${connection.statement}`
          : "Both stories are open."}
      </p>

      <BookSpread
        left={
          thenMemory ? (
            <StoryPage
              person={pair.then}
              memory={thenMemory}
              highlight={connection?.thenHighlight}
              gloss={
                atLeast(phase, "highlightThen") ? connection?.thenGloss : undefined
              }
              highlightActive={atLeast(phase, "highlightThen")}
              showTranslation={Boolean(translated[thenMemory.id])}
              onToggleTranslation={() =>
                setTranslated((t) => ({
                  ...t,
                  [thenMemory.id]: !t[thenMemory.id],
                }))
              }
            />
          ) : (
            <span aria-hidden />
          )
        }
        right={
          nowMemory ? (
            <StoryPage
              person={pair.now}
              memory={nowMemory}
              highlight={connection?.nowHighlight}
              highlightActive={atLeast(phase, "highlightNow")}
              showTranslation={Boolean(translated[nowMemory.id])}
              onToggleTranslation={() =>
                setTranslated((t) => ({
                  ...t,
                  [nowMemory.id]: !t[nowMemory.id],
                }))
              }
            />
          ) : (
            <span aria-hidden />
          )
        }
        across={
          connection ? (
            <FoldBloom
              phase={phase}
              connection={connection}
              yearsApart={yearsBetween(pair)}
            />
          ) : null
        }
        atTheFold={
          connection ? (
            <FollowUpBar
              connection={connection}
              partnerName={pair.then.name}
              visible={atLeast(phase, "followUpBud")}
              questionVisible={atLeast(phase, "followUp")}
              onAsk={() => {
                askFollowUp(id);
                router.push(`/garden?bloomed=${id}`);
              }}
            />
          ) : looked ? (
            /* Nothing shared was found: two stories, kept side by side, and no
               invented flower between them. */
            <div className="flex flex-col items-center gap-3 px-6 pb-8 text-center md:pb-10">
              <p
                className="font-serif text-[19px] italic text-then-ink md:text-[22px]"
                style={{ textShadow: "0 0 18px #f2ece0" }}
              >
                Two stories, kept side by side.
              </p>
              <button
                type="button"
                onClick={() => {
                  markSeen(id);
                  router.push("/garden");
                }}
                className="text-[15px] font-semibold text-bloom-green underline-offset-8 hover:underline"
              >
                Back to the garden →
              </button>
            </div>
          ) : null
        }
      />
    </div>
  );
}
