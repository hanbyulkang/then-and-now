"use client";

import type { ConversationStatus, Pair, Question } from "@/lib/types";

/**
 * Today's question, sitting at the centre of the garden as an unopened bud.
 *
 * What the other person said is never shown here. Blind answering is the reason
 * the reveal is worth anything (spec §12).
 */
export function QuestionBud({
  question,
  pair,
  status,
  viewerAnswered,
  partnerAnswered,
  onAnswer,
  onReveal,
}: {
  question: Question;
  pair: Pair;
  status: ConversationStatus;
  viewerAnswered: boolean;
  partnerAnswered: boolean;
  onAnswer(): void;
  onReveal(): void;
}) {
  const partner = pair.then;
  const ready = status === "ready";

  return (
    <div className="flex flex-col items-center gap-6">
      <article
        className={`w-[min(380px,calc(100vw-40px))] rounded-[16px] border bg-white p-6 shadow-[0_8px_12px_rgba(64,56,47,0.06)] md:p-7 ${
          ready ? "border-bloom-rose" : "border-bloom-gold"
        }`}
      >
        <header className="flex items-start justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-bloom-gold">
            {question.origin === "follow-up"
              ? "A conversation waiting to bloom"
              : "Today's Question"}
          </p>
          {partnerAnswered ? (
            <span className="shrink-0 rounded-[12px] bg-then-sage/[0.08] px-2 py-1 text-[11px] text-then-sage">
              {partner.name} answered
            </span>
          ) : null}
        </header>

        <p className="mt-4 font-memory text-[20px] leading-[1.4] text-then-ink md:text-[22px]">
          &ldquo;{question.text}&rdquo;
        </p>

        <footer className="mt-4 flex items-center justify-between gap-4">
          {ready ? (
            <>
              <p className="text-[13px] text-then-faded">
                Both stories are ready.
              </p>
              <button
                type="button"
                onClick={onReveal}
                className="shrink-0 rounded-[20px] bg-bloom-rose px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-then-rose"
              >
                Reveal together
              </button>
            </>
          ) : viewerAnswered ? (
            <p className="text-[13px] leading-[1.5] text-now-slate">
              {partner.name} hasn&apos;t answered yet. We&apos;ll keep your
              story private until she does.
            </p>
          ) : (
            <>
              <p className="text-[13px] text-now-slate">
                Waiting for your answer
              </p>
              <button
                type="button"
                onClick={onAnswer}
                className="shrink-0 rounded-[20px] bg-bloom-green px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
              >
                Answer
              </button>
            </>
          )}
        </footer>
      </article>

      {/* The bud. It breathes while it waits, and brightens once both stories
          are in — the only thing that changes about it. */}
      <div className="flex flex-col items-center gap-1">
        <svg
          width="40"
          height="56"
          viewBox="0 0 40 56"
          fill="none"
          aria-hidden
          className="animate-breathe"
        >
          <path
            d="M20 0.75C25.2 0.75 30 3.7 33.5 8.6 37 13.6 39.25 20.4 39.25 28c0 7.6-2.2 14.4-5.75 19.4C30 52.3 25.2 55.25 20 55.25S9.99 52.3 6.47 47.4C2.95 42.4.75 35.6.75 28c0-7.6 2.2-14.4 5.72-19.4C9.99 3.7 14.8.75 20 .75Z"
            fill={ready ? "#c5a768" : "#b88379"}
            stroke="#c5a768"
            strokeWidth="1.5"
            style={{ transition: "fill 900ms ease" }}
          />
        </svg>
        <p className="text-[12px] text-then-faded">
          {ready ? "Ready to open" : "Bud of Memory"}
        </p>
      </div>
    </div>
  );
}
