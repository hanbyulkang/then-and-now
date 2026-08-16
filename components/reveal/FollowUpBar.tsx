"use client";

import { Bud } from "@/components/botanical/Bud";
import type { Connection } from "@/lib/types";

/**
 * The last beat of the bloom, written in the gutter.
 *
 * A discovery is only worth anything here if it opens the next question, so the
 * flower is immediately followed by a bud — one that has not opened yet, with
 * the question it is holding written beside it.
 */
export function FollowUpBar({
  connection,
  partnerName,
  visible,
  questionVisible,
  onAsk,
}: {
  connection: Connection;
  partnerName: string;
  visible: boolean;
  questionVisible: boolean;
  onAsk(): void;
}) {
  return (
    <div
      className="flex flex-col items-center gap-3 px-6 pb-8 text-center md:pb-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 900ms ease, transform 900ms var(--ease-settle)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Bud width={28} />

      <p
        className="max-w-[42ch] font-serif text-[19px] italic leading-snug text-then-ink md:text-[22px]"
        style={{
          opacity: questionVisible ? 1 : 0,
          transition: "opacity 900ms ease",
          textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0",
        }}
      >
        &ldquo;{connection.followUp}&rdquo;
      </p>

      <button
        type="button"
        onClick={onAsk}
        className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
        style={{
          opacity: questionVisible ? 1 : 0,
          transition: "opacity 900ms ease 200ms",
        }}
      >
        Ask {partnerName} →
      </button>
    </div>
  );
}
