"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/** 03 — Onboarding: Names. Two fields, written on ruled paper. */
export default function OnboardingNamesPage() {
  const router = useRouter();
  const [draft, update] = useOnboardingDraft();

  const yourName = draft.yourName || "Ann";
  const theirName = draft.theirName || draft.relationship;

  return (
    <>
      <form
        className="w-full max-w-[640px] rounded-[24px] border border-bloom-gold bg-now-canvas p-7 shadow-[0_16px_16px_rgba(64,56,47,0.06)] md:p-12"
        onSubmit={(event) => {
          event.preventDefault();
          update({ yourName, theirName });
          router.push("/onboarding/ready");
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-serif text-[30px] leading-tight text-then-ink md:text-[40px]">
            Tell us your names.
          </h1>
          <p className="text-[15px] text-now-slate md:text-[16px]">
            This will be the beginning of your garden.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-8 md:mt-10">
          <JournalField
            label="Your name"
            icon="leaf"
            value={draft.yourName}
            placeholder="Ann"
            onChange={(v) => update({ yourName: v })}
          />
          <JournalField
            label={`${draft.relationship}'s name`}
            icon="flower-gold"
            value={draft.theirName}
            placeholder={draft.relationship}
            onChange={(v) => update({ theirName: v })}
          />
        </div>

        <div className="mt-8 flex items-center justify-between md:mt-10">
          <p className="text-[14px] text-now-slate">Step 2 of 3</p>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-[24px] bg-bloom-green py-3.5 pl-9 pr-8 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
          >
            Plant your garden
            <Icon name="sprout-white" size={16} />
          </button>
        </div>
      </form>

      <p className="pt-8 text-center text-[13px] text-now-slate">
        {yourName} &amp; {theirName}&apos;s garden will be planted in beautiful
        fertile soil.
      </p>
    </>
  );
}

function JournalField({
  label,
  icon,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  icon: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-[12px] uppercase tracking-wide text-bloom-gold">
        {label}
      </span>
      <span className="flex items-center justify-between gap-3 border-b-[1.5px] border-bloom-gold pb-3">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-memory text-[20px] italic text-then-ink outline-none placeholder:text-then-ink/35 md:text-[22px]"
        />
        <Icon name={icon} size={16} />
      </span>
    </label>
  );
}
