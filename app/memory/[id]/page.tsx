"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BookSpread } from "@/components/book/BookSpread";
import { FlowerMark } from "@/components/garden/Flower";
import { BudMark } from "@/components/garden/Botanical";
import { MemoryPage } from "@/components/story/MemoryPage";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { seedOf } from "@/lib/botany";

/**
 * One flower, opened.
 *
 * The two stories it grew out of, on their own pages, and the flower itself
 * standing on the binding between them with its name under it. Underneath, the
 * bud it has not opened yet — the question this discovery made possible.
 */
export default function FlowerDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { state, askFollowUp } = useGarden();

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
  const seed = seedOf(id);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookSpread
        className="min-h-[640px]"
        left={
          thenMemory ? (
            <div className="relative z-20 flex flex-1 flex-col justify-center p-7 md:py-14 md:pl-16 md:pr-[clamp(120px,16vw,240px)]">
              <MemoryPage
                person={pair.then}
                memory={thenMemory}
                highlight={connection.thenHighlight}
                highlightActive
                gloss={connection.thenGloss}
              />
            </div>
          ) : (
            <span aria-hidden />
          )
        }
        right={
          nowMemory ? (
            <div className="relative z-20 flex flex-1 flex-col justify-center p-7 md:py-14 md:pl-[clamp(120px,16vw,240px)] md:pr-16">
              <MemoryPage person={pair.now} memory={nowMemory} align="right" />
            </div>
          ) : (
            <div className="relative z-20 flex flex-1 flex-col items-end justify-center gap-3 p-7 text-right md:p-14">
              <p className="text-[11px] uppercase tracking-[0.3em] text-now-slate">
                Now
              </p>
              <p className="max-w-[26ch] text-[18px] leading-relaxed text-now-charcoal">
                {pair.now.name} hasn&apos;t told this one yet.
              </p>
            </div>
          )
        }
        atTheCentre={
          <div className="flex flex-col items-center gap-4 text-center">
            <FlowerMark size={188} seed={seed} />
            <p
              className="text-[13px] uppercase tracking-[0.22em] text-then-ink md:text-[15px]"
              style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
            >
              {connection.theme}
            </p>
            <p
              className="max-w-[24ch] font-serif text-[17px] italic leading-snug text-bloom-rose md:text-[20px]"
              style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
            >
              {connection.headline} {connection.statement}
            </p>
          </div>
        }
        atTheFold={
          <div className="flex max-w-[42ch] flex-col items-center gap-3 px-6 pb-8 text-center md:pb-11">
            <svg width="34" height="44" viewBox="-17 -42 34 44" aria-hidden>
              <BudMark x={0} y={0} length={40} />
            </svg>
            <p
              className="text-[11px] uppercase tracking-[0.26em] text-then-faded"
              style={{ textShadow: "0 0 14px #f2ece0" }}
            >
              A conversation waiting to bloom
            </p>
            <p
              className="font-serif text-[18px] italic leading-snug text-then-ink md:text-[21px]"
              style={{ textShadow: "0 0 18px #f2ece0, 0 0 30px #f2ece0" }}
            >
              &ldquo;{connection.followUp}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                askFollowUp(conversation.id);
                router.push("/garden");
              }}
              className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
              style={{ textShadow: "0 0 14px #f2ece0" }}
            >
              Ask {pair.then.name} →
            </button>
          </div>
        }
      />

      <MobileNavSpacer />
    </div>
  );
}
