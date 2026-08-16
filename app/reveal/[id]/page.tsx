"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookSpread } from "@/components/book/BookSpread";
import { HeardBefore } from "@/components/reveal/HeardBefore";
import { Meeting } from "@/components/reveal/Meeting";
import { reached, useReveal } from "@/components/reveal/sequence";
import { MemoryPage } from "@/components/story/MemoryPage";
import { Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import type { Connection } from "@/lib/types";

/**
 * Two stories, opened together.
 *
 * Her page, your page, and for the first few seconds nothing at all in between
 * — the words have to land before anything comments on them. Then two stems
 * come up out of the pages and meet on the binding, and a flower opens that is
 * half of each of them.
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
  const seed = id.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <p className="sr-only" aria-live="polite">
        {reached(beat, "words") && connection
          ? `${connection.headline} ${connection.statement}`
          : "Both stories are open."}
      </p>

      <BookSpread
        className="min-h-[620px]"
        left={
          thenMemory ? (
            <div className="relative z-20 flex flex-1 flex-col justify-center p-7 md:py-14 md:pl-16 md:pr-[clamp(90px,13vw,200px)]">
              <MemoryPage
                person={pair.then}
                memory={thenMemory}
                highlight={connection?.thenHighlight}
                highlightActive={reached(beat, "catchThen")}
                gloss={
                  reached(beat, "catchThen") ? connection?.thenGloss : undefined
                }
              />
            </div>
          ) : (
            <span aria-hidden />
          )
        }
        right={
          nowMemory ? (
            <div className="relative z-20 flex flex-1 flex-col justify-center p-7 md:py-14 md:pl-[clamp(90px,13vw,200px)] md:pr-16">
              <MemoryPage
                person={pair.now}
                memory={nowMemory}
                align="right"
                highlight={connection?.nowHighlight}
                highlightActive={reached(beat, "catchNow")}
              />
            </div>
          ) : (
            <span aria-hidden />
          )
        }
        across={
          connection ? (
            <Meeting
              beat={beat}
              seed={seed}
              theme={connection.theme}
              headline={connection.headline}
              statement={connection.statement}
            />
          ) : null
        }
        atTheFold={
          reached(beat, "asked") || (looked && !connection) ? (
            <div className="flex max-w-[46ch] flex-col items-center gap-6 px-6 pb-8 md:pb-11">
              {/* Whether or not anything was found, you just heard her. */}
              {thenMemory ? (
                <HeardBefore
                  name={pair.then.name}
                  answer={thenMemory.heardBefore}
                  onAnswer={(value) => markHeard(thenMemory.id, value)}
                />
              ) : null}

              {connection ? (
                <button
                  type="button"
                  onClick={() => {
                    askFollowUp(id);
                    router.push("/garden");
                  }}
                  className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
                  style={{ textShadow: "0 0 16px #f2ece0" }}
                >
                  A conversation is waiting to bloom →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    markSeen(id);
                    router.push("/garden");
                  }}
                  className="text-[15px] font-semibold text-bloom-green underline-offset-8 hover:underline"
                  style={{ textShadow: "0 0 16px #f2ece0" }}
                >
                  Back to the garden →
                </button>
              )}
            </div>
          ) : null
        }
      />
    </div>
  );
}
