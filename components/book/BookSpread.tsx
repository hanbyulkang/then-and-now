import type { ReactNode } from "react";

/**
 * The book, open.
 *
 * Every screen in this product is one spread: an old book on the left, a
 * modern one on the right, and a fold down the middle where the two meet. The
 * page is the layout — there are no cards here, and nothing is a panel floating
 * on a background.
 *
 * `across` is the layer the garden lives in. It spans both pages and sits above
 * the paper but below the writing, so a stem can cross the fold and pass behind
 * a line of text the way it would if someone had drawn it into the book.
 */
export function BookSpread({
  left,
  right,
  across,
  /** Sits over everything, centred on the fold. */
  atTheFold,
  className = "",
}: {
  left: ReactNode;
  right: ReactNode;
  across?: ReactNode;
  atTheFold?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-1 flex-col md:flex-row ${className}`}>
      {/* THEN — paper that has been in a drawer for fifty years. */}
      <section
        className="paper-grain relative flex flex-1 flex-col bg-then-paper"
        aria-label="Then"
      >
        {left}
      </section>

      {/* NOW — the same book, printed this year. */}
      <section
        className="relative flex flex-1 flex-col bg-now-canvas"
        aria-label="Now"
      >
        {right}
      </section>

      <Fold />

      {across ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="pointer-events-auto contents">{across}</div>
        </div>
      ) : null}

      {atTheFold ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
          <div className="pointer-events-auto">{atTheFold}</div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The same two pages, when the content is what sets the height.
 *
 * Used where the book runs on past the bottom of the screen — the archive — so
 * the paper, the fold and the shadow carry all the way down whatever is put on
 * them. On a narrow screen there is only one page, so the split goes away.
 */
export function BookGround({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-1 flex-col bg-canvas ${className}`}>
      <div
        className="paper-grain absolute inset-y-0 left-0 right-1/2 hidden bg-then-paper md:block"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-1/2 right-0 hidden bg-now-canvas md:block"
        aria-hidden
      />
      <Fold />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

/**
 * The fold. Not a rule down the middle — the shadow paper makes when it is
 * bent, which is what tells you these are two pages of one thing.
 */
function Fold() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 right-0 z-[5] hidden md:block"
      aria-hidden
    >
      <div className="absolute inset-y-0 left-1/2 w-[76px] -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(90,74,52,0.06)_32%,rgba(90,74,52,0.15)_49%,rgba(90,74,52,0.06)_68%,transparent_100%)]" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[rgba(90,74,52,0.16)]" />
    </div>
  );
}

/** The quiet label at the head of each page. */
export function PageHead({
  side,
  eyebrow,
  name,
  className = "",
}: {
  side: "then" | "now";
  eyebrow: string;
  name: string;
  className?: string;
}) {
  const isThen = side === "then";
  return (
    <header className={`flex flex-col gap-1.5 ${className}`}>
      <p
        className={`text-[11px] uppercase tracking-[0.32em] ${
          isThen ? "text-then-faded" : "text-now-slate"
        }`}
      >
        {eyebrow}
      </p>
      <p
        className={
          isThen
            ? "font-serif text-[30px] leading-none text-then-ink md:text-[38px]"
            : "text-[26px] font-medium leading-none tracking-tight text-now-charcoal md:text-[32px]"
        }
      >
        {name}
      </p>
    </header>
  );
}

/** A year, set the way an old book sets one. */
export function PageYear({
  side,
  year,
  place,
}: {
  side: "then" | "now";
  year: number | string;
  place?: string;
}) {
  const isThen = side === "then";
  return (
    <div className="flex flex-col gap-1">
      <span
        className={
          isThen
            ? "font-serif text-[52px] leading-none text-bloom-rose md:text-[68px]"
            : "text-[46px] font-light leading-none tracking-tight text-bloom-green md:text-[60px]"
        }
      >
        {year}
      </span>
      {place ? (
        <span
          className={`text-[11px] uppercase tracking-[0.26em] ${
            isThen ? "text-then-faded" : "text-now-slate"
          }`}
        >
          {place}
        </span>
      ) : null}
    </div>
  );
}
