"use client";

import type { Connection } from "@/lib/types";

/**
 * 20 — Follow-Up Bud.
 *
 * The last beat of the bloom. A discovery is only worth anything here if it
 * opens the next question, so the flower is immediately followed by a bud.
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
    <footer
      className="flex flex-col items-start gap-4 border-t border-bloom-gold/20 bg-then-paper px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 800ms ease, transform 800ms var(--ease-settle)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="flex items-center gap-4">
        <svg
          width="24"
          height="32"
          viewBox="0 0 24 32"
          fill="none"
          aria-hidden
          className="shrink-0 animate-breathe"
        >
          <ellipse
            cx="12"
            cy="16"
            rx="11"
            ry="15"
            fill="#e6d6b4"
            stroke="#c5a768"
            strokeWidth="1"
          />
        </svg>
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-then-faded">
            Next conversation waiting to bloom
          </p>
          <p
            className="font-memory text-[15px] text-then-ink md:text-[16px]"
            style={{
              opacity: questionVisible ? 1 : 0,
              transition: "opacity 700ms ease",
            }}
          >
            &ldquo;{connection.followUp}&rdquo;
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAsk}
        className="shrink-0 rounded-[20px] bg-then-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-then-faded"
      >
        Ask {partnerName} →
      </button>
    </footer>
  );
}
