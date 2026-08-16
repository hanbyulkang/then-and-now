"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BookSpread } from "@/components/book/BookSpread";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { FoldBloom } from "@/components/reveal/FoldBloom";
import { FollowUpBar } from "@/components/reveal/FollowUpBar";
import { StoryPage } from "@/components/reveal/StoryPage";
import { useGarden } from "@/lib/state/garden-provider";
import { yearsBetween } from "@/lib/types";

/**
 * A shared memory, kept.
 *
 * The same spread as the reveal, at rest: the stems already crossed, the flower
 * already open. You can come back to this page any time and it is exactly where
 * you left it.
 */
export default function SharedMemoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { state, askFollowUp } = useGarden();
  const [translated, setTranslated] = useState<Record<string, boolean>>({});

  const pair = state.pair;
  const conversation = state.conversations.find((c) => c.id === id);
  const connection = conversation?.connection;

  if (!conversation || !connection) {
    return (
      <div className="flex min-h-dvh flex-col bg-canvas">
        <Navigation />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="font-memory text-[20px] italic text-then-faded">
            This page is still waiting for its first story.
          </p>
          <Link
            href="/garden"
            className="text-[15px] font-semibold text-bloom-green underline-offset-8 hover:underline"
          >
            Back to the garden →
          </Link>
        </main>
      </div>
    );
  }

  const thenMemory = conversation.memories[pair.then.id];
  const nowMemory = conversation.memories[pair.now.id];
  const index = state.conversations.indexOf(conversation);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookSpread
        left={
          thenMemory ? (
            <StoryPage
              person={pair.then}
              memory={thenMemory}
              highlight={connection.thenHighlight}
              gloss={connection.thenGloss}
              highlightActive
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
              highlight={connection.nowHighlight}
              highlightActive
              showTranslation={Boolean(translated[nowMemory.id])}
              onToggleTranslation={() =>
                setTranslated((t) => ({
                  ...t,
                  [nowMemory.id]: !t[nowMemory.id],
                }))
              }
            />
          ) : (
            <div className="relative z-20 flex flex-1 flex-col items-end justify-center gap-4 p-8 text-right md:p-16">
              <p className="text-[11px] uppercase tracking-[0.32em] text-now-slate">
                Now
              </p>
              <p className="max-w-[28ch] text-[19px] leading-relaxed text-now-charcoal">
                {pair.now.name} hasn&apos;t told this one yet.
              </p>
            </div>
          )
        }
        across={
          <FoldBloom
            phase="followUp"
            connection={connection}
            yearsApart={yearsBetween(pair)}
            variant={index}
          />
        }
        atTheFold={
          <FollowUpBar
            connection={connection}
            partnerName={pair.then.name}
            visible
            questionVisible
            onAsk={() => {
              askFollowUp(conversation.id);
              router.push("/garden");
            }}
          />
        }
      />

      <MobileNavSpacer />
    </div>
  );
}
