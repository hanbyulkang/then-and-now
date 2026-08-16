"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BookGround } from "@/components/book/BookSpread";
import { BudMark, Leaf } from "@/components/garden/Botanical";
import { FlowerMark } from "@/components/garden/Flower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { seedOf } from "@/lib/botany";
import { useGarden } from "@/lib/state/garden-provider";
import type { Conversation } from "@/lib/types";
import { flowersOf, yearsBetween } from "@/lib/types";

/**
 * Between Us.
 *
 * Not the garden again, and not a list of flowers. This is the field journal:
 * scraps of two lives laid out across the book, a flower wherever two of them
 * turned out to be the same thing, and a thin botanical line running from each
 * scrap into the flower it fed.
 *
 * Rest on a flower and the rest of the plate goes quiet, so that you are
 * looking at one thing they share and at the two memories it came from.
 */
export default function BetweenUsPage() {
  const router = useRouter();
  const { state } = useGarden();
  const [open, setOpen] = useState<string | null>(null);

  const pair = state.pair;
  const found = useMemo(() => flowersOf(state), [state]);
  const stories = state.conversations.reduce(
    (n, c) => n + Object.keys(c.memories).length,
    0,
  );

  /* A question one of these discoveries opened that nobody has answered. */
  const waiting = useMemo(
    () =>
      state.conversations.find(
        (c) =>
          c.question.origin === "follow-up" && !Object.keys(c.memories).length,
      ),
    [state.conversations],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookGround>
        <header className="flex flex-col items-center gap-4 px-7 pb-6 pt-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.34em] text-then-faded">
            Between us
          </p>
          <h1 className="max-w-[20ch] font-serif text-[32px] leading-tight text-then-ink md:text-[42px]">
            Things we never knew we shared.
          </h1>
          <p className="font-serif text-[16px] italic leading-[1.9] text-then-faded md:text-[18px]">
            {yearsBetween(pair)} years.
            <br />
            {stories} stories.
            <br />
            {found.length} things we found in each other.
          </p>
        </header>

        <ol className="flex flex-col gap-16 px-6 py-10 md:gap-2 md:px-10 md:py-14">
          {found.map((conversation, i) => (
            <Entry
              key={conversation.id}
              conversation={conversation}
              index={i}
              thenName={pair.then.name}
              nowName={pair.now.name}
              thenId={pair.then.id}
              nowId={pair.now.id}
              quiet={Boolean(open) && open !== conversation.id}
              onEnter={() => setOpen(conversation.id)}
              onLeave={() => setOpen((v) => (v === conversation.id ? null : v))}
              onOpen={() => router.push(`/memory/${conversation.id}`)}
            />
          ))}
        </ol>

        {found.length === 0 ? (
          <p className="px-7 py-24 text-center font-serif text-[20px] italic text-then-faded">
            Nothing yet. It fills the first time two of your stories turn out to
            be the same story.
          </p>
        ) : (
          <footer className="flex flex-col items-center gap-4 px-7 pb-24 pt-12 text-center">
            {waiting ? (
              <>
                <svg width="42" height="52" viewBox="-21 -50 42 52" aria-hidden>
                  <BudMark x={0} y={0} length={46} />
                </svg>
                <p className="max-w-[34ch] font-serif text-[18px] italic leading-snug text-then-ink md:text-[21px]">
                  &ldquo;{waiting.question.text}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/today")}
                  className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-colors hover:text-then-ink hover:underline"
                >
                  Ask {pair.then.name} →
                </button>
              </>
            ) : null}
            <p className="mt-6 font-serif text-[19px] italic text-then-faded md:text-[22px]">
              Maybe we weren&apos;t so far apart after all.
            </p>
          </footer>
        )}
      </BookGround>

      <MobileNavSpacer />
    </div>
  );
}

/** One discovery: two scraps of a life, and the flower between them. */
function Entry({
  conversation,
  index,
  thenName,
  nowName,
  thenId,
  nowId,
  quiet,
  onEnter,
  onLeave,
  onOpen,
}: {
  conversation: Conversation;
  index: number;
  thenName: string;
  nowName: string;
  thenId: string;
  nowId: string;
  quiet: boolean;
  onEnter(): void;
  onLeave(): void;
  onOpen(): void;
}) {
  const connection = conversation.connection;
  const thenMemory = conversation.memories[thenId];
  const nowMemory = conversation.memories[nowId];
  const seed = seedOf(conversation.id);

  /* Nothing sits on a line with the one above it: a plate, not a table. */
  const drift = [0, 36, -28, 20, -40, 14, -20][index % 7];
  const size = [108, 92, 100, 86, 96][index % 5];

  if (!connection) return null;

  return (
    <li
      className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-0"
      style={{
        opacity: quiet ? 0.22 : 1,
        transition: "opacity 450ms ease",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Scrap
        name={thenName}
        year={thenMemory?.year}
        place={thenMemory?.place}
        quote={thenMemory?.transcript}
        side="then"
        drift={drift}
      />

      <button
        type="button"
        onClick={onOpen}
        onFocus={onEnter}
        onBlur={onLeave}
        className="group flex flex-col items-center gap-1 px-4"
        style={{ transform: `translateY(${drift * 0.35}px)` }}
      >
        {/* The two stems that fed it come in from either page and meet under
            the flower, so the flower stands on them rather than beneath them. */}
        <span className="relative flex items-center justify-center">
          <svg
            width="280"
            height="60"
            viewBox="0 0 280 60"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-md:hidden"
            aria-hidden
          >
            <path
              d="M 2 50 C 46 52, 92 40, 138 31"
              stroke="#a3936f"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity={0.8}
            />
            <path
              d="M 278 50 C 234 52, 188 40, 142 31"
              stroke="#9aab96"
              strokeWidth="1.7"
              fill="none"
              strokeLinecap="round"
              opacity={0.8}
            />
            <Leaf side="then" x={64} y={48} length={24} angle={-140} sway={false} />
            <Leaf side="now" x={216} y={48} length={22} angle={-40} sway={false} />
          </svg>

          <span className="relative">
            <FlowerMark size={size} seed={seed} />
          </span>
        </span>
        <span className="font-serif text-[15px] italic text-then-ink md:text-[17px]">
          {connection.theme}
        </span>
        <span className="mt-1 max-w-[24ch] text-[10px] uppercase leading-relaxed tracking-[0.14em] text-bloom-rose opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          {connection.headline} {connection.statement}
        </span>
      </button>

      <Scrap
        name={nowName}
        year={nowMemory?.year}
        place={nowMemory?.place}
        quote={nowMemory?.transcript}
        side="now"
        drift={-drift}
        align="right"
      />
    </li>
  );
}

function Scrap({
  name,
  year,
  place,
  quote,
  side,
  drift,
  align = "left",
}: {
  name: string;
  year?: number;
  place?: string;
  quote?: string;
  side: "then" | "now";
  drift: number;
  align?: "left" | "right";
}) {
  if (!year || !quote) return <span aria-hidden />;
  const isThen = side === "then";
  return (
    <figure
      className={`flex flex-col gap-1.5 ${align === "right" ? "items-end text-right" : ""}`}
      style={{ transform: `translateY(${drift}px)` }}
    >
      <figcaption
        className={`text-[10px] uppercase tracking-[0.24em] ${
          isThen ? "text-then-faded" : "text-now-slate"
        }`}
      >
        {year} · {place} · {name}
      </figcaption>
      <blockquote
        className={
          isThen
            ? "max-w-[26ch] font-memory text-[15px] italic leading-[1.7] text-then-ink md:text-[17px]"
            : "max-w-[26ch] text-[14px] leading-[1.75] text-now-charcoal md:text-[16px]"
        }
      >
        &ldquo;{clip(quote)}&rdquo;
      </blockquote>
    </figure>
  );
}

/** Enough of it to recognise. The whole thing lives on its own page. */
function clip(text: string, max = 92) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
