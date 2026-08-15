"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BloomSequence } from "@/components/reveal/BloomSequence";
import { FollowUpBar } from "@/components/reveal/FollowUpBar";
import { StoryPanel } from "@/components/reveal/StoryPanel";
import { atLeast, useRevealSequence } from "@/components/reveal/phases";
import { Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import type { Connection } from "@/lib/types";
import { yearsBetween } from "@/lib/types";

/**
 * 08 / 09 — Reveal.
 *
 * Both stories first, on their own, in their own visual worlds. Only once
 * they have been read does anything grow between them.
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
     so the branches never grow toward an empty middle. */
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
            That conversation isn&apos;t in your garden.
          </p>
        </main>
      </div>
    );
  }

  const thenMemory = conversation.memories[pair.then.id];
  const nowMemory = conversation.memories[pair.now.id];
  const bloomStarted = Boolean(connection) && atLeast(phase, "branches");

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <p className="sr-only" aria-live="polite">
        {atLeast(phase, "statement") && connection
          ? `${connection.headline} ${connection.statement}`
          : "Both stories are open."}
      </p>

      <main className="flex flex-1 flex-col md:flex-row md:items-stretch">
        {thenMemory ? (
          <StoryPanel
            person={pair.then}
            memory={thenMemory}
            compact={bloomStarted}
            highlight={connection?.thenHighlight}
            gloss={connection?.thenGloss}
            highlightActive={atLeast(phase, "highlightThen")}
            showTranslation={Boolean(translated[thenMemory.id])}
            onToggleTranslation={() =>
              setTranslated((t) => ({
                ...t,
                [thenMemory.id]: !t[thenMemory.id],
              }))
            }
          />
        ) : null}

        {/* The shared space. On desktop it opens out between the two columns as
            the branches grow; on mobile it sits between them so the comparison
            still reads top to bottom (spec §33). */}
        <div
          className="relative order-2 shrink-0 self-stretch border-y border-black/5 transition-[width] duration-[900ms] ease-[var(--ease-settle)] max-md:!w-full md:order-none md:border-x md:border-y-0"
          style={{ width: bloomStarted ? "min(42vw, 480px)" : "1px" }}
        >
          <div className="relative mx-auto h-[440px] w-full max-w-[440px] py-6 md:absolute md:inset-y-0 md:left-1/2 md:h-full md:w-[min(42vw,480px)] md:max-w-none md:-translate-x-1/2 md:py-0">
            {connection ? (
              <div
                className="h-full w-full"
                style={{
                  opacity: bloomStarted ? 1 : 0,
                  transition: "opacity 700ms ease",
                }}
              >
                <BloomSequence
                  phase={phase}
                  connection={connection}
                  yearsApart={yearsBetween(pair)}
                />
              </div>
            ) : null}
          </div>

          {/* Until something is found, the divider is only a divider —
              a small pressed mark on the seam (node 08). */}
          <span
            className="absolute left-1/2 top-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bloom-gold bg-canvas"
            aria-hidden
            style={{
              opacity: bloomStarted ? 0 : 1,
              transition: "opacity 500ms ease",
            }}
          >
            <span className="block size-4 rounded-full bg-bloom-rose" />
          </span>
        </div>

        {nowMemory ? (
          <StoryPanel
            person={pair.now}
            memory={nowMemory}
            compact={bloomStarted}
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
        ) : null}
      </main>

      {/* Nothing shared was found: two stories, two leaves, no invented flower. */}
      {looked && !connection ? (
        <footer className="border-t border-black/5 bg-then-paper px-6 py-5 text-center md:px-12">
          <p className="font-memory text-[17px] italic text-then-ink">
            Two separate memories, kept side by side.
          </p>
          <button
            type="button"
            onClick={() => {
              markSeen(id);
              router.push("/garden");
            }}
            className="mt-3 rounded-[20px] bg-then-ink px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Back to the garden
          </button>
        </footer>
      ) : null}

      {connection ? (
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
      ) : null}
    </div>
  );
}
