"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SharedFlower } from "@/components/garden/SharedFlower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { StoryPanel } from "@/components/reveal/StoryPanel";
import { useGarden } from "@/lib/state/garden-provider";

/**
 * 13 — Shared Memory Detail.
 *
 * The same composition as the reveal, at rest. Both people keep their own
 * column and their own words; the flower between them is the only thing
 * neither of them said alone.
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
            Nothing has bloomed here yet.
          </p>
          <Link
            href="/garden"
            className="rounded-[20px] bg-bloom-green px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Back to the garden
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

      <main className="flex flex-1 flex-col md:flex-row md:items-stretch">
        {thenMemory ? (
          <StoryPanel
            person={pair.then}
            memory={thenMemory}
            compact={false}
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
        ) : null}

        <div className="relative order-2 flex shrink-0 items-start justify-center border-y border-black/5 py-12 md:order-none md:w-[320px] md:border-x md:border-y-0 md:py-0">
          {/* The seam the flower grew on. */}
          <span
            className="absolute inset-y-0 left-1/2 hidden w-px bg-bloom-gold/60 md:block"
            aria-hidden
          />
          <div className="relative flex w-[280px] flex-col items-center gap-5 md:mt-[120px]">
            <SharedFlower size={180} variant={index} glow />
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-[14px] font-semibold uppercase tracking-wide text-bloom-gold">
                Theme
              </p>
              <h1 className="font-serif text-[30px] leading-[1.1] text-then-ink md:text-[32px]">
                {connection.theme}
              </h1>
              <p className="font-memory text-[17px] italic leading-snug text-bloom-rose md:text-[18px]">
                &ldquo;{connection.headline} {connection.statement}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {nowMemory ? (
          <StoryPanel
            person={pair.now}
            memory={nowMemory}
            compact={false}
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
          <section className="flex flex-1 flex-col justify-center gap-4 bg-now-canvas p-8 md:p-16">
            <p className="text-[14px] font-semibold text-now-slate">NOW</p>
            <p className="font-memory text-[19px] italic leading-relaxed text-now-charcoal">
              {pair.now.name} hasn&apos;t answered this one yet.
            </p>
          </section>
        )}
      </main>

      <footer className="flex flex-col items-start gap-4 border-t border-bloom-gold bg-then-paper px-6 py-5 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="flex items-center gap-4">
          <svg
            width="24"
            height="32"
            viewBox="0 0 24 32"
            fill="none"
            aria-hidden
            className="shrink-0 animate-breathe"
          >
            <ellipse
              cx="12"
              cy="16"
              rx="11"
              ry="15"
              fill="#e6d6b4"
              stroke="#c5a768"
              strokeWidth="1"
            />
          </svg>
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-bloom-rose">
              Continue this conversation
            </p>
            <p className="font-memory text-[16px] text-then-ink">
              &ldquo;{connection.followUp}&rdquo;
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            askFollowUp(conversation.id);
            router.push("/garden");
          }}
          className="shrink-0 rounded-[20px] bg-then-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-then-faded"
        >
          Reflect Together →
        </button>
      </footer>

      <MobileNavSpacer />
    </div>
  );
}
