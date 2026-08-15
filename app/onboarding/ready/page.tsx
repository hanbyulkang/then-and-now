"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GeometricSeedling,
  OrganicSeedling,
} from "@/components/botanical/Seedling";
import { Navigation } from "@/components/nav/Navigation";
import { DEMO_PAIR } from "@/lib/demo-data";
import { useGarden } from "@/lib/state/garden-provider";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/**
 * 04 — Onboarding: Garden Created.
 *
 * Two seedlings grow in as the screen settles. Nothing has been shared yet, so
 * there is nothing between them — that empty middle is the point.
 */
export default function GardenCreatedPage() {
  const router = useRouter();
  const [draft] = useOnboardingDraft();
  const { startFreshGarden } = useGarden();
  const [grown, setGrown] = useState(0);
  const [copied, setCopied] = useState(false);

  const yourName = draft.yourName || DEMO_PAIR.now.name;
  const theirName = draft.theirName || draft.relationship || DEMO_PAIR.then.name;

  useEffect(() => {
    const timer = window.setTimeout(() => setGrown(1), 200);
    return () => window.clearTimeout(timer);
  }, []);

  /* Planting a garden is what onboarding was for — the store starts over here. */
  function enterGarden() {
    startFreshGarden({
      ...DEMO_PAIR,
      gardenName: `${yourName} & ${theirName}'s Garden`,
      then: { ...DEMO_PAIR.then, name: theirName },
      now: { ...DEMO_PAIR.now, name: yourName },
    });
    router.push("/garden");
  }

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/garden?joining=${encodeURIComponent(theirName)}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* Clipboard blocked — the button simply does nothing visible. */
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 pb-24 pt-10 md:gap-12 md:pb-20">
        <div className="flex items-start justify-center gap-16 md:gap-[120px]">
          <figure className="flex w-[140px] flex-col items-center gap-4 md:w-[180px]">
            <OrganicSeedling height={120} growth={grown} />
            <figcaption className="font-serif text-[18px] text-then-ink md:text-[20px]">
              {theirName}&apos;s Seedling
            </figcaption>
          </figure>
          <figure className="flex w-[140px] flex-col items-center gap-4 md:w-[180px]">
            <GeometricSeedling height={120} growth={grown} />
            <figcaption className="text-[14px] font-medium text-now-charcoal md:text-[15px]">
              {yourName}&apos;s Seedling
            </figcaption>
          </figure>
        </div>

        <div className="flex w-full max-w-[560px] flex-col items-center gap-4 text-center">
          <span className="rounded-[12px] bg-then-sage/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-then-sage">
            Garden Created
          </span>
          <h1 className="font-serif text-[34px] leading-tight text-then-ink md:text-[48px]">
            {yourName} &amp; {theirName}&apos;s Garden
          </h1>
          <p className="text-[15px] leading-[1.6] text-then-faded md:text-[16px]">
            Your garden has been tilled and the seeds are waiting. Once{" "}
            {theirName} joins, your first conversation can begin to bloom.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={enterGarden}
            className="rounded-[24px] bg-bloom-green px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
          >
            Invite {theirName}
          </button>
          <button
            type="button"
            onClick={copyInvite}
            className="rounded-[24px] border border-then-faded px-6 py-3 text-[14px] font-medium text-then-faded transition-colors duration-200 hover:bg-then-paper"
          >
            {copied ? "Link copied" : "Copy invite link"}
          </button>
        </div>
      </main>
    </div>
  );
}
