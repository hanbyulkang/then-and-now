"use client";

import type { Conversation, Pair } from "@/lib/types";

/**
 * What a flower says when you lean toward it (spec §22): both people, both
 * places, and the one line they turned out to share. Editorial, not a tooltip.
 */
export function StoryPreview({
  conversation,
  pair,
}: {
  conversation: Conversation;
  pair: Pair;
}) {
  const connection = conversation.connection;
  if (!connection) return null;

  const then = conversation.memories[pair.then.id];
  const now = conversation.memories[pair.now.id];

  return (
    <div
      role="tooltip"
      className="animate-rise-in pointer-events-none absolute left-1/2 top-full z-30 mt-3 w-[280px] -translate-x-1/2 rounded-[16px] border border-bloom-gold/60 bg-canvas/97 p-5 text-left shadow-[0_12px_28px_rgba(64,56,47,0.14)] backdrop-blur-sm"
    >
      <h3 className="font-serif text-[22px] leading-tight text-then-ink">
        {connection.theme}
      </h3>

      <dl className="mt-3 flex flex-col gap-1.5 text-[12px]">
        {then ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="font-medium text-then-faded">{pair.then.name}</dt>
            <dd className="text-then-faded/80">
              {then.place} · {then.year}
            </dd>
          </div>
        ) : null}
        {now ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="font-medium text-now-slate">{pair.now.name}</dt>
            <dd className="text-now-slate/80">
              {now.place} · {now.year}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-4 border-t border-bloom-gold/25 pt-3 font-memory text-[15px] italic leading-snug text-then-ink">
        {connection.headline} {connection.statement}
      </p>

      <p className="mt-3 text-[12px] font-semibold text-bloom-green">
        Hear this story →
      </p>
    </div>
  );
}
