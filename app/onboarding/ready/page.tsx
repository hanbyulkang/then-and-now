"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SeedVessel } from "@/components/garden/SeedVessel";
import { Navigation } from "@/components/nav/Navigation";
import { DEMO_PAIR, freshGarden } from "@/lib/demo-data";
import { useGarden } from "@/lib/state/garden-provider";
import { useOnboardingDraft } from "@/lib/state/onboarding";
import { yearsBetween } from "@/lib/types";

/**
 * The first moment of the garden.
 *
 * Not the end of account setup — the beginning of a story. An almost empty page
 * with one seed resting in the middle of it, and the first question arriving
 * quietly enough that you notice it rather than are told it.
 *
 * Everything appears in sequence, slowly, because the pacing is the point.
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
    gardenName: `${yourName} & ${theirName}'s Garden`,
    then: { ...DEMO_PAIR.then, name: theirName },
    now: { ...DEMO_PAIR.now, name: yourName },
  };
  const firstQuestion = freshGarden(pair).conversations[0].question.text;

  useEffect(() => {
    const timer = window.setTimeout(() => setAwake(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  function begin() {
    startFreshGarden(pair);
    router.push("/garden");
  }

  /** Each line waits its turn. */
  const step = (delay: number) => ({
    animation: `rise-in 1400ms var(--ease-settle) ${delay}ms both`,
  });

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="flex flex-col items-center gap-2 text-center">
          <p
            className="font-serif text-[26px] text-then-ink md:text-[30px]"
            style={step(200)}
          >
            {theirName} &amp; {yourName}
          </p>
          <p
            className="text-[13px] text-then-faded md:text-[14px]"
            style={step(900)}
          >
            {yearsBetween(pair)} years between you.
          </p>
        </div>

        {/* One seed, and the whole thing still inside it. */}
        <svg
          viewBox="-150 -260 300 300"
          className="h-[300px] w-[300px] overflow-visible"
          style={{
            ...step(1500),
            filter: awake
              ? "drop-shadow(0 0 26px rgba(197,167,104,0.3))"
              : "drop-shadow(0 0 0 rgba(197,167,104,0))",
            transition: "filter 2.6s ease",
          }}
          aria-hidden
        >
          <g className={awake ? "animate-breathe" : undefined}>
            <SeedVessel stage="dormant" opened={0} size={92} />
          </g>
        </svg>

        <p
          className="max-w-[520px] text-center font-serif text-[21px] italic leading-relaxed text-then-faded md:text-[24px]"
          style={step(2400)}
        >
          Every garden begins with a story.
        </p>

        <div
          className="flex max-w-[560px] flex-col items-center gap-8 text-center"
          style={step(3600)}
        >
          <p className="font-memory text-[24px] leading-[1.4] text-then-ink md:text-[28px]">
            &ldquo;{firstQuestion}&rdquo;
          </p>

          <button
            type="button"
            onClick={begin}
            className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors duration-200 hover:text-then-sage hover:underline"
          >
            Plant your first story →
          </button>
        </div>
      </main>
    </div>
  );
}
