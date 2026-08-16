"use client";

import { useRouter } from "next/navigation";
import { LeafButton, Panel } from "@/components/ui/Panel";
import { Steps } from "@/components/ui/Steps";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/** Two names, and nothing else asked. */
export default function OnboardingNamesPage() {
  const router = useRouter();
  const [draft, update] = useOnboardingDraft();

  const yourName = draft.yourName.trim();
  const theirName = draft.theirName.trim();

  return (
    <main className="flex w-full max-w-[660px] flex-1 flex-col justify-center py-14">
      <Panel className="px-8 py-12 md:px-14">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!yourName || !theirName) return;
            router.push("/onboarding/ready");
          }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-[28px] leading-tight text-then-ink md:text-[34px]">
              Tell us your names.
            </h1>
            <p className="text-[14px] text-then-faded">
              This will be the beginning of your garden.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-7">
            <Written
              label="Your name"
              value={draft.yourName}
              placeholder="Ann"
              onChange={(v) => update({ yourName: v })}
              autoFocus
            />
            <Written
              label={`${draft.relationship}'s name`}
              value={draft.theirName}
              placeholder={draft.relationship}
              onChange={(v) => update({ theirName: v })}
            />
          </div>

          <div className="mt-12 flex items-center justify-between gap-6">
            <Steps of={3} at={2} />
            <LeafButton type="submit" disabled={!yourName || !theirName}>
              Plant your garden
            </LeafButton>
          </div>
        </form>
      </Panel>
    </main>
  );
}

function Written({
  label,
  value,
  placeholder,
  onChange,
  autoFocus,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange(v: string): void;
  autoFocus?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.2em] text-then-faded">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[4px] border border-then-faded/25 bg-white/40 px-4 py-3 font-serif text-[19px] text-then-ink outline-none transition-colors placeholder:text-then-faded/45 focus:border-bloom-gold"
      />
    </label>
  );
}
