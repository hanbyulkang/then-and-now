"use client";

import { Bud } from "@/components/botanical/Bud";
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
    <div className="flex flex-col items-center gap-5 md:gap-6">
      {ready ? (
        /* 07 — Both Stories Ready. The moment gets more room than the waiting
           state did: this is an occasion, not a task. */
        <article className="flex w-[min(420px,calc(100vw-40px))] flex-col items-center gap-4 rounded-[24px] border-[1.5px] border-bloom-gold bg-white p-6 text-center shadow-[0_12px_16px_rgba(64,56,47,0.06)] md:p-7">
          <span className="rounded-[12px] bg-bloom-rose/[0.12] px-3 py-1 text-[12px] font-semibold uppercase tracking-wide text-bloom-rose">
            You have both spoken
          </span>
          <h2 className="font-serif text-[26px] leading-tight text-then-ink md:text-[32px]">
            &ldquo;{question.text}&rdquo;
          </h2>
          <p className="text-[14px] leading-[1.5] text-now-slate">
            Take a quiet moment. Read each other&apos;s at the same time.
          </p>
          <button
            type="button"
            onClick={onReveal}
            className="rounded-[24px] bg-bloom-green px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
          >
            Open them together →
          </button>
        </article>
      ) : (
        <article className="w-[min(380px,calc(100vw-40px))] rounded-[16px] border border-bloom-gold bg-white p-6 shadow-[0_8px_12px_rgba(64,56,47,0.06)] md:p-7">
          <header className="flex items-start justify-between gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-bloom-gold">
              {question.origin === "follow-up"
                ? "A conversation waiting to bloom"
                : "Today"}
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
            {viewerAnswered ? (
              /* Spec §14: the story stays private until both have spoken. */
              <p className="text-[13px] leading-[1.5] text-now-slate">
                {partner.name} hasn&apos;t spoken yet. Yours stays
                private until she has.
              </p>
            ) : (
              <>
                <p className="text-[13px] text-now-slate">
                  Waiting for yours
                </p>
                <button
                  type="button"
                  onClick={onAnswer}
                  className="shrink-0 rounded-[20px] bg-bloom-green px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-then-sage"
                >
                  Tell yours →
                </button>
              </>
            )}
          </footer>
        </article>
      )}

      {/* The bud. It breathes while it waits, and warms once both stories are
          in — the only thing about it that ever changes. */}
      <div className="flex flex-col items-center gap-2">
        <Bud width={ready ? 62 : 46} ready={ready} />
        <p
          className="text-[12px] text-then-faded md:text-[13px]"
          style={{ textShadow: "0 0 12px #f7f4ec, 0 0 22px #f7f4ec" }}
        >
          {ready ? "Ready to open" : "Still closed"}
        </p>
      </div>
    </div>
  );
}
