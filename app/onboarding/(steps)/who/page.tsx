"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useOnboardingDraft } from "@/lib/state/onboarding";

const RELATIONSHIPS = [
  { label: "Grandma", icon: "sprout" },
  { label: "Grandpa", icon: "sprout" },
  { label: "Mom", icon: "flower" },
  { label: "Dad", icon: "tree-pine" },
  { label: "Other family", icon: "wheat" },
] as const;

/** 02 — Onboarding: Who. One question, five answers, nothing else asked. */
export default function OnboardingWhoPage() {
  const router = useRouter();
  const [draft, update] = useOnboardingDraft();

  return (
    <>
      <div className="w-full max-w-[640px] rounded-[24px] border border-bloom-gold bg-now-canvas p-7 shadow-[0_16px_16px_rgba(64,56,47,0.06)] md:p-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-serif text-[30px] leading-tight text-then-ink md:text-[40px]">
            Who are you growing this with?
          </h1>
          <p className="text-[15px] text-now-slate md:text-[16px]">
            You can invite them to your memory garden.
          </p>
        </div>

        <fieldset className="mt-8 flex flex-col gap-3 md:mt-10">
          <legend className="sr-only">Relationship</legend>
          {RELATIONSHIPS.map((option) => {
            const selected = draft.relationship === option.label;
            return (
              <label
                key={option.label}
                className={`flex min-h-[64px] cursor-pointer items-center justify-between rounded-[16px] border-[1.5px] p-4 transition-colors duration-200 md:p-5 ${
                  selected
                    ? "border-bloom-gold bg-then-paper"
                    : "border-black/[0.04] hover:border-bloom-gold/40"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`flex items-center justify-center rounded-[12px] p-2.5 ${
                      selected ? "bg-canvas" : "bg-now-canvas"
                    }`}
                  >
                    <Icon
                      name={
                        selected && option.icon === "sprout"
                          ? "sprout-active"
                          : option.icon
                      }
                    />
                  </span>
                  <span
                    className={`text-[16px] text-then-ink ${
                      selected ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {option.label}
                  </span>
                </span>

                <input
                  type="radio"
                  name="relationship"
                  value={option.label}
                  checked={selected}
                  onChange={() => update({ relationship: option.label })}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`size-5 rounded-full border-[1.5px] border-bloom-gold ${
                    selected ? "bg-bloom-green" : "bg-black/[0.02]"
                  }`}
                />
              </label>
            );
          })}
        </fieldset>

        <div className="mt-8 flex items-center justify-between md:mt-10">
          <p className="text-[14px] text-now-slate">Step 1 of 3</p>
          <button
            type="button"
            onClick={() => router.push("/onboarding/names")}
            className="rounded-[24px] bg-bloom-green px-8 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
          >
            Continue →
          </button>
        </div>
      </div>

      <p className="pt-8 text-center text-[13px] text-now-slate">
        A quiet space with no questionnaires, just pure stories.
      </p>
    </>
  );
}
