"use client";

import { useRouter } from "next/navigation";
import { FlowerMark } from "@/components/garden/Flower";
import { Panel } from "@/components/ui/Panel";
import { Steps } from "@/components/ui/Steps";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/**
 * Who the garden is with.
 *
 * One question and five answers, each with its own flower — a different one for
 * each, because that is the promise the whole product makes.
 */
const PEOPLE = ["Grandma", "Grandpa", "Mom", "Dad", "Other family"];

export default function OnboardingWhoPage() {
  const router = useRouter();
  const [draft, update] = useOnboardingDraft();

  return (
    <main className="flex w-full max-w-[660px] flex-1 flex-col justify-center py-14">
      <Panel className="px-8 py-12 md:px-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="max-w-[16ch] font-serif text-[28px] leading-tight text-then-ink md:text-[34px]">
            Who are you growing this with?
          </h1>
          <p className="text-[14px] text-then-faded">
            You can invite them to your garden.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {PEOPLE.map((name, i) => {
            const chosen = draft.relationship === name;
            return (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => {
                    update({ relationship: name });
                    router.push("/onboarding/names");
                  }}
                  onMouseEnter={() => update({ relationship: name })}
                  onFocus={() => update({ relationship: name })}
                  className={`flex w-[104px] flex-col items-center gap-2 rounded-[5px] border px-3 py-4 transition-colors duration-200 ${
                    chosen
                      ? "border-bloom-gold/70 bg-[#f4eee1]"
                      : "border-then-faded/20 hover:border-bloom-gold/40"
                  }`}
                >
                  <FlowerMark size={42} seed={i * 7 + 1} side="then" />
                  <span
                    className={`text-[13px] ${chosen ? "text-then-ink" : "text-then-faded"}`}
                  >
                    {name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex justify-between">
          <Steps of={3} at={1} />
        </div>
      </Panel>
    </main>
  );
}
