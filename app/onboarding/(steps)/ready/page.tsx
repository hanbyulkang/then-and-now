"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Seedling } from "@/components/garden/Botanical";
import { LeafButton, Panel } from "@/components/ui/Panel";
import { Leaf } from "@/components/garden/Botanical";
import { Steps } from "@/components/ui/Steps";
import { DEMO_PAIR } from "@/lib/demo-data";
import { useGarden } from "@/lib/state/garden-provider";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/**
 * The garden, before anything is in it.
 *
 * Not a success screen and not a receipt — two seed leaves in bare earth and
 * the name of the thing the two of you are about to keep. The only thing to do
 * from here is ask the other person to come, which is the honest next step:
 * nothing grows until they answer something.
 */
export default function GardenReadyPage() {
  const router = useRouter();
  const [draft] = useOnboardingDraft();
  const { startFreshGarden } = useGarden();
  const [copied, setCopied] = useState(false);

  const yourName = draft.yourName || DEMO_PAIR.now.name;
  const theirName = draft.theirName || draft.relationship || DEMO_PAIR.then.name;

  const pair = {
    ...DEMO_PAIR,
    gardenName: `${yourName} & ${theirName}'s Garden`,
    then: { ...DEMO_PAIR.then, name: theirName },
    now: { ...DEMO_PAIR.now, name: yourName },
  };

  return (
    <main className="flex w-full max-w-[660px] flex-1 flex-col justify-center py-14">
      <Panel className="relative overflow-visible px-8 py-12 md:px-14">
      {/* A sprig laid in the corner of the sheet. */}
      <svg
        className="pointer-events-none absolute -right-2 -top-4 w-[86px] opacity-70 md:-right-4 md:-top-6 md:w-[110px]"
        viewBox="0 0 120 150"
        aria-hidden
      >
        <Leaf side="then" x={62} y={146} length={64} angle={-96} />
        <Leaf side="then" x={62} y={112} length={48} angle={-40} />
        <Leaf side="then" x={62} y={86} length={44} angle={-142} flip />
      </svg>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="font-serif text-[28px] leading-tight text-then-ink md:text-[34px]">
            Your garden
            <br />
            is ready.
          </h1>
          <p className="font-serif text-[15px] italic text-then-faded md:text-[16px]">
            {pair.gardenName}
          </p>
        </div>

        <svg
          viewBox="0 0 420 150"
          className="mx-auto mt-8 w-full max-w-[420px]"
          aria-hidden
        >
          <Seedling x={128} y={138} length={112} />
          <Seedling x={292} y={140} length={104} flip />
        </svg>

        <div className="mt-8 flex flex-col items-center gap-3">
          <LeafButton
            className="px-7 py-3 text-[14px]"
            onClick={() => {
              startFreshGarden(pair);
              router.push("/today");
            }}
          >
            Invite {theirName}
          </LeafButton>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard
                ?.writeText(`${window.location.origin}/garden`)
                .catch(() => undefined);
              setCopied(true);
            }}
            className="text-[12px] text-then-faded"
          >
            or{" "}
            <span className="underline underline-offset-4">
              {copied ? "invite link copied" : "copy invite link"}
            </span>
          </button>
        </div>

        <div className="mt-10 flex justify-between">
          <Steps of={3} at={3} />
        </div>
      </Panel>
    </main>
  );
}
