import Image from "next/image";
import type { Pair } from "@/lib/types";

/**
 * Two overlapping portraits. The pair is the account — there is no single
 * "user" in this product, so the avatar slot always shows both people.
 */
export function ProfilePair({
  pair,
  size = 36,
  className = "",
}: {
  pair: Pair;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`flex items-center ${className}`}>
      <Image
        src={pair.then.avatar}
        alt={pair.then.name}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-canvas"
        style={{ marginRight: -size / 3, width: size, height: size }}
      />
      <Image
        src={pair.now.avatar}
        alt={pair.now.name}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-canvas"
        style={{ width: size, height: size }}
      />
    </span>
  );
}
