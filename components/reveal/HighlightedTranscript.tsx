"use client";

/**
 * The transcript, with the shared phrase brought forward.
 *
 * The emphasis arrives as a slow underline rather than a highlighter block —
 * spec §17 is explicit that this should feel like someone pointing, not like a
 * marker pen. The original words are never altered, only weighted.
 */
export function HighlightedTranscript({
  text,
  highlight,
  active,
  className = "",
  markColor = "#e7d49a",
}: {
  text: string;
  highlight?: string;
  active: boolean;
  className?: string;
  markColor?: string;
}) {
  if (!highlight || !text.includes(highlight)) {
    return <p className={className}>&ldquo;{text}&rdquo;</p>;
  }

  const [before, ...rest] = text.split(highlight);
  const after = rest.join(highlight);

  return (
    <p className={className}>
      &ldquo;{before}
      {/* The phrase is marked the way somebody marks a book: a soft stripe of
          colour laid over the words, drawn on from the left. */}
      <mark
        className="bg-transparent"
        style={{
          color: "inherit",
          backgroundImage: `linear-gradient(${markColor}, ${markColor})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 55%",
          backgroundSize: active ? "100% 78%" : "0% 78%",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          padding: "0.06em 0.1em",
          transition: "background-size 1100ms var(--ease-organic)",
        }}
      >
        {highlight}
      </mark>
      {after}&rdquo;
    </p>
  );
}
