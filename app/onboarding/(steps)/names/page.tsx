"use client";

import { useRouter } from "next/navigation";
import { LeafButton } from "@/components/ui/Panel";
import { useOnboardingDraft } from "@/lib/state/onboarding";

/**
 * Two names, written on the page.
 *
 * On lines, the way you would write them in the front of a book you were about
 * to keep together — not into fields in a form.
 */
export default function OnboardingNamesPage() {
  const router = useRouter();
  const [draft, update] = useOnboardingDraft();

  const yourName = draft.yourName.trim();
  const theirName = draft.theirName.trim();

  return (
    <main className="flex w-full max-w-[560px] flex-1 flex-col justify-center gap-14 py-16">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-serif text-[30px] leading-tight text-then-ink md:text-[40px]">
          Tell us your names.
        </h1>
        <p className="font-serif text-[16px] italic text-then-faded md:text-[18px]">
          This is the beginning of your garden.
        </p>
      </div>

      <form
        className="flex flex-col gap-11"
        onSubmit={(event) => {
          event.preventDefault();
          if (!yourName || !theirName) return;
          router.push("/onboarding/ready");
        }}
      >
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

        <LeafButton
          type="submit"
          disabled={!yourName || !theirName}
          className="self-center px-7 py-3 text-[14px]"
        >
          Plant your garden
        </LeafButton>
      </form>
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
    <label className="flex flex-col gap-3">
      <span className="text-[11px] uppercase tracking-[0.26em] text-then-faded">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-0 border-b border-then-faded/40 bg-transparent pb-2 font-serif text-[26px] text-then-ink outline-none transition-colors placeholder:text-then-faded/40 focus:border-bloom-gold md:text-[30px]"
      />
    </label>
  );
}
