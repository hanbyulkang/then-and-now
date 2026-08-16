"use client";

import { useRouter } from "next/navigation";
import { FlowerMark } from "@/components/garden/Flower";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/**
 * Who the garden is with.
 *
 * Set like the index page of an old book: one question, a short list of
 * answers, and a flower beside whichever one you rest on. No cards, no
 * radio buttons, no step counter marching across the bottom.
 */
const PEOPLE = ["Grandma", "Grandpa", "Mom", "Dad", "Someone else"];

export default function OnboardingWhoPage() {
  const router = useRouter();
  const [draft, update] = useOnboardingDraft();

  return (
    <main className="flex w-full max-w-[640px] flex-1 flex-col justify-center gap-12 py-16">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-serif text-[30px] leading-tight text-then-ink md:text-[40px]">
          Who will you grow this garden with?
        </h1>
        <p className="font-serif text-[16px] italic text-then-faded md:text-[18px]">
          Every garden begins with two stories.
        </p>
      </div>

      <ul className="flex flex-col items-center gap-1">
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
                className="group flex items-center gap-4 px-3 py-2.5"
              >
                <span
                  className="transition-opacity duration-500"
                  style={{ opacity: chosen ? 1 : 0 }}
                  aria-hidden
                >
                  <FlowerMark size={34} seed={i * 5 + 2} side="then" />
                </span>
                <span
                  className={`font-serif text-[24px] transition-colors duration-300 md:text-[28px] ${
                    chosen ? "text-then-ink" : "text-then-faded"
                  }`}
                >
                  {name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
