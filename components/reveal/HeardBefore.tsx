"use client";

import { useState } from "react";
import { BudMark, Leaf } from "@/components/garden/Botanical";

/**
 * The only reaction in the product.
 *
 * Not a like and not a heart. After you have heard someone's story for the
 * first time there is exactly one thing worth asking, and the answer isn't a
 * rating — it only records where that memory already stood between the two of
 * you. Neither answer is the better one.
 */
export function HeardBefore({
  name,
  answer,
  onAnswer,
}: {
  name: string;
  answer?: "never" | "remembered";
  onAnswer(value: "never" | "remembered"): void;
}) {
  const [just, setJust] = useState<"never" | "remembered" | null>(null);
  const settled = answer ?? just;

  if (settled) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <svg width="52" height="46" viewBox="-26 -44 52 46" aria-hidden>
          {settled === "never" ? (
            <BudMark x={0} y={0} length={42} />
          ) : (
            <Leaf side="then" x={0} y={0} length={40} angle={-118} sway={false} />
          )}
        </svg>
        <p
          className="animate-rise-in font-serif text-[18px] italic text-then-ink md:text-[21px]"
          style={{ textShadow: "0 0 18px #f2ece0, 0 0 32px #f2ece0" }}
        >
          {settled === "never"
            ? `You met a part of ${name} you hadn't known before.`
            : "A story that was already part of you."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p
        className="text-[11px] uppercase tracking-[0.28em] text-then-faded"
        style={{ textShadow: "0 0 14px #f2ece0" }}
      >
        Had you heard this story before?
      </p>
      <div className="flex items-center gap-9">
        {(
          [
            ["never", "I never knew this"],
            ["remembered", "I remember this"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setJust(value);
              onAnswer(value);
            }}
            className="font-serif text-[17px] italic text-then-ink underline decoration-bloom-gold/40 underline-offset-8 transition-colors hover:decoration-bloom-gold md:text-[19px]"
            style={{ textShadow: "0 0 16px #f2ece0, 0 0 28px #f2ece0" }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
