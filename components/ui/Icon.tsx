import Image from "next/image";

/** Icons exported from the design file. Kept unoptimised so the SVG ships as drawn. */
export function Icon({
  name,
  size = 20,
  alt = "",
  className = "",
}: {
  name: string;
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      src={`/assets/icons/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      aria-hidden={alt === "" ? true : undefined}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
