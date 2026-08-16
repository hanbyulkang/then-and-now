"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookSpread } from "@/components/book/BookSpread";
import { Seedling } from "@/components/garden/Botanical";
import { DEMO_PAIR, freshGarden } from "@/lib/demo-data";
import { useGarden } from "@/lib/state/garden-provider";
import { useOnboardingDraft } from "@/lib/state/onboarding";
import { yearsBetween } from "@/lib/types";

/**
 * The first moment of the garden.
 *
 * Not the end of account setup — the beginning of a story. An almost empty
 * book, two seedlings in bare earth, and the first question arriving quietly
 * enough that you notice it rather than are told it.
 *
 * Nothing here says the garden was created. It just is, and it is empty.
 */
export default function GardenBeginsPage() {
  const router = useRouter();
  const [draft] = useOnboardingDraft();
  const { startFreshGarden } = useGarden();
  const [awake, setAwake] = useState(false);

  const yourName = draft.yourName || DEMO_PAIR.now.name;
  const theirName = draft.theirName || draft.relationship || DEMO_PAIR.then.name;

  const pair = {
    ...DEMO_PAIR,
    gardenName: `${yourName} & ${theirName}`,
    then: { ...DEMO_PAIR.then, name: theirName },
    now: { ...DEMO_PAIR.now, name: yourName },
  };
  const firstQuestion = freshGarden(pair).conversations[0].question.text;

  useEffect(() => {
    const timer = window.setTimeout(() => setAwake(true), 2400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-dvh flex-col bg-canvas">
      <BookSpread
        className="min-h-[600px]"
        left={<span aria-hidden />}
        right={<span aria-hidden />}
        across={
          <div className="pointer-events-none absolute inset-0">
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden
            >
              <Seedling x={560} y={790} length={116} />
              <Seedling x={880} y={794} length={104} flip />
            </svg>
          </div>
        }
        atTheCentre={
          <div className="flex max-w-[34ch] flex-col items-center gap-4 px-6 text-center">
            <p
              className="font-serif text-[28px] leading-none text-then-ink md:text-[36px]"
              style={{ textShadow: "0 0 24px #f2ece0, 0 0 44px #f2ece0" }}
            >
              {yourName} &amp; {theirName}
            </p>
            <p
              className="text-[11px] uppercase tracking-[0.26em] text-then-faded"
              style={{ textShadow: "0 0 16px #f2ece0" }}
            >
              {yearsBetween(pair)} years between you
            </p>
            <p
              className="mt-3 font-serif text-[17px] italic text-then-faded md:text-[19px]"
              style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
            >
              Every garden begins with a story.
            </p>

            <div
              className="mt-8 flex flex-col items-center gap-3"
              style={{
                opacity: awake ? 1 : 0,
                transform: awake ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 1400ms ease, transform 1400ms var(--ease-settle)",
              }}
            >
              <p
                className="text-[11px] uppercase tracking-[0.28em] text-then-faded"
                style={{ textShadow: "0 0 16px #f2ece0" }}
              >
                Today&apos;s question
              </p>
              <p
                className="max-w-[24ch] font-serif text-[21px] italic leading-snug text-then-ink md:text-[25px]"
                style={{ textShadow: "0 0 20px #f2ece0, 0 0 36px #f2ece0" }}
              >
                &ldquo;{firstQuestion}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  startFreshGarden(pair);
                  router.push("/today");
                }}
                className="mt-1 text-[16px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
                style={{ textShadow: "0 0 16px #f2ece0" }}
              >
                Plant the first story →
              </button>
            </div>
          </div>
        }
      />
    </main>
  );
}
