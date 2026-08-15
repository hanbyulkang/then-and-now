/**
 * An exported icon drawn in the current text colour.
 *
 * The tab icons ship from the design file with their state colour baked in, so
 * they are used here as a mask instead: the vector is exactly the one that was
 * drawn, and the colour comes from the token the state calls for.
 */
export function MaskIcon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(/assets/icons/${name}.svg)`,
        WebkitMaskImage: `url(/assets/icons/${name}.svg)`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
