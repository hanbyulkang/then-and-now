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
  markColor = "#b88379",
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
      <mark
        className="bg-transparent font-semibold"
        style={{
          color: active ? markColor : "inherit",
          fontWeight: active ? 700 : "inherit",
          backgroundImage: `linear-gradient(${markColor}, ${markColor})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 92%",
          backgroundSize: active ? "100% 1.5px" : "0% 1.5px",
          transition:
            "background-size 900ms var(--ease-organic), color 700ms ease, font-weight 400ms ease",
        }}
      >
        {highlight}
      </mark>
      {after}&rdquo;
    </p>
  );
}
